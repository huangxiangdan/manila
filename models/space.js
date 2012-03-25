<<<<<<< HEAD
function Space(id, payment, earn){
=======
function Space(id, payment, earn, ware){
>>>>>>> 699ee7b0bcc55c1b27e89f0c337025ee0d8b5152
	this.id = id;
	this.payment = payment;
	this.earn = earn;
	this.owner = null;
	this.ware = ware;
};

module.exports = Space;