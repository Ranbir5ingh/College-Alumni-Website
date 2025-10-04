// routes/user/alumni-routes.js
const express = require("express");

const {
  getMyDashboard,
  getMyEvents,
  getMyDonations,
  getMyMembership,
  searchAlumniDirectory,
  getAlumniProfileById,
} = require("../../controllers/user/alumni-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Protected routes - require authentication
router.get("/dashboard", authMiddleware, getMyDashboard);
router.get("/my-events", authMiddleware, getMyEvents);
router.get("/my-donations", authMiddleware, getMyDonations);
router.get("/my-membership", authMiddleware, getMyMembership);

// Alumni directory - accessible to verified alumni
router.get("/directory", authMiddleware, searchAlumniDirectory);
router.get("/directory/:id", authMiddleware, getAlumniProfileById);

module.exports = router;