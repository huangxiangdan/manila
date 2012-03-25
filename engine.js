var GameState = require('./common/GameState.js');
var Player = require('./models/player.js');
//the game engine
var game_engine = {
	game_state : new GameState(),

	add_player : function() {
		var player_id = this.game_state.players.length + 1;
		this.game_state.players.push(new Player(player_id, "test"));
		// this.num_players += 1;
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
		this.game_state.current_player = (this.game_state.current_player + 1) % this.game_state.players.length;
	},

	get_gamestate : function() {
		return this.game_state;
	},
	
	handle_action : function(action) {
		//perform action
		if(action.type === "dice") {
			//
			this.roll_dice();
		}
		this.next_player();
		
	},
	roll_dice : function() {
		for (var i = 0; i < this.game_state.punts.length; i++) {
			var punt = this.game_state.punts[i];
			punt.position += (1 + Math.floor(Math.random() * 6));
		}
		
	},
	
	init : function() {
		this.game_state = new GameState();
		return this;
	}
	
}

module.exports = game_engine;
