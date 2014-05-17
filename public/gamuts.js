"use strict";

$(document).ready(function() {

	var defaultText = 'Melanoma is a malignant tumor of melanocytes which are found predominantly in skin but also in the bowel and the eye'
	
	$('#inputText').html(defaultText)

})

function getDiagnosis() {
	var textInput = { text : "" }

	textInput.text = $('#inputText').html()

	$('#submitReport').addClass('disabled')

	$.post('/api/getGamut', textInput).then(function(result) {
		var buildOutput = ''

		buildOutput = "<table>"
		_.forEach(result.causes, function(term) {
			buildOutput += "<tr> <td>" + term.name + "</td> <td>" + term.freq + "</tf> </tr>"
		})
		buildOutput += "</table>"

		$('#output').html(buildOutput)

		$('#inputText').html(result.hilitedText)

	})

}
