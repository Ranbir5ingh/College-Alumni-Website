const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require("crypto");
const sendEmail = require("../../helpers/sendEmail");

// Register User (Basic Registration)
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      enrollmentNumber,
      yearOfJoining,
      yearOfPassing,
      department,
      degree,
    } = req.body;

    // Check if User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    // Check if enrollment number already exists
    const existingEnrollment = await User.findOne({ enrollmentNumber });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this enrollment number!",
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

    // Create new User with basic info only
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashPassword,
      enrollmentNumber,
      batch: `${yearOfJoining}-${yearOfPassing}`,
      yearOfJoining,
      yearOfPassing,
      department,
      degree,
      verificationToken,
      accountStatus: "incomplete_profile",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! Please complete your profile.",
      data: {
        id: newUser._id,
        accountStatus: newUser.accountStatus,
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

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if completion is allowed (only from incomplete_profile)
    if (user.accountStatus !== "incomplete_profile") {
      return res.status(400).json({
        success: false,
        message: "Profile is already completed or verification is underway!",
      });
    }

    // Update profile fields
    // NOTE: Using direct assignment assumes the frontend sends the required data for completion.
    user.phone = phone;
    user.secondaryPhone = secondaryPhone;
    user.gender = gender;
    user.dateOfBirth = dateOfBirth;
    user.address = address;
    user.currentCompany = currentCompany;
    user.currentDesignation = currentDesignation;
    user.industry = industry;
    user.skills = skills;
    user.linkedInProfile = linkedInProfile;
    user.profilePicture = profilePicture;
    user.bio = bio;
    user.secondaryEmail = secondaryEmail;

    // Save the changes first so the virtual 'isProfileComplete' is calculated
    await user.save();

    // Re-fetch or check the current state to access the virtual field accurately
    // The previous save() *should* update virtuals, but a quick re-fetch ensures accuracy, 
    // or you can just check the newly saved object. We'll use the saved object.
    
    // --- CRITICAL FIX: Check completeness and update status ---
    if (user.isProfileComplete) {
        // If the profile is fully complete (based on the virtual check)
        // change the status directly to 'pending_verification' as requested.
        user.accountStatus = "pending_verification"; 
        
        // Save again to persist the status change
        await user.save(); 
        
        // Ensure the response is sent with the updated status
        res.status(200).json({
            success: true,
            message: "Profile completed and verification requested successfully!",
            // Return the entire updated user object to the frontend auth slice
            data: user.toObject({ virtuals: true }), 
        });
        return; // End the function call
    }
    // -----------------------------------------------------------

    // If the profile is NOT complete after the initial save, 
    // the status remains 'incomplete_profile', and we return a message.
    res.status(200).json({
      success: true,
      message: "Profile details updated, but required fields are still missing. Please complete your profile.",
      data: user.toObject({ virtuals: true }), 
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

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.accountStatus !== "incomplete_profile") {
      return res.status(400).json({
        success: false,
        message: "Verification already requested or account is verified!",
      });
    }

    // Check if profile is complete using virtual
    if (!user.isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before requesting verification!",
        missingFields: [
          !user.phone && "phone",
          !user.gender && "gender",
          !user.dateOfBirth && "dateOfBirth",
          !user.currentCompany && "currentCompany",
          !user.currentDesignation && "currentDesignation",
          !user.industry && "industry",
          !user.address?.city && "address.city",
          !user.address?.country && "address.country",
        ].filter(Boolean),
      });
    }

    // Update status to pending verification
    user.accountStatus = "pending_verification";
    await user.save();

    // TODO: Send email notification to admin about new verification request

    res.status(200).json({
      success: true,
      message: "Verification request submitted successfully! Please wait for admin approval.",
      data: {
        accountStatus: user.accountStatus,
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

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await User.findOne({ email }).select("+password");
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    if (!checkUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact admin.",
      });
    }

    if (checkUser.accountStatus === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected. Please contact admin.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Update last login
    checkUser.lastLogin = new Date();
    await checkUser.save();

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        accountStatus: checkUser.accountStatus,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: checkUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Logout User
const logoutUser = (req, res) => {
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

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier features");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        isProfileComplete: user.isProfileComplete,
        isVerified: user.isVerified,
        hasActiveMembership: user.hasActiveMembership,
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

// Update User Profile
const updateUserProfile = async (req, res) => {
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

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        ...updatedUser.toObject(),
        isProfileComplete: updatedUser.isProfileComplete,
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token and expiry in database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

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
            <p>Hi ${user.firstName},</p>
            <p>We received a request to reset your password for your BBSBEC User Portal account.</p>
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
            <p>© ${new Date().getFullYear()} BBSBEC User Portal. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail(
      user.email,
      "Password Reset Request - BBSBEC User Portal",
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

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email, // Return email for display (masked)
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

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token!",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

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
            <p>Hi ${user.firstName},</p>
            <div class="success">
              <strong>Your password has been changed successfully!</strong>
            </div>
            <p>Your BBSBEC User Portal account password was changed on ${new Date().toLocaleString()}.</p>
            <p>If you did not make this change, please contact us immediately at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BBSBEC User Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      user.email,
      "Password Changed Successfully - BBSBEC User Portal",
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
  registerUser,
  completeProfile,
  requestVerification,
  loginUser,
  logoutUser,
  authMiddleware,
  getUserProfile,
  updateUserProfile,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
};