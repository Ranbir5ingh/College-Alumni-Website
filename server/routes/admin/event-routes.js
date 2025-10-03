const express = require("express");

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getEventStats,
  getEventRegistrations,
  markAttendance,
  generateAttendanceQR,
  deactivateAttendanceQR,
  exportEventRegistrations,
  sendEventReminders,
  handleImageUpload,
} = require("../../controllers/admin/event-controller");


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

// Admin routes for event management
router.get("/", authMiddleware, adminMiddleware, getAllEvents);
router.get("/stats", authMiddleware, adminMiddleware, getEventStats);
router.get("/:id", authMiddleware, adminMiddleware, getEventById);

// Event CRUD operations
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

// Event status management
router.put("/:id/status", authMiddleware, adminMiddleware, updateEventStatus);

// Event registrations management
router.get("/:id/registrations", authMiddleware, adminMiddleware, getEventRegistrations);
router.get("/:id/registrations/export", authMiddleware, adminMiddleware, exportEventRegistrations);

// Attendance management
router.put("/registrations/:registrationId/attendance", authMiddleware, adminMiddleware, markAttendance);
router.post("/:id/qr/generate", authMiddleware, adminMiddleware, generateAttendanceQR);
router.post("/:id/qr/deactivate", authMiddleware, adminMiddleware, deactivateAttendanceQR);

// Email reminders
router.post("/:id/reminders", authMiddleware, adminMiddleware, sendEventReminders);

// Image upload
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;