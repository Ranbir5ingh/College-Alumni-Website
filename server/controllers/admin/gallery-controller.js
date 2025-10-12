// controllers/adminGalleryController.js
const Album = require('../../models/Album');
const GalleryPhoto = require('../../models/GalleryPhoto');
const { imageUploadUtil } = require('../../helpers/cloudinary');
const cloudinary = require('cloudinary').v2;

// Create Album
exports.createAlbum = async (req, res) => {
  try {
    const { name, description, category, year, tags } = req.body;
    const userId = req.user.id;
    console.log(userId);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Album name is required' });
    }

    const album = new Album({
      name,
      description,
      category,
      year,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      createdBy: userId,
    });

    await album.save();
    res.status(201).json({ success: true, data: album, message: 'Album created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload Photos to Album
exports.uploadPhotos = async (req, res) => {
  try {
    const { albumId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const uploadedPhotos = [];
    let coverImageSet = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = Buffer.from(file.buffer).toString("base64");
    const url = "data:" + file.mimetype + ";base64," + b64;
      const bufferResult = await imageUploadUtil(url);

      const photo = new GalleryPhoto({
        album: albumId,
        cloudinaryUrl: bufferResult.secure_url,
        cloudinaryPublicId: bufferResult.public_id,
        thumbnail: cloudinary.url(bufferResult.public_id, { width: 300, height: 300, crop: 'fill', quality: 'auto' }),
        uploadedBy: req.user.id,
        metadata: {
          width: bufferResult.width,
          height: bufferResult.height,
          size: bufferResult.bytes,
          format: bufferResult.format,
        },
        position: album.photoCount + i,
      });

      await photo.save();
      uploadedPhotos.push(photo);

      if (!coverImageSet) {
        album.coverImage = bufferResult.secure_url;
        coverImageSet = true;
      }
    }

    album.photoCount += uploadedPhotos.length;
    album.metadata.lastUpdated = Date.now();
    await album.save();

    res.status(201).json({
      success: true,
      data: uploadedPhotos,
      message: `${uploadedPhotos.length} photos uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Album
exports.updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { name, description, category, year, tags, isPublished } = req.body;

    // First, fetch the existing album to get current tags if not provided
    const existingAlbum = await Album.findById(albumId);
    if (!existingAlbum) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Prepare the update object
    const updateData = {
      name,
      description,
      category,
      year,
      tags: tags ? tags.split(',').map(t => t.trim()) : existingAlbum.tags,
      isPublished,
      updatedAt: Date.now(),
    };

    // Update the album
    const album = await Album.findByIdAndUpdate(albumId, updateData, { new: true });

    res.status(200).json({ success: true, data: album, message: 'Album updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Photo
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await GalleryPhoto.findById(photoId);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
    await GalleryPhoto.findByIdAndDelete(photoId);

    const album = await Album.findById(photo.album);
    if (album) {
      album.photoCount = Math.max(0, album.photoCount - 1);
      await album.save();
    }

    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Album
exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const photos = await GalleryPhoto.find({ album: albumId });
    for (const photo of photos) {
      await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
    }

    await GalleryPhoto.deleteMany({ album: albumId });
    await Album.findByIdAndDelete(albumId);

    res.status(200).json({ success: true, message: 'Album and all photos deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all albums (admin)
exports.getAllAlbums = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, year } = req.query;
    const query = {};

    if (category) query.category = category;
    if (year) query.year = Number(year);

    const skip = (page - 1) * limit;

    const albums = await Album.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .select('_id name description category photoCount coverImage year isPublished createdAt');

    const total = await Album.countDocuments(query);

    res.status(200).json({
      success: true,
      data: albums,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get album details with photos
exports.getAlbumDetails = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId).populate('createdBy', 'name email');
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const photos = await GalleryPhoto.find({ album: albumId })
      .sort({ position: 1 })
      .select('_id title description cloudinaryUrl thumbnail createdAt');

    res.status(200).json({ success: true, data: { album, photos } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder photos
exports.reorderPhotos = async (req, res) => {
  try {
    const { photoOrder } = req.body; // Array of { photoId, position }

    for (const item of photoOrder) {
      await GalleryPhoto.findByIdAndUpdate(item.photoId, { position: item.position });
    }

    res.status(200).json({ success: true, message: 'Photos reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
