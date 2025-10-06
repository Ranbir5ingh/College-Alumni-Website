const User = require("../../models/User");
const { imageUploadUtil } = require("../../helpers/cloudinary");
const MembershipPurchase = require("../../models/MembershipPurchase");

// Helper function to check if a query parameter is meaningful (not null, undefined, or empty string literal)
const isQueryValid = (value) =>
  value && value !== "null" && value !== "undefined" && value !== "";

// Get all user (Admin only)
const getAllUser = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      batch,
      department,
      yearOfPassing,
      accountStatus,
      search,
    } = req.query; // Build filter object

    const filter = { role: "alumni" }; // Apply filter only if the query value is valid
    if (isQueryValid(batch)) filter.batch = batch;
    if (isQueryValid(department)) filter.department = department;
    if (isQueryValid(yearOfPassing))
      filter.yearOfPassing = parseInt(yearOfPassing);
    if (isQueryValid(accountStatus)) filter.accountStatus = accountStatus; // Search functionality
    if (isQueryValid(search)) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { enrollmentNumber: { $regex: search, $options: "i" } },
        { alumniId: { $regex: search, $options: "i" } },
      ];
    }

    const user = await User.find(filter)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUser = await User.countDocuments(filter);

    if (!user.length) {
      // Returning 404 here only if the query found nothing.
      // With the fix above, this should now correctly return the full list (200) when no filters are set.
      return res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUser / limit),
        totalUser,
        hasNextPage: page < Math.ceil(totalUser / limit),
        hasPrevPage: page > 1,
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

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier features price")
      .populate("membershipHistory", "membershipId startDate expiryDate status")
      .populate(
        "eventRegistrations",
        "eventId registrationDate attended status"
      )
      .populate("donations", "donationCampaignId amount donationDate status");

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

