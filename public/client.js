function update(game_state) {
	$num_players.html(game_state.players.length);
	$current_player.html(game_state.current_player);
//	$current_price.html(game_state.current_price);
//	$current_captain.html(game_state.current_captain;
//	$end_price.html(game_state.end_price);
//	$captain.html(game_state.end_price);
}

$(document).ready(function() {
	//client bindings
	$num_players = $("#num_players")
	$current_player = $("#current_player")
	$my_id = $("#my_id")
	$current_price = $("#current_price")
	$current_captain = $("#current_captain")
	$end_price = $("#end_price")
	$captain = $("#captian")

	var socket = io.connect('http://localhost:3000');

	socket.on("game_state", function(game_state) {
		// console.log(game_state);
		update(game_state);
	});
	
	socket.on("assign_id", function(data) {
		console.log(data);
		$my_id.html(data.id);
	})
	
	$("#act").click(function(e) {
		console.log("act");
		socket.emit("action", 0);
		e.preventDefault();
	})
	$("#confirm").click(function(e) {
		console.log("confirm");
		socket.emit("action", 3);
		e.preventDefault();
	})
	$("#cancel").click(function(e) {
		console.log("cancel");
		socket.emit("action", 4);
		e.preventDefault();	
	})
		$("#auction").click(function(e) {
		console.log("auction");
		socket.emit("action", 2);
		e.preventDefault();	
	})
});