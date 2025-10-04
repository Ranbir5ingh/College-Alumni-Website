// routes/user/event-routes.js
const express = require("express");
const {
  getAllEvents,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
} = require("../../controllers/user/event-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// GET /api/user/events - Get all published events (with filters)
router.get("/", authMiddleware, getAllEvents);

// GET /api/user/events/:id - Get event details by ID
router.get("/:id", authMiddleware, getEventById);

// POST /api/user/events/:id/register - Register for an event
router.post("/:id/register", authMiddleware, registerForEvent);

// POST /api/user/events/:id/unregister - Unregister from event
router.post("/:id/unregister", authMiddleware, unregisterFromEvent);

module.exports = router;