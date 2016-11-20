/**
 * MyVehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyVehicle(scene) {
	this.scene = scene;

  var frontTopCV = [
    [
      [-1.8, -2, 0, 1],
      [-1.8, 2, 0, 1]
    ],
    [
      [-1, -2, .3, 1],
      [-1, 2, .3, 1]
    ],
    [
      [0, -2, .7, 1],
      [0, 2, .7, 1]
    ],
    [
      [1, -2, .3, 1],
      [1, 2, .3, 1]
    ],
    [
      [1.8, -2, 0, 1],
      [1.8, 2, 0, 1]
    ]
  ];

  var backCV = [
    [
      [-1.8, -2, 0, 1],
      [-1.8, 2, 0, 1]
    ],
    [
      [-1, -2, .2, 1],
      [-1, 2, .2, 1]
    ],
    [
      [0, -2, .4, 1],
      [0, 2, .4, 1]
    ],
    [
      [1, -2, .2, 1],
      [1, 2, .2, 1]
    ],
    [
      [1.8, -2, 0, 1],
      [1.8, 2, 0, 1]
    ]
  ]

  this.frontTop = new Patch(this.scene, 4, 1, 10, 12, frontTopCV);
  this.back = new Patch(this.scene, 4, 1, 10, 12, backCV);
  this.side = new Plane(this.scene, 1, 2, 5, 5);
  this.wheel = new MyTorus(this.scene, .425, .4, 100, 100);

  this.materialA = new CGFappearance(this.scene);

  this.text_side= new CGFtexture(this.scene, "../resources/images/tram_2.png", 1, 1);
  this.text_front= new CGFtexture(this.scene, "../resources/images/tram_front_2.png", 1, 1);
  this.text_back= new CGFtexture(this.scene, "../resources/images/tram_back.png", 1, 1);
  this.text_top= new CGFtexture(this.scene, "../resources/images/tram_top.png", 1, 1);
  this.text_wheel= new CGFtexture(this.scene, "../resources/images/tram_wheel.png", 1, 1);
};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

MyVehicle.prototype.display = function () {

  //materials
  this.materialA.setAmbient(1,1,1,1,1);
	this.materialA.setDiffuse(1,1,1,1);
	this.materialA.setSpecular(1,1,1,1);

  // eletrico
  this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2, 0,1,0);
    this.scene.translate(0,2.25,6);
    this.scene.scale(.95,1,1);
    this.scene.rotate(Math.PI,0,0,1);

    this.materialA.setTexture(this.text_back);
    this.materialA.apply();

    this.back.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0,2.25,6);
    this.scene.scale(.95, 1, 1);
    this.scene.rotate(Math.PI, 0,0,1);

    this.materialA.setTexture(this.text_front);
    this.materialA.apply();

    this.frontTop.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,2.25,1.7);
    this.scene.rotate(Math.PI, 0,0,1);
    this.scene.scale(3,1,1);

    this.materialA.setTexture(this.text_side);
    this.materialA.apply();

    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0,1,0);
    this.scene.translate(0,2.25,1.7);
    this.scene.rotate(Math.PI, 0,0,1);
    this.scene.scale(3,1,1);

    this.side.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2, 0,0,1);
    this.scene.rotate(Math.PI/2, 0,1,0);
    this.scene.translate(0,0,4.15);
    this.scene.scale(1,3.2,1);

    this.materialA.setTexture(this.text_top);
    this.materialA.apply();

    this.frontTop.display();
  this.scene.popMatrix();

  //rodas
  this.scene.pushMatrix();
    this.scene.translate(-4, .85, -1.45);
    this.scene.scale(1,1,.5);

    this.materialA.setTexture(this.text_wheel);
    this.materialA.apply();

    this.wheel.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(-4, .85, 1.45);
    this.scene.scale(1,1,.5);

    this.wheel.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0, .85, -1.45);
    this.scene.scale(1,1,.5);

    this.wheel.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0, .85, 1.45);
    this.scene.scale(1,1,.5);

    this.wheel.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(4, .85, -1.45);
    this.scene.scale(1,1,.5);

    this.wheel.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(4, .85, 1.45);
    this.scene.scale(1,1,.5);

    this.wheel.display();
  this.scene.popMatrix();
};
