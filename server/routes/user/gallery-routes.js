// routes/alumniGalleryRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const alumniGalleryController = require('../../controllers/user/gallery-controller');

router.get('/albums', authMiddleware, alumniGalleryController.getPublishedAlbums);

router.get('/album/:albumId', authMiddleware, alumniGalleryController.getAlbumWithPhotos);

router.get('/search', authMiddleware, alumniGalleryController.searchGallery);

router.get('/categories', authMiddleware, alumniGalleryController.getCategories);

router.get('/years', authMiddleware, alumniGalleryController.getYears);

module.exports = router;