
//地图的元素类
function MapElement(sw, sh, dx, dy, scale,image,context){
	this.sw = sw;
	this.sh = sh;
	this.dx = dx;
	this.dy = dy;
	this.scale = scale;
	this.dw=this.sw*this.scale;//绘制出的图像宽度
	this.dh=this.sh*this.scale;//绘制出的图像高度
	this.image=image;//绘制的素材
	this.context=context;//绘制的canvas的context
};

MapElement.prototype.draw=function(){
	// console.log('image:'+this.image+'|sx:'+this.sx+'|sy:'+this.sy+'|sw:'+this.sw+'|sh:'+this.sh+'|dx:'+this.dx+'|dy:'+this.dy+'|dw:'+this.dw+'|dh:'+this.dh);
	this.context.drawImage(this.image,this.dx, this.dy,this.dw,this.dh);																
};