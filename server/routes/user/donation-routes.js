// routes/user/donation-routes.js
const express = require("express");
const router = express.Router();
const {
  getDonationCategoryStats,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createDonation,
  updateDonationStatus,
  getDonationById,
  getMyDonationStats,
  downloadReceipt,
  downloadTaxCertificate,
} = require("../../controllers/user/donation-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

// Get all donation categories with stats
router.get("/category-stats", authMiddleware, getDonationCategoryStats);

// Get my donation statistics
router.get("/my-stats", authMiddleware, getMyDonationStats);

// Create Razorpay order
router.post("/create-order", authMiddleware, createRazorpayOrder);

// Verify Razorpay payment
router.post("/verify-payment", authMiddleware, verifyRazorpayPayment);

// Create a new donation (after payment verification)
router.post("/", authMiddleware, createDonation);

// Update donation payment status (for payment callbacks)
router.patch("/:id/status", authMiddleware, updateDonationStatus);

// Get donation by ID
router.get("/:id", authMiddleware, getDonationById);

// Download receipt
router.get("/:id/receipt", authMiddleware, downloadReceipt);

// Download tax certificate
router.get("/:id/tax-certificate", authMiddleware, downloadTaxCertificate);

module.exports = router;