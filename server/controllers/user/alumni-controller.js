// controllers/user/alumni-controller.js
const Alumni = require("../../models/Alumni");
const Donation = require("../../models/Donation"); // ADD THIS
const DonationCampaign = require("../../models/DonationCampaign"); // ADD THIS

// Get my dashboard data
const getMyDashboard = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await Alumni.findById(id)
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

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    // Get upcoming events user is registered for
    const Event = require("../../models/Event");
    const upcomingEvents = await Event.find({
      _id: { $in: alumni.eventRegistrations },
      date: { $gte: new Date() },
      status: "published"
    })
      .select("title date location eventType")
      .sort({ date: 1 })
      .limit(5);

    // Get recent donations
    const recentDonations = alumni.donations.slice(-3).reverse();

    // Calculate stats
    const stats = {
      totalEventsAttended: alumni.eventRegistrations.length,
      totalDonations: alumni.donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      membershipStatus: alumni.hasActiveMembership ? "active" : "inactive",
      accountCompleteness: calculateProfileCompleteness(alumni),
      upcomingEventsCount: upcomingEvents.length,
    };

    res.status(200).json({
      success: true,
      data: {
        profile: {
          firstName: alumni.firstName,
          lastName: alumni.lastName,
          email: alumni.email,
          profilePicture: alumni.profilePicture,
          alumniId: alumni.alumniId,
          batch: alumni.batch,
          department: alumni.department,
          degree: alumni.degree,
          currentCompany: alumni.currentCompany,
          currentDesignation: alumni.currentDesignation,
          accountStatus: alumni.accountStatus,
          isVerified: alumni.isVerified,
          isProfileComplete: alumni.isProfileComplete,
        },
        stats,
        upcomingEvents,
        recentDonations,
        membership: alumni.currentMembership,
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
function calculateProfileCompleteness(alumni) {
  const fields = [
    alumni.phone,
    alumni.gender,
    alumni.dateOfBirth,
    alumni.currentCompany,
    alumni.currentDesignation,
    alumni.industry,
    alumni.address?.city,
    alumni.address?.state,
    alumni.address?.country,
    alumni.linkedInProfile,
    alumni.profilePicture,
    alumni.bio,
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

    const alumni = await Alumni.findById(id).populate({
      path: "eventRegistrations",
      populate: {
        path: "eventId",
        select: "title description date location eventType status banner"
      }
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: alumni.eventRegistrations,
      count: alumni.eventRegistrations.length,
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

    const alumni = await Alumni.findById(id).populate({
      path: "donations",
      populate: {
        path: "donationCampaignId",
        select: "title description"
      }
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: alumni.donations,
      total: alumni.donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      count: alumni.donations.length,
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

    const alumni = await Alumni.findById(id)
      .select("currentMembership membershipHistory")
      .populate("currentMembership.membershipId", "name tier features price description")
      .populate({
        path: "membershipHistory",
        populate: {
          path: "membershipId",
          select: "name tier"
        }
      });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        current: alumni.currentMembership,
        history: alumni.membershipHistory,
        hasActiveMembership: alumni.hasActiveMembership,
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

// Search alumni directory (public for verified alumni)
const searchAlumniDirectory = async (req, res) => {
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

    // Only verified alumni can be searched
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

    const alumni = await Alumni.find(filter)
      .select("firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile privacySettings")
      .sort({ lastName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter based on privacy settings
    const filteredAlumni = alumni.map(alum => {
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

    const totalAlumni = await Alumni.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: filteredAlumni,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAlumni / limit),
        totalAlumni,
        hasNextPage: page < Math.ceil(totalAlumni / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in searchAlumniDirectory:", e);
    res.status(500).json({
      success: false,
      message: "Failed to search directory",
    });
  }
};

// Get alumni profile by ID (respects privacy)
const getAlumniProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await Alumni.findOne({
      _id: id,
      accountStatus: "verified",
      isActive: true,
    }).select(
      "firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile bio email phone privacySettings"
    );

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found or not accessible!",
      });
    }

    const alumObj = alumni.toObject();

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
    console.error("Error in getAlumniProfileById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alumni profile",
    });
  }
};

module.exports = {
  getMyDashboard,
  getMyEvents,
  getMyDonations,
  getMyMembership,
  searchAlumniDirectory,
  getAlumniProfileById,
};