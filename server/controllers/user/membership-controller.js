// controllers/user/membership-controller.js
const MembershipPurchase = require("../../models/MembershipPurchase");
const User = require("../../models/User");
const mongoose = require("mongoose");
const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");

// Membership pricing
const MEMBERSHIP_PRICING = {
  monthly: 500,
  lifetime: 2000,
};

// Get membership details and benefits
const getMembershipInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        plans: [
          {
            type: "monthly",
            name: "Monthly Membership",
            price: MEMBERSHIP_PRICING.monthly,
            currency: "INR",
            duration: "1 month",
            description: "Pay monthly and enjoy all membership benefits",
          },
          {
            type: "lifetime",
            name: "Lifetime Membership",
            price: MEMBERSHIP_PRICING.lifetime,
            currency: "INR",
            duration: "Lifetime",
            description: "One-time payment for lifetime access",
            badge: "Best Value",
          },
        ],
        benefits: [
          {
            title: "Guest House Facility",
            description: "Avail college guest house at nominal rates",
            icon: "home",
          },
          {
            title: "Sports Facilities",
            description: "Access to college grounds, swimming pool, gym with concession",
            icon: "activity",
          },
          {
            title: "Infrastructure Access",
            description: "Use college infrastructure for educational activities at nominal rates",
            icon: "building",
          },
          {
            title: "Transportation",
            description: "College bus service with nominal charges for local tours",
            icon: "bus",
          },
          {
            title: "Promotion Support",
            description: "Advertise your work on college social media platforms",
            icon: "megaphone",
          },
          {
            title: "Recognition & Awards",
            description: "Get rewarded for contributions to college progress",
            icon: "award",
          },
          {
            title: "Distinguished Alumni Awards",
            description: "Recognition for welfare work in society at alumni meets",
            icon: "trophy",
          },
          {
            title: "Networking Events",
            description: "Exclusive access to alumni networking events and activities",
            icon: "users",
          },
        ],
      },
    });
  } catch (e) {
    console.error("Error in getMembershipInfo:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership information",
    });
  }
};

// Get my membership status
const getMyMembershipStatus = async (req, res) => {
  try {
    const { id: alumniId } = req.user;

    // Get user with membership details
    const user = await User.findById(alumniId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get active membership
    const activeMembership = await MembershipPurchase.findActiveMembership(alumniId);

    // Get all membership history
    const membershipHistory = await MembershipPurchase.find({
      alumniId,
      paymentStatus: "completed",
    })
      .sort({ purchaseDate: -1 })
      .limit(10)
      .lean();

    // Calculate statistics
    const stats = await MembershipPurchase.aggregate([
      {
        $match: {
          alumniId: new mongoose.Types.ObjectId(alumniId),
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

    res.status(200).json({
      success: true,
      data: {
        currentMembership: user.currentMembership,
        activeMembership: activeMembership,
        hasActiveMembership: user.hasActiveMembership,
        membershipHistory,
        stats,
      },
    });
  } catch (e) {
    console.error("Error in getMyMembershipStatus:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch membership status",
    });
  }
};

// Create Razorpay order for membership
const createMembershipOrder = async (req, res) => {
  try {
    const { planType } = req.body;

    if (!planType || !["monthly", "lifetime"].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: "Valid plan type is required (monthly or lifetime)",
      });
    }

    const amount = MEMBERSHIP_PRICING[planType];

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `membership_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        planType,
        planAmount: amount,
      },
    });
  } catch (e) {
    console.error("Error in createMembershipOrder:", e);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// Purchase membership after successful payment
const purchaseMembership = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: alumniId } = req.user;
    const {
      planType,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = "card",
    } = req.body;

    // Validate required fields
    if (!planType || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Plan type and payment details are required",
      });
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Get user
    const user = await User.findById(alumniId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already has active membership
    const existingActiveMembership = await MembershipPurchase.findActiveMembership(alumniId);
    
    // Get amount
    const amount = MEMBERSHIP_PRICING[planType];

    // Calculate dates
    const startDate = new Date();
    let expiryDate = new Date();

    if (planType === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planType === "lifetime") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 99);
    }

    // If user has active membership, extend it
    if (existingActiveMembership && planType === "monthly") {
      // For monthly plans, extend from current expiry date
      startDate.setTime(existingActiveMembership.expiryDate.getTime());
      expiryDate = new Date(startDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (existingActiveMembership && planType === "lifetime") {
      // If upgrading to lifetime, mark current as expired
      existingActiveMembership.status = "cancelled";
      await existingActiveMembership.save({ session });
    }

    // Create membership purchase record
    const membershipPurchase = await MembershipPurchase.create(
      [
        {
          alumniId,
          planType,
          amount,
          currency: "INR",
          purchaseDate: new Date(),
          startDate,
          expiryDate,
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentMethod,
          paymentStatus: "completed",
          status: "active",
        },
      ],
      { session }
    );

    // Update user's current membership
    user.currentMembership = {
      membershipId: membershipPurchase[0]._id,
      startDate,
      expiryDate,
      status: "active",
      transactionId: razorpay_payment_id,
    };

    // Add to membership history
    user.membershipHistory.push(membershipPurchase[0]._id);

    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Membership purchased successfully",
      data: {
        membership: membershipPurchase[0],
        expiryDate,
      },
    });
  } catch (e) {
    await session.abortTransaction();
    console.error("Error in purchaseMembership:", e);

    // Handle duplicate transaction ID
    if (e.code === 11000 && e.keyPattern?.transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to purchase membership",
    });
  } finally {
    session.endSession();
  }
};

// Cancel membership (for monthly recurring)
const cancelMembership = async (req, res) => {
  try {
    const { id: alumniId } = req.user;

    // Get active membership
    const activeMembership = await MembershipPurchase.findActiveMembership(alumniId);

    if (!activeMembership) {
      return res.status(404).json({
        success: false,
        message: "No active membership found",
      });
    }

    if (activeMembership.planType === "lifetime") {
      return res.status(400).json({
        success: false,
        message: "Lifetime membership cannot be cancelled",
      });
    }

    // Disable auto-renewal
    activeMembership.autoRenewal = false;
    activeMembership.nextRenewalDate = null;
    await activeMembership.save();

    res.status(200).json({
      success: true,
      message: "Membership auto-renewal cancelled. Your membership will remain active until expiry date.",
      data: activeMembership,
    });
  } catch (e) {
    console.error("Error in cancelMembership:", e);
    res.status(500).json({
      success: false,
      message: "Failed to cancel membership",
    });
  }
};

// Download membership receipt
const downloadMembershipReceipt = async (req, res) => {
  try {
    const { id: purchaseId } = req.params;
    const { id: alumniId } = req.user;

    const purchase = await MembershipPurchase.findOne({
      _id: purchaseId,
      alumniId,
      paymentStatus: "completed",
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Membership purchase not found",
      });
    }

    if (!purchase.receiptUrl) {
      return res.status(404).json({
        success: false,
        message: "Receipt not yet generated",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        receiptUrl: purchase.receiptUrl,
        receiptNumber: purchase.receiptNumber,
      },
    });
  } catch (e) {
    console.error("Error in downloadMembershipReceipt:", e);
    res.status(500).json({
      success: false,
      message: "Failed to download receipt",
    });
  }
};

module.exports = {
  getMembershipInfo,
  getMyMembershipStatus,
  createMembershipOrder,
  purchaseMembership,
  cancelMembership,
  downloadMembershipReceipt,
};