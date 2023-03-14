const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDetails = await User.findOne({ email }).catch((err) => {
    throw new Error(err);
  });

  if (!userDetails) {
    return res.status(400).json({ message: "Email or Pasword do not match!" });
  }

  if (userDetails.password !== password) {
    return res
      .status(400)
      .json({ message: "Email or Password does not match" });
  }

  const { name, roles } = userDetails;
  const jwtToken = jwt.sign(
    { id: userDetails.id, email: userDetails.email },
    // process.env.JWT_SECRET
    process.env.SECRETKEY
  );

  res
    .cookie("jwt", jwtToken, {
      httpOnly: true, //true stops browser to access cookie
      secure: false, //--> SET TO TRUE ON PRODUCTION
    })
    .status(200)
    .json({
      // message: "You have logged in :D",
      token: jwtToken,
      user: { email, name, roles },
    });
  //   res
  //     .cookie("token", jwtToken)
  //     .status(200)
  //     .json({ message: "Welcome", token: jwtTok  en });
});

const passport = require("passport");
router.get(
  "/loggedInUser",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var user = req.user;
    console.log("user ==>> ");
    console.log(user);
    res.status(200).send({ userData: user });
    //   db.find({ email: Email }, function (err, results) {
    //     if (err) {
    //       res.send(err);
    //     } else if (results.length == 0) {
    //       res.status(404).send("Email id entered is incorrect!");
    //     } else {
    //       console.log("User Exists!");
    //       res.status(200).json({ results });
    //     }
    //   });
  }
);
router.get(
  "/logout",

  (req, res) => {
    // req.logout();
    res.clearCookie("jwt", { domain: "localhost", path: "/" });
    res.send({ message: "User logged out" });
  }
);

module.exports = router;
