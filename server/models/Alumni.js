const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: true,
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
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
    // Academic Information
    studentId: {
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
    graduationYear: {
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
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    
    // Personal Information
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    
    // Address Information
    currentAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    permanentAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    
    // Professional Information
    currentCompany: {
      type: String,
      trim: true,
    },
    currentPosition: {
      type: String,
      trim: true,
    },
    workExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        location: String,
      }
    ],
    skills: [String],
    linkedinProfile: {
      type: String,
      trim: true,
    },
    githubProfile: {
      type: String,
      trim: true,
    },
    portfolioWebsite: {
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
    achievements: [String],
    hobbies: [String],
    
    // Alumni Specific
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    membershipStatus: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    alumniId: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Privacy Settings
    profileVisibility: {
      type: String,
      enum: ["public", "alumni-only", "private"],
      default: "alumni-only",
    },
    showContactInfo: {
      type: Boolean,
      default: false,
    },
    showCurrentCompany: {
      type: Boolean,
      default: true,
    },
    
    // Engagement
    eventsAttended: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        attendedDate: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    mentorshipPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorshipProgram",
      }
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      }
    ],
    
    // Permissions
    role: {
      type: String,
      enum: ["alumni", "admin", "committee"],
      default: "alumni",
    },
    canPostJobs: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

// Create alumni ID automatically
AlumniSchema.pre('save', function(next) {
  if (!this.alumniId && this.isVerified) {
    const year = this.graduationYear.toString().slice(-2);
    const dept = this.department.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.alumniId = `AL${year}${dept}${random}`;
  }
  next();
});

// Index for better search performance
AlumniSchema.index({ firstName: 1, lastName: 1 });
AlumniSchema.index({ batch: 1, department: 1 });
AlumniSchema.index({ graduationYear: 1 });
AlumniSchema.index({ currentCompany: 1 });
// AlumniSchema.index({ email: 1 });

module.exports = mongoose.model("Alumni", AlumniSchema);