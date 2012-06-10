var total = function(obj){
  var length = 0;
  for(var proto in obj){
    if(!(obj[proto] instanceof Function)){
      length += obj[proto];
    }
  }
  return length;
};

exports.testCaptainAuction = function(test) {
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	test.equal(engine.get_gamestate().auction_price, 0, "the auction should start with auction price 0");
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	var client4 = {id:4};
	engine.add_player(client1);
	engine.add_player(client1);
	engine.add_player(client1);
	engine.add_player(client1);
	state = engine.get_gamestate();
	test.equal(state.players.length, 4, "the game shoule have 4 players");
	test.equal(0, state.current_player_id, "the first player goes first." + state.current_player);
	
	engine.start_auction();
	
	state.players[0].money = 40;
	state.players[1].money = 40;
	state.players[2].money = 40;
	state.players[3].money = 40;
				
	action = {type : "auction", player_id: 0, add_price: 2}
	engine.handle_action(action)
	action = {type : "auction_drop", player_id: 1}
	engine.handle_action(action)
	action = {type : "auction", player_id: 2, add_price: 2}
	engine.handle_action(action)
	action = {type : "auction_drop", player_id: 3}
	engine.handle_action(action)
  // console.log(state.current_player_id);
	test.equal(0, state.current_player_id, "player 1 should be current_player_id");
	
  action = {type : "auction", player_id: 0, add_price: 2}
  engine.handle_action(action)
  action = {type : "auction_drop", player_id: 2}
  engine.handle_action(action)
  
  engine.auction_result();
  
  test.equal(1, state.players[0].roleId, "player 3 should be caption");
  test.equal(0, state.last_captain, "last_captain should be player 3");
  test.equal(6, state.auction_price, "auction_price should be 6");

	test.done();
}

exports.testCaptainAuctionDrop = function(test) {
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	test.equal(engine.get_gamestate().auction_price, 0, "the auction should start with auction price 0");
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	var client4 = {id:4};
	engine.add_player(client1);
	engine.add_player(client1);
	engine.add_player(client1);
	engine.add_player(client1);
	state = engine.get_gamestate();
	test.equal(state.players.length, 4, "the game shoule have 4 players");
	test.equal(0, state.current_player_id, "the first player goes first." + state.current_player);
	
	engine.start_auction();
	
	action = {type : "auction_drop", player_id: 0}
	engine.handle_action(action)
	action = {type : "auction_drop", player_id: 1}
	engine.handle_action(action)
	action = {type : "auction_drop", player_id: 2}
	engine.handle_action(action)
	action = {type : "auction_drop", player_id: 3}
	engine.handle_action(action)

	engine.auction_result();
	
	test.equal(1, state.players[0].roleId, "player 1 should be caption");
	
	test.done();
}

exports.testAddPlayers = function(test){
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	test.equal(state.players.length, 0, "the game should start with 0 players");
	var client1 = {id:1};
	var client2 = {id:2};
	engine.add_player(client1);
	engine.add_player(client2);
	state = engine.get_gamestate();
    test.equal(state.players.length, 2, "the game should have 2 players");
	
	test.equal(0, state.current_player_id, "the first player goes first. " + engine.current_player_id);
    test.done();
};

exports.testStartNewAuctionPhase = function(test){
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	test.equal(state.players.length, 0, "the game should start with 0 players");
	var client1 = {id:1};
	var client2 = {id:2};
	engine.add_player(client1);
	engine.add_player(client2);
	state = engine.get_gamestate();
	state.phase = -1;
	test.equal(-1, state.phase, "the phase should be ready phase_1")
	action = {type : "ready", player_id: 0}
	engine.handle_action(action)
	
	test.equal(-1, state.phase, "the phase should be ready phase_2")
	
	action = {type : "ready", player_id: 1}
	engine.handle_action(action)
	
	test.equal(0, state.phase, "the phase should be auction phase")
  test.done();
};

