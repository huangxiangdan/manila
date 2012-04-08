var mapData=[
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1]
	];
	
var spaceData = [
		[20, 40], [20, 100], [20, 160], 
		[20, 40], [20, 100], [20, 160],
		[20, 40], [20, 100], [20, 160],
		[20, 20], [20, 70], [20, 120], [20, 170],
		[75, 25], [75, 140], [75, 270],
		[910, 10], [910, 220], [910, 420], [870, 620]
	];
	
var wharfData = [
		[150, 250], [150, 110], [150, 0]
	];
	
var shipyardData = [
		[880, 0], [910, 140], [910, 350]
	];
//放大倍数
var SCALE=1;
//图片对象
var IMAGE_LIST=[ 
	{
		id:"bg",
		url:"images/map_bg.jpg"
	},
	{
		id : "map",
		url : "images/water.png"
	},
	{
		id : "punt",
		url : "images/punt.png"
	}, {
		id : "nutme",
		url : "images/nutme.png"
	}, {
 		id : "silk",
		url : "images/silk.png"
	}, {
 		id : "ginseng",
		url : "images/ginseng.png"
	}, {
 		id : "jade",
		url : "images/jade.png"
	}
];
//存放已载入的图片
var imageCache=null;
//地图坐标偏移量
var offsetX;
var offsetY;
