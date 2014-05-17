'use strict';

var request = require('request'),
	an = require('../annotator'),
	hilite = require('../hilite'),
	async = require('async'),
	_ = require('lodash')

exports.getGamut = function(req, res, next) {

	var radlexTerms = [],
		gamutTerms = [],
		causes = []

	/*
	Send report body to annotator to simply match terms
	 */
	an.getAnnotations(req.body.text, function(err, result) {

		/*
		result looks like:
		[ { term: 'HEAD', from: 52, to: 55 },
		  { term: 'NECK', from: 57, to: 60 },
		  { term: 'DIAGNOSTIC', from: 216, to: 225 },
		  { term: 'TUMOR', from: 286, to: 290 },
		  { term: 'HYDROCEPHALUS', from: 317, to: 329 },
		  { term: 'MALIGNANT', from: 357, to: 365 },
		  { term: 'DUCT', from: 393, to: 396 } ]
		 */

		var newText = hilite.hiliteTerms(result, req.body.text)

		// console.log('terms: ', result)
		// console.log('markup: ', newText)

		for (var i = 0; i < result.length; i++) {
			radlexTerms.push(result[i].term)
		}

		/*
		Take all the matched RadLex terms and search gamuts for them
		 */
		function gamutSearch(text, callback) {

			// console.log(text)

			request.get({url: 'https://api.gamuts.net/json/search/?q=' + text, json:true}, function(error, result, body) {

				if (error) {
					callback(error)
				}

				// console.log('body: ', body)

				var urls = _.map(body.response.entity, function(entity) { return entity.url })
				
				// console.log(body.response.entity)

				gamutTerms = gamutTerms.concat(urls)

				callback()

			})
		}

		async.each(radlexTerms, gamutSearch, function(err) {
			if (err) {
				console.log(err)
			}

			// console.log('gamut terms: ', gamutTerms)

			/*
			Take each found gamut term and get details, including "causes"
			 */
			function gamutDetails(id, callback) {

				request({
					url: id,
					json: true
				}, function(error, result, body) {

					if (error) {
						callback(error)
					}

					console.log('entity: ', body.response.entity)
					var c = _.filter(_.map(body.response.entity.relations.causes, function(cause) {
							return cause.frequency === 'common' ? cause.name : false
						}))

					causes.concat(c)

					callback()
				})
			}

			async.each(gamutTerms, gamutDetails, function(err){
				if (err){ next(err) }

				// console.log(causes)

				res.send(causes)
			})

		})


	})

	/*request('https://api.gamuts.net/json/details/1000', function(error, result, body) {
		res.send(body)
	})*/
}