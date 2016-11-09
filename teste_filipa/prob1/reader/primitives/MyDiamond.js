/**
 * MyDiamond
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


function MyDiamond(scene, slices) {
	CGFobject.call(this,scene);
	this.slices = slices;

	this.angleA = Math.atan(1/.5);
	this.angleB = Math.PI/this.slices;
	this.halfX = .5*Math.sin(this.angleB);
	this.hY = .5*Math.cos(this.angleB);
	this.aHip = Math.sqrt(1+Math.pow(.5,2));
	this.h = Math.sqrt(Math.pow(this.aHip,2)-Math.pow(this.halfX,2));

	this.triangle=new MyTriangle(scene, -this.halfX,0,0, this.halfX,0,0, 0,this.h,0);
	this.triangle.initBuffers();
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor=MyDiamond;

MyDiamond.prototype.display = function () {
	var distance = .5;

  for (var i = 0; i < this.slices; i++) {
    this.scene.pushMatrix();

      this.scene.rotate(i*2*Math.PI/this.slices, 0, 1, 0);
      this.scene.translate(0,0,this.hY);
			this.scene.rotate(-(Math.PI/2 - this.angleA -.055),1,0,0);

      this.triangle.display();
    this.scene.popMatrix();
  }
this.scene.rotate(Math.PI, 1, 0, 0);
	for (var i = 0; i < this.slices; i++) {
		this.scene.pushMatrix();

			this.scene.rotate(i*2*Math.PI/this.slices, 0, 1, 0);
			this.scene.translate(0,0,this.hY);
			this.scene.rotate(-(Math.PI/2 - this.angleA -.055),1,0,0);	//erro numerico: .055

			this.triangle.display();
		this.scene.popMatrix();
	}

};
