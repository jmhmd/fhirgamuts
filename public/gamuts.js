
$(document).ready(function() {

	defaultText = 'Melanoma is a malignant tumor of melanocytes which are found predominantly in skin but also in the bowel and the eye'
	inputText.innerHTML = defaultText

})

function getDiagnosis() {
	textInput = { text : "" }

	textInput.text = $('#inputText').text()

console.log(textInput)
	$.post('/api/getGamut', textInput).then(function(result) {
		var buildOutput = ''

		buildOutput = "<table>"
		_.forEach(result, function(term) {
			buildOutput += "<tr> <td>" + term.name + "</td> <td>" + term.freq + "</tf> </tr>"
		})
		buildOutput += "</table>"

		output.innerHTML = buildOutput
	})

	this.hiliteText = function(terms){
		var resultDetails = $('#resultDetails'),
			termsByLoc = {}

		_.forEach(terms, function(term){
			var termDetails = ''

			_.forEach(term, function(ontol, key){
				if (key === '_id'){ return false }
				termDetails += '<h4>'+key+'</h4>'+
					'<h5>Preferred Name:</h5>'+
					'<span><a href="'+ontol.link+'" title="'+ontol.link+'" target="_blank">'+ontol.term+'</a></span>'
			})

			var words = $('.matched-word.t_'+term._id)

			_.forEach(words, function(word){
				word = $(word)
			// add matched info and listener if needed
				if (word.hasClass('term_hilite')){					
				// click event already attached, just append info
					word.data('details', word.data('details') + termDetails)
				} else {
					word.addClass('term_hilite')
						.data('details', termDetails)
						.on('click', function(e){
							resultDetails.html($(e.target).data('details'))
					})
				}
			})

		})
	}

}
