const express = require("express");
const router = express.Router();

console.log("MARKS ROUTES LOADED");

const Marks = require("../models/Marks");

router.get("/test", (req, res) => {
  res.send("Marks route is working!");
});

// TEST / GET MARKS FOR ONE STUDENT
router.get("/:studentId", async (req, res) => {
  try {
    const marks = await Marks.find({
      studentId: req.params.studentId
    });

    res.json(marks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADD MARKS
router.post("/", async (req, res) => {
  try {
    const marks = new Marks(req.body);

    const savedMarks = await marks.save();

    res.status(201).json(savedMarks);
  } catch (error) {
    console.log("ADD MARKS ERROR:", error);

    res.status(400).json({
      message: error.message
    });
  }
});

// UPDATE MARKS
router.put("/:id", async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(marks);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE MARKS
router.delete("/:id", async (req, res) => {
  try {
    await Marks.findByIdAndDelete(req.params.id);

    res.json({
      message: "Marks deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;