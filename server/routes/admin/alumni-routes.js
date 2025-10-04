const express = require("express");

const {
  getAllUser,
  getUserById,
  verifyUser,
  rejectUser,
  updateUserStatus,
  deleteUser,
  getUserStats,
  getPendingVerifications,
  exportUserData,
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
router.get("/", authMiddleware, adminMiddleware, getAllUser);
router.get("/stats", authMiddleware, adminMiddleware, getUserStats);
router.get("/pending", authMiddleware, adminMiddleware, getPendingVerifications);
router.get("/export", authMiddleware, adminMiddleware, exportUserData);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);

// Verification routes
router.post("/:id/verify", authMiddleware, adminMiddleware, verifyUser);
router.post("/:id/reject", authMiddleware, adminMiddleware, rejectUser);

// Status and permission management
router.put("/:id/status", authMiddleware, adminMiddleware, updateUserStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;