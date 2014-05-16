'use strict';

var request = require('request'),
		 an = require('../annotator');

exports.getGamut = function(req, res){

	var foundTerms = []

	an.getAnnotations(req.body.text, function(err, result) {
		
		for(var i = 0; i < result.length; i++) {
			request('https://api.gamuts.net/json/search/?q=' + result[i], function(error, result, body) {
				res.send(body)
			})
		}
	})
}