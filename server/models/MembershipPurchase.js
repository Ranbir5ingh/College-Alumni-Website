const mongoose = require("mongoose");

const MembershipPurchaseSchema = new mongoose.Schema(
  {
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    // Purchase details
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    // Payment details
    amount: {
      type: Number,
      required: true,
    },
    discountApplied: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "offline", "other"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Status tracking
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "refunded"],
      default: "active",
    },
    // Cancellation details
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Invoice details
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    invoiceUrl: {
      type: String,
    },
    // Notes
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate invoice number
MembershipPurchaseSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV${year}${month}${random}`;
  }
  next();
});

// Auto-update status based on expiry date
MembershipPurchaseSchema.pre('save', function(next) {
  if (this.status === 'active' && new Date(this.expiryDate) < new Date()) {
    this.status = 'expired';
  }
  next();
});

// Indexes
MembershipPurchaseSchema.index({ alumniId: 1, membershipId: 1 });
MembershipPurchaseSchema.index({ alumniId: 1, status: 1 });
MembershipPurchaseSchema.index({ status: 1 });
MembershipPurchaseSchema.index({ expiryDate: 1 });
MembershipPurchaseSchema.index({ purchaseDate: -1 });
MembershipPurchaseSchema.index({ transactionId: 1 });
MembershipPurchaseSchema.index({ invoiceNumber: 1 });

module.exports = mongoose.model("MembershipPurchase", MembershipPurchaseSchema);