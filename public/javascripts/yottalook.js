"use strict";

function getYotta(name) {

	$.post('/api/getYotta', { name : name }).then(function(result) {
		console.log(result)
	})
}