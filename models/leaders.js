const mongoose= require('mongoose');
const schema= mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const currency= mongoose.Types.Currency;

const leaderSchema= new schema({

	name:{
		type: String,
		required: true,
		unique: true

	},
	designation:{
		type: String,
		required: true
	}, 
	image:{
		type: String,
		required: true
	},
	abbr:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	featured:{
		type: Boolean,
		default: false

	}
},{
		timestamps: true

});

const Leaders= mongoose.model('Leader', leaderSchema);

module.exports= Leaders;