'use strict';

var request = require('request');

exports.getGamut = function(req, res){

	request('https://api.gamuts.net/json/details/1000', function(error, result, body) {
		res.send(body)
	})

}