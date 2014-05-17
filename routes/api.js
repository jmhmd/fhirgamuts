'use strict';

var request = require('request'),
	an = require('../annotator'),
	hilite = require('../hilite'),
	async = require('async'),
	_ = require('lodash')

exports.getGamut = function(req, res, next) {

	var radlexTerms = [],
		gamutTerms = [],
		causes = [],
		freqArray = [],
		topThree = []

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

		for (var i = 0; i < result.length; i++) {
			radlexTerms.push(result[i].term)
		}

		/*
		Take all the matched RadLex terms and search gamuts for them
		 */
		function gamutSearch(text, callback) {

			request.get({url: 'https://api.gamuts.net/json/search/?q=' + text, json:true}, function(error, result, body) {

				if (error) {
					callback(error)
				}

				var urls = _.map(body.response.entity, function(entity) { return entity.url })

				gamutTerms = gamutTerms.concat(urls)

				callback()

			})
		}

		async.each(radlexTerms, gamutSearch, function(err) {
			if (err) {
				console.log(err)
			}

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

					if(body.response.entity.relations != null && body.response.entity.relations.may_be_caused_by != null) {

						_.forEach(body.response.entity.relations.may_be_caused_by, function(cause) {
							if(cause.frequency === 'common' || cause.frequency === 'uncommon') {
								causes.push(cause.name)
							}
						})
					}

					callback()
				})
			}

			async.each(gamutTerms, gamutDetails, function(err){
				if (err){ next(err) }

				_.forEach(causes, function(cause) {
					var temp = {
						name : "",
						freq : 1
					},
						exists = 0

					if(freqArray.length == 0) {
						temp.name = cause
						freqArray.push(temp)
					}
					else {
						exists = _.find(freqArray, function(contains) { return cause == contains.name })
						if(exists) {
							exists.freq++
						}
						else {
							temp.name = cause
							freqArray.push(temp)
						}
					}

				})

				topThree = _.sortBy(freqArray, function(term) { return -term.freq } )

				res.send({causes: topThree, hilitedText: newText})
			})

		})

	})
}