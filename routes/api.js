'use strict';

var request = require('request'),
		 an = require('../annotator');

exports.getGamut = function(req, res){

	var foundTerms = []

	an.getAnnotations(req.body.text, function(err, result) {

		for(var i = 0; i < result.length; i ++) {
			foundTerms.push(result[i].term)
		}

		res.send(result)
	})
}