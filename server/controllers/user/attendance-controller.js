// controllers/user/attendance-controller.js
const Event = require("../../models/Event");
const EventRegistration = require("../../models/EventRegistration");

// Verify attendance token and get event details
const verifyAttendanceToken = async (req, res) => {
  try {
    const { id: eventId, token } = req.params;

    const event = await Event.findById(eventId)
      .select('title startDateTime endDateTime attendanceQRCode status')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Verify QR code exists and is active
    if (!event.attendanceQRCode || !event.attendanceQRCode.token) {
      return res.status(400).json({
        success: false,
        message: "No attendance QR code found for this event!",
      });
    }

    // Verify token matches
    if (event.attendanceQRCode.token !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance token!",
      });
    }

    // Check if QR code is still active
    if (!event.attendanceQRCode.isActive) {
      return res.status(400).json({
        success: false,
        message: "This attendance QR code has been deactivated!",
      });
    }

    // Check if QR code has expired
    const now = new Date();
    if (event.attendanceQRCode.expiresAt && now > new Date(event.attendanceQRCode.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This attendance QR code has expired!",
      });
    }

    // Return event details for the attendance page
    res.status(200).json({
      success: true,
      message: "Valid attendance token",
      data: {
        eventId: event._id,
        eventTitle: event.title,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        tokenValid: true,
      },
    });
  } catch (e) {
    console.error("Error in verifyAttendanceToken:", e);
    res.status(500).json({
      success: false,
      message: "Failed to verify attendance token",
    });
  }
};

// Mark attendance using QR code
const markAttendanceViaQR = async (req, res) => {
  try {
    const { id: eventId, token } = req.params;
    const { id: alumniId } = req.user;

    // Verify event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Verify QR code
    if (!event.attendanceQRCode || !event.attendanceQRCode.token) {
      return res.status(400).json({
        success: false,
        message: "No attendance QR code found for this event!",
      });
    }

    if (event.attendanceQRCode.token !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance token!",
      });
    }

    if (!event.attendanceQRCode.isActive) {
      return res.status(400).json({
        success: false,
        message: "This attendance QR code has been deactivated!",
      });
    }

    // Check expiry
    const now = new Date();
    if (event.attendanceQRCode.expiresAt && now > new Date(event.attendanceQRCode.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This attendance QR code has expired!",
      });
    }

    // Find user's registration
    const registration = await EventRegistration.findOne({
      eventId,
      alumniId,
      status: { $ne: "cancelled" },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "You are not registered for this event!",
      });
    }

    // Check if attendance already marked
    if (registration.attended) {
      return res.status(400).json({
        success: false,
        message: "Your attendance has already been marked!",
        data: {
          attendanceMarkedAt: registration.attendanceMarkedAt,
        },
      });
    }

    // Mark attendance
    registration.attended = true;
    registration.attendanceMarkedAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully!",
      data: {
        registrationId: registration._id,
        registrationNumber: registration.registrationNumber,
        attended: registration.attended,
        attendanceMarkedAt: registration.attendanceMarkedAt,
        eventTitle: event.title,
      },
    });
  } catch (e) {
    console.error("Error in markAttendanceViaQR:", e);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
};

// Get attendance status for current user
const getMyAttendanceStatus = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { id: alumniId } = req.user;

    const registration = await EventRegistration.findOne({
      eventId,
      alumniId,
      status: { $ne: "cancelled" },
    })
      .select('attended attendanceMarkedAt registrationNumber status')
      .lean();

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "You are not registered for this event!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isRegistered: true,
        attended: registration.attended,
        attendanceMarkedAt: registration.attendanceMarkedAt,
        registrationNumber: registration.registrationNumber,
        status: registration.status,
      },
    });
  } catch (e) {
    console.error("Error in getMyAttendanceStatus:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance status",
    });
  }
};

module.exports = {
  verifyAttendanceToken,
  markAttendanceViaQR,
  getMyAttendanceStatus,
};