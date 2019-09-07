var express = require('express');
var router = express.Router();
const bodyParser= require('body-parser');

const users= require('../models/user');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next)=>{

	users.findOne({username: req.body.username})
	.then((user)=>{
		if(user!=null)
		{
			var err= new Error("User "+ req.body.username+ " already exists!");
			err.status= 403;
			next(err);
		}
		else{

			return users.create({
				username: req.body.username,

				password: req.body.password
			});
		}

	}, (err)=> next(err))
	.then((user)=>{

		res.statusCode=200;
		res.setHeader('content-Type', 'application/json');
		res.json({status:"Registration successful", user:user});

	}, (err)=> next(err))
	.catch((err)=> next(err));

});

router.post('/login', (req, res, next)=>{

	if(!req.session.user){
		var authHeader= req.headers.authorization;

		if(!authHeader){

			var err= new Error("You seem to be unauthorized");

			res.setHeader('WWW-authenticate', 'basic');
			err.status= 401;
			return next(err);
		}

		const auth= new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		var username= auth[0];
		var password= auth[1];

		users.findOne({username: req.body.username})
		.then((user)=>{

			if(user===null){
				var err= new Error("User "+username+" does not exist!");
				err.status= 401;
				return next(err);
			}
			else if(user.password!==password){
				var err= new Error("You seem to have an incorrect password");
				err.status= 403;
				return next(err);
			}
			else if(user.username===username && user.password===password){
				req.session.user= 'authenticated';
				res.statusCode=200;
				res.setHeader('content-Type', 'text/plain');
				res.end('You are now authenticated!\n Welcome to the Home page');
			}
		})
		.catch((err)=>{ next(err);})

	}
	else{

			res.statusCode=200;
			res.setHeader('content-Type', 'text/plain');
			res.end('You are already logged in!!');
	}

});

router.get('/logout', (req, res)=>{

	if(req.session)
	{
		req.session.destroy();
		res.clearCookie();
		res.redirect('/');
	}
	else{
		var err= new Error("You are not logged in!!");
		err.status= 403;
		return next(err);
	}
});

module.exports = router;
