//the game engine
num_players = 0;
current_player = 1;

function add_player() {
	var player_id = num_players;
	num_players += 1;
	return player_id;
};

function remove_player(client) {
	console.log("removing " + client);
	num_players -=1;
}

function next_player() {
	if (num_players == 0) {
		return 0;
	}
	current_player = (current_player + 1) % num_players;
}

function get_gamestate() {
	return {
		"num_players" : num_players,
		"current_player" : current_player
	}
}
exports.add_player = add_player;
exports.remove_player = remove_player;
exports.next_player = next_player;
exports.get_gamestate = get_gamestate;

