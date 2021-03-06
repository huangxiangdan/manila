var Punt = require('../models/punt.js');
var Space = require('../models/space.js');
var Ware = require('../models/ware.js');

var phases = [	"auction_phase",
				"buy_stock_phase",
				"choose_ships_phase",
				"first_choose_spaces_phase",
				"second_choose_spaces_phase",
				"third_choose_spaces_phase",
				"move_ship_phase", //+1, +2
				"game_over"
			];

function GameState(){
	this.players = [];
	this.shares = {};
	this.share_prices = {};
	this.init();
};

GameState.prototype.init = function(){
  this.current_player_id = 0;
	this.captain_id = 0;
	this.phase = 0;
	this.max_player_id = -1;
	this.acted_players = 0; //number of players who has acted in current phase
	this.auction_price = 0;
	this.last_captain = 0;
	this.auction_count = 3;
	this.auction_players = [];
	this.started = false;
	this.spaces = [];
	this.punts = [];
	this.wares = [];
	this.dices = [];

	for(var i=0; i<3; i++){
		this.punts.push(new Punt(i));
	}
	var i=-1;
	nutme_spaces = [new Space(++i, 2, 0, "nutme"), new Space(++i, 3, 0, "nutme"), new Space(++i, 4, 0, "nutme")]; // for nutme
	silk_spaces = [new Space(++i, 3, 0, "silk"), new Space(++i, 4, 0, "silk"), new Space(++i, 5, 0, "silk")]; // for silk
	ginseng_spaces = [new Space(++i, 1, 0, "ginseng"), new Space(++i, 2, 0, "ginseng"), new Space(++i, 3, 0, "ginseng")]; // for  ginseng
	jade_spaces = [new Space(++i, 3, 0, "jade"), new Space(++i, 4, 0, "jade"), new Space(++i, 4, 0, "jade"), new Space(++i, 5, 0, "jade")]; // for jade
	wharf_spaces = [new Space(++i, 4, 6), new Space(++i, 3, 8), new Space(++i, 2, 15)];
	shipyard_spaces = [new Space(++i, 4, 6), new Space(++i, 3, 8), new Space(++i, 2, 15)];
	insurance_spaces = [new Space(++i, -10, 0)];

	this.spaces = this.spaces.concat(nutme_spaces);
	this.spaces = this.spaces.concat(silk_spaces);
	this.spaces = this.spaces.concat(ginseng_spaces);
	this.spaces = this.spaces.concat(jade_spaces);
	this.spaces = this.spaces.concat(wharf_spaces);
	this.spaces = this.spaces.concat(shipyard_spaces);
	this.spaces = this.spaces.concat(insurance_spaces);

	var i=-1;
	nutme_ware = new Ware(++i, "nutme", "肉豆蔻", 24, nutme_spaces);
	silk_ware = new Ware(++i, "silk", "丝绸", 30, silk_spaces);
	ginseng_ware = new Ware(++i, "ginseng", "人参", 18, ginseng_spaces);
	jade_ware = new Ware(++i, "jade", "玉石", 36, jade_spaces);
	this.wares = [nutme_ware, silk_ware, ginseng_ware, jade_ware];

	this.shares = {"nutme" : 5, "ginseng" : 5, "silk" : 5, "jade" : 5}
	this.share_prices = {"nutme" : 0, "ginseng" : 0, "silk" : 0, "jade" : 0}
	this.shares_array = this.get_shares_array();
};

GameState.prototype.get_shares_array = function(){
  var shares_ary = [];
  for(var share in this.shares){
    for(var i=0; i<this.shares[share]; i++){
      shares_ary.push(share);
    }
  }
  return shares_ary;
}

module.exports = GameState;
