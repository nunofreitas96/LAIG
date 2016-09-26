/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

	var i;
	var j;
	var k=2*Math.PI/this.slices;

	this.vertices=[];
	for(var i=0;i<this.stacks;i++){
		for(var j=0; j<this.slices; j++){
				this.vertices.push(Math.cos(2*j*Math.PI/this.slices), Math.sin(2*j*Math.PI/this.slices), i);
				this.vertices.push(Math.cos(2*j*Math.PI/this.slices), Math.sin(2*j*Math.PI/this.slices), i+1);
				this.vertices.push(Math.cos(2*(j+1)*Math.PI/this.slices), Math.sin(2*(j+1)*Math.PI/this.slices), i);
				this.vertices.push(Math.cos(2*(j+1)*Math.PI/this.slices), Math.sin(2*(j+1)*Math.PI/this.slices), i+1);

		}
	}


	this.indices = [];
	
		for(i=0; i<4*this.slices*this.stacks; i+=4){
			this.indices.push((i+1), (i), (i+2));
			this.indices.push((i+1), (i+2), (i+3));
		}
	

 	
	this.normals = [];
	for(var j=0;j<this.stacks;j++){
		for(i=0; i<this.slices; i++){
			this.normals.push(Math.cos(Math.PI/this.slices + i*2*Math.PI/this.slices), Math.sin(Math.PI/this.slices + i*2*Math.PI/this.slices), 0);
			this.normals.push(Math.cos(Math.PI/this.slices + i*2*Math.PI/this.slices), Math.sin(Math.PI/this.slices + i*2*Math.PI/this.slices), 0);
			this.normals.push(Math.cos(Math.PI/this.slices + i*2*Math.PI/this.slices), Math.sin(Math.PI/this.slices + i*2*Math.PI/this.slices), 0);
			this.normals.push(Math.cos(Math.PI/this.slices + i*2*Math.PI/this.slices), Math.sin(Math.PI/this.slices + i*2*Math.PI/this.slices), 0);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
