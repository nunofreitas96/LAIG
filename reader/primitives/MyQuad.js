/**
* MyQuad
* @param gl {WebGLRenderingContext}
* @constructor
*/
function MyQuad(scene, minX, maxX, minY, maxY) {
	CGFobject.call(this,scene);

	this.minS=0;
	this.maxS=1;
	this.minT=0;
	this.maxT=1;

	this.minX = minX;
	this.minY = minY;
	this.maxX = maxX;
	this.maxY = maxY;

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.textResize = function(length_s, length_t){
	this.texCoords = [
		0, 0,
		(this.maxX - this.minX)/length_s, 0,
		0, (this.minY - this.maxY)/length_t,
		(this.maxX - this.minX)/length_s, (this.minY - this.maxY)/length_t

	];
	this.updateTexCoordsGLBuffers();
}

MyQuad.prototype.initBuffers = function () {

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

	this.texCoords = [
		this.minX, this.maxY,
		this.maxX, this.maxY,
		this.minY, this.minX,
		this.maxX, this.minY
	];
	this.primitiveType=this.scene.gl.TRIANGLES;

	this.initGLBuffers();
};
