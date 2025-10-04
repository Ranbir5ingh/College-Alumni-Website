// controllers/user/user-controller.js
const User = require("../../models/User");
const Donation = require("../../models/Donation"); // ADD THIS
const DonationCampaign = require("../../models/DonationCampaign"); // ADD THIS

// Get my dashboard data
const getMyDashboard = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier features")
      .populate({
        path: "eventRegistrations",
        populate: {
          path: "eventId",
          select: "title date location status"
        }
      })
      .populate({
        path: "donations",
        select: "amount donationDate status donationCampaignId"
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Get upcoming events user is registered for
    const Event = require("../../models/Event");
    const upcomingEvents = await Event.find({
      _id: { $in: user.eventRegistrations },
      date: { $gte: new Date() },
      status: "published"
    })
      .select("title date location eventType")
      .sort({ date: 1 })
      .limit(5);

    // Get recent donations
    const recentDonations = user.donations.slice(-3).reverse();

    // Calculate stats
    const stats = {
      totalEventsAttended: user.eventRegistrations.length,
      totalDonations: user.donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      membershipStatus: user.hasActiveMembership ? "active" : "inactive",
      accountCompleteness: calculateProfileCompleteness(user),
      upcomingEventsCount: upcomingEvents.length,
    };

    res.status(200).json({
      success: true,
      data: {
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          alumniId: user.alumniId,
          batch: user.batch,
          department: user.department,
          degree: user.degree,
          currentCompany: user.currentCompany,
          currentDesignation: user.currentDesignation,
          accountStatus: user.accountStatus,
          isVerified: user.isVerified,
          isProfileComplete: user.isProfileComplete,
        },
        stats,
        upcomingEvents,
        recentDonations,
        membership: user.currentMembership,
      },
    });
  } catch (e) {
    console.error("Error in getMyDashboard:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

// Helper function to calculate profile completeness percentage
function calculateProfileCompleteness(user) {
  const fields = [
    user.phone,
    user.gender,
    user.dateOfBirth,
    user.currentCompany,
    user.currentDesignation,
    user.industry,
    user.address?.city,
    user.address?.state,
    user.address?.country,
    user.linkedInProfile,
    user.profilePicture,
    user.bio,
  ];

  const filledFields = fields.filter(
    (field) => field && field !== ""
  ).length;

  return Math.round((filledFields / fields.length) * 100);
}

// Get my events
const getMyEvents = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate({
      path: "eventRegistrations",
      populate: {
        path: "eventId",
        select: "title description date location eventType status banner"
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: user.eventRegistrations,
      count: user.eventRegistrations.length,
    });
  } catch (e) {
    console.error("Error in getMyEvents:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// Get my donations
const getMyDonations = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate({
      path: "donations",
      populate: {
        path: "donationCampaignId",
        select: "title description"
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: user.donations,
      total: user.donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      count: user.donations.length,
    });
  } catch (e) {
    console.error("Error in getMyDonations:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

// Get my membership details
const getMyMembership = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select("currentMembership membershipHistory")
      .populate("currentMembership.membershipId", "name tier features price description")
      .populate({
        path: "membershipHistory",
        populate: {
          path: "membershipId",
          select: "name tier"
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        current: user.currentMembership,
        history: user.membershipHistory,
        hasActiveMembership: user.hasActiveMembership,
      },
    });
  } catch (e) {
    console.error("Error in getMyMembership:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership details",
    });
  }
};

// Search user directory (public for verified user)
const searchUserDirectory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      batch,
      department,
      yearOfPassing,
      currentCompany,
    } = req.query;

    // Only verified user can be searched
    const filter = { accountStatus: "verified", isActive: true };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { alumniId: { $regex: search, $options: "i" } },
      ];
    }

    if (batch) filter.batch = batch;
    if (department) filter.department = department;
    if (yearOfPassing) filter.yearOfPassing = parseInt(yearOfPassing);
    if (currentCompany) filter.currentCompany = { $regex: currentCompany, $options: "i" };

    const user = await User.find(filter)
      .select("firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile privacySettings")
      .sort({ lastName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter based on privacy settings
    const filteredUser = user.map(alum => {
      const alumObj = alum.toObject();
      
      if (!alumObj.privacySettings?.showEmail) delete alumObj.email;
      if (!alumObj.privacySettings?.showPhone) delete alumObj.phone;
      if (!alumObj.privacySettings?.showCompany) {
        delete alumObj.currentCompany;
        delete alumObj.currentDesignation;
      }
      delete alumObj.privacySettings;
      
      return alumObj;
    });

    const totalUser = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: filteredUser,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUser / limit),
        totalUser,
        hasNextPage: page < Math.ceil(totalUser / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in searchUserDirectory:", e);
    res.status(500).json({
      success: false,
      message: "Failed to search directory",
    });
  }
};

// Get user profile by ID (respects privacy)
const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      accountStatus: "verified",
      isActive: true,
    }).select(
      "firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile bio email phone privacySettings"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or not accessible!",
      });
    }

    const alumObj = user.toObject();

    // Apply privacy filters
    if (!alumObj.privacySettings?.showEmail) delete alumObj.email;
    if (!alumObj.privacySettings?.showPhone) delete alumObj.phone;
    if (!alumObj.privacySettings?.showCompany) {
      delete alumObj.currentCompany;
      delete alumObj.currentDesignation;
    }
    delete alumObj.privacySettings;

    res.status(200).json({
      success: true,
      data: alumObj,
    });
  } catch (e) {
    console.error("Error in getUserProfileById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

module.exports = {
  getMyDashboard,
  getMyEvents,
  getMyDonations,
  getMyMembership,
  searchUserDirectory,
  getUserProfileById,
};