function Space(id, payment, earn, ware){
	this.id = id;
	this.payment = payment;
	this.earn = earn;
	this.owner = null;
	this.ware = ware;
};

module.exports = Space;