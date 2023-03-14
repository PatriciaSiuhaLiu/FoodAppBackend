const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    replyStatus: {
        type: Boolean,
    },
  },
  { collection: "ContactForm" }
);

module.exports = mongoose.model("ContactForm", contactSchema);