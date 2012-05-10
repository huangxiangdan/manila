Array.prototype.remove = function(b) { 
	var a = this.indexOf(b); 
	if (a >= 0) { 
		this.splice(a, 1); 
		return true; 
	} 
	return false; 
};

var total = function(obj){
  var length = 0;
  for(var proto in obj){
    if(!(obj[proto] instanceof Function)){
      length += obj[proto];
    }
  }
  return length;
};