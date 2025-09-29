const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../../models/Alumni");

// Register Alumni
const registerAlumni = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      studentId,
      batch,
      graduationYear,
      department,
      degree,
      phone,
    } = req.body;

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists with this email!",
      });
    }

    // Check if student ID already exists
    const existingStudentId = await Alumni.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Alumni already exists with this student ID!",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, studentId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create new alumni
    const newAlumni = new Alumni({
      firstName,
      lastName,
      email,
      password: hashPassword,
      studentId,
      batch,
      graduationYear,
      department,
      degree,
      phone,
      verificationToken,
    });

    await newAlumni.save();

    res.status(201).json({
      success: true,
      message: "Alumni registration successful! Please wait for admin verification.",
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

    const checkAlumni = await Alumni.findOne({ email });
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
        isVerified: checkAlumni.isVerified,
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
        isVerified: checkAlumni.isVerified,
        membershipStatus: checkAlumni.membershipStatus,
        alumniId: checkAlumni.alumniId,
        batch: checkAlumni.batch,
        department: checkAlumni.department,
        degree: checkAlumni.degree,
        graduationYear: checkAlumni.graduationYear,
        phone: checkAlumni.phone,
        studentId: checkAlumni.studentId,
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

// Get Current User
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
    const alumni = await Alumni.findById(req.user.id).select("-password");
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: alumni,
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
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile!",
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, studentId, isVerified, role, alumniId, ...updateData } = req.body;

    const updatedAlumni = await Alumni.findByIdAndUpdate(id, updateData, {
      new: true,
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
      data: updatedAlumni,
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

    const alumni = await Alumni.findById(id);
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
    await Alumni.findByIdAndUpdate(id, { password: hashedNewPassword });

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

// Verify Alumni (Admin only)
const verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, membershipStatus } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "committee") {
      return res.status(403).json({
        success: false,
        message: "Only admin can verify alumni!",
      });
    }

    const alumni = await Alumni.findByIdAndUpdate(
      id,
      { isVerified, membershipStatus },
      { new: true }
    ).select("-password");

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alumni verification status updated successfully!",
      data: alumni,
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
  loginAlumni,
  logoutAlumni,
  authMiddleware,
  getAlumniProfile,
  updateAlumniProfile,
  changePassword,
  verifyAlumni,
};