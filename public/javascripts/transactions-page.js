function filter() {
	var keyPhrase = document.getElementById("filter").value;
	window.location.href = window.location.href + '/search/' + keyPhrase;
}

var filterWithAJAX = function() {
	var keyPhrase = document.getElementById("filter").value;

	// var http = new XMLHttpRequest();
	// http.onreadystatechange = function() {
	// 	if (http.readyState == 4 && http.status == 200) {
	// 		console(http.response);
	// 	}
	// 	console.log('\n' + http);
	// }

	// http.open("GET", "transactions/search/" + keyPhrase, true);
	// http.send();
	alert(keyPhrase);
	$.ajax({
		url: "transactions/search/" + keyPhrase,
		type: "POST",
		success: function(data) {
			alert('Success:\n' + JSON.stringify(data));
		}
	});
}