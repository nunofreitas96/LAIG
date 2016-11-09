
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();

	this.scene.perspectives=[];
	this.scene.transformations = [];
	this.scene.illumination = [];
	this.scene.light = [];
	this.scene.textures = {};
	this.scene.texSizes = {};
	this.scene.materials=[];
	this.scene.components = [];
	this.scene.primitives = [];

	this.primitives = {};
	this.materials = {};
	this.transformations = {};
	this.omnilights = [];
	this.spotlights = [];

	this.scene.views = {};
	/*
	* Read the contents of the xml file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/

	this.reader.open('scenes/'+filename, this);
}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	//var error = this.parseGlobalsExample(rootElement);
	var error = this.parseSceneDXS(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


MySceneGraph.prototype.parseSceneDXS = function(rootElement){
	if (this.parseSceneRoot(rootElement) != null) {
		return 0;
	}
	else if (this.parseViews(rootElement) != null) {
		return 0;
	}
	else if (this.parseIllumination(rootElement) != null) {
		return 0;
	}
	else if (this.parseLights(rootElement) != null) {
		return 0;
	}
	else if (this.parseTextures(rootElement) != null) {
		return 0;
	}
	else if (this.parseMaterials(rootElement) != null) {
		return 0;
	}
	else if (this.parseTransformations(rootElement) != null) {
		return 0;
	}
	else if (this.parsePrimitives(rootElement) != null) {
		return 0;
	}
	else if (this.parseComponents(rootElement) != null) {
		return 0;
	}
	this.buildGraph();

	return;
}


MySceneGraph.prototype.parseSceneRoot = function(rootElement){
	var sceneRoot = rootElement.getElementsByTagName('scene');
	if (sceneRoot == null) {
		this.onXMLError("root not defined");
		return -1;
	}
	if (sceneRoot.length != 1 || sceneRoot[0].attributes.length != 2){
		this.onXMLError("root bad definition");
		return 0;
	}

	this.scene.scene_root = sceneRoot[0].attributes.getNamedItem("root").value;
	this.scene.scene_axis = sceneRoot[0].attributes.getNamedItem("axis_length").value;
	console.log("root id: "+this.scene.scene_root+"; axis length: "+this.scene.scene_axis);

	return;
}

MySceneGraph.prototype.parseViews = function(rootElement){
	var views = rootElement.getElementsByTagName('views');
	if(views == null){
		this.onXMLError("views not defined");
		return -1;
	}
	if (views.length != 1 || views[0].attributes.length != 1){
		this.onXMLError("views bad definition");
		return 0;
	}

	var ids = [];

	this.scene.views_default = views[0].attributes.getNamedItem("default").value;
	console.log("view default: "+this.scene.views_default);

	var tempViews=rootElement.getElementsByTagName('views');


	var descN=tempViews[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = tempViews[0].children[i];

		if (e.tagName != "perspective" || e.attributes.length != 4) {
			this.onXMLError("perspective bad definition");
			return 0;
		}
		else if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("perspective id duplicated");
			return -2;
		}
		ids[i] = e.id;

		var view = {
			near: null,
			far: null,
			angle: null,
			from: [],
			to: []
		};

		view.near = parseFloat(e.attributes.getNamedItem("near").value);
		view.far = parseFloat(e.attributes.getNamedItem("far").value);
		view.angle = parseFloat(e.attributes.getNamedItem("angle").value);
		view.from = [parseFloat(e.children[0].attributes.getNamedItem("x").value),parseFloat(e.children[0].attributes.getNamedItem("y").value),parseFloat(e.children[0].attributes.getNamedItem("z").value)];
		view.to = [parseFloat(e.children[1].attributes.getNamedItem("x").value),parseFloat(e.children[1].attributes.getNamedItem("y").value),parseFloat(e.children[1].attributes.getNamedItem("z").value)];
		this.scene.perspectives[e.id] = view;

		// so para ver
		console.log("perspective "+e.id);
		console.log("\tnear "+this.scene.perspectives[e.id].near);
		console.log("\tfar "+this.scene.perspectives[e.id].far);
		console.log("\tangle "+this.scene.perspectives[e.id].angle);
		console.log("\tfrom "+this.scene.perspectives[e.id].from);
		console.log("\tto "+this.scene.perspectives[e.id].to);


		this.scene.views[e.id] = new CGFcamera(view.angle, view.near, view.far, vec3.fromValues(view.from[0], view.from[1], view.from[2]), vec3.fromValues(view.to[0], view.to[1], view.to[2]));
		console.log(this.scene.views[e.id]);
	}

	if (ids.length = 0) {
		this.onXMLError("there must be at least one view");
		return 0;
	}


	return;
}

MySceneGraph.prototype.parseIllumination = function(rootElement){
	var illum = rootElement.getElementsByTagName('illumination');
	if( illum == null){
		this.onXMLError("root not defined");
		return -1;
	}
	if (illum.length != 1 || illum[0].attributes.length != 2) {
		this.onXMLError("illumination bad definition");
		return 0;
	}


	this.scene.illumination[0] = illum[0].attributes.getNamedItem('doublesided').value;
	this.scene.illumination[1] = illum[0].attributes.getNamedItem('local').value;

	if ((this.scene.illumination[0] != 0 && this.scene.illumination[0] != 1) || (this.scene.illumination[1] != 0 && this.scene.illumination[1] != 1)) {
		this.onXMLError("illumination attributes must be tt");
		return -1;
	}

	console.log("illumination doublesided: "+this.scene.illumination[0]+" local: "+this.scene.illumination[1]);

	this.scene.illumination.ambient=[];
	this.scene.illumination.ambient[0]=illum[0].children[0].attributes.getNamedItem("r").value;
	this.scene.illumination.ambient[1]=illum[0].children[0].attributes.getNamedItem("g").value;
	this.scene.illumination.ambient[2]=illum[0].children[0].attributes.getNamedItem("b").value;
	this.scene.illumination.ambient[3]=illum[0].children[0].attributes.getNamedItem("a").value;
	console.log("\tillumination ambient R:"+this.scene.illumination.ambient[0]+" G:"+this.scene.illumination.ambient[1]+" B:"+this.scene.illumination.ambient[2]+" A:"+this.scene.illumination.ambient[3]);

	this.scene.illumination.background=[];
	this.scene.illumination.background[0]=illum[0].children[1].attributes.getNamedItem("r").value;
	this.scene.illumination.background[1]=illum[0].children[1].attributes.getNamedItem("g").value;
	this.scene.illumination.background[2]=illum[0].children[1].attributes.getNamedItem("b").value;
	this.scene.illumination.background[3]=illum[0].children[1].attributes.getNamedItem("a").value;
	console.log("\tillumination background R:"+this.scene.illumination.background[0]+" G:"+this.scene.illumination.background[1]+" B:"+this.scene.illumination.background[2]+" A:"+this.scene.illumination.background[3]);

	return;
}

MySceneGraph.prototype.parseLights = function(rootElement){
	var lights = rootElement.getElementsByTagName('lights');
	if (lights == null) {
		this.onXMLError("lights not defined");
		return -1;
	}
	if (lights.length != 1) {
		this.onXMLError("lights bad definition");
		return 0;
	}


	var ids = [];

	var descN = lights[0].children.length;
	var i = 0;
	for (i = 0; i < descN; i++) {
		var e = lights[0].children[i];

		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("light id duplicated");
			return -1;
		}
		ids[i] = e.id;

		this.scene.light[i] = [];
		if (e.tagName == "omni") {
			this.scene.light[i][0] = "omni";
			this.scene.light[i][1] = e.id;
			this.scene.light[i][2] = e.attributes.getNamedItem('enabled').value;
			console.log("lights "+this.scene.light[i][0]+" ("+this.scene.light[i][1]+") enabled: "+	this.scene.light[i][2]);
			this.scene.light[i].location = [];
			this.scene.light[i].location[0] = e.children[0].attributes.getNamedItem('x').value;
			this.scene.light[i].location[1] = e.children[0].attributes.getNamedItem('y').value;
			this.scene.light[i].location[2] = e.children[0].attributes.getNamedItem('z').value;
			this.scene.light[i].location[3] = e.children[0].attributes.getNamedItem('w').value;
			console.log("\t location x:"+this.scene.light[i].location[0]+" y:"+this.scene.light[i].location[1]+" z:"+this.scene.light[i].location[2]+" w:"+this.scene.light[i].location[3]);
			this.scene.light[i].ambient = [];
			this.scene.light[i].ambient[0] = e.children[1].attributes.getNamedItem('r').value;
			this.scene.light[i].ambient[1] = e.children[1].attributes.getNamedItem('g').value;
			this.scene.light[i].ambient[2] = e.children[1].attributes.getNamedItem('b').value;
			this.scene.light[i].ambient[3] = e.children[1].attributes.getNamedItem('a').value;
			console.log("\t ambient r:"+this.scene.light[i].ambient[0]+" g:"+this.scene.light[i].ambient[1]+" b:"+this.scene.light[i].ambient[2]+" a:"+this.scene.light[i].ambient[3]);
			this.scene.light[i].diffuse = [];
			this.scene.light[i].diffuse[0] = e.children[2].attributes.getNamedItem('r').value;
			this.scene.light[i].diffuse[1] = e.children[2].attributes.getNamedItem('g').value;
			this.scene.light[i].diffuse[2] = e.children[2].attributes.getNamedItem('b').value;
			this.scene.light[i].diffuse[3] = e.children[2].attributes.getNamedItem('a').value;
			console.log("\t diffuse r:"+this.scene.light[i].diffuse[0]+" g:"+this.scene.light[i].diffuse[1]+" b:"+this.scene.light[i].diffuse[2]+" a:"+this.scene.light[i].diffuse[3]);
			this.scene.light[i].specular = [];
			this.scene.light[i].specular[0] = e.children[3].attributes.getNamedItem('r').value;
			this.scene.light[i].specular[1] = e.children[3].attributes.getNamedItem('g').value;
			this.scene.light[i].specular[2] = e.children[3].attributes.getNamedItem('b').value;
			this.scene.light[i].specular[3] = e.children[3].attributes.getNamedItem('a').value;
			console.log("\t specular r:"+this.scene.light[i].specular[0]+" g:"+this.scene.light[i].specular[1]+" b:"+this.scene.light[i].specular[2]+" a:"+this.scene.light[i].specular[3]);

		}
		else if (e.tagName == "spot") {
			this.scene.light[i][0] = "spot";
			this.scene.light[i][1] = e.id;
			this.scene.light[i][2] = e.attributes.getNamedItem('enabled').value;
			this.scene.light[i][3] = e.attributes.getNamedItem('angle').value;
			this.scene.light[i][4] = e.attributes.getNamedItem('exponent').value;
			console.log("lights "+this.scene.light[i][0]+" ("+this.scene.light[i][1]+") enabled: "+	this.scene.light[i][2]+" angle:"+this.scene.light[i][3]+" exponent:"+this.scene.light[i][4]);
			this.scene.light[i].target = [];
			this.scene.light[i].target[0] = e.children[0].attributes.getNamedItem('x').value;
			this.scene.light[i].target[1] = e.children[0].attributes.getNamedItem('y').value;
			this.scene.light[i].target[2] = e.children[0].attributes.getNamedItem('z').value;
			console.log("\t target x:"+this.scene.light[i].target[0]+" y:"+this.scene.light[i].target[1]+" z:"+this.scene.light[i].target[2]);
			this.scene.light[i].location = [];
			this.scene.light[i].location[0] = e.children[1].attributes.getNamedItem('x').value;
			this.scene.light[i].location[1] = e.children[1].attributes.getNamedItem('y').value;
			this.scene.light[i].location[2] = e.children[1].attributes.getNamedItem('z').value;
			console.log("\t location x:"+this.scene.light[i].location[0]+" y:"+this.scene.light[i].location[1]+" z:"+this.scene.light[i].location[2]);
			this.scene.light[i].ambient = [];
			this.scene.light[i].ambient[0] = e.children[2].attributes.getNamedItem('r').value;
			this.scene.light[i].ambient[1] = e.children[2].attributes.getNamedItem('g').value;
			this.scene.light[i].ambient[2] = e.children[2].attributes.getNamedItem('b').value;
			this.scene.light[i].ambient[3] = e.children[2].attributes.getNamedItem('a').value;
			console.log("\t ambient r:"+this.scene.light[i].ambient[0]+" g:"+this.scene.light[i].ambient[1]+" b:"+this.scene.light[i].ambient[2]+" a:"+this.scene.light[i].ambient[3]);
			this.scene.light[i].diffuse = [];
			this.scene.light[i].diffuse[0] = e.children[3].attributes.getNamedItem('r').value;
			this.scene.light[i].diffuse[1] = e.children[3].attributes.getNamedItem('g').value;
			this.scene.light[i].diffuse[2] = e.children[3].attributes.getNamedItem('b').value;
			this.scene.light[i].diffuse[3] = e.children[3].attributes.getNamedItem('a').value;
			console.log("\t diffuse r:"+this.scene.light[i].diffuse[0]+" g:"+this.scene.light[i].diffuse[1]+" b:"+this.scene.light[i].diffuse[2]+" a:"+this.scene.light[i].diffuse[3]);
			this.scene.light[i].specular = [];
			this.scene.light[i].specular[0] = e.children[4].attributes.getNamedItem('r').value;
			this.scene.light[i].specular[1] = e.children[4].attributes.getNamedItem('g').value;
			this.scene.light[i].specular[2] = e.children[4].attributes.getNamedItem('b').value;
			this.scene.light[i].specular[3] = e.children[4].attributes.getNamedItem('a').value;
			console.log("\t specular r:"+this.scene.light[i].specular[0]+" g:"+this.scene.light[i].specular[1]+" b:"+this.scene.light[i].specular[2]+" a:"+this.scene.light[i].specular[3]);
		}
	}
	if (ids.length == 0) {
		this.onXMLError("there must be at least one light omni or spot");
		return 0;
	}
	return;
}

MySceneGraph.prototype.parseTextures = function(rootElement){
	var text = rootElement.getElementsByTagName('textures');
	if (text == null) {
		this.onXMLError("textures not defined");
		return -1;
	}
	if (text.length != 1) {
		this.onXMLError("textures bad definition");
		return 0;
	}

	console.log("textures");

	var ids = [];

	var descN = text[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = text[0].children[i];
		if (e.tagName != "texture" || e.attributes.length != 4) {
			this.onXMLError("texture is missing");
			return -1;
		}
		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("texture id duplicated");
			return 0;
		}
		ids[i] = e.id;
		/*
		this.scene.textures[e.attributes.getNamedItem('id').value] = {
			file: e.attributes.getNamedItem('file').value,
			length_s: e.attributes.getNamedItem('length_s').value,
			length_t: e.attributes.getNamedItem('length_t').value
		};
		*/
		var file = e.attributes.getNamedItem('file').value;
		var length_s = e.attributes.getNamedItem('length_s').value;
		var length_t = e.attributes.getNamedItem('length_t').value;
		this.scene.textures[e.id] = new CGFtexture(this.scene, file, length_t, length_s);
		console.log("----> "+e.id+", "+this.scene.textures[e.id]);

		this.scene.texSizes[e.id] = [length_t, length_s];
		console.log("----> "+e.id+", "+this.scene.textures[e.id]);
		/*
		this.scene.textures[i][0]=e.attributes.getNamedItem('id').value;
		this.scene.textures[i][1]=e.attributes.getNamedItem('file').value;
		this.scene.textures[i][2]=e.attributes.getNamedItem('length_s').value;
		this.scene.textures[i][3]=e.attributes.getNamedItem('length_t').value;
		*/
		//var t= new Texture(this.scene.textures[i][0],this.scene.textures[i][1],this.scene.textures[i][2],this.scene.textures[i][3]);
		//console.log("\ttexture ("+this.scene.textures[i][0]+") file:"+this.scene.textures[i][1]+" length_s:"+this.scene.textures[i][2]+" length_t:"+this.scene.textures[i][3]);
		//console.log("\ttexture ("+e.id+") file:"+this.scene.textures[e.id].file+" length_s:"+this.scene.textures[e.id].length_s+" length_t:"+this.scene.textures[e.id].length_t);
	}

	if (ids.length == 0) {
		this.onXMLError("there must be at leat one texture");
		return 0;
	}
	return;
}

