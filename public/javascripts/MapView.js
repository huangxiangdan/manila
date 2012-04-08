//地图类
function MapView(mapDataArray,width,height,scale,offsetX,offsetY,image,bgImage){
	this.mapDataArray=mapDataArray;
	this.scale=scale;
	this.offsetX=offsetX;
	this.offsetY=offsetY;
	
	this.image=image;
	this.widthNum=mapDataArray[0].length;//地图宽的元素数量
	this.heightNum=mapDataArray.length;//地图高的元素数量
	
	this.width=width;//绘制的地图宽度
	this.height=height;//绘制的地图高度

	this.sw=163;//绘制出的图像宽度
	this.sh=99;//绘制出的图像高度	
	

	// 创建canvas，并初始化 （也可以直接以标签形式写在页面中，然后通过id等方式取得canvas）
	this.canvas=document.createElement("canvas");
	this.canvas.width=this.width;
	this.canvas.height=this.height;
	document.body.appendChild(this.canvas);
	
	// 取得2d绘图上下文 
	this.context= this.canvas.getContext("2d");
	
	if (bgImage) {
		this.drawBgByImage(bgImage);
	}
	
	var mapElementArray=new Array();

	var dw=this.sw*this.scale;//绘制出的图像宽度
	var dh=this.sh*this.scale;//绘制出的图像高度	
	for(var i=0;i<this.heightNum;i++){
		var tempArray=new Array(0);
		for(var j=0;j<this.widthNum;j++){
			var dx=this.offsetX+j*dw;
			var dy=this.offsetY+i*dh;
			//console.log('flag:'+flag+'owner:'+owner+'|sx:'+sx+'|sy:'+sy+'|sw:'+sw+'|sh:'+sh+'|dx:'+dx+'|dy:'+dy+'|scale:'+this.scale+'|image:'+this.image+'|context:'+this.context+'|color:'+this.color);
			tempArray[j]=new MapElement(this.sw, this.sh, dx, dy, this.scale,this.image,this.context);
		}
		mapElementArray[i]=tempArray;
	}
	this.mapElementArray=mapElementArray;
};

MapView.prototype.draw=function(){
	for(var i=0;i<this.heightNum;i++){
		for (var j=0; j < this.widthNum; j++) {
			var element=this.mapElementArray[i][j];
			element.draw();
		}
	}
};

MapView.prototype.drawByIndex=function(index){
	var temp=this.getijByIndex(index);
	if(temp){
		var i=temp.i;
		var j=temp.j;
		this.mapElementArray[i][j].draw();	
	}
};

MapView.prototype.drawBgByImage=function(bgImage){
	this.context.drawImage(bgImage,0,0,this.width,this.height);
};

MapView.prototype.cleanByColorByIndex=function(index){
	var temp=this.getijByIndex(index);
	var i=temp.i;
	var j=temp.j;
	this.mapElementArray[i][j].cleanByColor();
};

MapView.prototype.getMapByIndex=function(index, position){
	var x= this.mapElementArray[this.heightNum - position - 1][index].dx;	
	var y= this.mapElementArray[this.heightNum - position - 1 ][index].dy;	
	return {'x':x,'y':y};
};