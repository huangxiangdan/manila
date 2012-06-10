function Player(id, clientId, name){
	this.id = id;
	this.name = name;
	this.init();
	this.clientId = clientId;
	this.init();
};

Player.prototype.total_score = function(game_state) {
	//compute price of shares
	var share_prices = game_state.share_prices;
	var sum = 0;
	for(var share_name in this.shares) {
		sum += (share_prices[share_name] * this.shares[share_name])
	}
	return this.money + sum;
}

Player.prototype.init = function(){
  this.tokens = [];
	this.shares = {"nutme" : 0, "ginseng" : 0, "silk" : 0, "jade" : 0};
	this.auction_state = true;
	this.money = 30;
	this.roleId = 0; //0 for normal, 1 for harbor maste, 2 for bank
}

module.exports = Player;