MySceneGraph.prototype.parseMaterials = function(rootElement){

	var mats = rootElement.getElementsByTagName('materials');
	if (mats == null) {
		this.onXMLError("materials not defined");
		return -1;
	}

	var tempMats=rootElement.getElementsByTagName('materials');
	if (tempMats == null || tempMats.length == 0) {
		this.onXMLError("materials are missing");
		return 0;
	}



	var ids = [];

	var descN=mats[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = mats[0].children[i];
		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("material id duplicated");
			return 0;
		}
		ids[i] = e.id;
		this.scene.materials[e.id]=[];
		var descNN = e.children.length;

		console.log("material "+e.id);

		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			if (f.tagName == "emission") {
				this.scene.materials[e.id].emission = [];
				this.scene.materials[e.id].emission[0] = f.attributes.getNamedItem('r').value;
				this.scene.materials[e.id].emission[1] = f.attributes.getNamedItem('g').value;
				this.scene.materials[e.id].emission[2] = f.attributes.getNamedItem('b').value;
				this.scene.materials[e.id].emission[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" emission r:"+this.scene.materials[e.id].emission[0]+" g:"+this.scene.materials[e.id].emission[1]+" b:"+this.scene.materials[e.id].emission[2]+" a:"+this.scene.materials[e.id].emission[3]);
			}
			else if (f.tagName == "ambient") {
				this.scene.materials[e.id].ambient = [];
				this.scene.materials[e.id].ambient[0] = f.attributes.getNamedItem('r').value;
				this.scene.materials[e.id].ambient[1] = f.attributes.getNamedItem('g').value;
				this.scene.materials[e.id].ambient[2] = f.attributes.getNamedItem('b').value;
				this.scene.materials[e.id].ambient[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" ambient r:"+this.scene.materials[e.id].ambient[0]+" g:"+this.scene.materials[e.id].ambient[1]+" b:"+this.scene.materials[e.id].ambient[2]+" a:"+this.scene.materials[e.id].ambient[3]);
			}
			else if (f.tagName == "diffuse") {
				this.scene.materials[e.id].diffuse = [];
				this.scene.materials[e.id].diffuse[0] = f.attributes.getNamedItem('r').value;
				this.scene.materials[e.id].diffuse[1] = f.attributes.getNamedItem('g').value;
				this.scene.materials[e.id].diffuse[2] = f.attributes.getNamedItem('b').value;
				this.scene.materials[e.id].diffuse[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" diffuse r:"+this.scene.materials[e.id].diffuse[0]+" g:"+this.scene.materials[e.id].diffuse[1]+" b:"+this.scene.materials[e.id].diffuse[2]+" a:"+this.scene.materials[e.id].diffuse[3]);
			}
			else if (f.tagName == "specular") {
				this.scene.materials[e.id].specular = [];
				this.scene.materials[e.id].specular[0] = f.attributes.getNamedItem('r').value;
				this.scene.materials[e.id].specular[1] = f.attributes.getNamedItem('g').value;
				this.scene.materials[e.id].specular[2] = f.attributes.getNamedItem('b').value;
				this.scene.materials[e.id].specular[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" specular r:"+this.scene.materials[e.id].specular[0]+" g:"+this.scene.materials[e.id].specular[1]+" b:"+this.scene.materials[e.id].specular[2]+" a:"+this.scene.materials[e.id].specular[3]);
			}
			else if (f.tagName == "shininess") {
				this.scene.materials[e.id].shininess =  f.attributes.getNamedItem('value').value;
				console.log("\tmaterial "+e.id+" shininess:"+this.scene.materials[e.id].shininess);
			}
		}

		var material = new CGFappearance(this.scene);
			material.setEmission(this.scene.materials[e.id].emission[0], this.scene.materials[e.id].emission[1], this.scene.materials[e.id].emission[2], this.scene.materials[e.id].emission[3]);
			material.setAmbient(this.scene.materials[e.id].ambient[0], this.scene.materials[e.id].ambient[1], this.scene.materials[e.id].ambient[2], this.scene.materials[e.id].ambient[3]);
			material.setDiffuse(this.scene.materials[e.id].diffuse[0], this.scene.materials[e.id].diffuse[1], this.scene.materials[e.id].diffuse[2], this.scene.materials[e.id].diffuse[3]);
			material.setSpecular(this.scene.materials[e.id].specular[0], this.scene.materials[e.id].specular[1], this.scene.materials[e.id].specular[2], this.scene.materials[e.id].specular[3]);
			material.setShininess(this.scene.materials[e.id].shininess);
			//console.log(e.id);
			this.materials[e.id] = material;
			//console.log("-----> "+this.materials[e.id].shininess);
	}

	if (ids.length == 0) {
		this.onXMLError("there must be at least one material");
		return 0;
	}

	return;
}

