var passport= require('passport');
var strategy= require('passport-local').Strategy;
var user= require('./models/user');
var jwtstrategy= require('passport-jwt').Strategy;
var extract= require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken');

var confg= require('./config');

exports.local=passport.use(new strategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

exports.getToken= (User)=>{
	return jwt.sign(User, confg.secretKey, {expiresIn: 3600});
};

var opt={};
opt.jwtFromRequest= extract.fromAuthHeaderAsBearerToken();
opt.secretOrKey= confg.secretKey;

exports.jwtPassport= passport.use(new jwtstrategy(opt, (jwt_payload, done)=>{
	console.log("Jwt payload: ", jwt_payload);
	user.findOne({_id: jwt_payload._id}, (err, User)=>{
		if(err)
			return done(err, false);
		else if(User)
			return done(null, User);
		else
			return done(null, false);
	});
}));

exports.verifyUser= passport.authenticate('jwt', {session: false});