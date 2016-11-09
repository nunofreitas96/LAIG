
function XMLscene(interface) {
  CGFscene.call(this);
  this.myInterface = interface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  //this.grafo=[];    // TODO saber se e necessario ou basta usarmos this.graph?

  CGFscene.prototype.init.call(this, application);

  this.initCameras();


  this.enableLight = [];
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis=new CGFaxis(this);

  this.myMaterials = [];
  this.myTextures = [];

  this.myView = '';

  this.force = 0;
};

XMLscene.prototype.initLights = function () {
  for(var i =0; i < this.light.length; i++){
    if(this.light[i][0] == "omni"){
      this.lights[i].setPosition(parseFloat(this.light[i].location[0]),parseFloat(this.light[i].location[1]),parseFloat(this.light[i].location[2]),parseFloat(this.light[i].location[3]));
      this.lights[i].setAmbient(parseFloat(this.light[i].ambient[0]),parseFloat(this.light[i].ambient[1]),parseFloat(this.light[i].ambient[2]),parseFloat(this.light[i].ambient[3]));
      this.lights[i].setSpecular(parseFloat(this.light[i].specular[0]),parseFloat(this.light[i].specular[1]),parseFloat(this.light[i].specular[2]),parseFloat(this.light[i].specular[3]));
      this.lights[i].setDiffuse(parseFloat(this.light[i].diffuse[0]),parseFloat(this.light[i].diffuse[1]),parseFloat(this.light[i].diffuse[2]),parseFloat(this.light[i].diffuse[3]));

      if(this.light[i][2] == "true"){
        this.lights[i].enable();
      }

      this.lights[i].setVisible(true);
      this.lights[i].update();
      if(this.light[i][2] == "true"){
        this.enableLight[i] = true;
      }
      else{
        this.enableLight[i] = false;
      }
      this.myInterface.lightBox(i,this.light[i][1]);
    }

    if(this.light[i][0] == "spot"){
      this.lights[i].setPosition(parseFloat(this.light[i].location[0]),parseFloat(this.light[i].location[1]),parseFloat(this.light[i].location[2]),1);
      this.lights[i].setAmbient(parseFloat(this.light[i].ambient[0]),parseFloat(this.light[i].ambient[1]),parseFloat(this.light[i].ambient[2]),parseFloat(this.light[i].ambient[3]));
      this.lights[i].setSpecular(parseFloat(this.light[i].specular[0]),parseFloat(this.light[i].specular[1]),parseFloat(this.light[i].specular[2]),parseFloat(this.light[i].specular[3]));
      this.lights[i].setDiffuse(parseFloat(this.light[i].diffuse[0]),parseFloat(this.light[i].diffuse[1]),parseFloat(this.light[i].diffuse[2]),parseFloat(this.light[i].diffuse[3]));
      this.lights[i].setSpotDirection(parseFloat(this.light[i].target[0])- parseFloat(this.light[i].location[0]),parseFloat(this.light[i].target[1]) - parseFloat(this.light[i].location[1]),parseFloat(this.light[i].target[2]) - parseFloat(this.light[i].location[2]));
      if(this.light[i][2] == "true"){
        this.lights[i].enable();
      }

      this.lights[i].setVisible(true);
      this.lights[i].update();
      if(this.light[i][2] == "true"){
        this.enableLight[i] = true;
      }
      else{
        this.enableLight[i] = false;}
        this.myInterface.lightBox(i,this.light[i][1]);
      }
    }
  };

  XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
    this.myInterface.setActiveCamera(this.camera);
  };

  XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  };

  // Handler called when the graph is finally loaded.
  // As loading is asynchronous, this may be called already after the application has started the run loop
  XMLscene.prototype.onGraphLoaded = function (){
    /*
    this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
    this.lights[0].setVisible(true);
    this.lights[0].enable();
    */

    this.initLights();
  };

  XMLscene.prototype.processaGrafo= function(nodeName){
    console.log("-------------------------- "+nodeName+" --------------------------");
    var material = null;  // CGFappearance
    var texture = null;
    var length_t;
    var length_s;
    var confirmer = 0;



    if (nodeName!=null) {
      var node = this.graph[nodeName];


      //console.log("MATERIAL "+node.material+"    "+this.graph.materials[node.material]+" ____________ "+this.myMaterials);
      //console.log("TEXTURE "+node.texture+"    "+this.graph.materials[node.texture]+" ____________ "+this.myTextures);
      if(node.material != "inherit"){   // important: so tenho o 1o material guardado, o resto esta nos components
        //console.log("OTHER: "+node.material);
        this.myMaterials.push(node.material);
        material = this.graph.materials[this.myMaterials[this.myMaterials.length -1]];
      }
      else {
        //console.log("INHERIT");
        material=this.graph.materials[this.myMaterials[this.myMaterials.length -1]];
        this.myMaterials.push(this.myMaterials[this.myMaterials.length -1]);
      }


      if (node.texture != "none") {
        if (node.texture == "inherit" || this.force == 1) {
          texture = this.textures[this.myTextures[this.myTextures.length -1]];
          this.myTextures.push(this.myTextures[this.myTextures.length -1]);
        }
        else {
          this.myTextures.push(node.texture);
          texture = this.textures[this.myTextures[this.myTextures.length -1]];
          length_t = this.texSizes[this.myTextures[this.myTextures.length -1]][0];
          length_s = this.texSizes[this.myTextures[this.myTextures.length -1]][1];
          material.setTexture(texture);
          confirmer = 1;
        }
      }

      console.log("force: "+node.textForce);
      if (node.textForce == '1') {
        this.force=1;
      }
      console.log("FORCE: "+this.force);

      //console.log("MATERIAL ARRAY "+this.myMaterials+" || TEXTURE ARRAY "+this.myTextures);
      //console.log("\tPRIMITIVE "+node.primitive);
      //console.log("\tNÓ: "+node+" CHILDREN: "+node.children);

      if (node.primitive != null) {
        //console.log("MATERIAL PRIM "+nodeName+" emission: "+material.emission+" ambient: "+material.ambient+" diffuse: "+material.diffuse+" specular: "+material.specular+" shininess: "+material.shininess);
        this.pushMatrix();
        this.multMatrix(node.m);
        material.apply();
        if(this.graph.primitives[node.primitive].textResize != null && confirmer ==1 ){
          console.log("--------RESIZING---------------");
          console.log(this.graph.primitives[node.primitive]);
          console.log(length_t);
          console.log(length_s);
          this.graph.primitives[node.primitive].textResize(length_t,length_s);
        }

        this.graph.primitives[node.primitive].display();
        this.popMatrix();
        this.myMaterials.pop();
        this.myTextures.pop();
        texture=this.textures[this.myTextures[this.myTextures.length -1]];
        if (typeof texture == "undefined") {
          material.setTexture();
        }
        else {
          material.setTexture(texture);
        }
        //console.log("\tFINAL MATERIAL: "+this.myMaterials+" || FINAL TEXTURE "+this.myTextures);
      }
      else {
        for(var i = 0; i < node.children.length; i++){
          //console.log("MATERIAL FOR "+nodeName+" emission: "+material.emission+" ambient: "+material.ambient+" diffuse: "+material.diffuse+" specular: "+material.specular+" shininess: "+material.shininess);
          this.pushMatrix();    // comecamos a processar o descendente
          this.multMatrix(node.m);
          material.apply();
          this.processaGrafo(node.children[i]);
          this.popMatrix();     // recuperamos o descendente
        }
        this.force = 0;
        this.myMaterials.pop();
        this.myTextures.pop();
        texture=this.textures[this.myTextures[this.myTextures.length -1]];
        if (typeof texture == "undefined") {
          material.setTexture();
        }
        else {
          material.setTexture(texture);
        }
      }
    }
  };

  XMLscene.prototype.updateLights = function () {
    //this.lights[1].enable();
    for(var i =0; i < this.lights.length; i++ ){
      if(this.enableLight[i] == true){
        this.lights[i].enable();
      }
      else{
        this.lights[i].disable();
      }
      this.lights[i].update();
    }
  };

  XMLscene.prototype.loadView = function () {
    this.camera = this.views[this.myView];
    this.myInterface.setActiveCamera(this.camera);
  };

  XMLscene.prototype.updateView = function () {
    var size = Object.keys(this.views).length;
    var myViews = Object.keys(this.views);

    var next=0;
    for (var i = 0; i < myViews.length; i++) {
      if (this.myView == myViews[i]) {
        next = 1;
      }
      if(next == 1){
        this.myView = myViews[(i+1)%size];
        break;
      }
    }

    this.camera = this.views[this.myView];
    this.myInterface.setActiveCamera(this.camera);
    console.log("VIEW CHANGED TO: "+this.myView);
  };

  XMLscene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    this.enableTextures(true);

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();


    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk)
    {
      this.updateLights();
      if (this.myView == '') {
        this.myView = this.views_default;
      }
      this.loadView();
      this.processaGrafo(this.scene_root);
    };

  };
