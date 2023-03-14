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
      secure: true, //--> SET TO TRUE ON PRODUCTION //if true it sends https, else sends http,
      //a secue cookie is sent only to https n not http
      // domain: "netlify.app",   //if you do not provide any domain here
      domain: "onrender.com",
      // domain: "online-food-order-frontend.onrender.com",
      //it will pick the domain of the backend ie. my-backend-app.netlify.app
      // if your ui is on different domain like renderit wil be problem
      //you cab provide a main domain like netlify.com and not full url of subdomain
      // path: "/",
      sameSite: "none", //doing it to make it work on netlify not to be done in production
      maxAge: 2.63e9, // approx 1 month
    })

    .status(200)
    .json({
      // message: "You have logged in :D",
      token: jwtToken,
      user: { email, name, roles },
    });

  //https://online-food-order-patricia.netlify.app
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
    res.clearCookie("jwt", {
      domain: "onrender.com",
      // domain: "online-food-order-frontend.onrender.com",
      // setting to parent domain so that any cookie for subdomains of this main domain
      //render,com will be deleted
      path: "/",
    });
    res.send({ message: "User logged out" });
  }
);

module.exports = router;
