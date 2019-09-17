const mongoose= require('mongoose');
const schema= mongoose.Schema;
const local= require('passport-local-mongoose');

const userSchema= new schema({
	admin:{
		type: Boolean,
		default: false
	}
});

userSchema.plugin(local);
var users= mongoose.model('user', userSchema);
module.exports= users;