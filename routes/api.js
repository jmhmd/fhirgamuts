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
							if(cause.frequency === 'common') {
								causes.push(cause.name)
							}
						})
					}

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
}