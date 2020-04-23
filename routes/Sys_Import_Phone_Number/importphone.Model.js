var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImportPhoneSchema = Schema({
	user_id: 
	{
		type:String,
	},
    created_at:
	{
		type: Date,
        default: Date.now
    },
    updated_at:{
	timestamp,
    }

});

module.exports = mongoose.model('importPhoneNumber', ImportPhoneSchema);