// models/News.js
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "general",
        "events",
        "achievements",
        "placements",
        "research",
        "alumni-stories",
        "announcements",
        "others",
      ],
      default: "general",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
newsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    // Add timestamp to ensure uniqueness
    if (this.isNew) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  next();
});

// Update publishedAt when status changes to published
newsSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});


// Virtual for checking if news is recent (within last 7 days)
newsSchema.virtual("isRecent").get(function () {
  if (!this.publishedAt) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.publishedAt >= sevenDaysAgo;
});

// Static method to get category info
newsSchema.statics.getCategoryInfo = function (category) {
  const categoryMap = {
    general: { label: "General", color: "#6B7280" },
    events: { label: "Events", color: "#3B82F6" },
    achievements: { label: "Achievements", color: "#10B981" },
    placements: { label: "Placements", color: "#8B5CF6" },
    research: { label: "Research", color: "#F59E0B" },
    "alumni-stories": { label: "Alumni Stories", color: "#EC4899" },
    announcements: { label: "Announcements", color: "#EF4444" },
    others: { label: "Others", color: "#6B7280" },
  };
  return categoryMap[category] || categoryMap.general;
};

// Method to increment view count
newsSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  return this.save();
};

// Indexes for better query performance
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ slug: 1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ isPinned: -1, publishedAt: -1 });

module.exports = mongoose.model("News", newsSchema);