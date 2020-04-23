var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadSchema = Schema({
	imagename: 
	{
		type:String,
	},
});

module.exports = mongoose.model('uploadimage', uploadSchema);