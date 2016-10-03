/**
 * MyBush
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBush(scene) {
	CGFobject.call(this,scene);

  this.base = new MyUnitCubeQuad(this.scene,0,1,0,1);
  this.tronco = new MyCylinder(this.scene,100,10);
  this.bush = new MySphere(this.scene,100,100);
  /*
	this.tampo = new MyUnitCubeQuad(this.scene,0,1,0,1);
	this.perna=new MyUnitCubeQuad(this.scene,0,1,0,1);
	this.materialC = new CGFappearance(this.scene);
	this.materialD = new CGFappearance(this.scene);
  */
};

MyBush.prototype = Object.create(CGFobject.prototype);
MyBush.prototype.constructor=MyBush;

MyBush.prototype.display = function () {
/*
	this.materialC.setAmbient(0.3,0.2,0,1,1);
	this.materialC.setDiffuse(0.3,0.2,0,1,1);
	this.materialC.setSpecular(0.1,0.1,0.1,1);

	this.materialD.setAmbient(0.67,0.67,0.67,1);
	this.materialD.setDiffuse(0.67,0.67,0.67,1);
	this.materialD.setSpecular(1,1,1,1);
*/

  // Base
	this.scene.pushMatrix();
    this.scene.translate(0,.5,0);
  	this.scene.scale(8, 1, 5);
  	//this.materialC.apply();
  	this.base.display();
	this.scene.popMatrix();

  // Tronco
  this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.translate(0,0,1);
    this.scene.scale(.5,.5,.4);
    this.tronco.display();
  this.scene.popMatrix();

  // bush 1
  this.scene.pushMatrix();
    this.scene.translate(-.5,5,0);
    this.scene.scale(4,2.5,2.5);
    this.bush.display();
  this.scene.popMatrix();

  // bush 2
  this.scene.pushMatrix();
    this.scene.translate(2,3.5,1.5);
    this.scene.scale(2,1.5,1.5);
    this.bush.display();
  this.scene.popMatrix();

  // bush 3
  this.scene.pushMatrix();
    this.scene.translate(-2.5,2.7,1);
    this.scene.scale(1.5,1,1);
    this.bush.display();
  this.scene.popMatrix();
};
