"use strict";

$(document).ready(function() {

	$('.find-reports').on('click', function(){
		getReports()
	})

	$('body').on('click', '.populate-textarea', function(e){

		e.preventDefault()

		$('.submitReport').removeClass('disabled')

		var reportText = $(e.target).parent().data('report')

		$('.inputText').html(reportText)
	})

	function getReports(){

		//FHIR.oauth2.ready(function(ssmart){
    // now do something cool

		var smart = FHIR.client({
  				serviceUrl: 'https://fhir-open-api.smarthealthit.org',
  				patientId: '1137192'
			});

		// Search for the current patient's conditions
		//smart.patient.api.search({type: 'Condition'});

		// Search for the current patient's prescriptions
		//smart.patient.api.search({type: 'MedicationOrder'});

		//});

		$.get('https://fhir.hackathon.siim.org/fhir/DiagnosticReport?service=RAD&_format=application/json', 
			function(result) {
				console.log(result)
			});

		/*$.get('https://fhir.hackathon.siim.org/fhir/DiagnosticReport?service=RAD&_format=application/json', function(result) {

			var listContainer = $('#patient-list')

			listContainer.empty()
			
			_.each(result.entry, function(entry, i) {

				var id, name, listel, patientIdentifier,
					reportText = $(entry.content.text.div).html()

				if (entry.content && entry.content.subject && entry.content.subject.reference){
					
					id = entry.content.subject.reference
					
					$.get('https://fhir.hackathon.siim.org/fhir/' + id + '?_format=application/json', function(result) {

						name = result.name[0].family + ', ' + result.name[0].given
						patientIdentifier = result.identifier[0].value

						addItem(name, patientIdentifier)
					})
				} else {
					name = "No name defined"
					patientIdentifier = "undefined_" + i

					addItem(name, patientIdentifier)
				}
				
				function addItem(name, patientIdentifier){
					
					listel = $('<li><a href="#" class="populate-textarea" id="'+patientIdentifier+'">' + name + '</a></li>')

					listel
						.data('report', reportText)
						.appendTo(listContainer)
				}
			})
		})*/
	}
})