"use strict";

var request = require('request'),
	async = require('async'),
	util = require('util'),
	fs = require('fs');

var limit = 40000,
	start = 0,
	sent = 0

function countMayCause (id, cb) {

	if (id < start){
		return cb(null, false)
	}

	request.get({url: 'https://api.gamuts.net/json/details/' + id, json:true}, function(error, result, body) {

		sent++;

		if (error) {
			return cb(error)
		}

		if (body.response.count !== 1){
			return cb(null, false)
		}

		if (id !== parseInt(body.response.entity.id, 10)){
			return cb("ids don't match")
		}

		// console.log(util.inspect(body.response, {depth: null}))

		var mayCauseLength;
		
		if (body.response.entity.relations &&
			body.response.entity.relations.may_cause){
			
			mayCauseLength = body.response.entity.relations.may_cause.length
		} else {
			mayCauseLength = 0
			// console.log(util.inspect(body.response, {depth: null}))
		}

		return cb(null, {
			id: id,
			mayCauseLength: mayCauseLength,
			fullObject: body.response
		})
	})
}

async.times(limit, countMayCause, function(err, result){
	if (err){ console.log('Error:', err)}

	result = result.filter(function(v){ return v })

	var fullResult = result.map(function(v){ return v.fullObject })

	var trimmedResult = result.map(function(v){ return {id: v.id, mayCauseLength: v.mayCauseLength} })
	var activeIds = result.map(function(v){ return v.id })

	// console.log(util.inspect(result, {depth: 1}))
	
	// write output to file
	fs.writeFile('full-result.json', JSON.stringify(fullResult, null, 4))
	fs.writeFile('trimmed-result.json', JSON.stringify(trimmedResult, null, 4))
	fs.writeFile('active-ids.json', JSON.stringify(activeIds, null, 4))

	console.log('all done!', 'sent', sent, 'requests')
})