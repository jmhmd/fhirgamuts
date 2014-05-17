var request = require('request');

var API_KEY= '5758f84b-562e-46cb-890b-ff787cc52bed',
	annotatorUrl = 'http://data.bioontology.org/annotator'

var params = {
		'minimum_match_length':'', 
		'ontologies':'RADLEX',   
		'semantic_types':'',
		'max_level':'0',
		'text': '', 
		'apikey': API_KEY
	}

getAnnotations = function (text, cb) {
	var result = [];

	params.text = text

	request.post(annotatorUrl, {form: params}, function(err, res, body){

		body = JSON.parse(body)

		body.forEach(function(match){

			var term = {},
				an = match.annotations[0]

			term.term = an.text
			term.from = an.from
			term.to = an.to
				
			result.push(term)
		})

		if (typeof cb === 'function'){
			cb(null, result)
		} else {
			return result
		}

	})
}

module.exports = {
	getAnnotations: getAnnotations,
	params: params
}