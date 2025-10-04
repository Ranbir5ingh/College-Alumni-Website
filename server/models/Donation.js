const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donationCampaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationCampaign",
      required: true,
    },
    // Donation details
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "INR",
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    // Payment details
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cheque", "cash", "other"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Donor information (can override from User model for anonymity)
    donorName: {
      type: String,
    },
    donorEmail: {
      type: String,
    },
    donorPhone: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    // Tax details
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptUrl: {
      type: String,
    },
    receiptGeneratedAt: {
      type: Date,
    },
    // 80G certificate for tax exemption
    taxCertificateGenerated: {
      type: Boolean,
      default: false,
    },
    taxCertificateUrl: {
      type: String,
    },
    taxCertificateGeneratedAt: {
      type: Date,
    },
    // Donation type
    donationType: {
      type: String,
      enum: ["one_time", "recurring"],
      default: "one_time",
    },
    // For recurring donations
    recurringDetails: {
      frequency: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
      },
      nextDonationDate: Date,
      endDate: Date,
      isActive: Boolean,
    },
    // Message/dedication
    message: {
      type: String,
      maxlength: 500,
    },
    dedicatedTo: {
      type: String,
    },
    // Acknowledgment
    acknowledgmentSent: {
      type: Boolean,
      default: false,
    },
    acknowledgmentSentAt: {
      type: Date,
    },
    // Thank you email tracking
    thankYouEmailSent: {
      type: Boolean,
      default: false,
    },
    thankYouEmailSentAt: {
      type: Date,
    },
    // Status
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    // Refund details
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
    refundAmount: {
      type: Number,
    },
    // Notes
    notes: {
      type: String,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate receipt number
DonationSchema.pre('save', function(next) {
  if (this.isNew && !this.receiptNumber && this.paymentStatus === 'completed') {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.receiptNumber = `DON${year}${random}`;
  }
  next();
});

// Indexes
DonationSchema.index({ alumniId: 1, donationCampaignId: 1 });
DonationSchema.index({ alumniId: 1, status: 1 });
DonationSchema.index({ donationCampaignId: 1, status: 1 });
DonationSchema.index({ donationDate: -1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ transactionId: 1 });
DonationSchema.index({ receiptNumber: 1 });
DonationSchema.index({ paymentStatus: 1 });
DonationSchema.index({ isAnonymous: 1 });

module.exports = mongoose.model("Donation", DonationSchema);