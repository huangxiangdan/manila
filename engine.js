var GameState = require('./common/GameState.js');
var Player = require('./models/player.js');
//the game engine
var game_engine = {
	game_state : new GameState(),
	
	start : function(){
		for(var i=0; i<this.game_state.punts.length; i++){
			this.game_state.punts[i].ware = this.game_state.wares[i+1];
		}
	},

	add_player : function(client) {
		var player_id = this.game_state.players.length;
		console.log("clientId:"+client.id);
		this.game_state.players.push(new Player(player_id, client.id, "test"));
		console.log("clientId2:"+this.game_state.players[0].clientId);
		// this.num_players += 1;
		return player_id;
	},

	remove_player : function(client) {
		console.log("removing " + client);
		var selected;
		for(var i=0; i< this.game_state.players.length; i++){
			var player = this.game_state.players[i];
			if(player.clientId == client.id){
				selected = player;
			}
		}
		this.game_state.players.remove(selected);
	},

	next_player : function() {
		if (this.num_players == 0) {
			return 0;
		}
		this.game_state.acted_players += 1;
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
		} else if (action.type === "place") {
			return this.place_dude(action);
		} else if (action.type === "choose_ware") {
			return this.choose_ware(action);
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
		this.advance_phase();
	
		return true;
	},
	
	choose_ware : function(action) {
		var ships = this.game_state.punts;
		ships[0].ware = action.first_ware;
		ships[1].ware = action.second_ware;
		ships[2].ware = action.third_ware;
		return true;
	},
	
	is_correct_player : function(action) {
		return action.player_id === this.game_state.current_player_id
	},
	
	init : function() {
		this.game_state = new GameState();
		return this;
	},
	
	advance_phase : function() {
		var end_of_placement = function(engine) {
			engine.game_state.acted_players = 0;
			engine.game_state.current_player_id = engine.game_state.captain_id;
			engine.roll_dice();
		}
		switch(this.game_state.phase) {
			case 3: {
				//check phase
				if(this.game_state.acted_players == this.game_state.players.length) {
					end_of_placement(this);
					this.game_state.phase += 1;
				}
				break;
			}
			case 4: {
				//check phase
				if(this.game_state.acted_players == this.game_state.players.length) {
					end_of_placement(this);
					this.game_state.phase += 1;
				}
				break;
			}
			
			case 5: {
				//check phase
				if(this.game_state.acted_players == this.game_state.players.length) {
					end_of_placement(this);
					this.compute_round_result();
					if(this.end_conditions_met()) {
						this.game_state.phase = 7; //game over
					} else {
						engine.game_state.phase = 3;
					}
				}
				break;
			}
		}
		
	},
	
	end_conditions_met : function() {
		for(var share_name in this.game_state.share_prices) {
			if (this.game_state.share_prices[share_name] >= 30) {
				return true;
			}
		}
		return false;
	},
	
	compute_round_score : function() {
		//tally up the score
		var ships_crossed = 0;
		var ships = this.game_state.punts;
		var players = this.game_state.players;
		for(var i = 0; i < ships.length; i++) {
			var ship = ships[i];
			if(ship.position > 13) {
				console.log("crossed:" + ship.ware)
				ships_crossed += 1;
				
				var spaces = this.spaces_with_ware(ship.ware, true);
				console.log("spaces with " + ship.ware + ":" + spaces.length);
				var loot = spaces.length === 0 ? 0 : this.value_of_ware(ship.ware) / spaces.length;
				for(var j = 0; j < spaces.length; j++) {
					var space = spaces[j];
					players[space.owner].money += loot;
				}
				
			}
			
		}
		
		//now assign the rest of spaces
		var spaces = this.game_state.spaces;
		for(var i = 13; i < spaces.length; i++) {
			var space = spaces[i];
			if(space.owner !== null) {
				players[space.owner].money += space.earn;
			}
		}		
	},
	
	spaces_with_ware : function(ware, skip_empty) {
		var spaces = this.game_state.spaces;
		var ret = [];
		for(var i = 0; i < spaces.length; i++) {
			var space = spaces[i];			
			if(skip_empty && space.owner === null) {
				continue;
			}

			if(space.ware === ware) {
				ret.push(space);
			}
		}
		return ret;
	},
	
	value_of_ware : function(ware) {
		if(ware === "silk") {
			return 36;
		} else {
			return 18;
		}
	}
	
}

module.exports = game_engine;
