
function XMLscene() {
  CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  //this.grafo=[];    // TODO saber se e necessario ou basta usarmos this.graph?

  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.initLights();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

  this.lights[0].setPosition(2, 3, 3, 1);
  this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  //TODO
  /*
  this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
  */
};

XMLscene.prototype.processaGrafo= function(nodeName){
  var material = null;
  if (nodeName!=null) {
    var node = this.graph[nodeName];

    if (node.material != null) {    // nao basta na declaracao ja referir a igualdade?
      material = this.graph.materials[node.material];
    }
    if (material != null) {
      // TODO :
      //console.log(material);
      material.apply();
      //this.mulMatrix(node.m);
    }

    if (node.primitive != null) {
      this.pushMatrix();
      console.log("XML transf "+node.m);
      this.multMatrix(node.m);
      this.graph.primitives[node.primitive].display();
      this.popMatrix();
    }

    for(var i = 0; i < node.children.length; i++){
      this.pushMatrix();    // comecamos a processar o descendente
      this.multMatrix(node.m);
      //this.applyMaterial(material);
      this.processaGrafo(node.children[i]);
      this.popMatrix();     // recuperamos o descendente
    }

  }
}

XMLscene.prototype.display = function () {
  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  // Draw axis
  this.axis.display();

  this.setDefaultAppearance();

  // graph processing --- me
  //  this.processaGrafo("1");


  // ---- END Background, camera and axis setup

  // it is important that things depending on the proper loading of the graph
  // only get executed after the graph has loaded correctly.
  // This is one possible way to do it
  if (this.graph.loadedOk)
  {

    //console.log(this.primitives[0]);
    this.lights[0].update();
    //console.log(this.scene_root);
    this.processaGrafo(this.scene_root);

  };

};
