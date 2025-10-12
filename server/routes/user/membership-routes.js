// routes/user/membership-routes.js
const express = require("express");
const {
  getMembershipInfo,
  getMyMembershipStatus,
  createMembershipOrder,
  purchaseMembership,
  cancelMembership,
  downloadMembershipReceipt,
} = require("../../controllers/user/membership-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const router = express.Router();

// Get membership information and benefits
router.get("/info", authMiddleware, getMembershipInfo);

// Get my membership status and history
router.get("/my-status", authMiddleware, getMyMembershipStatus);

// Create Razorpay order for membership purchase
router.post("/create-order", authMiddleware, createMembershipOrder);

// Purchase membership after payment
router.post("/purchase", authMiddleware, purchaseMembership);

// Cancel membership (disable auto-renewal)
router.post("/cancel", authMiddleware, cancelMembership);

// Download membership receipt
router.get("/receipt/:id", authMiddleware, downloadMembershipReceipt);

module.exports = router;