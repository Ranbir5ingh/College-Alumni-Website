require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes
const authRouter = require("./routes/auth/auth-routes");
const adminAlumniRouter = require("./routes/admin/alumni-routes.js");
const adminEventRouter = require("./routes/admin/event-routes.js");
const adminDonationRouter = require("./routes/admin/donation-routes.js");
const adminNewsRouter = require("./routes/admin/news-routes.js");
const adminMembershipRouter = require("./routes/admin/membership-routes.js");
const adminGalleryRouter = require("./routes/admin/gallery-routes.js");

const userAlumniRouter = require("./routes/user/alumni-routes.js");
const userEventRouter = require("./routes/user/event-routes.js");
const userAttendanceRouter = require("./routes/user/attendance-routes.js");
const userDonationRouter = require("./routes/user/donation-routes.js");
const userNewsRouter = require("./routes/user/news-routes.js");
const userMembershipRouter = require("./routes/user/membership-routes.js");
const userGalleryRouter = require("./routes/user/gallery-routes.js");

// Import cron jobs
const { startMembershipCronJobs } = require("./helpers/membershipCronJob");

// Create database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    
    // Start membership cron jobs after successful database connection
    startMembershipCronJobs();
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Admin Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/alumni", adminAlumniRouter);
app.use("/api/admin/events", adminEventRouter);
app.use("/api/admin/donations", adminDonationRouter);
app.use("/api/admin/news", adminNewsRouter);
app.use("/api/admin/membership", adminMembershipRouter);
app.use("/api/admin/gallery", adminGalleryRouter);

// User Routes
app.use("/api/user/events", userEventRouter);
app.use("/api/user/alumni", userAlumniRouter);
app.use("/api/user/attendance", userAttendanceRouter);
app.use("/api/user/donations", userDonationRouter);
app.use("/api/user/news", userNewsRouter);
app.use("/api/user/membership", userMembershipRouter);
app.use("/api/user/gallery", userGalleryRouter);

// Graceful shutdown - stop cron jobs when server stops
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const { stopMembershipCronJobs } = require("./utils/membershipCronJob");
  stopMembershipCronJobs();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  const { stopMembershipCronJobs } = require("./utils/membershipCronJob");
  stopMembershipCronJobs();
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));