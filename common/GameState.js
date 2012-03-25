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
	this.spaces = [];
	this.punts = [];
	this.wares = [];
	this.dices = [];
	this.current_player_id = 0;
	this.captain_id = 0;
	this.phase = 0;
	this.acted_players = 0; //number of players who has acted in current phase
	this.init();
};

GameState.prototype.init = function(){
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

	var i=0;
	nutme_ware = new Ware(++i, "肉豆蔻", 24, nutme_spaces);
	silk_ware = new Ware(++i, "丝绸", 30, silk_spaces);
	ginseng_ware = new Ware(++i, "人参", 18, ginseng_spaces);
	jade_ware = new Ware(++i, "玉石", 36, jade_spaces);
	this.wares = [nutme_ware, silk_ware, ginseng_ware, jade_ware];

	this.shares = {"nutme" : 5, "ginseng" : 5, "silk" : 5, "jade" : 5}
	this.share_prices = {"nutme" : 5, "ginseng" : 5, "silk" : 5, "jade" : 5}
};

module.exports = GameState;
