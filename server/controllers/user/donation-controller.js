// controllers/user/donation-controller.js
const Donation = require("../../models/Donation");
const User = require("../../models/User");
const mongoose = require("mongoose");
const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");

// Get donation category statistics
const getDonationCategoryStats = async (req, res) => {
  try {
    // Get total raised per category
    const categoryStats = await Donation.aggregate([
      {
        $match: { 
          paymentStatus: 'completed' 
        }
      },
      {
        $group: {
          _id: '$category',
          totalRaised: { $sum: '$amount' },
          donorCount: { $sum: 1 }
        }
      }
    ]);

    // Format as object for easy lookup
    const statsMap = {};
    categoryStats.forEach(stat => {
      statsMap[stat._id] = {
        totalRaised: stat.totalRaised,
        donorCount: stat.donorCount
      };
    });

    res.status(200).json({
      success: true,
      data: statsMap,
    });
  } catch (e) {
    console.error("Error in getDonationCategoryStats:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation statistics",
    });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (e) {
    console.error("Error in createRazorpayOrder:", e);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Verify signature
    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (e) {
    console.error("Error in verifyRazorpayPayment:", e);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// Create a donation after successful payment
const createDonation = async (req, res) => {
  try {
    const { id: alumniId } = req.user;
    const {
      category,
      amount,
      currency = "INR",
      paymentMethod = "card",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationType = "one_time",
      recurringDetails,
      message,
      dedicatedTo,
      isAnonymous = false,
      panNumber,
    } = req.body;

    // Validate required fields
    if (!category || !amount || !razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Category, amount, and payment details are required",
      });
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Get user details
    const user = await User.findById(alumniId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare donation data
    const donationData = {
      alumniId,
      category,
      amount,
      currency,
      paymentMethod,
      transactionId: razorpay_payment_id,
      donationType,
      message,
      dedicatedTo,
      isAnonymous,
      panNumber,
      paymentStatus: "completed", // Payment already verified
      status: "completed",
    };

    // Set donor information (unless anonymous)
    if (!isAnonymous) {
      donationData.donorName = `${user.firstName} ${user.lastName}`;
      donationData.donorEmail = user.email;
      donationData.donorPhone = user.phone;
    }

    // Add recurring details if applicable
    if (donationType === "recurring" && recurringDetails) {
      donationData.recurringDetails = {
        ...recurringDetails,
        isActive: true,
      };
    }

    // Create donation
    const donation = await Donation.create(donationData);

    // Update user's donations array
    await User.findByIdAndUpdate(alumniId, {
      $push: { donations: donation._id }
    });

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in createDonation:", e);
    
    // Handle duplicate transaction ID
    if (e.code === 11000 && e.keyPattern?.transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create donation",
    });
  }
};

// Update donation payment status
const updateDonationStatus = async (req, res) => {
  try {
    const { id: donationId } = req.params;
    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Update payment status
    donation.paymentStatus = paymentStatus;
    
    // Update overall status based on payment status
    if (paymentStatus === 'completed') {
      donation.status = 'completed';
    } else if (paymentStatus === 'failed') {
      donation.status = 'cancelled';
    } else if (paymentStatus === 'refunded') {
      donation.status = 'refunded';
    }

    await donation.save();

    res.status(200).json({
      success: true,
      message: "Donation status updated successfully",
      data: donation,
    });
  } catch (e) {
    console.error("Error in updateDonationStatus:", e);
    res.status(500).json({
      success: false,
      message: "Failed to update donation status",
    });
  }
};

// Get donation by ID
const getDonationById = async (req, res) => {
  try {
    const { id: donationId } = req.params;
    const { id: alumniId } = req.user;

    const donation = await Donation.findOne({
      _id: donationId,
      alumniId: alumniId
    }).lean();

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

// Get my donation statistics
const getMyDonationStats = async (req, res) => {
  try {
    const { id: alumniId } = req.user;

    // Total donations
    const totalStats = await Donation.aggregate([
      {
        $match: { 
          alumniId: new mongoose.Types.ObjectId(alumniId),
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    // Category-wise breakdown
    const categoryBreakdown = await Donation.aggregate([
      {
        $match: { 
          alumniId: new mongoose.Types.ObjectId(alumniId),
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Year-wise breakdown
    const yearlyBreakdown = await Donation.aggregate([
      {
        $match: { 
          alumniId: new mongoose.Types.ObjectId(alumniId),
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: { $year: '$donationDate' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Recent donations
    const recentDonations = await Donation.find({
      alumniId: alumniId,
      paymentStatus: 'completed'
    })
    .sort({ donationDate: -1 })
    .limit(5)
    .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAmount: totalStats.length > 0 ? totalStats[0].totalAmount : 0,
          totalDonations: totalStats.length > 0 ? totalStats[0].totalCount : 0,
          averageDonation: totalStats.length > 0 && totalStats[0].totalCount > 0 
            ? Math.round(totalStats[0].totalAmount / totalStats[0].totalCount) 
            : 0
        },
        categoryBreakdown,
        yearlyBreakdown,
        recentDonations
      },
    });
  } catch (e) {
    console.error("Error in getMyDonationStats:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation statistics",
    });
  }
};

// Download donation receipt
const downloadReceipt = async (req, res) => {
  try {
    const { id: donationId } = req.params;
    const { id: alumniId } = req.user;

    const donation = await Donation.findOne({
      _id: donationId,
      alumniId: alumniId,
      paymentStatus: 'completed'
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found or payment not completed",
      });
    }

    if (!donation.receiptUrl) {
      return res.status(404).json({
        success: false,
        message: "Receipt not yet generated",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        receiptUrl: donation.receiptUrl,
        receiptNumber: donation.receiptNumber
      },
    });
  } catch (e) {
    console.error("Error in downloadReceipt:", e);
    res.status(500).json({
      success: false,
      message: "Failed to download receipt",
    });
  }
};

// Download tax certificate
const downloadTaxCertificate = async (req, res) => {
  try {
    const { id: donationId } = req.params;
    const { id: alumniId } = req.user;

    const donation = await Donation.findOne({
      _id: donationId,
      alumniId: alumniId,
      paymentStatus: 'completed'
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found or payment not completed",
      });
    }

    if (!donation.taxCertificateUrl) {
      return res.status(404).json({
        success: false,
        message: "Tax certificate not yet generated",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        certificateUrl: donation.taxCertificateUrl,
        receiptNumber: donation.receiptNumber
      },
    });
  } catch (e) {
    console.error("Error in downloadTaxCertificate:", e);
    res.status(500).json({
      success: false,
      message: "Failed to download tax certificate",
    });
  }
};

module.exports = {
  getDonationCategoryStats,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createDonation,
  updateDonationStatus,
  getDonationById,
  getMyDonationStats,
  downloadReceipt,
  downloadTaxCertificate,
};