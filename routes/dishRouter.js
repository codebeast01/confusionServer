const express= require('express');
const bodyParse= require('body-parser');

const dishRouter =express.Router();

const mongoose= require('mongoose');
const Dishes= require('../models/dishes');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

dishRouter.use(bodyParse.json());

dishRouter.route('/')
.get((req, res, next) =>{

	Dishes.find({})
	.then((dishes)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(dishes);

	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.post((req, res, next) =>{

	Dishes.create(req.body)
	.then((dish)=>{
		console.log("Dish created: ", dish);

		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(dish);

	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.put((req, res, next) =>{

	res.statuscode=403;
	res.end('PUT is not supported in /dishes');
})

.delete((req, res, next) =>{

	Dishes.remove({})
	.then((resp)=>{

		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(resp);

	}, (err)=> next(err))
	.catch((err)=> next(err));
});


dishRouter.route('/:dishId')
.get((req, res, next) =>{
	
	Dishes.findById(req.params.dishId)
	.then((dishes)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(dishes);

	}, (err)=> next(err))
	.catch((err)=> next(err));	
})
.post((req, res, next) =>{

	res.statuscode=403;
	res.end('POST is not supported here in /dishes/'+req.params.dishId);
})

.put( (req, res, next) =>{

	Dishes.findByIdAndUpdate(req.params.dishId,{

		$set: req.body

	},{new : true})
	.then((dish)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(dish);

	}, (err)=> next(err))
	.catch((err)=> next(err));	
})

.delete((req, res, next) =>{

	Dishes.findByIdAndRemove(req.params.dishId)
	.then((resp)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(resp);

	}, (err)=> next(err))
	.catch((err)=> next(err));	

});



module.exports= dishRouter;
