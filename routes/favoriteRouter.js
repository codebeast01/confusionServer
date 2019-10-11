const express= require('express');
const bodyParse= require('body-parser');

const favoriteRouter =express.Router();

const mongoose= require('mongoose');
const favorites= require('../models/favorites');
var authenticate= require('../authenticate');
var cors= require('./cors');

favoriteRouter.use(bodyParse.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=>{res.statusCode(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
	favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes._id')
	.then((fav)=>{
		
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(fav);

	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favorites.findOne({user: req.user._id})
	.then((fav)=>{
		if(fav)		
		{
			for(var i=0; i<req.body.length; i++)
			{
				if (fav.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
			}
			fav.save()
			.then((fav)=>{
				favorites.findById(fav._id)
				.populate('user')
				.then((fav)=>{
					res.statuscode=200;
					res.setHeader('content-Type', 'application/json');
					res.json(fav);
				}, (err)=>next(err));

			}, (err)=> next(err))
			.catch((err)=> next(err));
		}
		else{
			fav.create({"user": req.user._id, "dishes": req.body})
			.then((fav)=>{
				res.statusCode=200;
				res.setHeader('content-Type', 'application/json');
				res.json(fav);
			}, (err)=> next(err))
			.catch((err)=> next(err));
		}
	}, (err)=> next(err))
	.catch((err)=> next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Dishes.findByIdAndRemove({"user": req.user._id})
	.then((resp)=>{
		res.statuscode=200;
		res.setHeader('content-Type', 'application/json');
		res.json(resp);

	}, (err)=> next(err))
	.catch((err)=> next(err));	
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{res.statusCode(200);})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favorites.findById({"user": req.user._id})
	.then((fav)=>{
		if(fav){
			if(fav.dishes.indexOf(req.params.dishId)===-1){
				fav.dishes.push(req.params.dishId)
				fav.save()
				.then((fav)=>{
					favorites.findById(fav._id)
					.populate('user')
					.then((fav)=>{
						res.statuscode=200;
						res.setHeader('content-Type', 'application/json');
						res.json(fav);
					});

				}, (err)=> next(err))
				.catch((err)=> next(err));
			}
		}
		else{
			fav.create({"user": req.user._id, "dishes": [req.params.dishId]})
			.then((fav)=>{
				res.statusCode=200;
				res.setHeader('content-Type', 'application/json');
				res.json(fav);
			}, (err)=> next(err))
			.catch((err)=> next(err));
		}

	}, (err)=> next(err))
	.catch((err)=> next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favorites.findOne(req.user._id)
	.then((fav)=>{
		if(fav){
			var index= fav.dishes.indexOf(req.params.dishId);
			if(index>=0){
				fav.dishes.splice(index, 1);
				fav.save()
				.then((resp)=>{
					res.statuscode=200;
					res.setHeader('content-Type', 'application/json');
					res.json(resp);

				}, (err)=> next(err))
				.catch((err)=> next(err));	
			}
			else{
				err= new Error("Dish "+req.params.dishId+" not found in favorites");
				err.status=404;
				return next(err);
			}
		}
		else{
			err= new Error("Favorites not found");
			err.status=404;
			return next(err);
		}
	}, (err)=>{next(err);})
	.catch((err)=>{
		next(err);
	});
});
module.exports= favoriteRouter;