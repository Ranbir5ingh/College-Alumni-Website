const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["conference", "workshop", "seminar", "reunion", "webinar", "networking", "cultural", "sports", "other"],
      required: true,
    },
    // Event timing
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    // Location details
    venue: {
      name: String,
      address: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    // Registration details
    registrationRequired: {
      type: Boolean,
      default: true,
    },
    registrationStartDate: {
      type: Date,
    },
    registrationEndDate: {
      type: Date,
    },
    maxAttendees: {
      type: Number,
      default: null, // null means unlimited
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    // Eligibility
    eligibleBatches: [{
      type: String,
    }],
    eligibleDepartments: [{
      type: String,
    }],
    requiresMembership: {
      type: Boolean,
      default: false,
    },
    requiredMembershipTiers: [{
      type: String,
      enum: ["basic", "silver", "gold", "platinum", "lifetime"],
    }],
    // Event content
    coverImage: {
      type: String,
    },
    agenda: [{
      time: String,
      title: String,
      description: String,
      speaker: String,
    }],
    speakers: [{
      name: String,
      designation: String,
      company: String,
      bio: String,
      photo: String,
    }],
    // Attendance tracking
    attendanceQRCode: {
      token: {
        type: String,
        unique: true,
        sparse: true,
      },
      generatedAt: Date,
      expiresAt: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    // Email reminders tracking
    remindersSent: [{
      type: {
        type: String,
        enum: ["1_week_before", "1_day_before", "event_day", "post_event"],
      },
      sentAt: Date,
      recipientCount: Number,
    }],
    // Status
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed", "ongoing"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Metadata
    tags: [{
      type: String,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // References
    registrations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRegistration",
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Helper methods instead of virtuals (works better with lean)
EventSchema.methods.getIsFull = function() {
  if (this.maxAttendees === null || this.maxAttendees === undefined) return false;
  return this.currentAttendees >= this.maxAttendees;
};

EventSchema.methods.getIsRegistrationOpen = function() {
  const now = new Date();
  const registrationOpen = !this.registrationStartDate || now >= this.registrationStartDate;
  const registrationNotClosed = !this.registrationEndDate || now <= this.registrationEndDate;
  const isFull = this.getIsFull();
  return this.registrationRequired && registrationOpen && registrationNotClosed && !isFull;
};

EventSchema.methods.getIsUpcoming = function() {
  return new Date(this.startDateTime) > new Date();
};

// Static helper to add computed fields to lean objects
EventSchema.statics.addComputedFields = function(eventObj) {
  const isFull = eventObj.maxAttendees !== null && 
                 eventObj.maxAttendees !== undefined && 
                 eventObj.currentAttendees >= eventObj.maxAttendees;
  
  const now = new Date();
  const registrationOpen = !eventObj.registrationStartDate || now >= new Date(eventObj.registrationStartDate);
  const registrationNotClosed = !eventObj.registrationEndDate || now <= new Date(eventObj.registrationEndDate);
  const isRegistrationOpen = eventObj.registrationRequired && registrationOpen && registrationNotClosed && !isFull;
  
  const isUpcoming = new Date(eventObj.startDateTime) > now;

  return {
    ...eventObj,
    isFull,
    isRegistrationOpen,
    isUpcoming
  };
};

// Indexes
EventSchema.index({ startDateTime: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ isFeatured: 1 });
EventSchema.index({ "attendanceQRCode.token": 1 });
EventSchema.index({ eligibleBatches: 1 });
EventSchema.index({ eligibleDepartments: 1 });
EventSchema.index({ tags: 1 });

// Text index for search
EventSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model("Event", EventSchema);