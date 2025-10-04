const express = require("express");

const {
  registerUser,
  completeProfile,
  requestVerification,
  loginUser,
  logoutUser,
  authMiddleware,
  getUserProfile,
  updateUserProfile,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Password reset routes (public - no auth required)
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const User = require("../../models/User");
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("currentMembership.membershipId", "name tier");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error checking authentication",
    });
  }
});

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile/:id", authMiddleware, updateUserProfile);

// Password reset request (protected - requires auth)
router.post("/request-password-reset", authMiddleware, requestPasswordReset);

// Profile completion and verification
router.put("/complete-profile", authMiddleware, completeProfile);
router.post("/request-verification", authMiddleware, requestVerification);

module.exports = router;