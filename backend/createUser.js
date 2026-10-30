const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Student = require("./models/Student");

const createStudentUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find the student
    const student = await Student.findOne({
      email: "wafa@gmail.com"
    });

    if (!student) {
      console.log("Student not found!");
      return;
    }

    const hashedPassword = await bcrypt.hash("student123", 10);

    const user = new User({
      name: student.name,
      email: student.email,
      password: hashedPassword,
      role: "student",
      studentId: student._id
    });

    await user.save();

    console.log("Student account created successfully!");
    
    await mongoose.disconnect();

  } catch (error) {
    console.log("ERROR:", error);
  }
};

createStudentUser();