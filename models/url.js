var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CounterSchema = Schema({
	_id: {type: String, required: true},
	seq: {type: Number, default: 0}
});

// why counter var is taken ?
var counter = mongoose.model('counter',CounterSchema);

var urlSchema = Schema({
	_id: {type: Number, index: true},
	long_url: String,
	created_at: Date
});

urlSchema.pre('save',function(next){
	var doc = this;
//find url_count from counters collection, and increment it by 1,and use this as the _id field of urls collection.
   	counter.findByIdAndUpdate({_id: 'url_count'},{$inc: {seq: 1} }, function(error,counter) {
		if(error)
		{
			return next(error);	
		}
		doc._id = counter.seq;
		doc.created_at = new Date();
		next();
	});
});
var Url = mongoose.model('Url', urlSchema);
module.exports = Url;
