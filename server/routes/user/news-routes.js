// routes/user/alumni-news-routes.js
const express = require("express");

const {
  getAllPublishedNews,
  getPinnedNews,
  getRecentNews,
  getNewsBySlug,
  getNewsById,
  getNewsByCategory,
  getRelatedNews,
  getCategories,
  getTags,
} = require("../../controllers/user/news-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes (accessible to authenticated alumni)
router.get("/", authMiddleware, getAllPublishedNews);
router.get("/pinned", authMiddleware, getPinnedNews);
router.get("/recent", authMiddleware, getRecentNews);
router.get("/categories", authMiddleware, getCategories);
router.get("/tags", authMiddleware, getTags);

// Get by category
router.get("/category/:category", authMiddleware, getNewsByCategory);

// Get by slug (should be before /:id to avoid conflicts)
router.get("/slug/:slug", authMiddleware, getNewsBySlug);

// Get by ID
router.get("/:id", authMiddleware, getNewsById);

// Get related news
router.get("/:id/related", authMiddleware, getRelatedNews);

module.exports = router;