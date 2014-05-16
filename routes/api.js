'use strict';

var request = require('request'),
		 an = require('../annotator');

exports.getGamut = function(req, res){

	an.getAnnotations(req.body.text)

	console.log("Length: " + req.body.text.length)

	res.send(req.body.text)

	/*request('https://api.gamuts.net/json/details/1000', function(error, result, body) {
		res.send(body)
	})*/
}

exports.getTerms = function(req, res){


}