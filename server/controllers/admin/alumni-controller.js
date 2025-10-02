const Alumni = require("../../models/Alumni");

// Get all alumni (Admin only)
const getAllAlumni = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      batch,
      department,
      yearOfPassing,
      accountStatus,
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (batch) filter.batch = batch;
    if (department) filter.department = department;
    if (yearOfPassing) filter.yearOfPassing = parseInt(yearOfPassing);
    if (accountStatus) filter.accountStatus = accountStatus;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
        { alumniId: { $regex: search, $options: 'i' } },
      ];
    }

    const alumni = await Alumni.find(filter)
      .select('-password')
      .populate('currentMembership.membershipId', 'name tier')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalAlumni = await Alumni.countDocuments(filter);

    if (!alumni.length) {
      return res.status(404).json({
        success: false,
        message: "No alumni found!",
      });
    }

    res.status(200).json({
      success: true,
      data: alumni,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAlumni / limit),
        totalAlumni,
        hasNextPage: page < Math.ceil(totalAlumni / limit),
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

// Get alumni by ID (Admin only)
const getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await Alumni.findById(id)
      .select("-password")
      .populate('currentMembership.membershipId', 'name tier features price')
      .populate('membershipHistory', 'membershipId startDate expiryDate status')
      .populate('eventRegistrations', 'eventId registrationDate attended status')
      .populate('donations', 'donationCampaignId amount donationDate status');

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

// Verify Alumni (Admin only)
const verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
      return res.status(403).json({
        success: false,
        message: "Only admin can verify alumni!",
      });
    }

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    if (alumni.accountStatus !== "pending_verification") {
      return res.status(400).json({
        success: false,
        message: "Alumni is not pending verification!",
      });
    }

    // Verify account
    alumni.accountStatus = "verified";
    await alumni.save();

    // TODO: Send verification success email to alumni

    res.status(200).json({
      success: true,
      message: "Alumni verified successfully!",
      data: {
        id: alumni._id,
        accountStatus: alumni.accountStatus,
        alumniId: alumni.alumniId,
        verifiedAt: alumni.verifiedAt,
        canPostJobs: alumni.canPostJobs,
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

// Reject Alumni (Admin only)
const rejectAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
      return res.status(403).json({
        success: false,
        message: "Only admin can reject alumni!",
      });
    }

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    if (alumni.accountStatus !== "pending_verification") {
      return res.status(400).json({
        success: false,
        message: "Alumni is not pending verification!",
      });
    }

    // TODO: Send rejection email to alumni with reason before deletion

    // Delete the alumni account
    await Alumni.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Alumni account rejected and deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Update alumni status/role (Admin only)
const updateAlumniStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role, canPostJobs, canMentor } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update alumni status!",
      });
    }

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Update fields
    if (isActive !== undefined) alumni.isActive = isActive;
    if (role) alumni.role = role;
    if (canPostJobs !== undefined) alumni.canPostJobs = canPostJobs;
    if (canMentor !== undefined) alumni.canMentor = canMentor;

    await alumni.save();

    res.status(200).json({
      success: true,
      message: "Alumni status updated successfully!",
      data: {
        id: alumni._id,
        isActive: alumni.isActive,
        role: alumni.role,
        canPostJobs: alumni.canPostJobs,
        canMentor: alumni.canMentor,
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

// Delete alumni (Admin only)
const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete alumni!",
      });
    }

    const alumni = await Alumni.findByIdAndDelete(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // TODO: Clean up related data (memberships, registrations, donations)

    res.status(200).json({
      success: true,
      message: "Alumni deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get alumni statistics (Admin only)
const getAlumniStats = async (req, res) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const verifiedAlumni = await Alumni.countDocuments({ accountStatus: 'verified' });
    const pendingVerification = await Alumni.countDocuments({ accountStatus: 'pending_verification' });
    const incompleteProfiles = await Alumni.countDocuments({ accountStatus: 'incomplete_profile' });
    const activeAlumni = await Alumni.countDocuments({ isActive: true });
    const alumniWithMembership = await Alumni.countDocuments({ 
      'currentMembership.status': 'active' 
    });

    // Get department wise count
    const departmentStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get batch wise count
    const batchStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Get year wise count
    const yearStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$yearOfPassing",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Get account status breakdown
    const statusStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$accountStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAlumni,
          verifiedAlumni,
          pendingVerification,
          incompleteProfiles,
          activeAlumni,
          alumniWithMembership,
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
    const pendingAlumni = await Alumni.find({
      accountStatus: 'pending_verification'
    })
    .select('-password')
    .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      data: pendingAlumni,
      count: pendingAlumni.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Export alumni data to Excel (Admin only)
const exportAlumniData = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can export alumni data!",
      });
    }

    const { accountStatus } = req.query;
    
    const filter = {};
    if (accountStatus) filter.accountStatus = accountStatus;

    const alumni = await Alumni.find(filter)
      .select('-password -verificationToken')
      .populate('currentMembership.membershipId', 'name tier')
      .lean();

    // Format data for Excel export
    const excelData = alumni.map(alum => ({
      'Alumni ID': alum.alumniId || 'N/A',
      'First Name': alum.firstName,
      'Middle Name': alum.middleName || '',
      'Last Name': alum.lastName,
      'Email': alum.email,
      'Secondary Email': alum.secondaryEmail || 'N/A',
      'Phone': alum.phone || 'N/A',
      'Enrollment Number': alum.enrollmentNumber,
      'Batch': alum.batch,
      'Department': alum.department,
      'Degree': alum.degree,
      'Year of Joining': alum.yearOfJoining,
      'Year of Passing': alum.yearOfPassing,
      'Gender': alum.gender || 'N/A',
      'Date of Birth': alum.dateOfBirth ? new Date(alum.dateOfBirth).toLocaleDateString() : 'N/A',
      'Current Company': alum.currentCompany || 'N/A',
      'Current Designation': alum.currentDesignation || 'N/A',
      'Industry': alum.industry || 'N/A',
      'LinkedIn': alum.linkedInProfile || 'N/A',
      'City': alum.address?.city || 'N/A',
      'State': alum.address?.state || 'N/A',
      'Country': alum.address?.country || 'N/A',
      'Account Status': alum.accountStatus,
      'Is Active': alum.isActive ? 'Yes' : 'No',
      'Membership Name': alum.currentMembership?.membershipId?.name || 'None',
      'Membership Tier': alum.currentMembership?.membershipId?.tier || 'N/A',
      'Membership Start Date': alum.currentMembership?.startDate 
        ? new Date(alum.currentMembership.startDate).toLocaleDateString() 
        : 'N/A',
      'Membership Expiry Date': alum.currentMembership?.expiryDate 
        ? new Date(alum.currentMembership.expiryDate).toLocaleDateString() 
        : 'N/A',
      'Membership Status': alum.currentMembership?.status || 'N/A',
      'Verified At': alum.verifiedAt ? new Date(alum.verifiedAt).toLocaleDateString() : 'N/A',
      'Registered At': new Date(alum.createdAt).toLocaleDateString(),
    }));

    res.status(200).json({
      success: true,
      message: "Alumni data exported successfully!",
      data: excelData,
      count: excelData.length,
    });

    // NOTE: In actual implementation, use 'xlsx' library to generate and send Excel file
    // const xlsx = require('xlsx');
    // const ws = xlsx.utils.json_to_sheet(excelData);
    // const wb = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(wb, ws, 'Alumni Data');
    // const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    // res.setHeader('Content-Disposition', 'attachment; filename=alumni_data.xlsx');
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.send(buffer);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  verifyAlumni,
  rejectAlumni,
  updateAlumniStatus,
  deleteAlumni,
  getAlumniStats,
  getPendingVerifications,
  exportAlumniData,
};