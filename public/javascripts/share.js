function ShareBase(name, container){
	
	//基本属性
	this.type = 'share';
  // this.image = image;
	this.container = container;
	this.name = name;
	
	this.scale = SCALE;
	
	// console.log(this.container);
		
	this._init();
}

ShareBase.prototype._init = function(){

	var _width = 60 * this.scale;
	var _height = 60 * this.scale;
	
	this.offsetX = 0;
	this.offsetY = 0;
	
	this.blockImage = $('<div class="share_'+this.name+'"><canvas width="' + _width + '" height="' + _height + '"></canvas></punt>').appendTo(this.container);
	
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
	this.drawShare();
	// console.log(this.image, 100 * this.scale);
  // this.context.drawImage(this.image, 0, 0, _width, _height); 
}

ShareBase.prototype.drawShare = function(e){
  this.offsetX = 5;
	this.offsetY = 5;
  this.context.clearRect ( 0 , 0 , 60 * this.scale , 60 * this.scale );
  // console.log(this.image, 100 * this.scale);
	this.context.beginPath();
	this.context.arc(20+this.offsetX, 20+this.offsetY, 20, 0, Math.PI*2, true);
	this.context.closePath();
	this.context.fillStyle = "rgba(232, 111, 213, 0.75)";
	this.context.fill();
}

// ShareBase.prototype.loadWare = function(ware){
//  var _width = 69 * this.scale;
//  var _height = 232 * this.scale;
//  this.context.drawImage(imageCache[ware.name], 20, 0, _width, _height);  
// }

ShareBase.prototype.place = function(price){
  var steps = [0, 5, 10, 20, 30];
  var order = steps.indexOf(price);
  this.setPosition(shareData[this.name][order][0], shareData[this.name][order][1]);
}

/**
 ** 设置用户头像位置
 **/
ShareBase.prototype.setPosition = function(x, y){
	this.blockImage.css({
		visibility: "visible",
		position:"absolute",
		opacity:0,
		left: x + this.offsetX + "px",
		top : y + this.offsetY + "px"
	}).animate({
		opacity:1
	}, 500);
}

// ShareBase.prototype.pullInWater = function(){
//   this.blockImage.removeClass('fail').removeClass('success');
// }

function ShareView(){
	this.shareMap = {};
	this.container = $('<div class="share-viewer"></div>').appendTo('body');
}

/**
 ** 初始化一个用户角色，并设置坐标位置
 **/
ShareView.prototype.add = function(shareName) {
	
	var share;

	share = new ShareBase(shareName, this.container);
	console.log(shareName);
	this.shareMap[shareName] = share;
};

ShareView.prototype.place = function(shareName, price){
	this.shareMap[shareName].place(price);
}

ShareView.prototype.removeAll = function() {
	this.shareMap = {};
	$('.share-viewer').remove();
};

ShareView.prototype.init = function() {
  $.each(this.shareMap, function(){
    this.place(0);
  })
};

// /**
//  ** 移除一个block
//  **/
// ShareView.prototype.remove = function(mapIndex) {
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


