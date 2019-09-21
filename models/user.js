const mongoose= require('mongoose');
const schema= mongoose.Schema;
const local= require('passport-local-mongoose');

const user= new schema({
	firstname:{
		type:String, 
		default: ''
	},
	lastname:{
		type:String, 
		default: ''
	},
	admin:{
		type: Boolean,
		default: false
	}
});

user.plugin(local);
module.exports= mongoose.model('user', user);
