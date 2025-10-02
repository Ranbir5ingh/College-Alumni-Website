const express = require("express");

const {
  registerAlumni,
  completeProfile,
  requestVerification,
  loginAlumni,
  logoutAlumni,
  authMiddleware,
  getAlumniProfile,
  updateAlumniProfile,
  changePassword,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes
router.post("/register", registerAlumni);
router.post("/login", loginAlumni);
router.post("/logout", logoutAlumni);

// Protected routes
router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    // Fetch full user data
    const Alumni = require("../../models/Alumni");
    const user = await Alumni.findById(req.user.id)
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
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified,
        isProfileComplete: user.isProfileComplete,
        alumniId: user.alumniId,
        batch: user.batch,
        department: user.department,
        degree: user.degree,
        yearOfPassing: user.yearOfPassing,
        yearOfJoining: user.yearOfJoining,
        phone: user.phone,
        enrollmentNumber: user.enrollmentNumber,
        canPostJobs: user.canPostJobs,
        canMentor: user.canMentor,
        currentMembership: user.currentMembership,
        hasActiveMembership: user.hasActiveMembership,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error checking authentication",
    });
  }
});

router.get("/profile", authMiddleware, getAlumniProfile);
router.put("/profile/:id", authMiddleware, updateAlumniProfile);
router.put("/change-password", authMiddleware, changePassword);

// New routes for profile completion and verification
router.put("/complete-profile", authMiddleware, completeProfile);
router.post("/request-verification", authMiddleware, requestVerification);

module.exports = router;