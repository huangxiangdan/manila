function msgReceived(game_state) {
	$clientCounter.html(game_state.num_players);
}

$(document).ready(function() {
	$clientCounter = $("#client_count")
	
	var socket = io.connect('http://localhost:3000');

	socket.on("game_state", function(game_state) {
		console.log(game_state);
		msgReceived(game_state);
	});
});