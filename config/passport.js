const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

// model
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email })
        if (!user) { 
          return done(null, false, {message: 'That email is not registered'}); 
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return done(null, false, {message: 'Password Incorrect'});
        }
        return done(null, user, {message: 'You are logged in'});
      } catch(err) {
        return done(err)
      }
      })
  )

  // runs when user logs in to create session cookie
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// runs on every request after login to verify user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
  
});
  
}

  