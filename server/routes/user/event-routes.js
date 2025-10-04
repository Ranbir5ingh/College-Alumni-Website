const express = require("express");
const {
  getEventById,
  registerForEvent,
} = require("../../controllers/user/event-controller");
// Assuming you have authController with authMiddleware
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// GET /api/user/events/:id - Publicly view event details (authMiddleware makes req.user available if logged in)
router.get("/:id", authMiddleware, getEventById);

// POST /api/user/events/:id/register - Alumni register for an event (requires authentication)
router.post("/:id/register", authMiddleware, registerForEvent);

// POST /api/user/events/:id/unregister - Alumni unregister
// router.post("/:id/unregister", authMiddleware, unregisterForEvent);

module.exports = router;