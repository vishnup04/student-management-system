const express = require("express");
const router = express.Router();
console.log("FEE ROUTES LOADED");

const Fee = require("../models/Fee");

router.get("/test", (req, res) => {
  res.send("Fee route is working!");
});

// ADD FEE
router.post("/", async (req, res) => {
  try {
    console.log("ADD FEE REQUEST:", req.body);

    const { studentId, totalFee, amountPaid } = req.body;

    const balance = totalFee - amountPaid;

    let status = "Not Paid";

    if (amountPaid >= totalFee) {
      status = "Paid";
    } else if (amountPaid > 0) {
      status = "Partially Paid";
    }

    const fee = new Fee({
      studentId,
      totalFee,
      amountPaid,
      balance,
      status
    });

    const savedFee = await fee.save();

    console.log("FEE SAVED:", savedFee);

    res.status(201).json(savedFee);

  } catch (error) {

    console.log("ADD FEE ERROR:", error);

    res.status(400).json({
      message: error.message
    });
  }
});

// GET FEES FOR ONE STUDENT
router.get("/:studentId", async (req, res) => {
  try {
    const fees = await Fee.find({
      studentId: req.params.studentId
    });

    res.json(fees);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE FEE
router.put("/:id", async (req, res) => {
  try {
    const { totalFee, amountPaid } = req.body;

    const balance = totalFee - amountPaid;

    let status = "Not Paid";

    if (amountPaid >= totalFee) {
      status = "Paid";
    } else if (amountPaid > 0) {
      status = "Partially Paid";
    }

    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      {
        totalFee,
        amountPaid,
        balance,
        status
      },
      { new: true }
    );

    res.json(fee);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE FEE
router.delete("/:id", async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);

    res.json({
      message: "Fee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;