exports.testPunts = function(test) {
	var engine = require("../engine").init();
	var punts = engine.get_gamestate().punts;
	test.equal(3, punts.length);
	for(var i = 0; i< punts.length; i++) {
		var punt = punts[i];
		test.equal(i, punt.id, "ships should have advancing ids");
		test.ok(punt.ware === null, "ships start out with no wares");
		test.equal(0, punt.position, "all ships start on zero");
	}
	
	test.done();
}

exports.testChooseShare = function(test) {
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	var client4 = {id:4};
	engine.add_player(client1);
	engine.add_player(client2);

	engine.start();

	test.equal(2, total(state.players[0].shares), "everyone should get 2 shares.");
	test.equal(2, total(state.players[1].shares), "everyone should get 2 shares.");
	
  state.players[0].roleId = 1;
	var action = {type : "choose_share", player_id: 1, share: "silk"};
	test.ok(!engine.handle_action(action), "choose share action should not succeed");

	var action = {type : "choose_share", player_id: 0, share: "silk"};
	test.ok(engine.handle_action(action), "choose share action should succeed");
	
	console.log(state.shares.length);
	
	test.equal(15, total(state.shares), "shares should be 11");
	test.equal(15, state.shares_array.length, "shares_array should be 11");
	test.done();
}

exports.chooseWare = function(test) {
	var engine = require("../engine").init();

	//choose ware
	var action = {type : "choose_ware", player_id: 0, first_ware: "jade", second_ware: "silk", third_ware: "ginseng"}
	test.ok(engine.handle_action(action), "choose ware action should succeed");
	
	var ships = engine.get_gamestate().punts;
	test.equal(3, ships.length);
	test.equal("jade", ships[0].ware, "first ship should have jade");
	test.equal("silk", ships[1].ware, "second ship should have silk");
	test.equal("ginseng", ships[2].ware, "third ship should have ginseng");

	test.done();	
}


exports.testDice = function(test){
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	engine.add_player(client1);
	engine.add_player(client2);
	var state = engine.get_gamestate();
    test.equal(state.players.length, 2, "the game should have 2 players");
	
	var action = {type : "dice"}
	engine.handle_action(action);
	
	var state = engine.get_gamestate();
	
	for (var i = 0; i < state.punts.length; i++) {
		var punt = state.punts[i];
		test.ok(punt.position > 0, "all ships moved at least one square");
		test.ok(punt.position < 7, "no ship moved more than 6 squares");
	}
	
    test.done();
};

exports.testInitPunts = function(test) {
	//create the engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	
	var players = engine.get_gamestate().players;
	test.equal(3, players.length, "there should be 3 players")
	
	var action = {type : "init_punts", position:[0,1,1], wares:[1,2,3]};
	test.ok(!engine.handle_action(action), "sum of position should be 9");
	
	var action = {type : "init_punts", position:[1,4,4], wares:[1,2,3]};
	test.ok(engine.handle_action(action), "sum of position should be 9");
  test.equal(1, engine.get_gamestate().punts[0].position, "punt 1 should be postion 1");
  test.equal(4, engine.get_gamestate().punts[1].position, "punt 2 should be postion 4");
  
	var action = {type : "init_punts", position:[8,0,1], wares:[1,2,3]};
	test.ok(!engine.handle_action(action), "none of punt would > 5");
	
	test.done();
}

exports.testPlayers = function(test) {
	//create the engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	
	var players = engine.get_gamestate().players;
	test.equal(3, players.length, "there should be 3 players")
	
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
		test.equal(i, player.id, "player should have increasing ids");
		test.equal(30, player.money, "player should start with 30 bucks");
	}
	
	test.done();
}

