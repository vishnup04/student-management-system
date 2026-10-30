const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0
    },

    balance: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Paid", "Partially Paid", "Not Paid"],
      default: "Not Paid"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Fee", feeSchema);