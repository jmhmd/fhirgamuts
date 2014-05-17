'use strict';

var request = require('request'),
	an = require('../annotator'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs')

exports.getGamut = function(req, res, next) {

	var radlexTerms = [],
		gamutTerms = [],
		causes = []

	request.get({
			url: 'https://api.gamuts.net/json/search/?q=neck'
		}, function(e, r, body){
			body = body.replace(/\\/g, '')
			console.log(body)
		})

	return false
	/*
	Send report body to annotator to simply match terms
	 */
	an.getAnnotations(req.body.text, function(err, result) {

		for (var i = 0; i < result.length; i++) {
			radlexTerms.push(result[i].term)
		}

		/*
		Take all the matched RadLex terms and search gamuts for them
		 */
		function gamutSearch(text, callback) {

			console.log(text)

			request('https://api.gamuts.net/json/search/?q=' + text, function(error, result, body) {

				body = JSON.parse(body.replace(/\\/g, ""))

				if (error) {
					callback(error)
				}

				console.log('body: ', body)

				var urls = _.map(body.response.entity, function(entity) { return entity.url })
				console.log(body.response.entity)

				gamutTerms.concat(urls)

				callback()

			})
		}

		async.each(radlexTerms, gamutSearch, function(err) {
			if (err) {
				console.log(err)
			}

			console.log('gamut terms: ', gamutTerms)


			/*
			Take each found gamut term and get details, including "causes"
			 */
			function gamutDetails(id, callback) {

				request({
					url: 'https://api.gamuts.net/json/details/' + id,
					json: true
				}, function(error, result, body) {

					if (error) {
						callback(error)
					}

					// console.log(body.response.entity)
					var c = _.filter(_.map(body.response.entity.relations.causes, function(cause) {
							return cause.frequency === 'common' ? cause.name : false
						}))

					causes.concat(c)

					callback()
				})
			}

			async.each(gamutTerms, gamutDetails, function(err){
				if (err){ next(err) }

				console.log(causes)

				res.send(causes)
			})

		})


	})

	/*request('https://api.gamuts.net/json/details/1000', function(error, result, body) {
		res.send(body)
	})*/
}