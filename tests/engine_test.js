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
	engine.handle_action(action);
	spaces = engine.get_gamestate().spaces;
	players = engine.get_gamestate().players;
	
	test.equal(20, spaces.length, "there should still be 20 spaces total");
	
	test.equal(players[0].id, spaces[3].owner, "player 1 should own the space now");
	test.equal(27, players[0].money, "player 1 should have paid for the space");
	
	test.equal(1, engine.get_gamestate().current_player_id, "current player cursor should move");
	
	test.done();
}