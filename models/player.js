function Player(id, name){
	this.name = name;
	this.id = id;
	this.tokens = [];
	this.shares = [];
	
	this.money = 30;
	this.roleId = 0; //0 for normal, 1 for harbor maste, 2 for bank
};

module.exports = Player;
