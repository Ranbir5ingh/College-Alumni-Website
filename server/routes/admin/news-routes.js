// routes/admin/admin-news-routes.js
const express = require("express");

const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews,
  togglePinNews,
  getNewsStatistics,
} = require("../../controllers/admin/news-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required!",
    });
  }
  next();
};

const router = express.Router();



// Statistics
router.get("/statistics", authMiddleware, adminMiddleware, getNewsStatistics);

// CRUD operations
router.post("/", authMiddleware, adminMiddleware, createNews);
router.get("/", authMiddleware, adminMiddleware, getAllNews);
router.get("/:id", authMiddleware, adminMiddleware, getNewsById);
router.put("/:id", authMiddleware, adminMiddleware, updateNews);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

// Publish/Unpublish
router.patch("/:id/publish", authMiddleware, adminMiddleware, publishNews);
router.patch("/:id/unpublish", authMiddleware, adminMiddleware, unpublishNews);

// Pin/Unpin
router.patch("/:id/toggle-pin", authMiddleware, adminMiddleware, togglePinNews);

module.exports = router;