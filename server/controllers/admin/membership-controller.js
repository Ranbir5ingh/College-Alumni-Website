// controllers/admin/membership-controller.js
const MembershipPurchase = require("../../models/MembershipPurchase");
const User = require("../../models/User");
const mongoose = require("mongoose");

// Get all membership purchases with filters
const getAllMembershipPurchases = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      planType,
      status,
      paymentStatus,
      search,
      sortBy = "purchaseDate",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    if (planType) {
      filter.planType = planType;
    }

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Search by receipt number or transaction ID
    if (search) {
      filter.$or = [
        { receiptNumber: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [purchases, total] = await Promise.all([
      MembershipPurchase.find(filter)
        .populate("alumniId", "firstName lastName email enrollmentNumber alumniId")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      MembershipPurchase.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        purchases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (e) {
    console.error("Error in getAllMembershipPurchases:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership purchases",
    });
  }
};

// Get membership statistics
const getMembershipStatistics = async (req, res) => {
  try {
    // Overall statistics
    const overallStats = await MembershipPurchase.aggregate([
      {
        $match: { paymentStatus: "completed" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalPurchases: { $sum: 1 },
          activeMemberships: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Plan-wise statistics
    const planStats = await MembershipPurchase.aggregate([
      {
        $match: { paymentStatus: "completed" },
      },
      {
        $group: {
          _id: "$planType",
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Monthly revenue trend (last 12 months)
    const monthlyRevenue = await MembershipPurchase.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          purchaseDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Expiring memberships (next 30 days)
    const expiringCount = await MembershipPurchase.countDocuments({
      status: "active",
      planType: "monthly",
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Recent purchases
    const recentPurchases = await MembershipPurchase.find({
      paymentStatus: "completed",
    })
      .populate("alumniId", "firstName lastName email")
      .sort({ purchaseDate: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overall: overallStats[0] || {
          totalRevenue: 0,
          totalPurchases: 0,
          activeMemberships: 0,
        },
        planStats,
        monthlyRevenue,
        expiringCount,
        recentPurchases,
      },
    });
  } catch (e) {
    console.error("Error in getMembershipStatistics:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership statistics",
    });
  }
};

// Get membership purchase by ID
const getMembershipPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await MembershipPurchase.findById(id)
      .populate("alumniId", "firstName lastName email phone enrollmentNumber alumniId batch department")
      .populate("processedBy", "firstName lastName email")
      .lean();

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Membership purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (e) {
    console.error("Error in getMembershipPurchaseById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership purchase",
    });
  }
};

// Get user's membership history
const getUserMembershipHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await MembershipPurchase.find({
      alumniId: userId,
    })
      .sort({ purchaseDate: -1 })
      .lean();

    // Calculate user statistics
    const userStats = await MembershipPurchase.aggregate([
      {
        $match: {
          alumniId: new mongoose.Types.ObjectId(userId),
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$planType",
          count: { $sum: 1 },
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    // Get active membership
    const activeMembership = await MembershipPurchase.findActiveMembership(userId);

    res.status(200).json({
      success: true,
      data: {
        history,
        stats: userStats,
        activeMembership,
      },
    });
  } catch (e) {
    console.error("Error in getUserMembershipHistory:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user membership history",
    });
  }
};

// Update membership status (admin action)
const updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const { id: adminId } = req.user;

    if (!["active", "expired", "cancelled", "refunded"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const purchase = await MembershipPurchase.findById(id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Membership purchase not found",
      });
    }

    // Update status
    purchase.status = status;
    if (notes) {
      purchase.notes = notes;
    }
    purchase.processedBy = adminId;

    await purchase.save();

    // Update user's current membership if this is the active one
    if (status === "expired" || status === "cancelled") {
      const user = await User.findById(purchase.alumniId);
      if (
        user &&
        user.currentMembership &&
        user.currentMembership.membershipId.toString() === id
      ) {
        user.currentMembership.status = status;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Membership status updated successfully",
      data: purchase,
    });
  } catch (e) {
    console.error("Error in updateMembershipStatus:", e);
    res.status(500).json({
      success: false,
      message: "Failed to update membership status",
    });
  }
};

// Process refund
const processMembershipRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount, refundReason } = req.body;
    const { id: adminId } = req.user;

    const purchase = await MembershipPurchase.findById(id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Membership purchase not found",
      });
    }

    if (purchase.paymentStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "This purchase has already been refunded",
      });
    }

    // Update purchase with refund details
    purchase.paymentStatus = "refunded";
    purchase.status = "refunded";
    purchase.refundedAt = new Date();
    purchase.refundAmount = refundAmount || purchase.amount;
    purchase.refundReason = refundReason;
    purchase.processedBy = adminId;

    await purchase.save();

    // Update user's current membership
    const user = await User.findById(purchase.alumniId);
    if (
      user &&
      user.currentMembership &&
      user.currentMembership.membershipId.toString() === id
    ) {
      user.currentMembership.status = "refunded";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: purchase,
    });
  } catch (e) {
    console.error("Error in processMembershipRefund:", e);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
    });
  }
};

