// controllers/user/event-controller.js
const Event = require("../../models/Event");
const EventRegistration = require("../../models/EventRegistration");
const User = require("../../models/User");

// Get all published events (with filters)
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      eventType,
      category,
      isFeatured,
      upcoming,
    } = req.query;

    const { id: alumniId } = req.user;

    // Build filter - only published events
    const filter = { status: "published" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (eventType) filter.eventType = eventType;
    if (category) filter.category = category;
    if (isFeatured) filter.isFeatured = isFeatured === "true";

    // Filter for upcoming events
    if (upcoming === "true") {
      filter.startDateTime = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .select(
        "title shortDescription coverImage startDateTime endDateTime venue isOnline eventType category isFeatured registrationFee maxAttendees currentAttendees isRegistrationOpen tags"
      )
      .sort({ startDateTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean({ virtuals: true });

    // Check if user is registered for each event
    const registrations = await EventRegistration.find({
      alumniId,
      eventId: { $in: events.map((e) => e._id) },
      status: { $ne: "cancelled" },
    }).select("eventId");

    const registeredEventIds = new Set(
      registrations.map((r) => r.eventId.toString())
    );

    const eventsWithRegistration = events.map((event) => ({
      ...event,
      isRegistered: registeredEventIds.has(event._id.toString()),
    }));

    const totalEvents = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: eventsWithRegistration,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalEvents,
        hasNextPage: page < Math.ceil(totalEvents / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in getAllEvents:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumniId = req.user?.id;

    const event = await Event.findOne({
      _id: id,
      status: "published",
    })
      .populate("createdBy", "firstName lastName")
      .lean({ virtuals: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not published!",
      });
    }

    // Check if user is registered
    let isRegistered = false;
    if (alumniId) {
      const registration = await EventRegistration.findOne({
        alumniId,
        eventId: id,
        status: { $ne: "cancelled" },
      });
      isRegistered = !!registration;
    }

    res.status(200).json({
      success: true,
      data: {
        ...event,
        isRegistered,
      },
    });
  } catch (e) {
    console.error("Error in getEventById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
    });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { id: alumniId } = req.user;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Check if event is published
    if (event.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Event is not available for registration!",
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: "Registration is closed for this event!",
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      alumniId,
      eventId,
      status: { $ne: "cancelled" },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event!",
      });
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: "Event is full!",
      });
    }

    // Get user details
    const user = await User.findById(alumniId).select(
      "firstName lastName email phone batch department"
    );

    // Create registration
    const registration = new EventRegistration({
      eventId,
      alumniId,
      registrationDate: new Date(),
      status: event.registrationFee > 0 ? "pending_payment" : "confirmed",
      paymentStatus: event.registrationFee > 0 ? "pending" : "not_applicable",
      amountPaid: event.registrationFee || 0,
      attendeeDetails: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        batch: user.batch,
        department: user.department,
      },
    });

    await registration.save();

    // Update event attendees count
    event.currentAttendees += 1;
    await event.save();

    // Add registration to user's eventRegistrations array
    await User.findByIdAndUpdate(alumniId, {
      $push: { eventRegistrations: registration._id },
    });

    res.status(201).json({
      success: true,
      message:
        event.registrationFee > 0
          ? "Registration initiated. Please complete payment."
          : "Successfully registered for the event!",
      data: {
        registrationId: registration._id,
        status: registration.status,
        paymentRequired: event.registrationFee > 0,
        amount: event.registrationFee,
      },
    });
  } catch (e) {
    console.error("Error in registerForEvent:", e);
    res.status(500).json({
      success: false,
      message: "Failed to register for event",
    });
  }
};

// Unregister from event
const unregisterFromEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { id: alumniId } = req.user;

    const registration = await EventRegistration.findOne({
      alumniId,
      eventId,
      status: { $ne: "cancelled" },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found!",
      });
    }

    const event = await Event.findById(eventId);

    // Check if event has already started
    if (new Date(event.startDateTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel registration for an event that has started!",
      });
    }

    // Update registration status
    registration.status = "cancelled";
    registration.cancellationDate = new Date();
    await registration.save();

    // Decrease event attendees count
    if (event.currentAttendees > 0) {
      event.currentAttendees -= 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "Successfully cancelled registration!",
    });
  } catch (e) {
    console.error("Error in unregisterFromEvent:", e);
    res.status(500).json({
      success: false,
      message: "Failed to cancel registration",
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
};