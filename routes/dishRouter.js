const express= require('express');
const bodyParse= require('body-parser');

const dishRouter =express.Router();


dishRouter.use(bodyParse.json());

dishRouter.route('/')
.all((req, res, next) =>{

	res.statuscode= 200;
	res.setHeader('content-Type', 'text/html');
	next();

})

.get((req, res, next) =>{

	res.end('Bringing the dishes to you....!!');
})

.post((req, res, next) =>{

	res.end('Posting the new dish: '+ req.body.name + ' with the details as follows: ' + req.body.description);
})

.put((req, res, next) =>{

	res.statuscode=403;
	res.end('PUT is not supported!');
})

.delete((req, res, next) =>{

	res.end('Deleting everything from here..!');
});


dishRouter.param('dishId', (req, res, next)=>{
	next();
})

dishRouter.route('/:dishId')
.all((req, res, next) =>{

 	res.statuscode= 200;
 	res.setHeader('content-Type', 'text/html');
 	next();

 })
.get((req, res, next) =>{
	res.end('Bringing the dish: '+ req.params.dishId +' to you....!!');
})
.post((req, res, next) =>{

	res.statuscode=403;
	res.end('POST is not supported here!');
})

.put( (req, res, next) =>{

	res.write('Updating the dish: ' + req.params.dishId + '\n');
	res.end('Will update the dish: '+ req.body.name + ' with the description: '+ req.body.description);
})

.delete((req, res, next) =>{

	res.end('Deleting everything from dish no: ' +req.params.dishId);
});



module.exports= dishRouter;
