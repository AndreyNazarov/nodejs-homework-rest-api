const passport = require("passport");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Users = require("../model/users");
const { Strategy, ExtractJwt } = require("passport-jwt");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error("User not found"), false);
      }
      if (!user.token) {
        return done(null, false);
      }
      if (!user.verify) {
        return done(null, false);
      }
      return done(null, user);
      // or you could create a new account
    } catch (e) {
      return done(e, false);
    }
  })
);
