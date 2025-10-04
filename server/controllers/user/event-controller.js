const Event = require("../../models/Event");
const EventRegistration = require("../../models/EventRegistration"); // Assuming this model exists
const Alumni = require("../../models/Alumni"); // Assuming this model exists

// Helper function to check if registration is currently open for an event
const isRegistrationOpen = (event) => {
    const now = new Date();
    // Check status is published/ongoing
    if (event.status !== 'published' && event.status !== 'ongoing') {
        return false;
    }
    // Check dates
    const registrationOpen = !event.registrationStartDate || now >= event.registrationStartDate;
    const registrationNotClosed = !event.registrationEndDate || now <= event.registrationEndDate;
    
    // Check capacity (using virtual 'isFull' property, assuming it exists on the schema)
    // NOTE: We must fetch the event with virtuals enabled for this, or check manually
    const isFull = event.maxAttendees !== null && event.currentAttendees >= event.maxAttendees;

    return registrationOpen && registrationNotClosed && !isFull;
};


// Get a single event by ID (User facing)
const getEventById = async (req, res) => {
    console.log("Fetching event details for ID:", req.params.id);
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('createdBy', 'firstName lastName profilePicture')
            .select('-attendanceQRCode -remindersSent') // Hide admin-only data
            .lean({ virtuals: true }); // Ensure virtuals (like isFull) are included

        if (!event || event.status === 'draft' || event.status === 'cancelled') {
            return res.status(404).json({
                success: false,
                message: "Event not found or is not currently active.",
            });
        }

        // Check user registration status (if user is authenticated)
        let isRegistered = false;
        if (req.user && req.user.role === 'alumni') {
            const registration = await EventRegistration.findOne({
                eventId: event._id,
                alumniId: req.user.id,
                status: { $in: ['confirmed', 'paid', 'pending_payment'] } 
            });
            isRegistered = !!registration;
        }

        res.status(200).json({
            success: true,
            data: {
                ...event,
                isRegistrationOpen: isRegistrationOpen(event),
                isRegistered,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred while fetching event details!",
        });
    }
};

// Register for an event (Alumni facing)
const registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const alumniId = req.user.id; 

        if (req.user.role !== 'alumni') {
            return res.status(403).json({ success: false, message: "Access denied. Only registered alumni can register." });
        }

        const event = await Event.findById(id).lean({ virtuals: true });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        // Check if registration is open using the helper function logic
        if (!isRegistrationOpen(event)) {
            return res.status(400).json({ success: false, message: "Registration is currently closed, cancelled, or the event is full." });
        }

        // 1. Check if already registered
        const existingRegistration = await EventRegistration.findOne({
            eventId: id,
            alumniId: alumniId,
            status: { $in: ['confirmed', 'paid', 'pending_payment'] }
        });

        if (existingRegistration) {
            return res.status(400).json({ success: false, message: "You are already registered for this event." });
        }
        
        // 2. Check membership requirements
        if (event.requiresMembership) {
             const alumni = await Alumni.findById(alumniId).lean({ virtuals: true });
             if (!alumni.hasActiveMembership) {
                 return res.status(403).json({ success: false, message: "An active membership is required for this event." });
             }
        }

        // 3. Handle fees
        if (event.registrationFee > 0) {
            // In a real app: Create PENDING registration, redirect to payment gateway
            return res.status(402).json({ 
                success: false, 
                message: "Payment required. Redirecting to payment gateway...", 
                fee: event.registrationFee 
            });
        }

        // 4. Create confirmed registration
        const newRegistration = new EventRegistration({
            eventId: id,
            alumniId: alumniId,
            status: 'confirmed', 
            registrationDate: new Date(),
        });

        await newRegistration.save();

        // Update Event attendees count and registration list
        await Event.findByIdAndUpdate(id, {
            $inc: { currentAttendees: 1 },
            $push: { registrations: newRegistration._id }
        });
        
        // Update Alumni's registrations array
        await Alumni.findByIdAndUpdate(alumniId, {
            $push: { eventRegistrations: newRegistration._id }
        });

        res.status(201).json({
            success: true,
            message: "Successfully registered! Confirmation sent to your email.",
            data: { isRegistered: true },
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to process registration.",
        });
    }
};

module.exports = {
    getEventById,
    registerForEvent,
    // Add unregisterForEvent later if needed
};