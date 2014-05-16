"use strict";

$(document).ready(function() {

	$('.find-reports').on('click', function(){
		getReports()
	})

	$('body').on('click', '.populate-textarea', function(e){

		e.preventDefault()

		var reportText = $(e.target).parent().data('report')

		$('#inputText').val(reportText)
	})

	function getReports(){
		// $.get('http://fhir.hackathon.siim.org/fhir/Patient?_format=application/json', function(result){
		$.get('http://fhir.hackathon.siim.org/fhir/DiagnosticReport?service=RAD&_format=application/json', function(result) {

			var listContainer = $('#patient-list')

			_.each(result.entry, function(entry) {

				var id = entry.content.subject.reference,
					reportText = $(entry.content.text.div).text()

				$.get('http://fhir.hackathon.siim.org/fhir/' + id + '?_format=application/json', function(result) {

					var name = result.name[0].family + ', ' + result.name[0].given

					var listel = $('<li><a href="#" class="populate-textarea" id="'+result.identifier[0].value+'">' + name + '</a></li>')

					listel
						.data('report', reportText)
						.appendTo(listContainer)
				})
			})
		})
	}
})