MySceneGraph.prototype.parseTransformations = function(rootElement){	//TODO
	var transf = rootElement.getElementsByTagName('transformations');
	if (transf == null) {
		this.onXMLError("transformations not defined");
		return -1;
	}
	if (transf.length != 1) {
		this.onXMLError("transformations bad definition");
		return 0;
	}

	var ids = [];
	console.log("transformations");

	var descN = transf[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = transf[0].children[i];

		if (e.tagName != "transformation" || e.attributes.length != 1 || ids.indexOf(e.id) >= 0) {
			this.onXMLError("transformation is missing");
			return 0;
		}

		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("transformation id duplicated");
			return 0;
		}
		ids[i] = e.id;


		this.scene.transformations[i]=[];

		this.scene.transformations[i][0] = e.id;


		var descNN = e.children.length;

		//TO

		var matrix = mat4.create();
		this.transformations[e.id] = matrix;

		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			var matrix = mat4.create();
			var matrix2 = this.transformations[e.id];

			if (f.tagName == "translate") {
				this.scene.transformations[i].translate = [];
				this.scene.transformations[i][1] = "translate";
				this.scene.transformations[i].translate[0] = parseFloat(f.attributes.getNamedItem('x').value);
				this.scene.transformations[i].translate[1] = parseFloat(f.attributes.getNamedItem('y').value);
				this.scene.transformations[i].translate[2] = parseFloat(f.attributes.getNamedItem('z').value);
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") x:"+this.scene.transformations[i].translate[0]+" y:"+this.scene.transformations[i].translate[1]+" z:"+this.scene.transformations[i].translate[2]);
				var coords = [this.scene.transformations[i].translate[0], this.scene.transformations[i].translate[1], this.scene.transformations[i].translate[2]];
				mat4.translate(matrix, matrix2, coords);
				console.log("\t\tmatrix: "+matrix);
			}
			else if (f.tagName == "rotate") {
				this.scene.transformations[i].rotate = [];
				this.scene.transformations[i][1] = "rotate";
				this.scene.transformations[i].rotate[0] = f.attributes.getNamedItem('axis').value;
				this.scene.transformations[i].rotate[1] = f.attributes.getNamedItem('angle').value;
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") axis:"+this.scene.transformations[i].rotate[0]+" angle:"+this.scene.transformations[i].rotate[1]);
				var angle = parseFloat(this.scene.transformations[i].rotate[1]) * (Math.PI/180);
				var coords;
				if (this.scene.transformations[i].rotate[0] == "x") {
					coords = [1, 0, 0];
				}
				else if (this.scene.transformations[i].rotate[0] == "y") {
					coords = [0, 1, 0];
				}
				else if (this.scene.transformations[i].rotate[0] == "z") {
					coords = [0, 0, 1];
				}
				mat4.rotate(matrix, matrix2, angle, coords);
				console.log("\t\tmatrix "+matrix);
			}
			else if (f.tagName == "scale") {
				this.scene.transformations[i].scale = [];
				this.scene.transformations[i][1] = "scale";
				this.scene.transformations[i].scale[0] = parseFloat(f.attributes.getNamedItem('x').value);
				this.scene.transformations[i].scale[1] = parseFloat(f.attributes.getNamedItem('y').value);
				this.scene.transformations[i].scale[2] = parseFloat(f.attributes.getNamedItem('z').value);
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") x:"+this.scene.transformations[i].scale[0]+" y:"+this.scene.transformations[i].scale[1]+" z:"+this.scene.transformations[i].scale[2]);
				var coords = [this.scene.transformations[i].scale[0], this.scene.transformations[i].scale[1], this.scene.transformations[i].scale[2]];
				mat4.scale(matrix, matrix2, coords);
			}

			this.transformations[e.id] = matrix;
		}
	}
	if (ids.length == 0) {
		this.onXMLError("there must be at least one transformation");
		return 0;
	}
	return;
}

