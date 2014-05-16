"use strict"

$(document).ready(function() {

	// $.get('http://fhir.hackathon.siim.org/fhir/Patient?_format=application/json', function(result){
	$.get('http://fhir.hackathon.siim.org/fhir/DiagnosticReport?service=RAD&_format=application/json', function(result) {

		var listContainer = $('#patient-list')

		_.each(result.entry, function(entry) {

			var id = entry.content.subject.reference,
				reportTextDiv = entry.content.text.div

				$.get('http://fhir.hackathon.siim.org/fhir/' + id + '?_format=application/json', function(result) {

					var name = result.name[0].family + ', ' + result.name[0].given

					listContainer.append('<li>' + name + ': ' + reportTextDiv + '</li>')
				})
		})
	})
})