const express = require("express");

const {
  getAllAlumni,
  getAlumniById,
  updateAlumniStatus,
  deleteAlumni,
  getAlumniStats,
  getPendingVerifications,
} = require("../../controllers/admin/alumni-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "committee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required!",
    });
  }
  next();
};

// Admin routes for alumni management
router.get("/", authMiddleware, adminMiddleware, getAllAlumni);
router.get("/stats", authMiddleware, adminMiddleware, getAlumniStats);
router.get("/pending", authMiddleware, adminMiddleware, getPendingVerifications);
router.get("/:id", authMiddleware, adminMiddleware, getAlumniById);
router.put("/:id/status", authMiddleware, adminMiddleware, updateAlumniStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAlumni);

module.exports = router;