// Get expiring memberships
const getExpiringMemberships = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const expiringDate = new Date();
    expiringDate.setDate(expiringDate.getDate() + parseInt(days));

    const expiringMemberships = await MembershipPurchase.find({
      status: "active",
      planType: "monthly",
      expiryDate: {
        $gte: new Date(),
        $lte: expiringDate,
      },
    })
      .populate("alumniId", "firstName lastName email phone")
      .sort({ expiryDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        count: expiringMemberships.length,
        memberships: expiringMemberships,
      },
    });
  } catch (e) {
    console.error("Error in getExpiringMemberships:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expiring memberships",
    });
  }
};

// Export revenue report
const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "month" } = req.query;

    const matchFilter = {
      paymentStatus: "completed",
    };

    if (startDate || endDate) {
      matchFilter.purchaseDate = {};
      if (startDate) matchFilter.purchaseDate.$gte = new Date(startDate);
      if (endDate) matchFilter.purchaseDate.$lte = new Date(endDate);
    }

    let groupByField;
    switch (groupBy) {
      case "day":
        groupByField = {
          year: { $year: "$purchaseDate" },
          month: { $month: "$purchaseDate" },
          day: { $dayOfMonth: "$purchaseDate" },
        };
        break;
      case "week":
        groupByField = {
          year: { $year: "$purchaseDate" },
          week: { $week: "$purchaseDate" },
        };
        break;
      case "year":
        groupByField = {
          year: { $year: "$purchaseDate" },
        };
        break;
      default: // month
        groupByField = {
          year: { $year: "$purchaseDate" },
          month: { $month: "$purchaseDate" },
        };
    }

    const report = await MembershipPurchase.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: groupByField,
          totalRevenue: { $sum: "$amount" },
          totalPurchases: { $sum: 1 },
          monthlyCount: {
            $sum: { $cond: [{ $eq: ["$planType", "monthly"] }, 1, 0] },
          },
          lifetimeCount: {
            $sum: { $cond: [{ $eq: ["$planType", "lifetime"] }, 1, 0] },
          },
          monthlyRevenue: {
            $sum: {
              $cond: [{ $eq: ["$planType", "monthly"] }, "$amount", 0],
            },
          },
          lifetimeRevenue: {
            $sum: {
              $cond: [{ $eq: ["$planType", "lifetime"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (e) {
    console.error("Error in getRevenueReport:", e);
    res.status(500).json({
      success: false,
      message: "Failed to generate revenue report",
    });
  }
};

// Bulk update expired memberships
const updateExpiredMemberships = async (req, res) => {
  try {
    const result = await MembershipPurchase.updateMany(
      {
        status: "active",
        expiryDate: { $lt: new Date() },
        planType: "monthly",
      },
      {
        $set: { status: "expired" },
      }
    );

    // Also update user records
    const expiredPurchases = await MembershipPurchase.find({
      status: "expired",
      expiryDate: { $lt: new Date() },
    }).select("alumniId _id");

    for (const purchase of expiredPurchases) {
      await User.updateOne(
        {
          _id: purchase.alumniId,
          "currentMembership.membershipId": purchase._id,
        },
        {
          $set: { "currentMembership.status": "expired" },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} expired memberships`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (e) {
    console.error("Error in updateExpiredMemberships:", e);
    res.status(500).json({
      success: false,
      message: "Failed to update expired memberships",
    });
  }
};

// Get active members list
const getActiveMembers = async (req, res) => {
  try {
    const { page = 1, limit = 20, planType, search } = req.query;

    const filter = {
      status: "active",
      expiryDate: { $gte: new Date() },
      paymentStatus: "completed",
    };

    if (planType) {
      filter.planType = planType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = MembershipPurchase.find(filter)
      .populate("alumniId", "firstName lastName email phone enrollmentNumber batch department")
      .sort({ expiryDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const [members, total] = await Promise.all([
      query.lean(),
      MembershipPurchase.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        members,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (e) {
    console.error("Error in getActiveMembers:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active members",
    });
  }
};

module.exports = {
  getAllMembershipPurchases,
  getMembershipStatistics,
  getMembershipPurchaseById,
  getUserMembershipHistory,
  updateMembershipStatus,
  processMembershipRefund,
  getExpiringMemberships,
  getRevenueReport,
  updateExpiredMemberships,
  getActiveMembers,
};