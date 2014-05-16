var request = require('request');

//API_KEY= '24e050ca-54e0-11e0-9d7b-005056aa3316'
var API_KEY= '5758f84b-562e-46cb-890b-ff787cc52bed',
	annotatorUrl = 'http://data.bioontology.org/annotator'
	//submitUrl = annotatorUrl + '/submit/jhostetter@gmail.com'

var textToAnnotate = "Melanoma is a malignant tumor of melanocytes which are found predominantly in skin but also in the bowel and the eye"

/*---------------------
// virtual ontology ids:
// Radlex: 1057/50767
// LOINC: 1350/47637
// SNOMED: 1353/46896
*/
var params = {
		'stop_words':'<table>, </table>, <tr>, </tr>, <td>, </td>',
		'minimum_match_length':'', 
		'ontologies':'RADLEX',   
		'semantic_types':'',  //T017,T047,T191&" #T999&"
		'max_level':'0',
		'text': textToAnnotate, 
		'apikey': API_KEY
	}

getAnnotations = function (text, cb) {
	var result = [],
		testing = false

	params.text = text || params.textToAnnotate
	
	/**
	 * Post request to JSON API
	 */

	console.log('querying api...')
	request.post(annotatorUrl, {form: params}, function(err, res, body){

		body = JSON.parse(body)

		body.forEach(function(match){

			var term = {},
				an = match.annotations[0]

			term.term = an.text
			term.from = an.from
			term.to = an.to
			term.isA = an.matchType
			term.link = match.annotatedClass.links.ui
			term.ontology = match.annotatedClass.links.ontology.split('/').pop()
				
			result.push(term)
		})

		console.log('finished parsing')

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