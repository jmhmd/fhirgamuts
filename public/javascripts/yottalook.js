"use strict";

function getYotta(name) {

	var yottaXML

	$.post('/api/getYotta', { name : name }).then(function(result) {
		yottaXML = result
	})
}