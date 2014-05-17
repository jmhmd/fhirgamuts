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

	console.log(textInput.text)

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
		var buildOutput = '', number = 1

		buildOutput = "<table>"
		_.forEach(result.causes, function(term) {
			buildOutput += "<tr> <td>" + number + ". </td> <td>" + term.name + "</td> <td>" + term.freq + "</tf> </tr>"
			number++
		})
		buildOutput += "</table>"

		$('#output').html(buildOutput)

		$('.inputText').html(result.hilitedText.replace(/\n/g, ' <br> '))
	})
}
