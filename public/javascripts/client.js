function update(game_state) {
	window.game_state = game_state;
	
	$("#players").html($.toJSON(game_state.players));
	$("#phase").html(game_state.phase);
	$("#spaces").html($.toJSON(game_state.spaces));
	$num_players.html(game_state.players.length);
	$current_player.html(game_state.current_player_id);
	// $ships.html($.toJSON(game_state.punts));
}

function getPuntBySpaceId(spaceId){
	var wareId = -1;
	for(var i=0; i<game_state.wares.length; i++){
		var ware = game_state.wares[i];
		// console.log(ware);
		for(var j=0; j<ware.spaces.length; j++){
			if(ware.spaces[j].id == spaceId){
				wareId = ware.id;
			}
		}
	}
	for(var i=0; i<game_state.punts.length; i++){
		// console.log(game_state.punts[i].ware.id);
		if(game_state.punts[i].ware && game_state.punts[i].ware.id == wareId){
			return game_state.punts[i].id;
		}
	}
	// console.log(spaceId);
	return -1;
}

imageCache=loadImage(IMAGE_LIST, init);
var game_state;

function init(){
	// engine = new Game();
	// 
	// var sound=new Sound('bg_music');
	// sound.play();
	mapView = new MapView(mapData,1000,1500,SCALE,240,0,imageCache['map'],imageCache['bg']);
	mapView.draw();	

	if(game_state){
		draw_game_state(game_state);
	}
	$(window).bind("click,dblclick", function(evt) {
		evt.preventDefault();
	});
	
	bindSocket();
}

function draw_game_state(game_state){
	window.puntView = new PuntView(mapView, imageCache['punt']);
	window.spaceView = new SpaceView(null);
	for(var i=0; i<game_state.punts.length; i++){
		var punt = game_state.punts[i];
		// console.log(punt.id);
		puntView.add(punt.id, 0);
	}
	for(var i=3; i<game_state.spaces.length; i++){
		var space = game_state.spaces[i];
		// console.log(space.id);
		position = {"x":spaceData[space.id][0], "y":spaceData[space.id][1]};
		var puntId = getPuntBySpaceId(space.id);
		// console.log(puntId);
		spaceView.add(space.id, position, puntId);
	}
}

function fillSpace(spaceId){
	socket.emit("action", {type : "place", player_id: my_id, space_id:spaceId});
	console.log(spaceId);
}

function bindSocket(){
	$num_players = $("#num_players")
	$current_player = $("#current_player")
	$my_id = $("#my_id")

	socket = io.connect('http://localhost:3000');

	socket.on("game_state", function(game_state) {
		// console.log(game_state);
		update(game_state);
	});
	
	socket.on("assign_id", function(data) {
		// console.log(data);
		my_id = data.id;
		window.game_state = data.game_state;
		if(game_state){
			draw_game_state(game_state);
		}
		$my_id.html(data.id);
	});
	
	$("#act").click(function(e) {
		console.log("act");
		socket.emit("action", 1);
		e.preventDefault();
		
	});
}