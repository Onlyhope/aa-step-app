function filter() {
	var keyPhrase = document.getElementById("filter").value;
	alert('Sending AJAX Request');

	$.ajax({success: function(result) {
		alert("Success: " + keyPhrase);
	}});
}