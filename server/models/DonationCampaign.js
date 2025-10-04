const mongoose = require("mongoose");

const DonationCampaignSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    // Campaign details
    category: {
      type: String,
      enum: [
        "infrastructure",
        "scholarship",
        "research",
        "sports",
        "library",
        "laboratory",
        "student_welfare",
        "faculty_development",
        "emergency_fund",
        "general",
        "other"
      ],
      required: true,
    },
    // Goal and progress
    goalAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    numberOfDonors: {
      type: Number,
      default: 0,
    },
    // Timeline
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // Media
    coverImage: {
      type: String,
    },
    gallery: [{
      type: String,
    }],
    videoUrl: {
      type: String,
    },
    // Campaign details
    purpose: {
      type: String,
      required: true,
    },
    impact: {
      type: String,
    },
    milestones: [{
      amount: Number,
      description: String,
      achieved: {
        type: Boolean,
        default: false,
      },
      achievedAt: Date,
    }],
    // Donation tiers/levels
    donationTiers: [{
      name: String,
      amount: Number,
      benefits: [String],
      color: String,
    }],
    // Settings
    minimumDonationAmount: {
      type: Number,
      default: 100,
    },
    allowRecurringDonations: {
      type: Boolean,
      default: true,
    },
    allowAnonymousDonations: {
      type: Boolean,
      default: true,
    },
    showDonorList: {
      type: Boolean,
      default: true,
    },
    // Tax exemption
    is80GEligible: {
      type: Boolean,
      default: false,
    },
    taxExemptionDetails: {
      certificateNumber: String,
      validFrom: Date,
      validUntil: Date,
    },
    // Status
    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed", "cancelled"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Updates for donors
    updates: [{
      title: String,
      description: String,
      date: {
        type: Date,
        default: Date.now,
      },
      images: [String],
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    // Contact person
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    // SEO and metadata
    tags: [{
      type: String,
    }],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    // Admin details
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    // References
    donations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    }],
  },
  {
    timestamps: true,
  }
);

// Virtual to calculate progress percentage
DonationCampaignSchema.virtual('progressPercentage').get(function() {
  if (this.goalAmount === 0) return 0;
  return Math.min(((this.currentAmount / this.goalAmount) * 100), 100).toFixed(2);
});

// Virtual to check if campaign is active
DonationCampaignSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.startDate && 
         now <= this.endDate;
});

// Virtual to check if goal is achieved
DonationCampaignSchema.virtual('goalAchieved').get(function() {
  return this.currentAmount >= this.goalAmount;
});

// Pre-save hook to generate slug
DonationCampaignSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes
DonationCampaignSchema.index({ status: 1 });
DonationCampaignSchema.index({ category: 1 });
DonationCampaignSchema.index({ isFeatured: 1 });
DonationCampaignSchema.index({ startDate: 1, endDate: 1 });
DonationCampaignSchema.index({ slug: 1 });
DonationCampaignSchema.index({ tags: 1 });

// Text index for search
DonationCampaignSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model("DonationCampaign", DonationCampaignSchema);