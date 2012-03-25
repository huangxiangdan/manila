function update(game_state) {
	$("#players").html($.toJSON(game_state.players));
	$("#phase").html(game_state.phase);
	$("#spaces").html($.toJSON(game_state.spaces));
	$num_players.html(game_state.players.length);
	$current_player.html(game_state.current_player_id);
	$ships.html($.toJSON(game_state.punts));
}

$(document).ready(function() {
	//client bindings
	$num_players = $("#num_players")
	$current_player = $("#current_player")
	$my_id = $("#my_id")
	$ships = $("#ships");

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
		socket.emit("action", {type:"dice"});
		e.preventDefault();
		
	})

});