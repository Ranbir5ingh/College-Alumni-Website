const Alumni = require("../../models/Alumni");

// Get all alumni (Admin only)
const getAllAlumni = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      batch,
      department,
      graduationYear,
      membershipStatus,
      isVerified,
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (batch) filter.batch = batch;
    if (department) filter.department = department;
    if (graduationYear) filter.graduationYear = graduationYear;
    if (membershipStatus) filter.membershipStatus = membershipStatus;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    
    // Search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { alumniId: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-password',
      sort: { createdAt: -1 },
    };

    const alumni = await Alumni.find(filter)
      .select('-password')
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

    const alumni = await Alumni.findById(id).select("-password");

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

// Update alumni status (Admin only)
const updateAlumniStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, membershipStatus, isActive, role } = req.body;

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Update fields
    if (isVerified !== undefined) alumni.isVerified = isVerified;
    if (membershipStatus) alumni.membershipStatus = membershipStatus;
    if (isActive !== undefined) alumni.isActive = isActive;
    if (role) alumni.role = role;

    await alumni.save();

    res.status(200).json({
      success: true,
      message: "Alumni status updated successfully!",
      data: {
        id: alumni._id,
        isVerified: alumni.isVerified,
        membershipStatus: alumni.membershipStatus,
        isActive: alumni.isActive,
        role: alumni.role,
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

    const alumni = await Alumni.findByIdAndDelete(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

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
    const verifiedAlumni = await Alumni.countDocuments({ isVerified: true });
    const pendingAlumni = await Alumni.countDocuments({ membershipStatus: 'pending' });
    const activeAlumni = await Alumni.countDocuments({ isActive: true });

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
          _id: "$graduationYear",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAlumni,
          verifiedAlumni,
          pendingAlumni,
          activeAlumni,
        },
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
      $or: [
        { isVerified: false },
        { membershipStatus: 'pending' }
      ]
    })
    .select('-password')
    .sort({ createdAt: -1 });

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

module.exports = {
  getAllAlumni,
  getAlumniById,
  updateAlumniStatus,
  deleteAlumni,
  getAlumniStats,
  getPendingVerifications,
};