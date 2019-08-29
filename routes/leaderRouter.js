const express= require('express');
const bodyParse= require('body-parser');

const leaderRouter =express.Router();


leaderRouter.use(bodyParse.json());

leaderRouter.route('/')
.all((req, res, next) =>{

	res.statuscode= 200;
	res.setHeader('content-Type', 'text/html');
	next();

})

.get((req, res, next) =>{

	res.end('Bringing the leaders to you....!!');
})

.post((req, res, next) =>{

	res.end('Posting the new leader: '+ req.body.name + ' with the details as follows: ' + req.body.description);
})

.put((req, res, next) =>{

	res.statuscode=403;
	res.end('PUT is not supported !');
})

.delete((req, res, next) =>{

	res.end('Deleting everything from here..!');
});


leaderRouter.param('leaderId', (req, res, next)=>{
	next();
})

leaderRouter.route('/:leaderId')
.all((req, res, next) =>{

 	res.statuscode= 200;
 	res.setHeader('content-Type', 'text/html');
 	next();

 })
.get((req, res, next) =>{
	res.end('Bringing the leader: '+ req.params.leaderId +' to you....!!');
})
.post((req, res, next) =>{

	res.statuscode=403;
	res.end('POST is not supported here!');
})

.put( (req, res, next) =>{

	res.write('Updating the leader: ' + req.params.leaderId + '\n');
	res.end('Will update the leader: '+ req.body.name + ' with the description: '+ req.body.description);
})

.delete((req, res, next) =>{

	res.end('Deleting everything from leader no: ' +req.params.leaderId);
});



module.exports= leaderRouter;
