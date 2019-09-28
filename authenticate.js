var passport= require('passport');
var strategy= require('passport-local').Strategy;
var user= require('./models/user');
var jwtstrategy= require('passport-jwt').Strategy;
var extract= require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken');
var facebookTokenStrategy= require('passport-facebook-token');

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

exports.verifyAdmin= (req, res, next)=>{
	if(req.user.admin)
		return next();
	else
	{
		err= new Error("You are not authorized to perform this operation..!!");
		err.status=403;
		return next(err);
	}
};


exports.facebookPassport= passport.use(new facebookTokenStrategy({
		clientID: confg.facebook.clientId,
		clientSecret: confg.facebook.clientSecret
	}, (accessToken, refreshToken, profile, done)=>{
		user.findOne({facebookId: profile.id}, (err, User)=>{
			if(err)
				return done(err, false);
			if(!err && User!==null)
				return done(null, User);
			else{

				User= new user({username: profile.displayName});
				User.facebookId= profile.id;
				User.firstname= profile.name.getName;
				User.lastname= profile.name.familyName;
				User.save((err, User)=>{
					if(err)
						return done(err, false);
					else
						return done(null, User);
				});
			}
		});

	}
));
