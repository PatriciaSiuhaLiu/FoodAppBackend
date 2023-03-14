const mongoose = require("mongoose");
const Schema = mongoose.Schema;

PaymentSchema = new Schema({
  cardNumber: {
    type: String,
  },
  cardHolder: {
    type: String,
  },
  expireMonth: {
    type: String,
  },
  expireYear: {
    type: String,
  },
  amount: {
    type: Number,
  },
  cvv: {
    type: String,
  },
});

module.exports = mongoose.model("Payments", PaymentSchema);
