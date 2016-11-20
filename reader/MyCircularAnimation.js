
function MyCircularAnimation(scene, id, time, center, initialAngle, rotationAngle, radius) {
	this.scene = scene;
	this.id = id;
	this.center = center;
	this.initialAngle = initialAngle;
	console.log("ia",initialAngle,this.initialAngle);
	this.rotationAngle = rotationAngle;
	console.log("ra",rotationAngle,this.rotationAngle);
	this.radius = radius;
	this.time = time;
	this.speed = this.rotationAngle / this.time;
	this.endCond = 0;
}

MyCircularAnimation.prototype = Object.create(MyCircularAnimation.prototype);

MyCircularAnimation.prototype.apply = function(time) {
	var ended =0;
	if(time > this.time){
		time = this.time;
		this.endCond = 1;
	}
	this.scene.translate(this.center[0],this.center[1],this.center[2]);
	console.log("centers", this.center[0],this.center[1],this.center[2]);
	var currAngle = this.initialAngle + this.speed * time;
	console.log("initial", this.initialAngle, "speed",this.speed,"time", time);
	
	
	this.scene.rotate(currAngle, 0, 1, 0);
	
	console.log("currAngle", currAngle," radius", this.radius);
	//this.scene.translate(this.radius*Math.cos(currAngle), 0,this.radius*Math.sin(currAngle));
	this.scene.translate(0,0,this.radius);
}