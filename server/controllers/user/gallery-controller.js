// controllers/alumniGalleryController.js
const Album = require('../../models/Album');
const GalleryPhoto = require('../../models/GalleryPhoto');

// Get all published albums
exports.getPublishedAlbums = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, year, sortBy = '-createdAt' } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'all') query.category = category;
    if (year && year !== 'all') query.year = Number(year);

    const skip = (page - 1) * limit;

    const albums = await Album.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortBy)
      .select('_id name description category photoCount coverImage year createdAt')
      .lean();

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

// Get album with photos
exports.getAlbumWithPhotos = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const album = await Album.findByIdAndUpdate(
      albumId,
      { $inc: { 'metadata.viewCount': 1 } },
      { new: true }
    ).select('-__v').lean();

    if (!album || !album.isPublished) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const skip = (page - 1) * limit;

    const photos = await GalleryPhoto.find({ album: albumId })
      .sort({ position: 1 })
      .skip(skip)
      .limit(Number(limit))
      .select('_id title description cloudinaryUrl thumbnail createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        album,
        photos,
        pagination: { total: album.photoCount, page: Number(page), pages: Math.ceil(album.photoCount / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search gallery
exports.searchGallery = async (req, res) => {
  try {
    const { query, category, year, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const searchQuery = { isPublished: true };

    if (query) {
      searchQuery.$text = { $search: query };
    }
    if (category && category !== 'all') searchQuery.category = category;
    if (year && year !== 'all') searchQuery.year = Number(year);

    const albums = await Album.find(searchQuery)
      .skip(skip)
      .limit(Number(limit))
      .sort({ score: { $meta: 'textScore' } })
      .select('_id name description category photoCount coverImage year createdAt')
      .lean();

    const total = await Album.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: albums,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Album.distinct('category', { isPublished: true });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all years
exports.getYears = async (req, res) => {
  try {
    const years = await Album.distinct('year', { isPublished: true }).sort(-1);
    res.status(200).json({ success: true, data: years });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};