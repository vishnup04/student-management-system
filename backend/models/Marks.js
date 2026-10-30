const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    internal1: {
      type: Number,
      min: 0,
      max: 20,
      default: 0
    },

    internal2: {
      type: Number,
      min: 0,
      max: 20,
      default: 0
    },

    assignment: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },

    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Marks", marksSchema);