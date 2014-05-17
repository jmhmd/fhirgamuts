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

		$('#output').html(JSON.stringify(result.causes))
		$('#inputText').html(result.hilitedText)
	})

}
