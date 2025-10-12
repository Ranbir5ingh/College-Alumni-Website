// controllers/admin/donation-controller.js
const Donation = require("../../models/Donation");
const User = require("../../models/User");
const mongoose = require("mongoose");

// Get all donations with filters and pagination
const getAllDonations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      paymentStatus,
      status,
      startDate,
      endDate,
      search,
      sortBy = 'donationDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (category) filter.category = category;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    // Search by donor name, email, or transaction ID
    if (search) {
      filter.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { donorEmail: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const donations = await Donation.find(filter)
      .populate('alumniId', 'firstName lastName email alumniId batch department')
      .populate('processedBy', 'firstName lastName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalDonations = await Donation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDonations / limit),
        totalDonations,
        hasNextPage: page < Math.ceil(totalDonations / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in getAllDonations:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

// Get donation statistics for dashboard
const getDonationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.donationDate = {};
      if (startDate) dateFilter.donationDate.$gte = new Date(startDate);
      if (endDate) dateFilter.donationDate.$lte = new Date(endDate);
    }

    // Overall statistics
    const overallStats = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          averageDonation: { $avg: '$amount' }
        }
      }
    ]);

    // Category-wise breakdown
    const categoryStats = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    // Monthly trend (last 12 months)
    const monthlyTrend = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          donationDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Payment status breakdown
    const paymentStatusStats = await Donation.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top donors
    const topDonors = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          isAnonymous: false,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$alumniId',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Populate donor information
    const topDonorsWithInfo = await User.populate(topDonors, {
      path: '_id',
      select: 'firstName lastName email alumniId profilePicture batch'
    });

    // Recent donations
    const recentDonations = await Donation.find({
      paymentStatus: 'completed'
    })
      .populate('alumniId', 'firstName lastName email alumniId')
      .sort({ donationDate: -1 })
      .limit(10)
      .lean();

    // Donation type breakdown
    const donationTypeStats = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$donationType',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAmount: overallStats.length > 0 ? overallStats[0].totalAmount : 0,
          totalDonations: overallStats.length > 0 ? overallStats[0].totalDonations : 0,
          averageDonation: overallStats.length > 0 ? Math.round(overallStats[0].averageDonation) : 0
        },
        categoryStats,
        monthlyTrend,
        paymentStatusStats,
        topDonors: topDonorsWithInfo,
        recentDonations,
        donationTypeStats
      },
    });
  } catch (e) {
    console.error("Error in getDonationStats:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation statistics",
    });
  }
};

// Get donation by ID
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id)
      .populate('alumniId', 'firstName lastName email phone alumniId batch department degree currentCompany')
      .populate('processedBy', 'firstName lastName email')
      .lean();

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (e) {
    console.error("Error in getDonationById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation",
    });
  }
};

// Update donation
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: adminId } = req.user;
    const updateData = req.body;

    // Don't allow updating certain fields
    delete updateData.alumniId;
    delete updateData.transactionId;
    delete updateData.amount;
    delete updateData.donationDate;

    // Add processedBy
    updateData.processedBy = adminId;

    const donation = await Donation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('alumniId', 'firstName lastName email alumniId')
      .lean();

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in updateDonation:", e);
    res.status(500).json({
      success: false,
      message: "Failed to update donation",
    });
  }
};

// Generate receipt
const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptUrl } = req.body;

    if (!receiptUrl) {
      return res.status(400).json({
        success: false,
        message: "Receipt URL is required",
      });
    }

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Receipt can only be generated for completed donations",
      });
    }

    donation.receiptUrl = receiptUrl;
    donation.receiptGeneratedAt = new Date();
    await donation.save();

    res.status(200).json({
      success: true,
      message: "Receipt generated successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in generateReceipt:", e);
    res.status(500).json({
      success: false,
      message: "Failed to generate receipt",
    });
  }
};

// Generate tax certificate
const generateTaxCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateUrl } = req.body;

    if (!certificateUrl) {
      return res.status(400).json({
        success: false,
        message: "Certificate URL is required",
      });
    }

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Tax certificate can only be generated for completed donations",
      });
    }

    if (!donation.panNumber) {
      return res.status(400).json({
        success: false,
        message: "PAN number required for tax certificate",
      });
    }

    donation.taxCertificateUrl = certificateUrl;
    donation.taxCertificateGenerated = true;
    donation.taxCertificateGeneratedAt = new Date();
    await donation.save();

    res.status(200).json({
      success: true,
      message: "Tax certificate generated successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in generateTaxCertificate:", e);
    res.status(500).json({
      success: false,
      message: "Failed to generate tax certificate",
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: adminId } = req.user;
    const { refundReason, refundAmount } = req.body;

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Only completed donations can be refunded",
      });
    }

    donation.paymentStatus = 'refunded';
    donation.status = 'refunded';
    donation.refundedAt = new Date();
    donation.refundReason = refundReason;
    donation.refundAmount = refundAmount || donation.amount;
    donation.processedBy = adminId;

    await donation.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in processRefund:", e);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
    });
  }
};

// Mark acknowledgment sent
const markAcknowledgmentSent = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        acknowledgmentSent: true,
        acknowledgmentSentAt: new Date()
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Acknowledgment marked as sent",
      data: donation,
    });
  } catch (e) {
    console.error("Error in markAcknowledgmentSent:", e);
    res.status(500).json({
      success: false,
      message: "Failed to mark acknowledgment",
    });
  }
};

// Export donations (CSV data)
const exportDonations = async (req, res) => {
  try {
    const {
      category,
      paymentStatus,
      status,
      startDate,
      endDate
    } = req.query;

    // Build filter
    const filter = {};
    
    if (category) filter.category = category;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    const donations = await Donation.find(filter)
      .populate('alumniId', 'firstName lastName email alumniId batch department')
      .sort({ donationDate: -1 })
      .lean();

    // Format data for export
    const exportData = donations.map(donation => ({
      receiptNumber: donation.receiptNumber || '',
      donationDate: donation.donationDate,
      donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
      donorEmail: donation.isAnonymous ? '' : donation.donorEmail,
      alumniId: donation.alumniId?.alumniId || '',
      batch: donation.alumniId?.batch || '',
      department: donation.alumniId?.department || '',
      category: donation.category,
      amount: donation.amount,
      currency: donation.currency,
      paymentMethod: donation.paymentMethod,
      paymentStatus: donation.paymentStatus,
      status: donation.status,
      transactionId: donation.transactionId,
      panNumber: donation.panNumber || '',
      donationType: donation.donationType,
      isAnonymous: donation.isAnonymous
    }));

    res.status(200).json({
      success: true,
      data: exportData,
    });
  } catch (e) {
    console.error("Error in exportDonations:", e);
    res.status(500).json({
      success: false,
      message: "Failed to export donations",
    });
  }
};

module.exports = {
  getAllDonations,
  getDonationStats,
  getDonationById,
  updateDonation,
  generateReceipt,
  generateTaxCertificate,
  processRefund,
  markAcknowledgmentSent,
  exportDonations,
};