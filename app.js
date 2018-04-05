var express = require('express');
var validUrl = require('valid-url');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');
var Url = require('./models/url');  //this line

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res) {
	res.sendFile(path.join(__dirname,'views/index.html'));
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

  // route to create and return a shortened URL given a long URL
app.post('/api/shorten',function(req,res) {
	var longUrl = req.body.url; // url given by user
	var shortUrl = '';
	// Url is the table, in which we are searching longUrl in long_url column.
	// single quotes is not used in long_url? 
	Url.findOne({long_url: longUrl}, function (err,doc) {
	    if (doc) {
		console.log("doc._id:"+ doc._id);
		shortUrl = config.webhost + base58.encode(doc._id+(Math.pow(58, 6)));
		console.log("Encoded: "+shortUrl);
		res.send({'shortUrl' : shortUrl}); //but is used here
  	    }
	    else {
	    	var newUrl = Url({
		     long_url : longUrl
		});
		newUrl.save(function(err)  {
		     if(err) {
			console.log(err);
		     }
		console.log("newUrl._id:" +newUrl._id);
		shortUrl = config.webhost + base58.encode(newUrl._id+(Math.pow(58, 6)));
		console.log("Encoded_New:  "+shortUrl);
		res.send({'shortUrl': shortUrl});
		});
	    }

	});
});
  // route to redirect the visitor to their original URL given the short URL
app.get('/:encoded_id',function(req,res) {
	var base58Id = req.params.encoded_id;
	console.log("base58Id: "+ base58Id);
	var id = base58.decode(base58Id);
	console.log("Id: " + id);
	id=id-Math.pow(58, 6);
	console.log("Id: " + id);
	Url.findOne({_id:id},function (err, doc)  {
		if(doc)  {
		    res.redirect(doc.long_url);
		}
		else   {
		    res.redirect(config.webhost); 
		}
	});
});
var server=app.listen(3000,function(){
	console.log("Server is running on port 3000");
});

module.exports = Url;  // this line

