
$(document).ready(function() {

	defaultText = 'Melanoma is a malignant tumor of melanocytes which are found predominantly in skin but also in the bowel and the eye'
	inputText.innerHTML = defaultText

})

function getDiagnosis() {
	textInput = { text : "" }

	textInput.text = inputText.value

	$.post('/api/getGamut', textInput).then(function(result) {

		output.innerHTML = result
	})

}
