'use strict';

var request = require('request'),
	an = require('../annotator'),
	hilite = require('../hilite'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs')

var gamutsEntities = JSON.parse(fs.readFileSync('gamuts/trimmed-result.json', 'utf8'))

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
console.log(body.response)
				var urls = _.map(body.response.entity, function(entity) { return entity.url })

				_.forEach(body.response.entity, function(term) {

					//Only include terms that match exactly
					//if(term.name.toUpperCase() === text.toUpperCase()) {
						gamutTerms = gamutTerms.concat(term.url)
					//}
				})

				console.log("Terms: " + gamutTerms.length)
				callback()

			})
		}

		/*async.each(radlexTerms, gamutSearch, function(err) {
			if (err) {
				console.log(err)
			}

			/*
			Take each found gamut term and get details, including "causes"
			 */
			/*function gamutDetails(id, callback) {

				request({
					url: id,
					json: true
				}, function(error, result, body) {

					if (error) {
						callback(error)
					}

					if(body.response.entity.relations != null && body.response.entity.relations.may_be_caused_by != null) {

						console.log(body.response.entity)
						_.forEach(body.response.entity.relations.may_be_caused_by, function(cause) {
							if(cause.frequency === 'common') { //} || cause.frequency === 'uncommon' || cause.frequency === 'unspecified') {
								causes.push(cause.name)
							}
						})
					}

					callback()
				})
			}*/

		/*function gamutSearch(text, callback) {

			request.get({url: 'https://api.gamuts.net/json/search/?q=' + text, json:true}, function(error, result, body) {

				if (error) {
					callback(error)
				}

				var urls = _.map(body.response.entity, function(entity) { return entity.url })

				gamutTerms = gamutTerms.concat(urls)

				callback()

			})
		}*/

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
							if(cause.frequency === 'common') { //} || cause.frequency === 'uncommon' || cause.frequency === 'unspecified') {
								causes.push(cause)
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
						id: parseInt(cause.url.split('/').pop(), 10),
						name : "",
						freq : 1,
						rank : 0
					},
						exists = 0

					if(freqArray.length == 0) {
						temp.name = cause.name
						freqArray.push(temp)
					}
					else {
						exists = _.find(freqArray, function(contains) { return cause.name == contains.name })
						if(exists) {
							exists.freq++
						}
						else {
							temp.name = cause.name
							freqArray.push(temp)
						}
					}

				})

				// topThree = _.sortBy(freqArray, function(term) { return -term.freq } )

				// console.log('diag array', topThree)

				var ranked = _.map(freqArray, function(entity){
					var gamutsListing = _.find(gamutsEntities, {id: entity.id})
					if (gamutsListing){
						/*
							Correction algorithm
						 */
						var mayCauseLength = gamutsListing.mayCauseLength

						// can't divide by zero, lowest should be one
						mayCauseLength = mayCauseLength === 0 ? 1 : mayCauseLength

						var rank = parseFloat(entity.freq * (1 / mayCauseLength)).toFixed(4)
						console.log('rank', rank)
						entity.rank = rank
						return entity
					} else {
						console.log('** ERR: not found: entity:', entity)
						return entity
					}
				})

				ranked = _.sortBy(ranked, function(term){ return -term.rank })

				console.log('ranked array', ranked)

				res.send({causes: ranked, hilitedText: newText, gamuts: gamutTerms})
			})

		})

	})
}

exports.getYotta = function(req, res, next) {

	request.get('http://www.yottalook.com/api_images_2_0.php?app_id=4b94305d853d3e7c91ed4774aa428f75&mod=all&q=' + req.body.name + '&cl=10&t=yy', function(error, result, body) {
		res.send(body)
	})

}