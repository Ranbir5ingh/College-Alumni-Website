const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../../models/Alumni");

// Register Alumni (Basic Registration)
const registerAlumni = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      enrollmentNumber,
      batch,
      yearOfJoining,
      yearOfPassing,
      department,
      degree,
    } = req.body;

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists with this email!",
      });
    }

    // Check if enrollment number already exists
    const existingEnrollment = await Alumni.findOne({ enrollmentNumber });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists with this enrollment number!",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, enrollmentNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create new alumni with basic info only
    const newAlumni = new Alumni({
      firstName,
      middleName,
      lastName,
      email,
      password: hashPassword,
      enrollmentNumber,
      batch,
      yearOfJoining,
      yearOfPassing,
      department,
      degree,
      verificationToken,
      accountStatus: "incomplete_profile",
    });

    await newAlumni.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! Please complete your profile.",
      data: {
        id: newAlumni._id,
        accountStatus: newAlumni.accountStatus,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Complete Profile (After basic registration)
const completeProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      phone,
      secondaryPhone,
      gender,
      dateOfBirth,
      address,
      currentCompany,
      currentDesignation,
      industry,
      skills,
      linkedInProfile,
      profilePicture,
      bio,
      secondaryEmail,
    } = req.body;

    const alumni = await Alumni.findById(id);
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    if (alumni.accountStatus !== "incomplete_profile") {
      return res.status(400).json({
        success: false,
        message: "Profile completion not allowed at this stage!",
      });
    }

    // Update profile fields
    if (phone) alumni.phone = phone;
    if (secondaryPhone) alumni.secondaryPhone = secondaryPhone;
    if (gender) alumni.gender = gender;
    if (dateOfBirth) alumni.dateOfBirth = dateOfBirth;
    if (address) alumni.address = address;
    if (currentCompany) alumni.currentCompany = currentCompany;
    if (currentDesignation) alumni.currentDesignation = currentDesignation;
    if (industry) alumni.industry = industry;
    if (skills) alumni.skills = skills;
    if (linkedInProfile) alumni.linkedInProfile = linkedInProfile;
    if (profilePicture) alumni.profilePicture = profilePicture;
    if (bio) alumni.bio = bio;
    if (secondaryEmail) alumni.secondaryEmail = secondaryEmail;

    await alumni.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        id: alumni._id,
        isProfileComplete: alumni.isProfileComplete,
        accountStatus: alumni.accountStatus,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Request Verification (After completing profile)
const requestVerification = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await Alumni.findById(id);
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    if (alumni.accountStatus !== "incomplete_profile") {
      return res.status(400).json({
        success: false,
        message: "Verification already requested or account is verified!",
      });
    }

    // Check if profile is complete using virtual
    if (!alumni.isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before requesting verification!",
        missingFields: [
          !alumni.phone && "phone",
          !alumni.gender && "gender",
          !alumni.dateOfBirth && "dateOfBirth",
          !alumni.currentCompany && "currentCompany",
          !alumni.currentDesignation && "currentDesignation",
          !alumni.industry && "industry",
          !alumni.address?.city && "address.city",
          !alumni.address?.country && "address.country",
        ].filter(Boolean),
      });
    }

    // Update status to pending verification
    alumni.accountStatus = "pending_verification";
    await alumni.save();

    // TODO: Send email notification to admin about new verification request

    res.status(200).json({
      success: true,
      message: "Verification request submitted successfully! Please wait for admin approval.",
      data: {
        accountStatus: alumni.accountStatus,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Login Alumni
const loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkAlumni = await Alumni.findOne({ email }).select("+password");
    if (!checkAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni doesn't exist! Please register first.",
      });
    }

    if (!checkAlumni.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact admin.",
      });
    }

    if (checkAlumni.accountStatus === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected. Please contact admin.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkAlumni.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Update last login
    checkAlumni.lastLogin = new Date();
    await checkAlumni.save();

    const token = jwt.sign(
      {
        id: checkAlumni._id,
        role: checkAlumni.role,
        email: checkAlumni.email,
        accountStatus: checkAlumni.accountStatus,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkAlumni.email,
        role: checkAlumni.role,
        id: checkAlumni._id,
        firstName: checkAlumni.firstName,
        lastName: checkAlumni.lastName,
        accountStatus: checkAlumni.accountStatus,
        isVerified: checkAlumni.isVerified,
        isProfileComplete: checkAlumni.isProfileComplete,
        alumniId: checkAlumni.alumniId,
        batch: checkAlumni.batch,
        department: checkAlumni.department,
        degree: checkAlumni.degree,
        yearOfPassing: checkAlumni.yearOfPassing,
        phone: checkAlumni.phone,
        enrollmentNumber: checkAlumni.enrollmentNumber,
        canPostJobs: checkAlumni.canPostJobs,
        canMentor: checkAlumni.canMentor,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Logout Alumni
const logoutAlumni = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// Get Alumni Profile
const getAlumniProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user.id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier features");
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...alumni.toObject(),
        isProfileComplete: alumni.isProfileComplete,
        isVerified: alumni.isVerified,
        hasActiveMembership: alumni.hasActiveMembership,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Update Alumni Profile
const updateAlumniProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== id && req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile!",
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    const { 
      password, 
      email, 
      enrollmentNumber, 
      accountStatus,
      role, 
      alumniId, 
      canPostJobs,
      canMentor,
      isActive,
      verificationToken,
      verifiedAt,
      currentMembership,
      membershipHistory,
      eventRegistrations,
      donations,
      ...updateData 
    } = req.body;

    const updatedAlumni = await Alumni.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        ...updatedAlumni.toObject(),
        isProfileComplete: updatedAlumni.isProfileComplete,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    const alumni = await Alumni.findById(id).select("+password");
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      alumni.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect!",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    alumni.password = hashedNewPassword;
    await alumni.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  registerAlumni,
  completeProfile,
  requestVerification,
  loginAlumni,
  logoutAlumni,
  authMiddleware,
  getAlumniProfile,
  updateAlumniProfile,
  changePassword,
};