// Verify User (Admin only)
const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      req.user.role !== "admin" &&
      req.user.role !== "super_admin" &&
      req.user.role !== "committee"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admin can verify user!",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.accountStatus !== "pending_verification") {
      return res.status(400).json({
        success: false,
        message: "User is not pending verification!",
      });
    } // Verify account

    user.accountStatus = "verified";
    await user.save(); // TODO: Send verification success email to user

    res.status(200).json({
      success: true,
      message: "User verified successfully!",
      data: {
        id: user._id,
        accountStatus: user.accountStatus,
        alumniId: user.alumniId,
        verifiedAt: user.verifiedAt,
        canPostJobs: user.canPostJobs,
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

// Reject User (Admin only)
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (
      req.user.role !== "admin" &&
      req.user.role !== "super_admin" &&
      req.user.role !== "committee"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admin can reject user!",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.accountStatus !== "pending_verification") {
      return res.status(400).json({
        success: false,
        message: "User is not pending verification!",
      });
    } // TODO: Send rejection email to user with reason before deletion // Delete the user account

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User account rejected and deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Update user status/role (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role, canPostJobs, canMentor } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update user status!",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    } // Update fields

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;
    if (canPostJobs !== undefined) user.canPostJobs = canPostJobs;
    if (canMentor !== undefined) user.canMentor = canMentor;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully!",
      data: {
        id: user._id,
        isActive: user.isActive,
        role: user.role,
        canPostJobs: user.canPostJobs,
        canMentor: user.canMentor,
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

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete user!",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    } // TODO: Clean up related data (memberships, registrations, donations)

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const verifiedUser = await User.countDocuments({
      accountStatus: "verified",
    });
    const pendingVerification = await User.countDocuments({
      accountStatus: "pending_verification",
    });
    const incompleteProfiles = await User.countDocuments({
      accountStatus: "incomplete_profile",
    });
    const activeUser = await User.countDocuments({ isActive: true });
    const userWithMembership = await User.countDocuments({
      "currentMembership.status": "active",
    }); // Get department wise count

    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]); // Get batch wise count

    const batchStats = await User.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]); // Get year wise count

    const yearStats = await User.aggregate([
      {
        $group: {
          _id: "$yearOfPassing",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]); // Get account status breakdown

    const statusStats = await User.aggregate([
      {
        $group: {
          _id: "$accountStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUser,
          verifiedUser,
          pendingVerification,
          incompleteProfiles,
          activeUser,
          userWithMembership,
        },
        statusStats,
        departmentStats,
        batchStats,
        yearStats,
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

// Get pending verifications (Admin only)
const getPendingVerifications = async (req, res) => {
  try {
    const pendingUser = await User.find({
      accountStatus: "pending_verification",
    })
      .select("-password")
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      data: pendingUser,
      count: pendingUser.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Export user data to Excel (Admin only)
const exportUserData = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can export user data!",
      });
    }

    const { accountStatus } = req.query;
    const filter = { role: "alumni" };
    if (accountStatus) filter.accountStatus = accountStatus;

    const user = await User.find(filter)
      .select("-password -verificationToken")
      .populate("currentMembership.membershipId", "name tier")
      .lean(); // Format data for Excel export

    const excelData = user.map((alum) => ({
      "User ID": alum.alumniId || "N/A",
      "First Name": alum.firstName,
      "Middle Name": alum.middleName || "",
      "Last Name": alum.lastName,
      Email: alum.email,
      "Secondary Email": alum.secondaryEmail || "N/A",
      Phone: alum.phone || "N/A",
      "Enrollment Number": alum.enrollmentNumber,
      Batch: alum.batch,
      Department: alum.department,
      Degree: alum.degree,
      "Year of Joining": alum.yearOfJoining,
      "Year of Passing": alum.yearOfPassing,
      Gender: alum.gender || "N/A",
      "Date of Birth": alum.dateOfBirth
        ? new Date(alum.dateOfBirth).toLocaleDateString()
        : "N/A",
      "Current Company": alum.currentCompany || "N/A",
      "Current Designation": alum.currentDesignation || "N/A",
      Industry: alum.industry || "N/A",
      LinkedIn: alum.linkedInProfile || "N/A",
      City: alum.address?.city || "N/A",
      State: alum.address?.state || "N/A",
      Country: alum.address?.country || "N/A",
      "Account Status": alum.accountStatus,
      "Is Active": alum.isActive ? "Yes" : "No",
      "Membership Name": alum.currentMembership?.membershipId?.name || "None",
      "Membership Tier": alum.currentMembership?.membershipId?.tier || "N/A",
      "Membership Start Date": alum.currentMembership?.startDate
        ? new Date(alum.currentMembership.startDate).toLocaleDateString()
        : "N/A",
      "Membership Expiry Date": alum.currentMembership?.expiryDate
        ? new Date(alum.currentMembership.expiryDate).toLocaleDateString()
        : "N/A",
      "Membership Status": alum.currentMembership?.status || "N/A",
      "Verified At": alum.verifiedAt
        ? new Date(alum.verifiedAt).toLocaleDateString()
        : "N/A",
      "Registered At": new Date(alum.createdAt).toLocaleDateString(),
    }));

    res.status(200).json({
      success: true,
      message: "User data exported successfully!",
      data: excelData,
      count: excelData.length,
    }); // NOTE: In actual implementation, use 'xlsx' library to generate and send Excel file // const xlsx = require('xlsx'); // const ws = xlsx.utils.json_to_sheet(excelData); // const wb = xlsx.utils.book_new(); // xlsx.utils.book_append_sheet(wb, ws, 'User Data'); // const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }); // res.setHeader('Content-Disposition', 'attachment; filename=user_data.xlsx'); // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // res.send(buffer);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred during image upload" });
  }
};

module.exports = {
  getAllUser,
  getUserById,
  verifyUser,
  rejectUser,
  updateUserStatus,
  deleteUser,
  getUserStats,
  getPendingVerifications,
  exportUserData,
  handleImageUpload,
};
