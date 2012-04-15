function update(game_state) {
	window.game_state = game_state;
	
	$("#players").html($.toJSON(game_state.players));
	$("#phase").html(game_state.phase);
	$("#spaces").html($.toJSON(game_state.spaces));
	$("#punts").html($.toJSON(game_state.punts));
	$num_players.html(game_state.players.length);
	$('#player').html('我的ID:'+ my_id);
	$('#current_player').html('当前行动ID:'+ game_state.current_player_id);
	$('#role').html("角色:"+game_state.players[my_id].roleId);
	$('#captain').html("船长:"+game_state.captain_id);
	$('#auction_price').html("当前最高价："+game_state.auction_price);
	$('#state').html("游戏状态："+(game_state.started ? "已开始": "未开始"));
	$('#phase').html("当前轮次:"+game_state.phase);
	if(game_state.punts[0].ware){
	  $('#punts').html("平地船的货物:"+  game_state.punts[0].ware.name + " " + game_state.punts[1].ware.name + " " + game_state.punts[2].ware.name + " ");
	}else{
	  $('#punts').html("没有货物");
	}
	movePunts();
	
	// $ships.html($.toJSON(game_state.punts));
}

function movePunts(){
	for(var i=0; i<game_state.punts.length; i++){
		// console.log(game_state.punts[i].ware.id);
		var punt = game_state.punts[i];
		if(punt.state != 1){
		  console.log("punt_id:"+punt.id);
		  puntView.place(punt.id, punt.state, punt.order);
		}else{
		  puntView.moveTo(punt.id, punt.position);
		}
	}
}

function getPuntBySpaceId(space){
	for(var i=0; i<game_state.punts.length; i++){
		// console.log(game_state.punts[i].ware.id);
		if(game_state.punts[i].ware && game_state.punts[i].ware.name == space.ware){
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
		game_init(game_state);
	}
	$(window).bind("click,dblclick", function(evt) {
		evt.preventDefault();
	});
	
	bindSocket();
}

function game_init(game_state){
  $("#palyers_panel").empty();
	window.puntView = new PuntView(mapView, imageCache['punt']);
	window.spaceView = new SpaceView(null);
	for(var i=0; i<game_state.punts.length; i++){
		var punt = game_state.punts[i];
		puntView.add(punt.id, punt.position);
	}
	for(var i=0; i<game_state.spaces.length; i++){
		var space = game_state.spaces[i];
		// console.log(space.id);
		position = {"x":spaceData[space.id][0], "y":spaceData[space.id][1]};
		if(space.ware == null){
		  spaceView.add(space.id, position, -1);
		}
	}
}

function game_start(game_state){
  window.game_state = game_state;
  for(var i=0; i<game_state.punts.length; i++){
		var punt = game_state.punts[i];
		puntView.loadWare(punt.id, punt.ware);
	}
	for(var i=0; i<game_state.spaces.length; i++){
		var space = game_state.spaces[i];
		// console.log(space.id);
		position = {"x":spaceData[space.id][0], "y":spaceData[space.id][1]};
		if(space.ware != null){
		  var puntId = getPuntBySpaceId(space);
  		if(puntId > -1){
  		  spaceView.add(space.id, position, puntId);
  	  }
		}
	}
}

function fillSpace(spaceId){
	send_action({type : "place", player_id: my_id, space_id:spaceId});
	console.log(spaceId);
}

function auction(addPrice){
	send_action({type : "auction", player_id: my_id, add_price:addPrice});
}

function auction_drop(){
	send_action({type : "auction_drop", player_id: my_id});
}

function send_action(action){
  if(my_id != game_state.current_player_id){
    alert("现在还没有轮到你，请耐心等候!");
  }else{
    socket.emit("action", action);
  }
}

function start_game(){
  socket.emit("start");
}

function add_player(id){
  $("#palyers_panel").append('<div class="player player'+id+'">玩家'+id+'</id>');
}

function remove_player(id){
  $("#palyers_panel").remove('.player'+id);
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
		  game_init(game_state);
		  if(game_state.started){
		    game_start(game_state);
		  }
			for(i=0; i<data.game_state.players.length; i++){
  		  add_player(data.game_state.players[i].id);
  	  }
		}
	});
	
	socket.on("new_player", function(data) {
		// console.log(data);
    // add_player(data.id);
    if(my_id != data.id){
      add_player(data.id);
    }
	});
	
	socket.on("remove_player", function(data) {
		// console.log(data);
		remove_player(data.id);
	});
	
	socket.on("start", function(data) {
		// console.log(data);
		game_start(data);
		update(data);
		$("#start_panel").hide();
    $("#auction_panel").show();
	});
}