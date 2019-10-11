// Include all the required modules

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// Getting the favourite  dishes of the user using the user id

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
  //  var userId = req.decoded._doc._id;
    var dishId = req.body._id;
  //  console.log('Displaying deocede doc _Id Variable ',userId);
    console.log('Displaying deocede body _Id Variable , should be undefined here',dishId);
    console.log('Displaying if we got the id corerct',req.user._id);
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// Posting the favorite dish of the user
// From the body loop though and get the dishes and save
// If the favorite is already  found then save dishes
// Else create  the favorite for the user and save the dishes
// Note to test in Postman usage is {"_id":"5d8de8bcce215e2e64bb49d8"} where it is the Object id of the dish


.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('Posting favorite now');
    console.log('the _id is ',req.user._id)
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            console.log('checking favorite just after  if', favorite);
       //     console.log(' The id in the body is ',favorite.dishes.indexOf(req.body[i]._id));
            console.log('checking the length ',req.body.length)
       // looping is needed for all the dishes 
            for (var i=0; i<req.body.length; i++) {
                console.log('Loop count',i);
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Created in if', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            console.log('In the else loop now count',i);
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((favorite) => {
                console.log('Favorite Created in else ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})

//Update operation is not supported 

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

// Remove the favorite using the user _id

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('About to delete user favourites for ',req.user._id)
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

// The section below is to support the '/favorites/:dishId' route

// As per the Assignment 4 requirement GET is not to be supported and
// only post and delete are supported

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})

// Posting a favourite using teh dishId route
// As dishID comes in looping is not needed as the req.params.dishID can be used 

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                console.log('favorite.dishes.indexOf(req.params.dishId) --',favorite.dishes.indexOf(req.params.dishId));
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created if section', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created  in else', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

// As per the Assignment 4 requirement PUT  is not to be supported and
// only post and delete are supported

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})

// Deleting favourite based on DishId

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('the user requesting delete  _id is ',req.user._id)
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) { 
            console.log('Displaying favorite before deleting -',favorite); 
// return the dishpositionindex  of the favorite based on dishId          
            dishpositionindex = favorite.dishes.indexOf(req.params.dishId);
            console.log('dishpositionindex is -',dishpositionindex)
            if (dishpositionindex >= 0) {
// remove the favorite based on index
                favorite.dishes.splice(dishpositionindex, 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found to delete');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;