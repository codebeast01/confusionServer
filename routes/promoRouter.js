const express= require('express');
const bodyParse= require('body-parser');

const promoRouter =express.Router();
const mongoose= require('mongoose');
const promos= require('../models/promotions');
var authenticate= require('../authenticate');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

promoRouter.use(bodyParse.json());

promoRouter.route('/')
.get((req, res, next) =>{

	promos.find({})
	.then((promos)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(promos);

	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	promos.create(req.body)
	.then((promo)=>{
		console.log("Leader created: ", promo);

		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(promo);

	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	res.statuscode=403;
	res.end('PUT is not supported in /promotions');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	promos.remove({})
	.then((resp)=>{

		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(resp);

	}, (err)=> next(err))
	.catch((err)=> next(err));
});


promoRouter.route('/:promoId')
.get((req, res, next) =>{
	
	promos.findById(req.params.promoId)
	.then((promos)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(promos);

	}, (err)=> next(err))
	.catch((err)=> next(err));	
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	res.statuscode=403;
	res.end('POST is not supported here in /promotions/'+req.params.promoId);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	promos.findByIdAndUpdate(req.params.promoId,{

		$set: req.body

	},{new : true})
	.then((promo)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(promo);

	}, (err)=> next(err))
	.catch((err)=> next(err));	
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{

	promos.findByIdAndRemove(req.params.promoId)
	.then((resp)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(resp);

	}, (err)=> next(err))
	.catch((err)=> next(err));	

});


module.exports= promoRouter;
