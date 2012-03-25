var app = require('express').createServer();
var socket = require('socket.io').listen(app);

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

socket.on("connection", function(client) {
	console.log("connection");
	GameEngine.add_player();
	socket.sockets.emit('game_state', GameEngine.get_gamestate());
	client.on("disconnect", function() {
		GameEngine.remove_player(client);
	});
});

app.listen(3000);