exports.testSpaces = function(test) {
	//create the engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	
	engine.get_gamestate().phase = 3;
	//test initial spaces
	var spaces = engine.get_gamestate().spaces;
	var players = engine.get_gamestate().players;
	test.equal(20, spaces.length, "there should be 20 spaces total")
	
	for (var i = 0; i < spaces.length; i++) {
		var space = spaces[i];
		test.ok(!space.owner, "all spaces are not owned initially");
	}
	
	//place a guy on top of a space
	var action = {type : "place", player_id: players[0].id, space_id:3}
	var result = engine.handle_action(action);
	
	test.ok(result, "first placement should succeed");
	spaces = engine.get_gamestate().spaces;
	players = engine.get_gamestate().players;
	
	test.equal(20, spaces.length, "there should still be 20 spaces total");
	
	test.equal(players[0].id, spaces[3].owner, "player 1 should own the space now");
	test.equal(27, players[0].money, "player 1 should have paid for the space");
	
	test.equal(1, engine.get_gamestate().current_player_id, "current player cursor should move");
	
	action = {type : "place", player_id: players[1].id, space_id:3}
	test.ok(!engine.handle_action(action), "can't place on same square");
	
	//test guy with no money
	players[1].money = 2;
	action = {type : "place", player_id: players[1].id, space_id:13}
	test.ok(!engine.handle_action(action), "can't place on spaces you cannot afford. money=" + players[1].money + " , cost=" + spaces[13].payment);
	
	action = {type : "place", player_id: players[1].id, space_id:15}
	test.ok(engine.handle_action(action), "can afford this cheap one. money=" + players[1].money + " , cost=" + spaces[15].payment);
	
	test.done();
}

exports.testAdvancePhase = function(test) {
	//create engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	engine.get_gamestate().phase = 5;
	
	//have everyone place a dude
	var players = engine.get_gamestate().players;
	test.ok(engine.handle_action({type : "place", player_id: players[0].id, space_id:3}), "place 1");
	test.equal(5, engine.get_gamestate().phase);
	test.ok(engine.handle_action({type : "place", player_id: players[1].id, space_id:4}), "place 2");
	test.equal(5, engine.get_gamestate().phase);
	test.ok(engine.handle_action({type : "place", player_id: players[2].id, space_id:5}), "place 3");
	test.equal(-1, engine.get_gamestate().phase, "advance to ready phase");
	
	test.equal(0, engine.get_punt_count(1), "place punt");
	test.equal(3, engine.get_punt_count(2)+engine.get_punt_count(3), "place punt");
	
	//check that the turn has advanced
	//check that dice got rolled
	test.done();
}


exports.computeRoundResult = function(test) {
	//create engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	var state = engine.get_gamestate();
	var players = engine.get_gamestate().players;
	
	//give players some shares
	players[1].shares["jade"] = 2
	
	//set up some positions
	var spaces = engine.get_gamestate().spaces
	spaces[0].owner = 1;
	spaces[3].owner = 1;
	spaces[4].owner = 2;	
	spaces[13].owner = 1;
	spaces[14].owner = 2;

	//setup ship
	var punts = engine.get_gamestate().punts
	punts[0].ware = state.wares[1]; //silk
	punts[0].position = 16;
	punts[1].ware = state.wares[0]; //nutme
	punts[1].position = 12;
	punts[2].ware = state.wares[3]; //jade
	punts[2].position = 18;
	
	//set some share prices
	engine.get_gamestate().share_prices["jade"] = 20;
	
	//call compute round
	engine.compute_round_score();
	
	//check the following conditions:
	//player 1 and 2 gets to split silk's 30(+ 15 each)
	//player 1 gets 4 points for a ship crossing and player 2 gets +6 points for 2 ships crossing
	

	//everyone's money is updated
	test.equal(51, players[1].money, "player 1 loot")
	test.equal(53, players[2].money, "player 2 loot")
  console.log(players[1].total_score(engine.get_gamestate()));
	//compute final score
	test.equal(91, players[1].total_score(engine.get_gamestate()), "player 1's score including stocks")
	
	test.done();
}

exports.findoutWinner = function(test) {
	//create engine
	var engine = require("../engine").init();
	var client1 = {id:1};
	var client2 = {id:2};
	var client3 = {id:3};
	engine.add_player(client1);
	engine.add_player(client2);
	engine.add_player(client3);
	var state = engine.get_gamestate();
	var players = engine.get_gamestate().players;
	players[0].money = 100;
	players[1].money = 10;
	engine.find_out_winner();
	test.equal(players[0].name, state.winner.name, "wrong winner");
	test.done();
}








