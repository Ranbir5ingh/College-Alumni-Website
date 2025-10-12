// routes/admin/donation-routes.js
const express = require("express");
const router = express.Router();
const {
  getAllDonations,
  getDonationStats,
  getDonationById,
  updateDonation,
  generateReceipt,
  generateTaxCertificate,
  processRefund,
  markAcknowledgmentSent,
  exportDonations,
} = require("../../controllers/admin/donation-controller");
const { authMiddleware} = require("../../controllers/auth/auth-controller");

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.role !== "committee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required!",
    });
  }
  next();
};


// Get donation statistics for dashboard
router.get("/stats", authMiddleware, adminMiddleware, getDonationStats);

// Export donations
router.get("/export", authMiddleware, adminMiddleware, exportDonations);

// Get all donations with filters and pagination
router.get("/", authMiddleware, adminMiddleware, getAllDonations);

// Get donation by ID
router.get("/:id", authMiddleware, adminMiddleware, getDonationById);

// Update donation
router.patch("/:id", authMiddleware, adminMiddleware, updateDonation);

// Generate receipt
router.post("/:id/receipt", authMiddleware, adminMiddleware, generateReceipt);

// Generate tax certificate
router.post("/:id/tax-certificate", authMiddleware, adminMiddleware, generateTaxCertificate);

// Process refund
router.post("/:id/refund", authMiddleware, adminMiddleware, processRefund);

// Mark acknowledgment as sent
router.patch("/:id/acknowledgment", markAcknowledgmentSent);

module.exports = router;