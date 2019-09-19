const mongoose= require('mongoose');
const schema= mongoose.Schema;
const local= require('passport-local-mongoose');

const userSchema= new schema({
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

userSchema.plugin(local);
module.exports= mongoose.model('user', userSchema);
