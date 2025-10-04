const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../../models/Alumni");
const crypto = require("crypto");
const sendEmail = require("../../helpers/sendEmail");

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
    console.log(req.body);

    const alumni = await Alumni.findById(id);
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Check if completion is allowed (only from incomplete_profile)
    if (alumni.accountStatus !== "incomplete_profile") {
      return res.status(400).json({
        success: false,
        message: "Profile is already completed or verification is underway!",
      });
    }

    // Update profile fields
    // NOTE: Using direct assignment assumes the frontend sends the required data for completion.
    alumni.phone = phone;
    alumni.secondaryPhone = secondaryPhone;
    alumni.gender = gender;
    alumni.dateOfBirth = dateOfBirth;
    alumni.address = address;
    alumni.currentCompany = currentCompany;
    alumni.currentDesignation = currentDesignation;
    alumni.industry = industry;
    alumni.skills = skills;
    alumni.linkedInProfile = linkedInProfile;
    alumni.profilePicture = profilePicture;
    alumni.bio = bio;
    alumni.secondaryEmail = secondaryEmail;

    // Save the changes first so the virtual 'isProfileComplete' is calculated
    await alumni.save();

    // Re-fetch or check the current state to access the virtual field accurately
    // The previous save() *should* update virtuals, but a quick re-fetch ensures accuracy, 
    // or you can just check the newly saved object. We'll use the saved object.
    
    // --- CRITICAL FIX: Check completeness and update status ---
    if (alumni.isProfileComplete) {
        // If the profile is fully complete (based on the virtual check)
        // change the status directly to 'pending_verification' as requested.
        alumni.accountStatus = "pending_verification"; 
        
        // Save again to persist the status change
        await alumni.save(); 
        
        // Ensure the response is sent with the updated status
        res.status(200).json({
            success: true,
            message: "Profile completed and verification requested successfully!",
            // Return the entire updated user object to the frontend auth slice
            data: alumni.toObject({ virtuals: true }), 
        });
        return; // End the function call
    }
    // -----------------------------------------------------------

    // If the profile is NOT complete after the initial save, 
    // the status remains 'incomplete_profile', and we return a message.
    res.status(200).json({
      success: true,
      message: "Profile details updated, but required fields are still missing. Please complete your profile.",
      data: alumni.toObject({ virtuals: true }), 
    });

  } catch (e) {
    console.error("Error in completeProfile:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while completing the profile.",
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
      user: checkAlumni,
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

const requestPasswordReset = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token and expiry in database
    alumni.passwordResetToken = hashedToken;
    alumni.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await alumni.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`;

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${alumni.firstName},</p>
            <p>We received a request to reset your password for your BBSBEC Alumni Portal account.</p>
            <p>Click the button below to reset your password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BBSBEC Alumni Portal. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail(
      alumni.email,
      "Password Reset Request - BBSBEC Alumni Portal",
      emailHtml
    );

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email!",
    });
  } catch (e) {
    console.error("Error in requestPasswordReset:", e);
    res.status(500).json({
      success: false,
      message: "Failed to send password reset email. Please try again later.",
    });
  }
};

// Verify Reset Token (check if token is valid)
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find alumni with valid token
    const alumni = await Alumni.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!alumni) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      email: alumni.email, // Return email for display (masked)
    });
  } catch (e) {
    console.error("Error in verifyResetToken:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Reset Password (actually changes the password)
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long!",
      });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find alumni with valid token
    const alumni = await Alumni.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!alumni) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token!",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    alumni.password = hashedPassword;
    alumni.passwordResetToken = undefined;
    alumni.passwordResetExpires = undefined;
    await alumni.save();

    // Send confirmation email
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .success { background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Changed Successfully</h1>
          </div>
          <div class="content">
            <p>Hi ${alumni.firstName},</p>
            <div class="success">
              <strong>Your password has been changed successfully!</strong>
            </div>
            <p>Your BBSBEC Alumni Portal account password was changed on ${new Date().toLocaleString()}.</p>
            <p>If you did not make this change, please contact us immediately at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BBSBEC Alumni Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      alumni.email,
      "Password Changed Successfully - BBSBEC Alumni Portal",
      confirmationEmailHtml
    );

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully! You can now login with your new password.",
    });
  } catch (e) {
    console.error("Error in resetPassword:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while resetting password!",
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
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
};