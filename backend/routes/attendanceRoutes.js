const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");

// ADD ATTENDANCE
router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// GET ATTENDANCE FOR ONE STUDENT
router.get("/:studentId", async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentId: req.params.studentId
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE ATTENDANCE
router.put("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(attendance);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE ATTENDANCE
router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Attendance deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;