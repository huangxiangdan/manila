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