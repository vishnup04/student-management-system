const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        address: {
            type: String
        },

        parentName: {
            type: String
        },

        parentPhone: {
            type: String
        },

        course: {
            type: String
        },

        semester: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);