MySceneGraph.prototype.parsePrimitives = function(rootElement){
	var prim = rootElement.getElementsByTagName('primitives');
	if (prim == null) {
		this.onXMLError("primitives not defined");
		return -1;
	}
	if (prim.length != 1) {
		this.onXMLError("primitives bad definition");
		return 0;
	}

	console.log("primitives");

	var ids = [];

	var descN = prim[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = prim[0].children[i];
		if (e.tagName != "primitive" || e.attributes.length != 1) {
			this.onXMLError("primitive is missing");
			return 0;
		}

		this.scene.primitives = [];
		this.scene.primitives[i] = [];
		if (e.tagName == "primitive" && ids.indexOf(e.id) < 0) {
			ids[i] = e.id;
			var f = e.children[0];
			this.scene.primitives[i][0] = f.tagName;
			this.scene.primitives[i][1] = e.id;
			if (f.tagName == "rectangle") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("x1").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("y1").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("x2").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("y2").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") x1:"+this.scene.primitives[i][2]+" y1:"+this.scene.primitives[i][3]+" x2:"+this.scene.primitives[i][4]+" y2:"+this.scene.primitives[i][5]);

				var rectangle = new MyQuad(this.scene, parseInt(this.scene.primitives[i][2]),parseInt(this.scene.primitives[i][4]),parseInt(this.scene.primitives[i][3]),parseInt(this.scene.primitives[i][5]));
				this.primitives[e.id] = rectangle;
			}
			else if (f.tagName == "triangle") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("x1").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("y1").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("z1").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("x2").value;
				this.scene.primitives[i][6] = f.attributes.getNamedItem("y2").value;
				this.scene.primitives[i][7] = f.attributes.getNamedItem("z2").value;
				this.scene.primitives[i][8] = f.attributes.getNamedItem("x3").value;
				this.scene.primitives[i][9] = f.attributes.getNamedItem("y3").value;
				this.scene.primitives[i][10] = f.attributes.getNamedItem("z3").value;
				this.primitives[i] = this.scene.primitives[i];

				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") x1:"+this.scene.primitives[i][2]+" y1:"+this.scene.primitives[i][3]+" x2:"+this.scene.primitives[i][4]+" y2:"+this.scene.primitives[i][5]);
				var triangle = new MyTriangle(this.scene,parseFloat(this.scene.primitives[i][2]),parseFloat(this.scene.primitives[i][3]),parseFloat(this.scene.primitives[i][4]),parseFloat(this.scene.primitives[i][5]),parseFloat(this.scene.primitives[i][6]),parseFloat(this.scene.primitives[i][7]),parseFloat(this.scene.primitives[i][8]),parseFloat(this.scene.primitives[i][9]),parseFloat(this.scene.primitives[i][10]));
				this.primitives[e.id] = triangle;
			}
			else if (f.tagName == "cylinder") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("base").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("top").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("height").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][6] = f.attributes.getNamedItem("stacks").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") base:"+this.scene.primitives[i][2]+" top:"+this.scene.primitives[i][3]+" height:"+this.scene.primitives[i][4]+" slices:"+this.scene.primitives[i][5]+" stacks:"+this.scene.primitives[i][6]);
				var cyl = new MyCylinder(this.scene,parseFloat(this.scene.primitives[i][4]),parseFloat(this.scene.primitives[i][2]),parseFloat(this.scene.primitives[i][3]),parseFloat(this.scene.primitives[i][6]),parseFloat(this.scene.primitives[i][5]) );
				this.primitives[e.id] = cyl;
			}
			else if (f.tagName == "sphere") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("radius").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("stacks").value;
				//this.primitives[i] = this.scene.primitives[i];
				var sphere = new MySphere(this.scene,parseInt(this.scene.primitives[i][2]),parseInt(this.scene.primitives[i][3]), parseInt(this.scene.primitives[i][4]));
				this.primitives[e.id] = sphere;
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") radius:"+this.scene.primitives[i][2]+" slices:"+this.scene.primitives[i][3]+" stacks:"+this.scene.primitives[i][4]);
			}
			else if (f.tagName == "torus") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("inner").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("outer").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("loops").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+" inner:"+this.scene.primitives[i][2]+" outer:"+this.scene.primitives[i][3]+" slices:"+this.scene.primitives[i][4]+" stacks:"+this.scene.primitives[i][5]);
				var torus = new MyTorus(this.scene,parseFloat(this.scene.primitives[i][2]),parseFloat(this.scene.primitives[i][3]),parseInt(this.scene.primitives[i][4]),parseInt(this.scene.primitives[i][5]));
				this.primitives[e.id] = torus;
			}
			else if (f.tagName == "diamond") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("slices").value;
				var diamond = new MyDiamond(this.scene, parseInt(this.scene.primitives[i][2]));
				//var diamond = new MyDiamond(this.scene, 8);
				this.primitives[e.id] = diamond;
			}
		}
		else {
			this.onXMLError("primitive bad definition or id duplicated");
			return 0;
		}
	}

	if (ids.length == 0) {
		this.onXMLError("there must be at least one primitive");
		return 0;
	}

	return;
}

