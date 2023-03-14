const mongoose = require("mongoose");

//module.exports = function initializeDB() {

const initializeDB = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.CONNECTION_STRING + process.env.DB_NAME)
    .then(() => {
      console.log("connected--->");
    })
    .catch((error) => {
      console.error(error.message);
      console.log(`Final project failed at http://localhost:${process.env.PORT}`);
      process.exit();
    });
};

module.exports = initializeDB();
