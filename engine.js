var GameState = require('./common/GameState.js');
var Player = require('./models/player.js');
//the game engine
var game_engine = {
	game_state : new GameState(),

	add_player : function() {
		var player_id = this.game_state.players.length;
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
		this.game_state.current_player_id = (this.game_state.current_player_id + 1) % this.game_state.players.length;
	},

	get_gamestate : function() {
		return this.game_state;
	},
	
	handle_action : function(action) {
		//perform action
		if(action.type === "dice") {
			this.roll_dice();
			return true;
		} else if (action.type == "place") {
			return this.place_dude(action);
		}
		return false;
	},
	
	roll_dice : function() {
		for (var i = 0; i < this.game_state.punts.length; i++) {
			var punt = this.game_state.punts[i];
			punt.position += (1 + Math.floor(Math.random() * 6));
		}
	},
	
	place_dude : function(action) {
		//assert it is the current player
		if(!this.is_correct_player(action)) {
			return false;
		}
		//assert it is the correct turn
		
		var space = this.game_state.spaces[action.space_id];
		var player = this.game_state.players[action.player_id];
				
		//can't place on owned square
		if(space.owner != null) {
			return false;
		}
		
		//check that you can afford it
		if(space.payment > player.money) {
			return false;
		}
		
		space.owner = action.player_id;

		player.money -= space.payment;
		this.next_player();
		return true;
	},
	
	is_correct_player : function(action) {
		return action.player_id === this.game_state.current_player_id
	},
	
	init : function() {
		this.game_state = new GameState();
		return this;
	}
	
}

module.exports = game_engine;
