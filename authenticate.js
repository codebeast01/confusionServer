var passport= require('passport');
var strategy= require('passport-local').Strategy;
var user= require('./models/user');

var local=passport.use(new strategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

module.exports=local;