'use strict';

var request = require('request'),
		 an = require('../annotator');

exports.getGamut = function(req, res){

	var foundTerms = []

	an.getAnnotations(req.body.text, function(err, result) {
		
		for(var i = 0; i < result.length; i ++) {
			foundTerms.push(result[i].term)
		}

		for(var i = 0; i < foundTerms.length; i++) {
			request('https://api.gamuts.net/json/search/?q=' + foundTerms[i], function(error, result, body) {
				res.send(body)
			})
		}
	})

	/*request('https://api.gamuts.net/json/details/1000', function(error, result, body) {
		res.send(body)
	})*/
}

exports.getTerms = function(req, res){


}