const express = require("express");
const passport = require("passport");
const Payment = require("../models/payment");

const router = express.Router();

router.get(
  "/payment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("You have a total of: 2400$");
  }
);
router.get(
  "/payment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    console.log("payment------>", payment);
    res.status(200).send({ result: payment });
  }
);
router.post(
  "/payment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { cardNumber, cardHolder, expireMonth, expireYear, amount, cvv } =
      req.body;

    var newPayment = new Payment({
      cardNumber,
      cardHolder,
      expireMonth,
      expireYear,
      amount,
      cvv,
    });
    const result = await newPayment.save();
    console.log(result);
    res
      .status(201)
      .send({ paymentId: result._id, message: "Payment created successfully" });
  }
);
router.put(
  "/payment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const paymentId = req.body.paymentId;
    const amount = req.body.amount;
    const userEmail = req.body.userEmail;
    const updateResult = await Payment.findByIdAndUpdate(req.params.id, {
      paymentId,
      amount,
      userEmail,
    });
    res.status(201).send("Payment updated successfully");
    // res.status(201).send({ result: updateResult });
  }
);
router.delete(
  "/payment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Payment.deleteOne({ _id: req.params.id });
    res.send("Payment Deleted");
  }
);

module.exports = router;
