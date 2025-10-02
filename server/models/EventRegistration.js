const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    // Registration details
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    // Payment details (if event has registration fee)
    amount: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "not_required"],
      default: "not_required",
    },
    // Attendance tracking
    attended: {
      type: Boolean,
      default: false,
    },
    attendanceMarkedAt: {
      type: Date,
    },
    attendanceMarkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
    },
    attendanceMethod: {
      type: String,
      enum: ["qr_code", "manual", "automatic"],
    },
    // Registration status
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "waitlisted", "checked_in"],
      default: "confirmed",
    },
    // Cancellation details
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    // Check-in details
    checkedInAt: {
      type: Date,
    },
    // Companion/Guest details (if allowed)
    numberOfGuests: {
      type: Number,
      default: 0,
    },
    guestDetails: [{
      name: String,
      email: String,
      phone: String,
    }],
    // Email tracking
    emailsSent: [{
      type: {
        type: String,
        enum: ["confirmation", "reminder", "cancellation", "thank_you"],
      },
      sentAt: Date,
      opened: {
        type: Boolean,
        default: false,
      },
      openedAt: Date,
    }],
    // Additional info
    specialRequirements: {
      type: String,
    },
    dietaryPreferences: {
      type: String,
    },
    // Feedback (post-event)
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
      submittedAt: Date,
    },
    // Certificate tracking
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
    },
    certificateGeneratedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate registration number
EventRegistrationSchema.pre('save', function(next) {
  if (this.isNew && !this.registrationNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.registrationNumber = `REG${year}${month}${random}`;
  }
  next();
});

// Compound index to prevent duplicate registrations
EventRegistrationSchema.index({ eventId: 1, alumniId: 1 }, { unique: true });

// Other indexes
EventRegistrationSchema.index({ eventId: 1, status: 1 });
EventRegistrationSchema.index({ alumniId: 1, status: 1 });
EventRegistrationSchema.index({ registrationDate: -1 });
EventRegistrationSchema.index({ attended: 1 });
EventRegistrationSchema.index({ registrationNumber: 1 });
EventRegistrationSchema.index({ status: 1 });

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);