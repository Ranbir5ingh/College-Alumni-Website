// utils/membershipCronJob.js
const cron = require("node-cron");
const MembershipPurchase = require("../models/MembershipPurchase");
const User = require("../models/User");

// Run daily at midnight to update expired memberships
const updateExpiredMemberships = cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running membership expiry check...");

    // Find all expired memberships that are still marked as active
    const expiredPurchases = await MembershipPurchase.find({
      status: "active",
      expiryDate: { $lt: new Date() },
      planType: "monthly", // Only monthly memberships expire
    });

    if (expiredPurchases.length === 0) {
      console.log("No expired memberships found");
      return;
    }

    // Update membership purchase status
    await MembershipPurchase.updateMany(
      {
        status: "active",
        expiryDate: { $lt: new Date() },
        planType: "monthly",
      },
      {
        $set: { status: "expired" },
      }
    );

    // Update user records
    for (const purchase of expiredPurchases) {
      await User.updateOne(
        {
          _id: purchase.alumniId,
          "currentMembership.membershipId": purchase._id,
        },
        {
          $set: { "currentMembership.status": "expired" },
        }
      );
    }

    console.log(`Updated ${expiredPurchases.length} expired memberships`);
  } catch (error) {
    console.error("Error in membership expiry cron job:", error);
  }
});

// Send renewal reminders 7 days before expiry
const sendRenewalReminders = cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Checking for memberships expiring soon...");

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringMemberships = await MembershipPurchase.find({
      status: "active",
      planType: "monthly",
      expiryDate: {
        $gte: new Date(),
        $lte: sevenDaysFromNow,
      },
    }).populate("alumniId", "firstName lastName email");

    if (expiringMemberships.length === 0) {
      console.log("No memberships expiring in the next 7 days");
      return;
    }

    // TODO: Send email reminders to users
    // You can integrate your email service here
    console.log(`Found ${expiringMemberships.length} memberships expiring soon`);
    
    // Example email integration (uncomment when ready):
    // for (const membership of expiringMemberships) {
    //   await sendEmail({
    //     to: membership.alumniId.email,
    //     subject: "Your Membership is Expiring Soon",
    //     template: "membership-renewal-reminder",
    //     data: {
    //       name: membership.alumniId.firstName,
    //       expiryDate: membership.expiryDate,
    //     },
    //   });
    // }

  } catch (error) {
    console.error("Error in renewal reminder cron job:", error);
  }
});

// Start all cron jobs
const startMembershipCronJobs = () => {
  updateExpiredMemberships.start();
  sendRenewalReminders.start();
  console.log("Membership cron jobs started");
};

// Stop all cron jobs
const stopMembershipCronJobs = () => {
  updateExpiredMemberships.stop();
  sendRenewalReminders.stop();
  console.log("Membership cron jobs stopped");
};

module.exports = {
  startMembershipCronJobs,
  stopMembershipCronJobs,
  updateExpiredMemberships,
  sendRenewalReminders,
};