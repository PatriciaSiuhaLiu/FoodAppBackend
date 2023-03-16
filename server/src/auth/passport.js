const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

const User = require("../models/user");
const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //  jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.SECRETKEY,
    },
    async function (jwtPayload, done) {
      try {
        const user = await User.findOne({ email: jwtPayload.email });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
