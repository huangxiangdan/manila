var app = require('express').createServer();
var io = require('socket.io').listen(app);

var GameEngine = require("./engine");
require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.get('/*.(js|css)' , function(req, res) {
	res.sendfile("./public"+req.url);
})

app.get('/', function(req, res) {
	console.log("rendered index");
	res.render('index');
});

io.on("connection", function(client) {
	console.log("connection");
	var player_id = GameEngine.add_player();
	
	client.emit("assign_id", {id: player_id});
	
	io.sockets.emit('game_state', GameEngine.get_gamestate());
	client.on("disconnect", function() {
		GameEngine.remove_player(client);
	});
	client.on("action", function() {
		GameEngine.next_player();
		io.sockets.emit('game_state', GameEngine.get_gamestate());
	})
});

app.listen(3000);