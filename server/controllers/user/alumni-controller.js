// controllers/user/user-controller.js
const User = require("../../models/User");
const Event = require("../../models/Event");
const EventRegistration = require("../../models/EventRegistration");
const Donation = require("../../models/Donation");
const DonationCampaign = require("../../models/DonationCampaign");

// Get my dashboard data
const getMyDashboard = async (req, res) => {
  try {
    const { id } = req.user;

    // DON'T use .lean() here - we need virtuals
    const user = await User.findById(id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier features");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Convert to object to get virtuals
    const userObj = user.toObject();

    // Get all event registrations for this user
    const eventRegistrations = await EventRegistration.find({
      alumniId: id,
      status: { $ne: "cancelled" }
    })
      .populate('eventId', 'title startDateTime endDateTime venue isOnline eventType coverImage status')
      .lean();

    // Get upcoming events (future events user is registered for)
    const now = new Date();
    const upcomingEvents = eventRegistrations
      .filter(reg => {
        const event = reg.eventId;
        return event && 
               event.status === 'published' && 
               new Date(event.startDateTime) > now;
      })
      .sort((a, b) => new Date(a.eventId.startDateTime) - new Date(b.eventId.startDateTime))
      .slice(0, 5)
      .map(reg => ({
        ...reg.eventId,
        registrationId: reg._id,
        registrationNumber: reg.registrationNumber,
        registrationDate: reg.registrationDate,
        attended: reg.attended
      }));

    // Get attended events count (events where attendance was marked)
    const attendedEventsCount = await EventRegistration.countDocuments({
      alumniId: id,
      attended: true,
      status: { $ne: "cancelled" }
    });

    // Get total registered events count
    const totalRegisteredEvents = await EventRegistration.countDocuments({
      alumniId: id,
      status: { $ne: "cancelled" }
    });

    // Get recent donations
    const recentDonations = await Donation.find({ alumniId: id })
      .populate('donationCampaignId', 'title description')
      .sort({ donationDate: -1 })
      .limit(3)
      .lean();

    // Calculate total donations
    const totalDonations = await Donation.aggregate([
      {
        $match: { 
          alumniId: user._id,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate stats using virtuals from the user document
    const stats = {
      totalEventsRegistered: totalRegisteredEvents,
      totalEventsAttended: attendedEventsCount,
      attendanceRate: totalRegisteredEvents > 0 
        ? `${Math.round((attendedEventsCount / totalRegisteredEvents) * 100)}%`
        : '0%',
      totalDonations: totalDonations.length > 0 ? totalDonations[0].total : 0,
      membershipStatus: user.hasActiveMembership ? "active" : "inactive",
      accountCompleteness: calculateProfileCompleteness(userObj),
      upcomingEventsCount: upcomingEvents.length,
    };

    res.status(200).json({
      success: true,
      data: {
        profile: {
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email,
          profilePicture: userObj.profilePicture,
          alumniId: userObj.alumniId,
          batch: userObj.batch,
          department: userObj.department,
          degree: userObj.degree,
          currentCompany: userObj.currentCompany,
          currentDesignation: userObj.currentDesignation,
          accountStatus: userObj.accountStatus,
          isVerified: userObj.isVerified, // Virtual
          isProfileComplete: userObj.isProfileComplete, // Virtual
          fullName: userObj.fullName, // Virtual
        },
        stats,
        upcomingEvents,
        recentDonations,
        membership: userObj.currentMembership,
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
    const { 
      page = 1, 
      limit = 10, 
      status, 
      upcoming, 
      attended 
    } = req.query;

    // Build filter
    const filter = { 
      alumniId: id,
      status: { $ne: "cancelled" }
    };

    // Get registrations with populated event data
    const registrations = await EventRegistration.find(filter)
      .populate({
        path: 'eventId',
        select: 'title description startDateTime endDateTime venue isOnline eventType status coverImage'
      })
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalRegistrations = await EventRegistration.countDocuments(filter);

    // Filter based on query params
    let filteredRegistrations = registrations.filter(reg => reg.eventId !== null);

    if (upcoming === 'true') {
      const now = new Date();
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.eventId.startDateTime) > now
      );
    }

    if (attended !== undefined) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        reg.attended === (attended === 'true')
      );
    }

    // Format response
    const formattedEvents = filteredRegistrations.map(reg => ({
      registrationId: reg._id,
      registrationNumber: reg.registrationNumber,
      registrationDate: reg.registrationDate,
      status: reg.status,
      attended: reg.attended,
      attendanceMarkedAt: reg.attendanceMarkedAt,
      amount: reg.amount,
      paymentStatus: reg.paymentStatus,
      event: reg.eventId
    }));

    res.status(200).json({
      success: true,
      data: formattedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRegistrations / limit),
        totalRegistrations,
        hasNextPage: page < Math.ceil(totalRegistrations / limit),
        hasPrevPage: page > 1,
      },
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
    const { page = 1, limit = 10 } = req.query;

    const donations = await Donation.find({ alumniId: id })
      .populate('donationCampaignId', 'title description goalAmount')
      .sort({ donationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalDonations = await Donation.countDocuments({ alumniId: id });

    // Calculate total amount - convert id string to ObjectId
    const mongoose = require('mongoose');
    const totalAmount = await Donation.aggregate([
      {
        $match: { 
          alumniId: new mongoose.Types.ObjectId(id),
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: donations,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDonations / limit),
        totalDonations,
        hasNextPage: page < Math.ceil(totalDonations / limit),
        hasPrevPage: page > 1,
      },
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

    // Don't use .lean() to access virtuals
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

    // Access virtual through document
    const hasActiveMembership = user.hasActiveMembership;

    res.status(200).json({
      success: true,
      data: {
        current: user.currentMembership,
        history: user.membershipHistory,
        hasActiveMembership,
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

// Search user directory (public for verified users)
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

    // Only verified users can be searched
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

    const users = await User.find(filter)
      .select("firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile privacySettings")
      .sort({ lastName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Filter based on privacy settings
    const filteredUsers = users.map(user => {
      const userObj = { ...user };
      
      if (!userObj.privacySettings?.showEmail) delete userObj.email;
      if (!userObj.privacySettings?.showPhone) delete userObj.phone;
      if (!userObj.privacySettings?.showCompany) {
        delete userObj.currentCompany;
        delete userObj.currentDesignation;
      }
      delete userObj.privacySettings;
      
      return userObj;
    });

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: filteredUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
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
    })
      .select(
        "firstName lastName profilePicture alumniId batch department degree yearOfPassing currentCompany currentDesignation industry linkedInProfile bio email phone privacySettings"
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or not accessible!",
      });
    }

    const userObj = { ...user };

    // Apply privacy filters
    if (!userObj.privacySettings?.showEmail) delete userObj.email;
    if (!userObj.privacySettings?.showPhone) delete userObj.phone;
    if (!userObj.privacySettings?.showCompany) {
      delete userObj.currentCompany;
      delete userObj.currentDesignation;
    }
    delete userObj.privacySettings;

    res.status(200).json({
      success: true,
      data: userObj,
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