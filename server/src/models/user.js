const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User schema containing details of the user.
UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    roles: {
      type: [Number],
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", UserSchema);
