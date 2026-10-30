const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// ADD STUDENT
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET ALL STUDENTS
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// SEARCH STUDENTS
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        const students = await Student.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { studentId: { $regex: query, $options: "i" } },
                { course: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } }
            ]
        });

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET ONE STUDENT
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE STUDENT
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE STUDENT
router.delete("/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;