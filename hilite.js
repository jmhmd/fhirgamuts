'use strict';

var _ = require('lodash'),
	opts = {
		showAllInstances: true
	};

module.exports.hiliteTerms = function (terms, text){

	/*
	/* give each term an id for use with assigning highlighting classes
	*/
	var i = 1;
	terms = _.map(terms, function(term) {
		term._id = i
		i++
		return term
	})

	/*
	/* start sorting out words, and which phrases they are included in
	*/

	// return first non-space character index
	function getNextStart(text, startIndex) {
		startIndex = startIndex || 0

		if (text.substr(startIndex, 1) != ' ') {
			return startIndex
		}

		var nextSpace = text.indexOf(' ', startIndex),
			nextWord = nextSpace + 1

		while (text.substr(nextWord, 1) == ' ') {
			nextWord += 1
		}

		return nextWord
	}

	// return first space character index
	function getNextEnd(text, startIndex) {
		var end = text.indexOf(' ', startIndex || 0)
		return end === -1 ? text.length : end
	}


	//build array of each word in text box, as bounded by space character
	function getWords(text, startIndex, endIndex) {
		
		var	words = []

		startIndex = startIndex || 0
		endIndex = endIndex || text.length

		while (startIndex < endIndex) {
			var next = getNextStart(text, startIndex),
				end = getNextEnd(text, next)

			words.push([next, end])
			startIndex = end
		}

		return words
	}

	var newText = '',
		words = getWords(text);

	// for each word in raw text, check if it falls within
	// any term's bounds, and if it does, add that term's class
	function isInBounds(val, bounds) {
		// takes val [from, to] and bounds [from, to]. Returns true if val.from is equal to
		// bounds.from or between bounds.from and bounds.to
		// TODO: make option for index correction (this data source uses first char as index 1)
		if (val[0] === bounds[0] - 1 || (val[0] > bounds[0] - 1 && val[0] < bounds[1])) {
			return true
		}
	}

	function addPadding(curr, last) {
		// check if previous word matched same term
		var padded = [],
			intersection = _.intersection(curr, last),
			difference = _.difference(curr, last)

		_.forEach(intersection, function(termId) {
			var lastIndex = _.indexOf(last, termId)
			if (lastIndex > -1) {
				for (var j = padded.length; j < lastIndex; j++) {
					padded.push(0)
				}
			}
			padded.push(termId)
		})
		// tack on terms not matched on prior word
		return padded.concat(difference)
	}

	var matchedPhrases = []

	_.forEach(words, function(val, i) {
		var classes = '',
			divPadding = 0,
			word = text.substr(val[0], val[1] - val[0]);

		matchedPhrases[i] = []

		_.forEach(terms, function(term) {
			/*var termCoords = _.reduce(term, function(prev, ontology, key) {
				return (key === '_id') ? prev : prev.concat(ontology.coords)
			}, [])*/
			var termCoords = [
				[term.from, term.to]
			]
			if (opts.showAllInstances) {
				_.forEach(termCoords, function(coord) {
					if (isInBounds(val, coord)) {
						matchedPhrases[i].push(term._id)
						classes += 't_' + term._id + ' '
					}
				})
			} else { // only check first instance of word
				if (isInBounds(val, termCoords[0])) {
					matchedPhrases[i].push(term._id)
					classes += 't_' + term._id + ' '
				}
			}
		})

		if (matchedPhrases[i].length > 0) {
			newText += '<mark id="w_' + i + '" class="matched-word ' + classes + '">' + word
			//	'<div class="underline-container">'

			/*
							// add div for underlines
							*/

			/*
							// add empty divs for padding
							if (i > 0 && matchedPhrases[i-1].length > 0){
								matchedPhrases[i] = addPadding(matchedPhrases[i], matchedPhrases[i-1])
							}
							
							_.forEach(matchedPhrases[i], function(termId){
								if (termId === 0){
									newText += '<div class="padding"></div>'
								} else {
									newText += '<div class="underline t_'+termId+'"></div>'
								}
							})
							*/

			//newText += '</div></mark> '
			newText += '</mark> '

		} else {
			newText += word + ' '
		}
	})

	return newText
}

/*//console.log(phrases)

resultBox.html(newText)
that.hiliteText(terms)

//outputArray += terms.length
console.log('Matched Annotations: ' + terms.length)
console.log(terms)*/