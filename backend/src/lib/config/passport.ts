import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

import {prisma} from "../prisma.js"



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Client secret
      callbackURL: "https://localhost:3000/auth/google/callback",
    },
    async function (token, tokenSecret, profile, done) {
      try {

        await prisma.user.findUnique({
            where:{
                
            }
        })
        return done(null, traveler);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* How to store the user information in the session */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* Exporting Passport Configuration */
module.exports = passport;
