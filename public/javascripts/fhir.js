"use strict";

$(document).ready(function() {

	$('.find-reports').on('click', function(){
		getReports()
	})

	$('body').on('click', '.populate-textarea', function(e){

		e.preventDefault()

		$('#submitReport').removeClass('disabled')

		var reportText = $(e.target).parent().data('report')

		$('.inputText').html(reportText)
	})

	function getReports(){
		$.get('http://fhir.hackathon.siim.org/fhir/DiagnosticReport?service=RAD&_format=application/json', function(result) {

			var listContainer = $('#patient-list')

			_.each(result.entry, function(entry) {

				var id = entry.content.subject.reference,
					reportText = $(entry.content.text.div).html()

				$.get('http://fhir.hackathon.siim.org/fhir/' + id + '?_format=application/json', function(result) {

					var name = result.name[0].family + ', ' + result.name[0].given

					console.log(result)

					var listel = $('<li><a href="#" class="populate-textarea" id="'+result.identifier[0].value+'">' + name + '</a></li>')

					listel.empty()

					listel
						.data('report', reportText)
						.appendTo(listContainer)
				})
			})
		})
	}
})