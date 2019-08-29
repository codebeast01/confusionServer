const express= require('express');
const bodyParse= require('body-parser');

const promoRouter =express.Router();


promoRouter.use(bodyParse.json());

promoRouter.route('/')
.all((req, res, next) =>{

	res.statuscode= 200;
	res.setHeader('content-Type', 'text/html');
	next();

})

.get((req, res, next) =>{

	res.end('Bringing the promotions to you....!!');
})

.post((req, res, next) =>{

	res.end('Posting the new promotion: '+ req.body.name + ' with the details as follows: ' + req.body.description);
})

.put((req, res, next) =>{

	res.statuscode=403;
	res.end('PUT is not supported!');
})

.delete((req, res, next) =>{

	res.end('Deleting everything from here..!');
});


promoRouter.param('promoId', (req, res, next)=>{
	next();
})

promoRouter.route('/:promoId')
.all((req, res, next) =>{

 	res.statuscode= 200;
 	res.setHeader('content-Type', 'text/html');
 	next();

 })
.get((req, res, next) =>{
	res.end('Bringing the promotions: '+ req.params.promoId +' to you....!!');
})
.post((req, res, next) =>{

	res.statuscode=403;
	res.end('POST is not supported here!');
})

.put( (req, res, next) =>{

	res.write('Updating the promotion: ' + req.params.promoId + '\n');
	res.end('Will update the promotions: '+ req.body.name + ' with the description: '+ req.body.description);
})

.delete((req, res, next) =>{

	res.end('Deleting everything from promotion no: ' +req.params.promoId);
});



module.exports= promoRouter;
