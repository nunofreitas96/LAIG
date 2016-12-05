function MyPieceAnimation(scene, id, time, nSquares, dir) {
	MyAnimation.call(this);
	this.scene = scene;
	this.id = id;
	this.time = time;
	this.nSquares = nSquares;
	this.dir = dir;
	this.speed = this.nSquares/time;
	/*this.points = points;
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
	

	this.prevAngle =0;
	this.prevAngle2 =0;
	this.pquant =0;*/
}

MyPieceAnimation.prototype = Object.create(MyPieceAnimation.prototype);

MyPieceAnimation.prototype.constructor = MyPieceAnimation;

MyPieceAnimation.prototype.apply = function(time) {
	if(time > this.time){
		time = this.time;
		this.endCond = 1;
	}
	
	currDist = this.speed * time;
	//TODO ver se isto dá bem de acordo com o tabuleiro
	switch(this.dir){
		case "N": this.scene.translate(currDist,0,0);
			break;
		case "NE": this.scene.translate(currDist,0,currDist);
			break;
		case "E": this.scene.translate(0,0,currDist);
			break;
		case "SE": this.scene.translate(currDist,0,currDist);
			break;
		case "S": this.scene.translate(-currDist,0,0);
			break;
		case "SW": this.scene.translate(currDist,0,-currDist);
			break;
		case "W": this.scene.translate(0,0,-currDist);
			break;
		case "NW": this.scene.translate(currDist,0,-currDist);
			break;
		
		
	}
	
	
}


