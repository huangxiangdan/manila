function PuntBase(puntId, image, container){
	
	//基本属性
	this.type = 'punt';
	this.image = image;
	this.container = container;
	this.id = puntId;
	
	this.scale = SCALE;
	
	// console.log(this.container);
		
	this._init();
}

PuntBase.prototype._init = function(position){

	var _width = 116 * this.scale;
	var _height = 245 * this.scale;
	
	this.offsetX = 20;
	this.offsetY = 20;
	
	this.blockImage = $('<div class="punt'+this.id+'"><canvas width="' + _width + '" height="' + _height + '"></canvas></punt>').appendTo(this.container);
	
	/*
	this.blockImage.css({
		width:100 * this.scale,
		height:100 * this.scale
	})
	*/
	
	/*
	this.blockImage=document.createElement("canvas");
	this.blockImage.width=this.width;
	this.blockImage.height=this.height;
	this.container.append(this.blockImage);
	*/
	this.context = this.blockImage.children()[0].getContext("2d");
	
	// console.log(this.image, 100 * this.scale);
	this.context.drawImage(this.image, 0, 0, _width, _height);	
}

PuntBase.prototype.loadWare = function(wareId){
	var _width = 116 * this.scale;
	var _height = 245 * this.scale;
	this.context.drawImage(imageCache["wares"], 0, 0, _width, _height);	
}

/**
 ** 设置用户头像位置
 **/
PuntBase.prototype.setPosition = function(position){
	this.blockImage.css({
		visibility: "visible",
		position:"absolute",
		opacity:0,
		left: position.x + this.offsetX + "px",
		top : position.y + this.offsetY + "px"
	}).animate({
		opacity:1
	}, 500);
}

function PuntView(mapView, image){
	this.puntMap = {};
	this.image = image;
	this.mapView = mapView;
	this.container = $('<div class="punt-viewer"></div>').appendTo('body');
}

/**
 ** 初始化一个用户角色，并设置坐标位置
 **/
PuntView.prototype.add = function(puntId, position) {
	
	var punt, 
		position;

	punt = new PuntBase(puntId, this.image, this.container);
	
	position = this.mapView.getMapByIndex(puntId, position);
	// console.log(position);
	punt.setPosition(position);
	
	this.puntMap[puntId] = punt;
};

PuntView.prototype.loadWare = function(puntId, wareId){
	this.puntMap[puntId].loadWare(wareId);
}

PuntView.prototype.moveTo = function(puntId, position){
	if(position >=0 && position < mapData.length){
		position = this.mapView.getMapByIndex(puntId, position);
		punt = this.puntMap[puntId];
		punt.setPosition(position);
	}
}

PuntView.prototype.removeAll = function() {
	this.puntMap = {};
	$('.punt-viewer').remove();
};

// /**
//  ** 移除一个block
//  **/
// PuntView.prototype.remove = function(mapIndex) {
// 	
// 	var blocker, 
// 		position;
// 
// 	blocker = this.blockerMap[mapIndex];
// 	
// 	blocker && blocker.remove();
// 	
// 	this.blockerMap[mapIndex] = null;
// 	
// };


