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

	$('#inputTextarea').on('input properychange', function(){
		$('.submitReport').removeClass('disabled')
	})
})

function getDiagnosisText() {
	var textInput = {}

	textInput.text = $('#inputTextarea').val()

	console.log(textInput.text)

	getDiagnosis(textInput, 'text')
}

function getDiagnosisFHIR() {
	var textInput = {}

	textInput.text = $('.inputText').html()

	getDiagnosis(textInput, 'html')
}

function getDiagnosis(textInput, format) {
	
	if (format === 'html'){
		$('.submitReport').addClass('disabled')
	}

	$.post('/api/getGamut', textInput).then(function(result) {
		var buildOutput = '', number = 1

		buildOutput = "<table>"
		_.forEach(result.causes, function(term) {
			buildOutput += "<tr> <td>" + number + ". </td> <td>" + term.name + "</td> <td>" + term.freq + "</tf> </tr>"
			number++
		})
		buildOutput += "</table>"

		$('#output').html(buildOutput)

		switch (format){
			case 'text':
				$('.inputText').html(result.hilitedText.replace(/\n/g, ' <br> '))
				break
			case 'html':
				$('.inputText').html(result.hilitedText)
		}
	})
}
