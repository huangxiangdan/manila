var app = require('express').createServer();
var io = require('socket.io').listen(app);
require('./common/utils');

var GameEngine = require("./engine");
require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.get('/common/*.(js|css|jpg|png)' , function(req, res) {
	res.sendfile("."+req.url);
});


app.get('/*.(js|css|jpg|png)' , function(req, res) {
	res.sendfile("./public"+req.url);
});

app.get('/', function(req, res) {
	console.log("rendered index");
	res.render('index');
});
GameEngine.start();

io.on("connection", function(client) {
	console.log("connection");
	var player_id = GameEngine.add_player(client);
	game_state = GameEngine.get_gamestate();
	
	client.emit("assign_id", {id: player_id, game_state:GameEngine.get_gamestate()});
	io.sockets.emit('game_state', GameEngine.get_gamestate());
	
	client.on("disconnect", function() {
		GameEngine.remove_player(client);
	});
	
	client.on("action", function(action) {
		console.log("action:"+action);
		GameEngine.handle_action(action);
		io.sockets.emit('game_state', GameEngine.get_gamestate());
	})
});

app.listen(3000);