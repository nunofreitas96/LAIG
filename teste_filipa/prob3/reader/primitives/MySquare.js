/**
* MySquare
* @param gl {WebGLRenderingContext}
* @constructor
*/
function MySquare(scene, texangle) {
	CGFobject.call(this,scene);

	this.minS=0;
	this.maxS=1;
	this.minT=0;
	this.maxT=1;

	this.minX = 0;
	this.minY = 0;
	this.maxX = 1;
	this.maxY = 1;

  this.texangle = texangle*Math.PI/180;
  //this.texangle = Math.PI / 6;

	this.initBuffers();
};

MySquare.prototype = Object.create(CGFobject.prototype);
MySquare.prototype.constructor=MySquare;



MySquare.prototype.initBuffers = function () {

	this.vertices = [
		this.minX, this.minY, 0,
		this.maxX, this.minY, 0,
		this.minX, this.maxY, 0,
		this.maxX, this.maxY, 0
	];

	this.indices = [
		0, 1, 2,
		3, 2, 1
	];



	this.normals = [	//1.3 -> vetores normais - homogenizar luz
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	];

  var cos = Math.cos(this.texangle);
  var sin = Math.sin(this.texangle);
  /*
  X = x*cos(θ) - y*sin(θ)
  Y = x*sin(θ) + y*cos(θ)

  // cx, cy - center of square coordinates
  // x, y - coordinates of a corner point of the square
  // theta is the angle of rotation

  // translate point to origin
  float tempX = x - cx;
  float tempY = y - cy;

  // now apply rotation
  float rotatedX = tempX*cos(theta) - tempY*sin(theta);
  float rotatedY = tempX*sin(theta) + tempY*cos(theta);

  // translate back
  x = rotatedX + cx;
  y = rotatedY + cy;
*/

  var hx1 = this.minS;
  var hy1 = this.maxT-1;
  var hx2 = this.maxS;
  var hy2 = this.maxT-1;
  var hx3 = this.minS;
  var hy3 = this.minT-1;
  var hx4 = this.maxS;
  var hy4 = this.minT-1;


	this.texCoords = [
    /*
    this.minS,this.maxT,
    this.maxS,this.maxT,
    this.minS,this.minT,
    this.maxS,this.minT
    */

    hx1*cos-hy1*sin, hy1*cos+hx1*sin+1,
    hx2*cos-hy2*sin, hy2*cos+hx2*sin+1,
    hx3*cos-hy3*sin, hy3*cos+hx3*sin+1,
    hx4*cos-hy4*sin, hy4*cos+hx4*sin+1


	];
	this.primitiveType=this.scene.gl.TRIANGLES;

	this.initGLBuffers();
};
