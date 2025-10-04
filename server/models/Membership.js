const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["days", "months", "years"],
        default: "years",
      },
    },
    features: [{
      type: String,
    }],
    benefits: [{
      title: String,
      description: String,
    }],
    tier: {
      type: String,
      enum: ["basic", "silver", "gold", "platinum", "lifetime"],
      default: "basic",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    maxPurchases: {
      type: Number,
      default: null, // null means unlimited
    },
    currentPurchases: {
      type: Number,
      default: 0,
    },
    // Color code for UI display
    color: {
      type: String,
      default: "#000000",
    },
    // Priority for display order
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if membership is available for purchase
MembershipSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false;
  if (this.maxPurchases === null) return true;
  return this.currentPurchases < this.maxPurchases;
});

// Calculate final price after discount
MembershipSchema.virtual('finalPrice').get(function() {
  return this.price - (this.price * this.discountPercentage / 100);
});

// Indexes
MembershipSchema.index({ tier: 1 });
MembershipSchema.index({ isActive: 1 });
MembershipSchema.index({ displayOrder: 1 });
MembershipSchema.index({ price: 1 });

module.exports = mongoose.model("Membership", MembershipSchema);