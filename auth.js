/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 10:14 AM
 */
// dependencies for authentication
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , User = require('./domain/user');

passport.use(new LocalStrategy(function (username, password, done) {

    User.authenticate(username, password, function (err, user) {

        if (err) {
            return done(null, false, { message:err });
        }

        if (!user) {
            return done(null, false, {
                message:err
            });
        }
        return done(null, user);
    });
}));

// serialize user on login
passport.serializeUser(function (user, done) {
    done(null, user.email);
});

// deserialize user on logout
passport.deserializeUser(function (email, done) {
    User.get(email, function (err, user) {
        done(err, user);
    });
});

function Auth() {
    "use strict";

    var self = this;

    self.ensureAuthenticated = function (req, res, next) {

        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };

}

module.exports = new Auth();
