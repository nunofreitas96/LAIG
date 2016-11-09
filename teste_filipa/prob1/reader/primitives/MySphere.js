/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, radius,slices, stacks) {
 	CGFobject.call(this,scene);
	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];
	
	this.angle = Math.PI*2/this.slices;

	for (j=0;j<=this.stacks;j++) {
		for (i = 1; i <= this.slices; i++) {
			var zangle = this.angle*i;
			var hangle = j*(Math.PI)/this.stacks;
			var x = this.radius*Math.sin(zangle) * Math.sin(hangle);
			var y = this.radius*Math.cos(zangle) * Math.sin(hangle);
			var z = Math.cos(hangle);
    		this.vertices.push(x,y,z);
    		this.normals.push(x,y,z);
			var textCS = (x + 1) / 2;
			var textCT = (y + 1) / 2;
			this.texCoords.push(i/this.slices, j/this.stacks);
		}
	}
	
	for (j=0;j<this.stacks;j++){
		for (i=0;i<this.slices-1;i++){
			var a = i+(j*this.slices);
			var b = i+((j+1)*this.slices);
			var c = i+1+(j*this.slices);
			var d = i+1+((j+1)*this.slices);
			this.indices.push(d,b,a);
			this.indices.push(a,c,d);
		}
		var a = j*this.slices;
		var b = (j+1)*this.slices;
		var c = a+this.slices-1;
		var d = b+this.slices-1;
		this.indices.push(d,c,a);
		this.indices.push(a,b,d);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
