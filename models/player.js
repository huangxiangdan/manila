function Player(id, name){
	this.id = id;
	this.name = name;

	this.tokens = [];
	this.shares = {"nutme" : 0, "ginseng" : 0, "silk" : 0, "jade" : 0};
	
	this.money = 30;
	this.roleId = 0; //0 for normal, 1 for harbor maste, 2 for bank
};

module.exports = Player;
