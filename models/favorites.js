const mongoose= require('mongoose');
const schema= mongoose.Schema;


var dish= new schema({
	_id:{
		type: schema.Types.ObjectId,
		ref: 'Dish' 
	}
},{
	timestamps: true
});

var favoriteSchema= new schema({
	user:{
		type:schema.Types.ObjectId,
		ref: 'user'
	},
	dishes:[dish]
}, {
	timestamps: true
});

exports.favorites= mongoose.model('favorite', favoriteSchema);


