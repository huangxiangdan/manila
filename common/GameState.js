var Punt = require('../models/punt.js');
var Share = require('../models/share.js');
var Space = require('../models/space.js');
var Ware = require('../models/ware.js');

var phases = [	"auction_phase",
				"buy_stock_phase",
				"choose_ships_phase",
				"first_choose_spaces_phase",
				"second_choose_spaces_phase",
				"third_choose_spaces_phase",
				"move_ship_phase" //+1, +2
			];

function GameState(){
	this.players = [];
	this.shares = [];
	this.spaces = [];
	this.punts = [];
	this.wares = [];
	this.dices = [];
	this.current_player_id = 0;
	this.phase = phases[0];
	this.acted_players = 0; //number of players who has acted in current phase
	this.init();
};

GameState.prototype.init = function(){
	for(var i=0; i<3; i++){
		this.punts.push(new Punt(i+1));
	}
	var i=0;
	nutme_spaces = [new Space(++i, 2, 0), new Space(++i, 3, 0), new Space(++i, 4, 0)]; // for nutme
	silk_spaces = [new Space(++i, 3, 0), new Space(++i, 4, 0), new Space(++i, 5, 0)]; // for silk
	ginseng_spaces = [new Space(++i, 1, 0), new Space(++i, 2, 0), new Space(++i, 3, 0)]; // for  ginseng
	jade_spaces = [new Space(++i, 3, 0), new Space(++i, 4, 0), new Space(++i, 4, 0), new Space(++i, 5, 0)]; // for jade
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

	var i=0;
	for(var k=0; k<this.wares.length; k++){
		for(var j=0; j<5; j++){
			this.shares.push(new Share(++i, this.wares[k]));		
		}
	}
};

module.exports = GameState;
