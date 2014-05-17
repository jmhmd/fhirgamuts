"use strict";

$(document).ready(function() {

	$('#Text').click(function (e) {
 		 e.preventDefault()
  		$(this).tab('show')
	})

	$('#FHIR').click(function (e) {
 		 e.preventDefault()
  		$(this).tab('show')
	})
})

function getDiagnosisText() {
	var textInput = {}

	textInput.text = $('#inputTextarea').val()

	getDiagnosis(textInput)
}

function getDiagnosisFHIR() {
	var textInput = {}

	textInput.text = $('.inputText').html()

	getDiagnosis(textInput)
}

function getDiagnosis(textInput) {
	
	$('.submitReport').addClass('disabled')

	$.post('/api/getGamut', textInput).then(function(result) {
		var buildOutput = ''

		buildOutput = "<table>"
		_.forEach(result.causes, function(term) {
			buildOutput += "<tr> <td>" + term.name + "</td> <td>" + term.freq + "</tf> </tr>"
		})
		buildOutput += "</table>"

		$('#output').html(buildOutput)

		$('.inputText').html(result.hilitedText)
	})
}
