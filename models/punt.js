function Punt(id){
	this.id = id;
	this.position = 0;
	this.state = 1; //1 for on water, 2 for wharf , 3 for shipyard
	this.order = 0;
	this.ware = null;
};

module.exports = Punt;
