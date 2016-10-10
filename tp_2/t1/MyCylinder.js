/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/


	var i;
	var j;
	var k = 2*this.slices;

	this.vertices=[];
	for(i=0;i<=this.stacks;i++){
		for(j=0;j<this.slices;j++){
			this.vertices.push(Math.cos(j*2*Math.PI/this.slices),Math.sin(j*2*Math.PI/this.slices),i);
		}
	}
	//this.vertices[1]=3;




	this.indices=[];
	for(i=0;i<this.stacks*this.slices;i+=this.slices){
		for(j=0;j<this.slices;j++){
			this.indices.push(j+i+1,j+i+this.slices,j+i);
			this.indices.push(j+i+1,j+i+1+this.slices,j+i+this.slices);
		}

		this.indices[this.indices.length-2]-=this.slices;
		this.indices[this.indices.length-3]-=this.slices;
		this.indices[this.indices.length-6]-=this.slices;

	}


	var alpha=2*Math.PI/this.slices;

	this.normals=[];
	for(var k=0;k<this.stacks;k++){
		for(i=0;i<this.slices;i++){
			for(j=0;j<this.slices;j++){
				this.normals.push(Math.cos(j*alpha),Math.sin(j*alpha),0);
			}
		}
	}



 	//this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
