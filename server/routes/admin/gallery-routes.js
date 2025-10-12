// routes/adminGalleryRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../../helpers/cloudinary');
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminGalleryController = require('../../controllers/admin/gallery-controller');

const adminMiddleware = (req, res, next) => {
console.log(req.user);
  if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required!",
    });
  }
  next();
};

// Albums
router.post(
  '/create-album',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.createAlbum
);

router.get(
  '/albums',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.getAllAlbums
);

router.get(
  '/album/:albumId',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.getAlbumDetails
);

router.put(
  '/album/:albumId',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.updateAlbum
);

router.delete(
  '/album/:albumId',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.deleteAlbum
);

// Photos
router.post(
  '/upload-photos/:albumId',
  authMiddleware,
  adminMiddleware,
  upload.array('photos', 50),
  adminGalleryController.uploadPhotos
);

router.delete(
  '/photo/:photoId',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.deletePhoto
);

router.put(
  '/reorder-photos',
  authMiddleware,
  adminMiddleware,
  adminGalleryController.reorderPhotos
);

module.exports = router;

