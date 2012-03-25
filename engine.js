var GameState = require('./common/GameState.js');
var Player = require('./models/player.js');
//the game engine
var game_engine = {
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
		if(action.type == "dice") {
			//
			this.roll_dice();
		}else if(action == 2){
			this.auction_init();
		}else if(action == 3){
				this.auction_confirm();
		}else if(action == 4){
			this.auction_drop();
		}
		this.next_player();
		
	},
	roll_dice : function() {
		
	},
	
	auction_init : function(){
		var auction_num_players = this.game_state.players.length;
		var current_captain = this.last_captain;
	}
	
	auction_confirm : function() {
		if(this.game_state.current_player.money >= current_price
		&& this.game_state.current_player.auctionstate == 1
		&& this.auction_num_players != 1
		&& this.bidding > this.current_price){
			this.current_price = this.bidding;
			this.current_captain = this.current_player.id;
		}
		else{
			this.auction_drop();
		}
		

	}
	
	auction_drop : function(){
		this.auction_num_players = this.num_players-1;
		// 改变该玩家的竞选状态，使之不能参加下次竞选
		this.game_state.current_player.auctionstate = 0;
		if(this.auction_num_players == 1)
		{
			this.end_price = this.current_price;
			this.captain = this.current_captain;
			break;
		}
	}
}

module.exports = game_engine;
