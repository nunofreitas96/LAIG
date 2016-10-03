 var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

//var BOARD_A_DIVISIONS = 1;	// 2.5 -> comentar
var BOARD_A_DIVISIONS = 30;		// 2.5 -> 30x30 divisoes
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.initLights();
	this.enableTextures(true);

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	// Scene elements
	this.table = new MyTable(this);
	this.wall = new Plane(this,1,0, 2, 0, 1);
	this.wall1 = new MyQuad(this,-.5, 1.5, -.5, 1.5);
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.torus = new MyTorus(this, .75,0.7, 100, 100);
  this.poster = new Plane(this, 1, 0, 1, 0, 1);

	// Materials
	this.materialDefault = new CGFappearance(this);

	this.materialA = new CGFappearance(this);
	this.materialA.setAmbient(0.3,0.3,0.3,1);
	this.materialA.setDiffuse(0.6,0.6,0.6,1);
	//this.materialA.setSpecular(0.2,0.2,0.2,1);	// 2.6 -> comentar
	//this.materialA.setSpecular(0.8,0.8,0.8,1);		// 2.6 -> mat(A)=mat(B)
	//this.materialA.setSpecular(0,0,0.8,1);			// 2.8
	this.materialA.setSpecular(0,0.2,0.8,1);		// 2.9
	//this.materialA.setShininess(10);
	this.materialA.setShininess(120);				// 2.7

	this.materialB = new CGFappearance(this);
	this.materialB.setAmbient(0.3,0.3,0.3,1);
	this.materialB.setDiffuse(0.6,0.6,0.6,1);
	this.materialB.setSpecular(0.8,0.8,0.8,1);
	this.materialB.setShininess(120);

	this.materialE = new CGFappearance(this);
	this.materialE.setAmbient(0.656,0.796,0.59,1);
	this.materialE.setDiffuse(0.656,0.796,0.59,1);
	this.materialE.setSpecular(0.656,0.796,0.59,1);
	this.materialE.setShininess(120);

	this.materialF = new CGFappearance(this);
	this.materialF.setAmbient(0.3,0.3,0.3,1);
	this.materialF.setDiffuse(0.43,0.62,0.01,1);
	this.materialF.setSpecular(0.8,0.2,0.8,1);
	this.materialF.setShininess(120);

	// Textures

	this.tableAppearance = new CGFappearance(this);
	//pouca componente especular e baixo brilho, forte componente difusa
	this.tableAppearance.setSpecular(0.1,0.1,1);
	this.tableAppearance.setShininess(50);
	this.tableAppearance.setDiffuse(0.8,0.8,0.8,1);
	//this.tableAppearance.loadTexture("../resources/images/table.png");
	this.tableAppearance.loadTexture("../resources/images/wood.png");

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.setAmbient(0.3,0.3,0.3,1);
	this.floorAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.floorAppearance.setSpecular(0.2,0.2,0.2,1);
	this.floorAppearance.setShininess(10);
	this.floorAppearance.loadTexture("../resources/images/floorTexture.png");
	this.floorAppearance.setTextureWrap('REPEAT','REPEAT');

	this.windowAppearance = new CGFappearance(this);
	this.windowAppearance.setAmbient(0.3,0.3,0.3,1);
	this.windowAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.windowAppearance.setSpecular(0.2,0.2,0.2,1);
	this.windowAppearance.setShininess(10);
	this.windowAppearance.loadTexture("../resources/images/window.png");
	this.windowAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

	this.slidesAppearance = new CGFappearance(this);
	//p o u c a componente especular e baixo brilho, forte componente difusa.
	this.slidesAppearance.setSpecular(0.2,0.2,0.2,1);
	this.slidesAppearance.setShininess(10);
	this.slidesAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.slidesAppearance.loadTexture("../resources/images/slides.png");
	this.slidesAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

	this.boardAppearance = new CGFappearance(this);
	//alguma componente especular, bastante brilho e uma menor componente difusa
	this.boardAppearance.setSpecular(0.6,0.6,0.6,1);
	this.boardAppearance.setShininess(250);
	this.boardAppearance.setDiffuse(0.35,0.35,0.35,1);
	this.boardAppearance.loadTexture("../resources/images/board.png");

	this.torusAppearance = new CGFappearance(this);
	//pouca componente especular e baixo brilho, forte componente difusa
	this.floorAppearance.setAmbient(0.3,0.3,0.3,1);
	this.floorAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.floorAppearance.setSpecular(0.2,0.2,0.2,1);
	this.floorAppearance.setShininess(10);
	//this.torusAppearance.loadTexture("../resources/images/table.png");
	this.torusAppearance.loadTexture("../resources/images/straw.png");
	this.torusAppearance.setTextureWrap('REPEAT','REPEAT');

	this.panelAppearance = new CGFappearance(this);
	this.panelAppearance.setAmbient(0.3,0.3,0.3,1);
	this.panelAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.panelAppearance.setSpecular(0.2,0.2,0.2,1);
	this.panelAppearance.setShininess(10);
	this.panelAppearance.loadTexture("../resources/images/panel.png");
	this.panelAppearance.setTextureWrap('REPEAT','REPEAT');

  this.posterAppearance = new CGFappearance(this);
	//p o u c a componente especular e baixo brilho, forte componente difusa.
	this.posterAppearance.setSpecular(0.2,0.2,0.2,1);
	this.posterAppearance.setShininess(10);
	this.posterAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.posterAppearance.loadTexture("../resources/images/naruto.png");
	this.posterAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	//this.setGlobalAmbientLight(0.5,0.5,0.5, 1.0);	//(original) 2.2 -> comentar
	this.setGlobalAmbientLight(0, 0, 0, 1.0);	// 2.2 - por RGB a zero

	this.shader.bind();

	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);	// 3.1
	this.lights[3].setPosition(4, 6.0, 5.0, 1.0);

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(255,255,0, 1.0);
	//this.lights[0].enable();	//1.2 -> descomentar

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();	//2.3 -> descomentar

	// 3.1
	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1,1,1, 1.0);
	this.lights[2].setConstantAttenuation(0);	// 3.2 -> kc=0
	this.lights[2].setLinearAttenuation(1);	// 3.2 -> kl=0.2
	this.lights[2].setQuadraticAttenuation(0);	// 3.2 -> kq=0
	//this.lights[2].enable();

	this.lights[3].setAmbient(0, 0, 0, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setSpecular(1,1,0, 1.0);
	this.lights[2].setConstantAttenuation(0);
	this.lights[2].setLinearAttenuation(0);
	this.lights[2].setQuadraticAttenuation(1);
	this.lights[3].enable();

	this.shader.unbind();
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}


