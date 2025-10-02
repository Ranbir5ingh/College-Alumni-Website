const express = require("express");

const {
  registerAlumni,
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
    const user = await Alumni.findById(req.user.id).select("-password");
    
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
        isVerified: user.isVerified,
        membershipStatus: user.membershipStatus,
        alumniId: user.alumniId,
        batch: user.batch,
        department: user.department,
        degree: user.degree,
        graduationYear: user.graduationYear,
        phone: user.phone,
        studentId: user.studentId,
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



module.exports = router;