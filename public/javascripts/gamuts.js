"use strict";

$(document).ready(function() {

	$('#explain').modal({show: true})

	$('#Text').click(function (e) {
 		 e.preventDefault()
  		$(this).tab('show')
	})

	$('#FHIR').click(function (e) {
 		 e.preventDefault()
  		$(this).tab('show')
	})

	var defaultText = 'Impression: \n 1. Splenomegaly \n 2. Portal hypertension \n 3. Hepatomegaly \n 4. Esophageal varices'

	$('#inputTextarea').val(defaultText)

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
		//_.forEach(result.causes, function(term) {
		for( var i=0; i < 5; i++) {
			//buildOutput += "<tr> <td>" + number + ". </td> <td>" + term.name + "</td> <td>" + term.rank + "</tf> </tr>"
			buildOutput += "<tr> <td>" + number + ". </td> <td>" + result.causes[i].name + "</tf></tr>"
			number++
		}
		//})
		buildOutput += "</table>"

		console.log(result)

		$('#output').html(buildOutput)
		getYotta(result.causes[0].name)

		switch (format){
			case 'text':
				$('.inputText').html(result.hilitedText.replace(/\n/g, ' <br> '))
				break
			case 'html':
				$('.inputText').html(result.hilitedText)
		}
	})
}
