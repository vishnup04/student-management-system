const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const User = require("../models/User");

const router = express.Router();
console.log("AUTH ROUTES LOADED");

router.get("/register-test", (req, res) => {
    res.send("Registration route is working!");
});


// LOGIN
router.post("/login", async (req, res) => {
    console.log("LOGIN REQUEST RECEIVED:", req.body);
  try {
    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        studentId: user.studentId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/register-test", (req, res) => {
  res.send("Registration route is working!");
});

 // REGISTER STUDENT
router.post("/register", async (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    if (!studentId || !email || !password) {
      return res.status(400).json({
        message: "Student ID, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    // Find an existing student record
    const student = await Student.findOne({
      studentId: studentId.trim(),
      email: email.trim().toLowerCase()
    });

    if (!student) {
      return res.status(404).json({
        message: "Student record not found. Check your student ID and email."
      });
    }

    // Check if an account already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { studentId: student._id }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account already exists for this email or student"
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: student.name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "student",
      studentId: student._id
    });

    return res.status(201).json({
      message: "Registration successful. You can now log in."
    });

  } catch (error) {
    console.log("REGISTRATION ERROR:", error);

    return res.status(500).json({
      message: "Registration failed due to a server error"
    });
  }
});


module.exports = router;