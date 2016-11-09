/**
 * MyDiamond
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


function MyDiamond(scene, slices) {
	CGFobject.call(this,scene);
	this.slices = slices;

  this.height = Math.sqrt(1+(.5^2));
  this.distance = Math.cos(Math.PI/this.slices);
  this.deg=180/Math.PI;
  var x = .5*Math.sin(Math.PI/this.slices);
	this.triangle=new MyTriangle(scene, -x,0,0, x,0,0, 0,this.height,0);
	this.triangle.initBuffers();
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor=MyDiamond;



MyDiamond.prototype.display = function () {
  for (var i = 0; i < 2; i++) {
    this.scene.pushMatrix();

      //this.scene.rotate(i*2*Math.PI/this.slices, 0, 1, 0);
      this.scene.translate(0,0,this.distance);
      this.scene.rotate(2*Math.PI-Math.atan(1/.5),1,0,0);

      this.triangle.display();
    this.scene.popMatrix();
  }

/*
	this.scene.translate(0,0,0.5);
	this.quad.display();
	this.scene.translate(0,0,-0.5);
	this.scene.rotate(-0.5*Math.PI,1,0,0);
	this.scene.translate(0,0,0.5);
	this.scene.rotate(-0.5*Math.PI,0,0,1);
	this.quad.display();
	this.scene.translate(0,0,-1);
	this.scene.rotate(Math.PI,0,1,0);
	this.scene.rotate(0.5*Math.PI,0,0,1);
	this.quad.display();
	this.scene.translate(0,0,-0.5);
	this.scene.rotate(0.5*Math.PI,1,0,0);
	this.scene.translate(0,0,0.5);
	this.scene.rotate(1.5*Math.PI,0,0,1);
	this.quad.display();
	this.scene.translate(0,0,-0.5);
	this.scene.rotate(1.5*Math.PI,1,0,0);
	this.scene.translate(0,0,0.5);
	this.quad.display();
	this.scene.translate(0,0,-1);
	this.scene.rotate(0.5*Math.PI,0,1,0);
	this.scene.rotate(2*Math.PI,0,0,1);
	this.scene.rotate(0.5*Math.PI,0,1,0);
	*/
//	this.triangle.display();

};
