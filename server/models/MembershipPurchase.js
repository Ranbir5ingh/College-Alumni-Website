// models/MembershipPurchase.js
const mongoose = require("mongoose");

const MembershipPurchaseSchema = new mongoose.Schema(
  {
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Membership plan details
    planType: {
      type: String,
      enum: ["monthly", "lifetime"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Purchase dates
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },

    // Payment details
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "other"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },

    // Status tracking
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "refunded"],
      default: "active",
    },

    // Auto-renewal for monthly plans
    autoRenewal: {
      type: Boolean,
      default: false,
    },
    nextRenewalDate: {
      type: Date,
    },

    // Receipt details
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

    // Admin notes
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
MembershipPurchaseSchema.pre("save", function (next) {
  if (this.isNew && !this.receiptNumber && this.paymentStatus === "completed") {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    this.receiptNumber = `MEM${year}${random}`;
  }
  next();
});

// Pre-save hook to set expiry date based on plan type
MembershipPurchaseSchema.pre("save", function (next) {
  if (this.isNew && !this.expiryDate) {
    const startDate = this.startDate || new Date();
    
    if (this.planType === "monthly") {
      // Set expiry to 1 month from start date
      this.expiryDate = new Date(startDate);
      this.expiryDate.setMonth(this.expiryDate.getMonth() + 1);
      
      // Set next renewal date for monthly plans
      if (this.autoRenewal) {
        this.nextRenewalDate = this.expiryDate;
      }
    } else if (this.planType === "lifetime") {
      // Set expiry to 99 years from start date (effectively lifetime)
      this.expiryDate = new Date(startDate);
      this.expiryDate.setFullYear(this.expiryDate.getFullYear() + 99);
    }
  }
  next();
});

// Method to check if membership is expired
MembershipPurchaseSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate && this.planType !== "lifetime";
};

// Method to check if membership is active
MembershipPurchaseSchema.methods.isActive = function () {
  return (
    this.status === "active" &&
    this.paymentStatus === "completed" &&
    !this.isExpired()
  );
};

// Static method to find active membership for a user
MembershipPurchaseSchema.statics.findActiveMembership = async function (alumniId) {
  return this.findOne({
    alumniId,
    status: "active",
    paymentStatus: "completed",
    expiryDate: { $gt: new Date() },
  }).sort({ expiryDate: -1 });
};

// Indexes
MembershipPurchaseSchema.index({ alumniId: 1, status: 1 });
MembershipPurchaseSchema.index({ alumniId: 1, expiryDate: -1 });
MembershipPurchaseSchema.index({ status: 1, expiryDate: 1 });
MembershipPurchaseSchema.index({ transactionId: 1 });
MembershipPurchaseSchema.index({ razorpayOrderId: 1 });
MembershipPurchaseSchema.index({ razorpayPaymentId: 1 });
MembershipPurchaseSchema.index({ receiptNumber: 1 });
MembershipPurchaseSchema.index({ purchaseDate: -1 });
MembershipPurchaseSchema.index({ planType: 1 });
MembershipPurchaseSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("MembershipPurchase", MembershipPurchaseSchema);