LightingScene.prototype.display = function() {
	this.shader.bind();

	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup


	// ---- BEGIN Geometric transformation section

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section

	// Floor
	this.pushMatrix();
		this.translate(7.5, 0, 7.5);
		this.rotate(-90 * degToRad, 1, 0, 0);
		this.scale(15, 15, 0.2);
		this.materialF.apply();
		this.floorAppearance.apply();
		this.floor.display();
	this.popMatrix();

	// Left Wall
	this.pushMatrix();
		this.translate(0, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15, 8, 0.2);
		this.materialE.apply();
		//this.windowAppearance.apply();
		this.wall1.display();
	this.popMatrix();

	// Plane Wall
	this.pushMatrix();
		this.translate(7.5, 4, 0);
		this.scale(15, 8, 0.2);
		this.materialE.apply();
		this.panelAppearance.apply();
		this.wall.display();
	this.popMatrix();

	// First Table
	this.pushMatrix();
		this.translate(5, 0, 8);
		this.tableAppearance.apply();
		this.table.display();
	this.popMatrix();

/*
	// Board A
	this.pushMatrix();
		this.translate(4, 4.5, 0.2);
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		//this.materialA.apply();
		this.slidesAppearance.apply();
		this.boardA.display();
	this.popMatrix();

	// Board B
	this.pushMatrix();
		this.translate(10.5, 4.5, 0.2);
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		//this.materialB.apply();
		this.boardAppearance.apply();
		this.boardB.display();
	this.popMatrix();
*/

// Torus assento
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(5, 4, -0.6);
		this.torusAppearance.apply();
		this.torus.display();
	this.popMatrix();

  // Poster
  this.pushMatrix();
    this.rotate(90 * degToRad, 0, 1, 0);
		this.translate(-7.5, 4.5, 0.1);
		this.scale(2.5, 4, 1);
		//this.materialA.apply();
		this.posterAppearance.apply();
		this.poster.display();
	this.popMatrix();

	// ---- END Primitive drawing section

	this.shader.unbind();
};
