const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema(
  {
    // Basic Information (Required for initial registration)
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    secondaryEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    
    // Academic Information (Required for initial registration)
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfJoining: {
      type: Number,
      required: true,
    },
    yearOfPassing: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Personal Information (Complete profile later)
    phone: {
      type: String,
      trim: true,
    },
    secondaryPhone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    dateOfBirth: {
      type: Date,
    },
    
    // Address Information (Complete profile later)
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    
    // Professional Information (Complete profile later)
    currentCompany: {
      type: String,
      trim: true,
    },
    currentDesignation: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    skills: [String],
    linkedInProfile: {
      type: String,
      trim: true,
    },
    
    // Profile Information
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    
    // Registration and Verification Status
    accountStatus: {
      type: String,
      enum: ["incomplete_profile", "pending_verification", "verified", "rejected"],
      default: "incomplete_profile",
    },
    
    // Verification tracking
    verificationToken: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    
    // Alumni ID - Generated after verification
    alumniId: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Permissions (enabled only after verification)
    role: {
      type: String,
      enum: ["alumni", "admin", "committee", "super_admin"],
      default: "alumni",
    },
    canPostJobs: {
      type: Boolean,
      default: false,
    },
    canMentor: {
      type: Boolean,
      default: false,
    },
    
    // Activity Tracking
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Privacy Settings
    privacySettings: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showCompany: { type: Boolean, default: true },
      showAddress: { type: Boolean, default: false },
    },

    // Membership tracking (current active membership)
    currentMembership: {
      membershipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership",
      },
      startDate: Date,
      expiryDate: Date,
      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
      },
      transactionId: String,
    },

    // References to track relationships
    membershipHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPurchase",
    }],

    eventRegistrations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRegistration",
    }],

    donations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
AlumniSchema.virtual('fullName').get(function() {
  return this.middleName 
    ? `${this.firstName} ${this.middleName} ${this.lastName}`
    : `${this.firstName} ${this.lastName}`;
});

// Virtual to check if membership is active
AlumniSchema.virtual('hasActiveMembership').get(function() {
  if (!this.currentMembership || !this.currentMembership.expiryDate) {
    return false;
  }
  return this.currentMembership.status === 'active' && 
         new Date(this.currentMembership.expiryDate) > new Date();
});

// Virtual to check profile completion
AlumniSchema.virtual('isProfileComplete').get(function() {
  // Check if all essential profile fields are filled
  const requiredFields = [
    this.phone,
    this.gender,
    this.dateOfBirth,
    this.currentCompany,
    this.currentDesignation,
    this.industry,
    this.address?.city,
    this.address?.country
  ];
  
  return requiredFields.every(field => field !== null && field !== undefined && field !== '');
});

// Virtual to check if account is verified
AlumniSchema.virtual('isVerified').get(function() {
  return this.accountStatus === 'verified';
});

// Create alumni ID automatically on verification
AlumniSchema.pre('save', function(next) {
  // Generate alumni ID when account is verified
  if (!this.alumniId && this.accountStatus === 'verified' && !this.isNew) {
    const year = this.yearOfPassing.toString().slice(-2);
    const dept = this.department.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.alumniId = `AL${year}${dept}${random}`;
  }
  
  // Set verifiedAt timestamp when verified
  if (this.isModified('accountStatus') && this.accountStatus === 'verified' && !this.verifiedAt) {
    this.verifiedAt = new Date();
    // Enable permissions after verification
    this.canPostJobs = true;
  }
  
  // Auto-update membership status if expired
  if (this.currentMembership && this.currentMembership.expiryDate) {
    if (new Date(this.currentMembership.expiryDate) < new Date() && 
        this.currentMembership.status === 'active') {
      this.currentMembership.status = 'expired';
    }
  }
  
  next();
});

// Indexes for better search performance
AlumniSchema.index({ firstName: 1, lastName: 1 });
AlumniSchema.index({ batch: 1, department: 1 });
AlumniSchema.index({ yearOfPassing: 1 });
AlumniSchema.index({ currentCompany: 1 });
AlumniSchema.index({ alumniId: 1 });
AlumniSchema.index({ email: 1 });
AlumniSchema.index({ enrollmentNumber: 1 });
AlumniSchema.index({ accountStatus: 1 });
AlumniSchema.index({ "currentMembership.status": 1 });
AlumniSchema.index({ "currentMembership.expiryDate": 1 });

// Text index for search functionality
AlumniSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  currentCompany: 'text',
  skills: 'text'
});

module.exports = mongoose.model("Alumni", AlumniSchema);