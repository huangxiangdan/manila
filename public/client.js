function msgReceived(msg) {
	$clientCounter.html(msg.clients);
}

$(document).ready(function() {
	$clientCounter = $("#client_count")
	
	var socket = io.connect('http://localhost:3000');

	socket.on("news", function(msg) {
		console.log("message rec" + msg);
		msgReceived(msg);
	});
});