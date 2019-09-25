var express= require('express');
var app= express();
var cors= require('cors');


const whiteList=['https://localhost:3443','http://localhost:3000'];

const corsOptionsDelegate= (req, cb)=>{
	var corsOptions;
	console.log(req.header('origin'));
	if(whiteList.indexOf(req.header('origin'))!==-1)
		corsOptions= {origin: true};
	else
		corsOptions= {origin: false};

	cb(null, corsOptions);
}


exports.cors=cors();

exports.corsWithOptions= cors(corsOptionsDelegate);