var GameState = require('./common/GameState.js');
var Player = require('./models/player.js');
//the game engine
var game_engine = {
	game_state : new GameState(),
	
	start : function(){
		for(var i=0; i<this.game_state.punts.length; i++){
			this.game_state.punts[i].ware = this.game_state.wares[i+1];
		}
		this.game_state.phase = 3;
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
	
	get_punt_count:function(state){
	  var count = 0;
	  for (var i = 0; i < this.game_state.punts.length; i++) {
	    var punt = this.game_state.punts[i];
	    if(punt.state == state){
	      count++;
	    }
	  }
	  return count;
	},
	
	place_fail_punt:function(){
	  var count = 0;
	  for (var i = 0; i < this.game_state.punts.length; i++) {
	    var punt = this.game_state.punts[i];
	    console.log("punt state:"+punt.state);
	    if(punt.state == 1){
	      punt.state = 3;
			  punt.order = count;
			  count++;
	    }
	  }
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
		} else if (action.type === "auction") {
			return this.auction(this.add_price);
		} else if (action.type === "auction_drop") {
			return this.auction_drop();
		}
		return false;
	},
	
	auction : function(add_price) {
		add_price = 1;
		if (add_price < 1) {
			return false;
		}
		
		this.game_state.auction_price += add_price;	// add_price是在当前竞价上增加的值

		this.game_state.anyone_auction = true;
		var player_id = this.game_state.current_player_id;
		this.game_state.last_captain = player_id;
		this.auction_init();
		this.auction_result();
		this.next_player();
		return true;
	},
	
	auction_drop : function() {
		var player = this.game_state.players[this.game_state.current_player_id];
		player.auction_state = false;	// 将当前player的竞选状态置为false，使之不能参加下次竞选
		this.game_state.auction_count -= 1;	// 竞价人数减1
		this.auction_result();
		this.next_player();
		return true;
	},
	
	auction_init : function() {
		if(this.game_state.last_captain == null) {
			this.game_state.last_captain = this.game_state.players[0].id;	
		}
		this.game_state.auction_count = this.game_state.players.length;	// 竞价人数初始化为当前玩家的总数

		for (var i = 0; i < this.game_state.players.length; i++) {
			var player = this.game_state.players[i];
			var share_count = player.shares["nutme"] + player.shares["ginseng"] + player.shares["silk"] + player.shares["jade"];
			 // || player.connect_statue == false 
			if ( (player.money + share_count*12) <= this.game_state.auction_price
					|| player.auction_state == false ) {
				player.auction_statue = false;
				this.game_state.auction_count -= 1;
			}
			else {
				player.auction_state = true;
			}
		}
	},
	
	auction_result : function() {
		console.log("last_captain:"+this.game_state.last_captain);
		if (this.game_state.auction_count == 1
			&& this.game_state.anyone_auction) {
			this.game_state.players[this.game_state.last_captain].roleId = 1;

			return true;
		}
		else if (this.game_state.auction_count == 0) {
			this.game_state.players[this.game_state.last_captain].roleId = 1;
			return true;
		}
		else {
			return false;
		}
	},
	
	roll_dice : function() {
		for (var i = 0; i < this.game_state.punts.length; i++) {
			var punt = this.game_state.punts[i];
			punt.position += (1 + Math.floor(Math.random() * 6));
			if(punt.position > 13 && punt.state == 1){
			  punt.order = this.get_punt_count(2);
  			punt.state = 2;
			}
		}
	},
	
	place_dude : function(action) {
		//assert it is the current player
		console.log("place");
		if(!this.is_correct_player(action)) {
		  console.log("not is_correct_player");
			return false;
		}
		//assert it is the correct turn
		
		var space = this.game_state.spaces[action.space_id];
		var player = this.game_state.players[action.player_id];
				
		//can't place on owned square
		if(space.owner != null) {
		  console.log("has owner");
			return false;
		}
		
		//check that you can afford it
		if(space.payment > player.money) {
		  console.log("invalid money");
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
    			this.place_fail_punt();
					this.compute_round_score();
					if(this.end_conditions_met()) {
						this.game_state.phase = 7; //game over
					} else {
						this.game_state.phase = 3;
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
	},
	
}

module.exports = game_engine;
