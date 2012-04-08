function SpaceBase(id, image, container){
	this.image = image;
	this.container = container;
	this.id = id;
	
	this.scale = SCALE;

	this._init();
}

SpaceBase.prototype._init = function(position){

	var _width = 60 * this.scale;
	var _height = 60 * this.scale;
	
	this.offsetX = 5;
	this.offsetY = 5;
	
	this.blockImage = $('<canvas width="' + _width + '" height="' + _height + '"></canvas>').appendTo(this.container);
	var $this = this;
	this.blockImage.click(function(){
		$this.click();
	});
	// console.log(this.container);
	this.context = this.blockImage[0].getContext("2d");
	
	// console.log(this.image, 100 * this.scale);

	this.context.beginPath();
	this.context.arc(25+this.offsetX, 25+this.offsetY, 25, 0, Math.PI*2, true);
	this.context.closePath();
	this.context.fillStyle = "rgba(255, 0, 0, 0.25)";
	this.context.fill();
	// this.context.drawImage(this.image, 0, 0, _width, _height);	
}

SpaceBase.prototype.click = function(e){
	var context = this.blockImage[0].getContext("2d");
	context.fillRect(0,0, 20, 20);
	fillSpace(this.id);
}

/**
 ** 设置用户头像位置
 **/
SpaceBase.prototype.setPosition = function(position){
	this.dx = position.x;
	this.dy = position.y;
	
	this.blockImage.css({
		visibility: "visible",
		position:"absolute",
		opacity:0,
		cursor:"pointer",
		left: position.x + this.offsetX + "px",
		top : position.y + this.offsetY + "px"
	}).animate({
		opacity:1
	}, 500);
}

function SpaceView(image){
	this.spaceMap = {};
	this.image = image;
}

/**
 ** 初始化一个用户角色，并设置坐标位置
 **/
SpaceView.prototype.add = function(spaceId, position, puntId) {
	// console.log(puntId);
	var space;
	var container = puntId>=0 ? $(".punt"+puntId) : $("body");
	// console.log(container);
	space = new SpaceBase(spaceId, null, container);
	// console.log(position);
	space.setPosition(position);
	
	this.spaceMap[spaceId] = space;
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


