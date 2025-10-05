// routes/user/attendance-routes.js
const express = require("express");
const {
  verifyAttendanceToken,
  markAttendanceViaQR,
  getMyAttendanceStatus,
} = require("../../controllers/user/attendance-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// GET /api/user/attendance/:id/:token - Verify attendance token (public route for QR scan)
// This should be accessible without auth initially to verify token
router.get("/:id/:token", verifyAttendanceToken);

// POST /api/user/attendance/:id/:token/mark - Mark attendance via QR code
router.post("/:id/:token/mark", authMiddleware, markAttendanceViaQR);

// GET /api/user/attendance/:id/status - Get my attendance status for an event
router.get("/:id/status", authMiddleware, getMyAttendanceStatus);

module.exports = router;