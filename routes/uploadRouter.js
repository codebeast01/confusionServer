const express= require('express');
const bodyParse= require('body-parser');
const multer=require('multer');

const uploadRouter =express.Router();

var authenticate= require('../authenticate');

const Storage= multer.diskStorage({
	destination: (req, file, cb)=>{
		cb(null, 'public/images');
	},

	filename:(req, file, cb)=>{
		cb(null, file.originalname);
	}
});

const imageFileFilter= (req, file, cb)=>{

	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
	{
		return cb(new Error('You can only upload image files'), false);
	}

	cb(null, true);
}

const uploads= multer({
	storage: Storage,
	fileFilter: imageFileFilter
})

uploadRouter.use(bodyParse.json());



uploadRouter.route('/')
.put(authenticate.verifyUser,(req, res, cb) =>{

	res.statuscode=403;
	res.end('PUT is not supported in /imageUpload');
})
.get(authenticate.verifyUser,(req, res, cb) =>{

	res.statuscode=403;
	res.end('GET is not supported in /imageUpload');
})
.delete(authenticate.verifyUser,(req, res, cb) =>{

	res.statuscode=403;
	res.end('DELETE is not supported in /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, uploads.single('imageFile'), (req, res)=>{

	res.statuscode=200;
	res.setHeader('Content-Type','application/json');
	res.json(req.file);
});

module.exports= uploadRouter;
