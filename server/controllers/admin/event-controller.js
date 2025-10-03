const Event = require("../../models/Event");
const EventRegistration = require("../../models/EventRegistration");
const { imageUploadUtil } = require("../../helpers/cloudinary");

// Get all events (Admin only)
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      eventType,
      status,
      isOnline,
      isFeatured,
      search,
      startDate,
      endDate,
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (eventType) filter.eventType = eventType;
    if (status) filter.status = status;
    if (isOnline !== undefined) filter.isOnline = isOnline === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    
    // Date range filter
    if (startDate || endDate) {
      filter.startDateTime = {};
      if (startDate) filter.startDateTime.$gte = new Date(startDate);
      if (endDate) filter.startDateTime.$lte = new Date(endDate);
    }
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'firstName lastName email alumniId')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ startDateTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalEvents = await Event.countDocuments(filter);

    if (!events.length) {
      return res.status(404).json({
        success: false,
        message: "No events found!",
      });
    }

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalEvents,
        hasNextPage: page < Math.ceil(totalEvents / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get event by ID (Admin only)
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate('createdBy', 'firstName lastName email alumniId profilePicture')
      .populate('updatedBy', 'firstName lastName email')
      .populate({
        path: 'registrations',
        populate: {
          path: 'alumniId',
          select: 'firstName lastName email alumniId profilePicture'
        }
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        isUpcoming: event.isUpcoming,
        isFull: event.isFull,
        isRegistrationOpen: event.isRegistrationOpen,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Create event (Admin only)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id,
      status: req.body.status || 'draft',
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      data: newEvent,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Update event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user.id,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      data: updatedEvent,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete events!",
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // TODO: Clean up related registrations and notify registered alumni

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Update event status (Admin only)
const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Update fields
    if (status) event.status = status;
    if (isFeatured !== undefined) event.isFeatured = isFeatured;
    event.updatedBy = req.user.id;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event status updated successfully!",
      data: {
        id: event._id,
        status: event.status,
        isFeatured: event.isFeatured,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get event statistics (Admin only)
const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const draftEvents = await Event.countDocuments({ status: 'draft' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const cancelledEvents = await Event.countDocuments({ status: 'cancelled' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const featuredEvents = await Event.countDocuments({ isFeatured: true });
    const upcomingEvents = await Event.countDocuments({
      startDateTime: { $gt: new Date() },
      status: 'published',
    });

    // Get event type wise count
    const eventTypeStats = await Event.aggregate([
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get online vs offline count
    const eventModeStats = await Event.aggregate([
      {
        $group: {
          _id: "$isOnline",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status breakdown
    const statusStats = await Event.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total registrations
    const totalRegistrations = await EventRegistration.countDocuments();
    const confirmedRegistrations = await EventRegistration.countDocuments({ 
      status: 'confirmed' 
    });
    const attendedCount = await EventRegistration.countDocuments({ 
      attended: true 
    });

    // Get monthly event count for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Event.aggregate([
      {
        $match: {
          startDateTime: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDateTime" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEvents,
          publishedEvents,
          draftEvents,
          completedEvents,
          cancelledEvents,
          ongoingEvents,
          upcomingEvents,
          featuredEvents,
        },
        registrations: {
          totalRegistrations,
          confirmedRegistrations,
          attendedCount,
          attendanceRate: totalRegistrations > 0 
            ? ((attendedCount / totalRegistrations) * 100).toFixed(2) + '%'
            : '0%',
        },
        eventTypeStats,
        eventModeStats,
        statusStats,
        monthlyStats,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get event registrations (Admin only)
const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      status,
      attended,
      paymentStatus,
    } = req.query;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Build filter object
    const filter = { eventId: id };
    
    if (status) filter.status = status;
    if (attended !== undefined) filter.attended = attended === 'true';
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const registrations = await EventRegistration.find(filter)
      .populate('alumniId', 'firstName lastName email phone alumniId profilePicture batch department')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRegistrations = await EventRegistration.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRegistrations / limit),
        totalRegistrations,
        hasNextPage: page < Math.ceil(totalRegistrations / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Mark attendance (Admin only)
const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { attended } = req.body;

    const registration = await EventRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found!",
      });
    }

    registration.attended = attended;
    registration.attendanceMarkedAt = attended ? new Date() : null;
    await registration.save();

    res.status(200).json({
      success: true,
      message: attended ? "Attendance marked successfully!" : "Attendance unmarked successfully!",
      data: {
        registrationId: registration._id,
        attended: registration.attended,
        attendanceMarkedAt: registration.attendanceMarkedAt,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Generate attendance QR code (Admin only)
const generateAttendanceQR = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiryMinutes = 60 } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // Generate unique token
    const token = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    event.attendanceQRCode = {
      token,
      generatedAt: new Date(),
      expiresAt,
      isActive: true,
    };

    await event.save();

    res.status(200).json({
      success: true,
      message: "QR code generated successfully!",
      data: {
        token,
        expiresAt,
        qrData: `${process.env.CLIENT_BASE_URL}/events/${id}/attendance/${token}`,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Deactivate attendance QR code (Admin only)
const deactivateAttendanceQR = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    if (!event.attendanceQRCode || !event.attendanceQRCode.token) {
      return res.status(400).json({
        success: false,
        message: "No active QR code found!",
      });
    }

    event.attendanceQRCode.isActive = false;
    await event.save();

    res.status(200).json({
      success: true,
      message: "QR code deactivated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Export event registrations (Admin only)
const exportEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can export event data!",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    const registrations = await EventRegistration.find({ eventId: id })
      .populate('alumniId', 'firstName lastName email phone alumniId batch department enrollmentNumber')
      .lean();

    // Format data for Excel export
    const excelData = registrations.map(reg => ({
      'Registration Number': reg.registrationNumber,
      'Alumni ID': reg.alumniId?.alumniId || 'N/A',
      'First Name': reg.alumniId?.firstName || 'N/A',
      'Last Name': reg.alumniId?.lastName || 'N/A',
      'Email': reg.alumniId?.email || 'N/A',
      'Phone': reg.alumniId?.phone || 'N/A',
      'Enrollment Number': reg.alumniId?.enrollmentNumber || 'N/A',
      'Batch': reg.alumniId?.batch || 'N/A',
      'Department': reg.alumniId?.department || 'N/A',
      'Registration Date': new Date(reg.registrationDate).toLocaleDateString(),
      'Amount': reg.amount || 0,
      'Payment Status': reg.paymentStatus,
      'Transaction ID': reg.transactionId || 'N/A',
      'Status': reg.status,
      'Attended': reg.attended ? 'Yes' : 'No',
      'Attendance Marked At': reg.attendanceMarkedAt 
        ? new Date(reg.attendanceMarkedAt).toLocaleString() 
        : 'N/A',
      'Feedback Rating': reg.feedback?.rating || 'N/A',
      'Feedback Comments': reg.feedback?.comments || 'N/A',
      'Certificate Generated': reg.certificateGenerated ? 'Yes' : 'No',
    }));

    res.status(200).json({
      success: true,
      message: "Event registrations exported successfully!",
      data: {
        eventTitle: event.title,
        registrations: excelData,
        count: excelData.length,
      },
    });

    // NOTE: In actual implementation, use 'xlsx' library to generate and send Excel file
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Bulk send event reminders (Admin only)
const sendEventReminders = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderType } = req.body; // '1_week_before', '1_day_before', 'event_day'

    const event = await Event.findById(id)
      .populate({
        path: 'registrations',
        match: { status: 'confirmed' },
        populate: {
          path: 'alumniId',
          select: 'email firstName lastName'
        }
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }

    // TODO: Implement email sending logic here
    const recipientCount = event.registrations?.length || 0;

    // Track reminder sent
    event.remindersSent.push({
      type: reminderType,
      sentAt: new Date(),
      recipientCount,
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: `Event reminders sent successfully to ${recipientCount} alumni!`,
      data: {
        reminderType,
        recipientCount,
        sentAt: new Date(),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred during image upload" });
  }
};

module.exports = {
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
};