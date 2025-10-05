require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes
const authRouter = require("./routes/auth/auth-routes");
const adminAlumniRouter = require("./routes/admin/alumni-routes.js");
const adminEventRouter = require("./routes/admin/event-routes.js");
const userAlumniRouter = require("./routes/user/alumni-routes.js");
const userEventRouter = require("./routes/user/event-routes.js");
const userAttendanceRouter = require("./routes/user/attendance-routes.js");

// Create database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
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

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/alumni", adminAlumniRouter);
app.use("/api/admin/events", adminEventRouter);
app.use("/api/user/events", userEventRouter);
app.use("/api/user/alumni", userAlumniRouter);
app.use("/api/user/attendance", userAttendanceRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));