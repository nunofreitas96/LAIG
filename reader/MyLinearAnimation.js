function MyLinearAnimation(scene, id, time, points) {
	MyAnimation.call(this);
	this.scene = scene;
	this.id = id;
	this.time = time;
	this.points = points;
	this.dist = 0;
	var i;
	this.cntrlPDist = [];
	for(i =1; i < points.length; i++){
		console.log("x1 -", points[i][1]);
		this.dist += vec3.dist(vec3.fromValues(points[i][0],points[i][1],points[i][2]),vec3.fromValues(points[i-1][0],points[i-1][1],points[i-1][2]));
		console.log(this.dist);
		this.cntrlPDist.push(this.dist);
	}
	this.endCond =0;
	this.speed = this.dist/time;

	this.prevAngle =0;
	this.prevAngle2 =0;
	this.pquant =0;
}

MyLinearAnimation.prototype = Object.create(MyLinearAnimation.prototype);

MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.apply = function(time) {
	//rotating part





	//moving part
	if(time > this.time){
		time = this.time;
		this.endCond = 1;
		}

	console.log("time");
	console.log(time);

	var CDist = this.speed * time;
	var i =0;
	while(CDist > this.cntrlPDist[i] && i < this.cntrlPDist.length){
		i++;


	}
	console.log(i);
	var x = this.points[i+1][0] - this.points[i][0];
	var y = this.points[i+1][1] - this.points[i][1];
	var z = this.points[i+1][2] - this.points[i][2];

	if(i ==0)
		cntrlPDist2 =0;
	else
		cntrlPDist2 = this.cntrlPDist[i-1];


	var quant = (CDist-cntrlPDist2)/(this.cntrlPDist[i]-cntrlPDist2);
	console.log(CDist);
	console.log(this.cntrlPDist[i]);
	console.log("X");
	console.log(x);
	console.log("Y");
	console.log(y);
	console.log("Z");
	console.log(z);
	console.log("QUant");
	console.log(quant);

	var trX = (x*quant + this.points[i][0]);
	var trY = y*quant + this.points[i][1];
	var trZ = (z*quant +this.points[i][2]);


	var orientationAngle = Math.atan(z/x);
	//var orientationAngle2 = Math.atan(y/z)
	console.log(orientationAngle);


	if(x < 0){
		orientationAngle +=  Math.PI;

	}

	if(x == 0 && z == 0){
		orientationAngle = this.prevAngle;
	}

	this.pquant = quant;
	this.prevAngle = orientationAngle;

	//this.prevAngle2 = orientationAngle2 ;



	//this.scene.translate(-(x*this.pquant + this.points[i][0])*-Math.cos(this.prevAngle),-(y*this.pquant + this.points[i][1]),-(z*this.pquant +this.points[i][2])*Math.sin(this.prevAngle));
	this.scene.translate(trX,trY,trZ);
	this.scene.rotate(orientationAngle, 0, 1, 0);

	//this.scene.translate((x*this.pquant + this.points[i][0])*-Math.cos(this.prevAngle),y*this.pquant + this.points[i][1],(z*this.pquant +this.points[i][2])*Math.sin(this.prevAngle));





	//this.scene.translate(-(x*quant + this.points[i][0])*-Math.cos(orientationAngle),-(y*quant + this.points[i][1]),-(z*quant +this.points[i][2])*Math.sin(orientationAngle));
	//this.scene.rotate(orientationAngle, 0, 1, 0);
	//this.scene.translate((x*quant + this.points[i][0])*-Math.cos(orientationAngle),y*quant + this.points[i][1],(z*quant +this.points[i][2])*Math.sin(orientationAngle));


	console.log("debug ", this.points[i][0], " ", this.points[i][1], this.points[i][2] );
	console.log("debug2 ", trX,trY,trZ);
}
