/**
 * MyPyramid
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//function MyPyramid(scene, minS, maxS, minT, maxT) {
function MyPyramid(scene) {
	CGFobject.call(this,scene);
/*
	this.minS=minS;
	this.maxS=maxS;
	this.minT=minT;
	this.maxT=maxT;
*/
	this.initBuffers();
};

MyPyramid.prototype = Object.create(CGFobject.prototype);
MyPyramid.prototype.constructor = MyPyramid;

MyPyramid.prototype.initBuffers = function () {

	this.vertices = [
			0, 1, 0,		// 0
			0, 1, 0,		// 0
			0, 1, 0,		// 0
			0, 1, 0,		// 0
			-.5, 0, .5,	// 1
			.5, 0 , .5,	// 2
			.5, 0 , .5,	// 2
			.5, 0, -.5,	// 3
			.5, 0, -.5,	// 3
			-.5, 0, -.5,	// 4
			-.5, 0, -.5,	// 4
			-.5, 0, .5,	// 1
			];

	this.indices = [
      		0, 4, 5,
			1, 6, 7,
			2, 8, 9,
			3, 10, 11
      ];



	this.normals = [	//1.3 -> vetores normais - homogenizar luz
		0, Math.sin(Math.PI/4), Math.cos(Math.PI/4),	// A0
		Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0,	// B1
		0, Math.sin(Math.PI/4), -Math.cos(Math.PI/4),	// C2
		-Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0,	// D3
		0, Math.sin(Math.PI/4), Math.cos(Math.PI/4),	// A4
		0, Math.sin(Math.PI/4), Math.cos(Math.PI/4),	// A5
		Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0,	// B6
		Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0,	// B7
		0, Math.sin(Math.PI/4), -Math.cos(Math.PI/4),	// C8
		0, Math.sin(Math.PI/4), -Math.cos(Math.PI/4),	// C9
		-Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0,	// D10
		-Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0	// D11
	];
	
/*
	this.texCoords = [
		this.minS, this.minT,
		this.minS, this.maxT,
		this.maxS, this.minT,
		this.maxS, this.maxT
	];
	*/
	this.primitiveType=this.scene.gl.TRIANGLES;

	this.initGLBuffers();
};
