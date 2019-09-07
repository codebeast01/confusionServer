const mongoose= require('mongoose');
const schema= mongoose.Schema;

const userSchema= new schema({

	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	},
	admin:{
		type: Boolean,
		default: false
	}
});

var users= mongoose.model('user', userSchema);
module.exports= users;