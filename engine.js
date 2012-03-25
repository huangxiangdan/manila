//the game engine
var game_engine = {

	num_players : 0,
	current_player : 1,

	add_player : function() {
		var player_id = this.num_players;
		this.num_players += 1;
		return player_id;
	},

	remove_player : function(client) {
		console.log("removing " + client);
		this.num_players -=1;
	},

	next_player : function() {
		if (this.num_players == 0) {
			return 0;
		}
		this.current_player = (this.current_player + 1) % this.num_players;
	},

	get_gamestate : function() {
		return {
			"num_players" : this.num_players,
			"current_player" : this.current_player
		}
	}
}

module.exports = game_engine;
