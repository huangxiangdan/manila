var app = require('express').createServer();
var socket = require('socket.io').listen(app);


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


var activeClients = 0;

socket.on("connection", function(client) {
	console.log("connection");
	activeClients +=1;
	socket.sockets.emit('news', {clients:activeClients});
	client.on("disconnect", function() {
		clientDisconnect(client);
	});
});

function clientDisconnect(client) {
	activeClients -=1;
	client.emit({clients:activeClients});
}

app.listen(3000);