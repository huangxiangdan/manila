exports.testSanity = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testAddPlayers = function(test){
	var engine = require("../engine").init();
	var state = engine.get_gamestate();
	test.equal(state.players.length, 0, "the game should start with 0 players");
	
	engine.add_player();
	engine.add_player();
	state = engine.get_gamestate();
    test.equal(state.players.length, 2, "the game should have 2 players");
	
	test.equal(0, state.current_player_id, "the first player goes first. " + engine.current_player_id);
    test.done();
};

exports.testDice = function(test){
	var engine = require("../engine").init();
	engine.add_player();
	engine.add_player();
	var state = engine.get_gamestate();
    test.equal(state.players.length, 2, "the game should have 2 players");

	for (var i = 0; i < state.punts.length; i++) {
		var punt = state.punts[i];
		test.equal(0, punt.position, "all ships start on zero");
	}
	
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

exports.testPlayers = function(test) {
	//create the engine
	var engine = require("../engine").init();
	engine.add_player();
	engine.add_player();
	engine.add_player();
	
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
	engine.add_player();
	engine.add_player();
	engine.add_player();
	
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
	engine.add_player();
	engine.add_player();
	engine.add_player();
	engine.get_gamestate().phase = phases[3];
	
	//have everyone place a dude
	var players = engine.get_gamestate().players;
	test.ok(engine.handle_action({type : "place", player_id: players[0].id, space_id:3}), "place 1");
	test.equal(phases[3], engine.get_gamestate().phase);
	test.ok(engine.handle_action({type : "place", player_id: players[0].id, space_id:4}), "place 2");
	test.equal(phases[3], engine.get_gamestate().phase);
	test.ok(engine.handle_action({type : "place", player_id: players[0].id, space_id:5}), "place 3");
	test.equal(phases[4], engine.get_gamestate().phase, "advance to next phase");
	
	//check that the turn has advanced
	//check that dice got rolled
	test.done();
}