MySceneGraph.prototype.parseComponents = function(rootElement){

	var comps = rootElement.getElementsByTagName('components');
	if (comps == null) {
		this.onXMLError("components not defined");
		return 0;
	}
	if (comps.length != 1) {
		this.onXMLError("components bad definition");
		return 0;
	}

	console.log("components");
	var ids = [];

	var descN = comps[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = comps[0].children[i];

		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("component id duplicated");
			return 0;
		}
		ids[i] = e.id;

		if (e.tagName != "component") {
			this.onXMLError("component bad definition");
			return 0;
		}

		var transfs = 0;
		var mats = 0;
		var texts = 0;
		var childs = 0;

		this.scene.components[i] = {
			id: e.attributes.getNamedItem('id').value
		};
		//this.scene.components[i] = e.attributes.getNamedItem('id').value;
		this.scene.components[i].transformation = [];
		this.scene.components[i].materials = [];
		//this.scene.components[i].texture = [];
		this.scene.components[i].children = [];


		console.log(typeof this.scene.components[i]);

		console.log("\tcomponent "+this.scene.components[i].id);
		var descNN = e.children.length;
		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			// transformation
			if (f.tagName == "transformation") {
				transfs++;
				console.log("\t\ttransformation");
				for(var k = 0; k < f.children.length; k++){
					var g = f.children[k];
					if(g.tagName == "transformationref"){
						this.scene.components[i].transformation.push(["transformationref", g.attributes.getNamedItem('id').value]);
						console.log("\t\t\t"+this.scene.components[i].transformation[this.scene.components[i].transformation.length -1]);
						//continue;
					}// TODO test this:
					else if (g.tagName == "translate") {
						this.scene.components[i].transformation.push(["translate", parseFloat(g.attributes.getNamedItem('x').value), parseFloat(g.attributes.getNamedItem('y').value), parseFloat(g.attributes.getNamedItem('z').value)]);
						console.log("\t\t\t"+this.scene.components[i].transformation[this.scene.components[i].transformation.length -1]);
					}
					else if (g.tagName == "rotate") {
						this.scene.components[i].transformation.push(["rotate", g.attributes.getNamedItem('axis').value, parseFloat(g.attributes.getNamedItem('angle').value)]);
						console.log("\t\t\t"+this.scene.components[i].transformation[this.scene.components[i].transformation.length -1]);
					}
					else if (g.tagName == "scale") {
						this.scene.components[i].transformation.push(["scale", parseFloat(g.attributes.getNamedItem('x').value), parseFloat(g.attributes.getNamedItem('y').value), parseFloat(g.attributes.getNamedItem('z').value)]);
						console.log("\t\t\t"+this.scene.components[i].transformation[this.scene.components[i].transformation.length -1]);
					}
				}
			}
			else if (f.tagName == "materials") {
				mats++;
				console.log("\t\tmaterials");
				for (var k = 0; k < f.children.length; k++) {
					var g = f.children[k];
					if (g.tagName == "material") {
						this.scene.components[i].materials.push(g.attributes.getNamedItem('id').value);
						console.log("\t\t\tmaterial "+ this.scene.components[i].materials[this.scene.components[i].materials.length -1]);
					}
					else {
						// sera preciso??
					}
				}
			}
			else if (f.tagName == "texture") {
				texts++;
				this.scene.components[i].texture = f.attributes.getNamedItem('id').value;
				console.log("\t\ttexture "+this.scene.components[i].texture);
			}
			else if (f.tagName == "children") {
				childs++;
				console.log("\t\tchildren");
				for (var k = 0; k < f.children.length; k++) {
					this.scene.components[i].children.push([f.children[k].tagName, f.children[k].attributes.getNamedItem('id').value]);
					console.log("\t\t\t"+this.scene.components[i].children[this.scene.components[i].children.length -1]);
				}
			}
		}
	}

	return;
}


