function Player(id, name){
	this.id = id;
	this.name = name;

	this.tokens = [];
	this.shares = {"nutme" : 0, "ginseng" : 0, "silk" : 0, "jade" : 0};
	
	this.money = 30;
	this.roleId = 0; //0 for normal, 1 for harbor maste, 2 for bank
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

module.exports = Player;
