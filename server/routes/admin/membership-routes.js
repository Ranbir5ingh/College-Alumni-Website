// routes/admin/membership-routes.js
const express = require("express");
const {
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
} = require("../../controllers/admin/membership-controller");

const router = express.Router();

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


// Get all membership purchases with filters and pagination
router.get("/", authMiddleware, adminMiddleware, getAllMembershipPurchases);

// Get membership statistics
router.get("/statistics", authMiddleware, adminMiddleware, getMembershipStatistics);

// Get expiring memberships
router.get("/expiring", authMiddleware, adminMiddleware, getExpiringMemberships);

// Get revenue report
router.get("/revenue-report", authMiddleware, adminMiddleware, getRevenueReport);

// Get active members list
router.get("/active-members", authMiddleware, adminMiddleware, getActiveMembers);

// Bulk update expired memberships
router.post("/update-expired", authMiddleware, adminMiddleware, updateExpiredMemberships);

// Get specific membership purchase by ID
router.get("/:id", authMiddleware, adminMiddleware, getMembershipPurchaseById);

// Get user's membership history
router.get("/user/:userId", authMiddleware, adminMiddleware, getUserMembershipHistory);

// Update membership status
router.put("/:id/status", authMiddleware, adminMiddleware, updateMembershipStatus);

// Process refund
router.post("/:id/refund", authMiddleware, adminMiddleware, processMembershipRefund);

module.exports = router;