MySceneGraph.prototype.buildGraph = function(){
	//console.log(this.scene.components.length);
	for (var i = 0; i < this.scene.components.length; i++) {
		//console.log("\t"+this.scene.components[i].id);
		var no = this.scene.components[i].id;
		this[no] = {
			material : null,
			m: [],
			texture: null,
			primitive: null,
			children: []
		};

		// material <- o primeiro material
		this[no].material = this.scene.components[i].materials[0];
		//console.log("______"+this[no].material);

		// transformacoes
		var matrix= mat4.create();
		this[no].m = matrix;
		for (var j = 0; j < this.scene.components[i].transformation.length; j++) {
			var matrix = mat4.create();
			var matrix2 = this[no].m;
			if(typeof this.scene.components[i].transformation[j] != 'undefined'){
				//console.log("TRANFS ("+no+") "+this.scene.components[i].transformation[j]);
				if(this.scene.components[i].transformation[j][0] == "transformationref"){
					matrix = this.transformations[this.scene.components[i].transformation[0][1]];
					//console.log("ref "+ matrix);
				}
				else if (this.scene.components[i].transformation[j][0] == "translate") {
					var coords = [this.scene.components[i].transformation[j][1], this.scene.components[i].transformation[j][2], this.scene.components[i].transformation[j][3]];
					mat4.translate(matrix, matrix2, coords);
					//console.log("trans "+ matrix);
				}
				else if (this.scene.components[i].transformation[j][0] == "scale") {
					var coords = [this.scene.components[i].transformation[j][1], this.scene.components[i].transformation[j][2], this.scene.components[i].transformation[j][3]];
					mat4.scale(matrix, matrix2, coords);
					//console.log("scale "+matrix);
				}
				else if (this.scene.components[i].transformation[j][0] == "rotate") {
					var coords;
					if (this.scene.components[i].transformation[j][1] == "x") {
						coords = [1, 0, 0];
					}
					else if (this.scene.components[i].transformation[j][1] == "y") {
						coords = [0, 1, 0];
					}
					else if (this.scene.components[i].transformation[j][1] == "z") {
						coords = [0, 0, 1];
					}
					mat4.rotate(matrix,matrix2, parseFloat(this.scene.components[i].transformation[j][2])*(Math.PI/180), coords);
					//console.log("rot "+matrix);
				}
			}
			//console.log(matrix);
			this[no].m = matrix;
		}

		// texture
		this[no].texture = this.scene.components[i].texture;
		//console.log("\t\tchildren: "+this.scene.components[i].children.length);
		for (var j = 0; j < this.scene.components[i].children.length; j++) {
			//console.log("\t\t"+this.scene.components[i].children[j]);
			//console.log("\t\t\t"+this.scene.components[i].children[j][0]);
			//console.log("\t\t\t"+this.scene.components[i].children[j][1]);
			if (this.scene.components[i].children[j][0] =="primitiveref") {
				this[no].primitive = this.scene.components[i].children[j][1];
				//console.log("A MINHA PRIMITIVA "+this[no].primitive);
			}
			else if (this.scene.components[i].children[j][0] =="componentref") {
				this[no].children.push(this.scene.components[i].children[j][1]);
			}
		}
	}

	return;
}

MySceneGraph.prototype.updateView = function () {
	console.log("OKOKOKOKOKOKOK");
};


/*
* Example of method that parses elements of one block and stores information in a specific data structure
*/


MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};

/*
* Callback to be executed on any read error
*/

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
