const express = require("express");

const {
  getAllAlumni,
  getAlumniById,
  verifyAlumni,
  rejectAlumni,
  updateAlumniStatus,
  deleteAlumni,
  getAlumniStats,
  getPendingVerifications,
  exportAlumniData,
  handleImageUpload
} = require("../../controllers/admin/alumni-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
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
router.get("/export", authMiddleware, adminMiddleware, exportAlumniData);
router.get("/:id", authMiddleware, adminMiddleware, getAlumniById);

// Verification routes
router.post("/:id/verify", authMiddleware, adminMiddleware, verifyAlumni);
router.post("/:id/reject", authMiddleware, adminMiddleware, rejectAlumni);

// Status and permission management
router.put("/:id/status", authMiddleware, adminMiddleware, updateAlumniStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAlumni);

router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;