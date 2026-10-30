const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Student routes
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/students", studentRoutes);

// Attendance routes
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use("/api/attendance", attendanceRoutes);

// Marks routes
const marksRoutes = require("./routes/marksRoutes");

app.use("/api/marks", marksRoutes);

// Fee routes
const feeRoutes = require("./routes/feeRoutes");

app.use("/api/fees", feeRoutes);

app.get("/fee-test", (req, res) => {
    res.send("Fee test from server works!");
});

// Authentication routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Home route
app.get("/", (req, res) => {
    res.send("Student Management System Backend Running");
});

// Test route
app.get("/test-marks", (req, res) => {
    res.send("Marks test works!");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});