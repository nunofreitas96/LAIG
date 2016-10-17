
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();

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
	return;
}

// TODO se necessario converter de string para o tipo pedido

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

	this.scene_root = sceneRoot[0].attributes.getNamedItem("root").value;
	this.scene_axis = sceneRoot[0].attributes.getNamedItem("axis_length").value;
	console.log("root id: "+this.scene_root+"; axis length: "+this.scene_axis);

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

	this.views_default = views[0].attributes.getNamedItem("default").value;
	console.log("view default: "+this.views_default);

	var tempViews=rootElement.getElementsByTagName('views');
	this.perspectives=[];

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

		this.perspectives[e.id]=[];
		this.perspectives[e.id][0] = e.attributes.getNamedItem("near").value;
		this.perspectives[e.id][1] = e.attributes.getNamedItem("far").value;
		this.perspectives[e.id][2] = e.attributes.getNamedItem("angle").value;
		console.log("perspective "+e.id+" near: "+this.perspectives[e.id][0]+" far: "+this.perspectives[e.id][1]+" angle: "+this.perspectives[e.id][2]);

		var descNN = e.children.length;
		this.perspectives[e.id].from=[];
		this.perspectives[e.id].from[0]=e.children[0].attributes.getNamedItem("x").value;
		this.perspectives[e.id].from[1]=e.children[0].attributes.getNamedItem("y").value;
		this.perspectives[e.id].from[2]=e.children[0].attributes.getNamedItem("z").value;
		console.log("\t"+e.id+" perspective from with x:"+this.perspectives[e.id].from[0]+" y:"+this.perspectives[e.id].from[1]+" z:"+this.perspectives[e.id].from[2]);

		this.perspectives[e.id].to=[];
		this.perspectives[e.id].to[0]=e.children[1].attributes.getNamedItem("x").value;
		this.perspectives[e.id].to[1]=e.children[1].attributes.getNamedItem("y").value;
		this.perspectives[e.id].to[2]=e.children[1].attributes.getNamedItem("z").value;
		console.log("\t"+e.id+" perspective to with x:"+this.perspectives[e.id].to[0]+" y:"+this.perspectives[e.id].to[1]+" z:"+this.perspectives[e.id].to[2]);
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
	this.illumination = [];

	this.illumination[0] = illum[0].attributes.getNamedItem('doublesided').value;
	this.illumination[1] = illum[0].attributes.getNamedItem('local').value;

	if ((this.illumination[0] != 0 && this.illumination[0] != 1) || (this.illumination[1] != 0 && this.illumination[1] != 1)) {
		this.onXMLError("illumination attributes must be tt");
		return -1;
	}

	console.log("illumination doublesided: "+this.illumination[0]+" local: "+this.illumination[1]);

	this.illumination.ambient=[];
	this.illumination.ambient[0]=illum[0].children[0].attributes.getNamedItem("r").value;
	this.illumination.ambient[1]=illum[0].children[0].attributes.getNamedItem("g").value;
	this.illumination.ambient[2]=illum[0].children[0].attributes.getNamedItem("b").value;
	this.illumination.ambient[3]=illum[0].children[0].attributes.getNamedItem("a").value;
	console.log("\tillumination ambient R:"+this.illumination.ambient[0]+" G:"+this.illumination.ambient[1]+" B:"+this.illumination.ambient[2]+" A:"+this.illumination.ambient[3]);

	this.illumination.background=[];
	this.illumination.background[0]=illum[0].children[1].attributes.getNamedItem("r").value;
	this.illumination.background[1]=illum[0].children[1].attributes.getNamedItem("g").value;
	this.illumination.background[2]=illum[0].children[1].attributes.getNamedItem("b").value;
	this.illumination.background[3]=illum[0].children[1].attributes.getNamedItem("a").value;
	console.log("\tillumination background R:"+this.illumination.background[0]+" G:"+this.illumination.background[1]+" B:"+this.illumination.background[2]+" A:"+this.illumination.background[3]);

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

	this.light = [];
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

		this.light[i] = [];
		if (e.tagName == "omni") {
			this.light[i][0] = "omni";
			this.light[i][1] = e.id;
			this.light[i][2] = e.attributes.getNamedItem('enabled').value;
			console.log("lights "+this.light[i][0]+" ("+this.light[i][1]+") enabled: "+	this.light[i][2]);
			this.light[i].location = [];
			this.light[i].location[0] = e.children[0].attributes.getNamedItem('x').value;
			this.light[i].location[1] = e.children[0].attributes.getNamedItem('y').value;
			this.light[i].location[2] = e.children[0].attributes.getNamedItem('z').value;
			this.light[i].location[3] = e.children[0].attributes.getNamedItem('w').value;
			console.log("\t location x:"+this.light[i].location[0]+" y:"+this.light[i].location[1]+" z:"+this.light[i].location[2]+" w:"+this.light[i].location[3]);
			this.light[i].ambient = [];
			this.light[i].ambient[0] = e.children[1].attributes.getNamedItem('r').value;
			this.light[i].ambient[1] = e.children[1].attributes.getNamedItem('g').value;
			this.light[i].ambient[2] = e.children[1].attributes.getNamedItem('b').value;
			this.light[i].ambient[3] = e.children[1].attributes.getNamedItem('a').value;
			console.log("\t ambient r:"+this.light[i].ambient[0]+" g:"+this.light[i].ambient[1]+" b:"+this.light[i].ambient[2]+" a:"+this.light[i].ambient[3]);
			this.light[i].diffuse = [];
			this.light[i].diffuse[0] = e.children[2].attributes.getNamedItem('r').value;
			this.light[i].diffuse[1] = e.children[2].attributes.getNamedItem('g').value;
			this.light[i].diffuse[2] = e.children[2].attributes.getNamedItem('b').value;
			this.light[i].diffuse[3] = e.children[2].attributes.getNamedItem('a').value;
			console.log("\t diffuse r:"+this.light[i].diffuse[0]+" g:"+this.light[i].diffuse[1]+" b:"+this.light[i].diffuse[2]+" a:"+this.light[i].diffuse[3]);
			this.light[i].specular = [];
			this.light[i].specular[0] = e.children[3].attributes.getNamedItem('r').value;
			this.light[i].specular[1] = e.children[3].attributes.getNamedItem('g').value;
			this.light[i].specular[2] = e.children[3].attributes.getNamedItem('b').value;
			this.light[i].specular[3] = e.children[3].attributes.getNamedItem('a').value;
			console.log("\t specular r:"+this.light[i].specular[0]+" g:"+this.light[i].specular[1]+" b:"+this.light[i].specular[2]+" a:"+this.light[i].specular[3]);
		}
		else if (e.tagName == "spot") {
			this.light[i][0] = "spot";
			this.light[i][1] = e.id;
			this.light[i][2] = e.attributes.getNamedItem('enabled').value;
			this.light[i][3] = e.attributes.getNamedItem('angle').value;
			this.light[i][4] = e.attributes.getNamedItem('exponent').value;
			console.log("lights "+this.light[i][0]+" ("+this.light[i][1]+") enabled: "+	this.light[i][2]+" angle:"+this.light[i][3]+" exponent:"+this.light[i][4]);
			this.light[i].target = [];
			this.light[i].target[0] = e.children[0].attributes.getNamedItem('x').value;
			this.light[i].target[1] = e.children[0].attributes.getNamedItem('y').value;
			this.light[i].target[2] = e.children[0].attributes.getNamedItem('z').value;
			console.log("\t target x:"+this.light[i].target[0]+" y:"+this.light[i].target[1]+" z:"+this.light[i].target[2]);
			this.light[i].location = [];
			this.light[i].location[0] = e.children[1].attributes.getNamedItem('x').value;
			this.light[i].location[1] = e.children[1].attributes.getNamedItem('y').value;
			this.light[i].location[2] = e.children[1].attributes.getNamedItem('z').value;
			console.log("\t location x:"+this.light[i].location[0]+" y:"+this.light[i].location[1]+" z:"+this.light[i].location[2]);
			this.light[i].ambient = [];
			this.light[i].ambient[0] = e.children[2].attributes.getNamedItem('r').value;
			this.light[i].ambient[1] = e.children[2].attributes.getNamedItem('g').value;
			this.light[i].ambient[2] = e.children[2].attributes.getNamedItem('b').value;
			this.light[i].ambient[3] = e.children[2].attributes.getNamedItem('a').value;
			console.log("\t ambient r:"+this.light[i].ambient[0]+" g:"+this.light[i].ambient[1]+" b:"+this.light[i].ambient[2]+" a:"+this.light[i].ambient[3]);
			this.light[i].diffuse = [];
			this.light[i].diffuse[0] = e.children[3].attributes.getNamedItem('r').value;
			this.light[i].diffuse[1] = e.children[3].attributes.getNamedItem('g').value;
			this.light[i].diffuse[2] = e.children[3].attributes.getNamedItem('b').value;
			this.light[i].diffuse[3] = e.children[3].attributes.getNamedItem('a').value;
			console.log("\t diffuse r:"+this.light[i].diffuse[0]+" g:"+this.light[i].diffuse[1]+" b:"+this.light[i].diffuse[2]+" a:"+this.light[i].diffuse[3]);
			this.light[i].specular = [];
			this.light[i].specular[0] = e.children[4].attributes.getNamedItem('r').value;
			this.light[i].specular[1] = e.children[4].attributes.getNamedItem('g').value;
			this.light[i].specular[2] = e.children[4].attributes.getNamedItem('b').value;
			this.light[i].specular[3] = e.children[4].attributes.getNamedItem('a').value;
			console.log("\t specular r:"+this.light[i].specular[0]+" g:"+this.light[i].specular[1]+" b:"+this.light[i].specular[2]+" a:"+this.light[i].specular[3]);
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
	this.textures = [];
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
		this.textures[i] = [];
		this.textures[i][0]=e.attributes.getNamedItem('id').value;
		this.textures[i][1]=e.attributes.getNamedItem('file').value;
		this.textures[i][2]=e.attributes.getNamedItem('length_s').value;
		this.textures[i][3]=e.attributes.getNamedItem('length_t').value;
		console.log("\ttexture ("+this.textures[i][0]+") file:"+this.textures[i][1]+" length_s:"+this.textures[i][2]+" length_t:"+this.textures[i][3]);
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


	this.materials=[];
	var ids = [];

	var descN=mats[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = mats[0].children[i];
		if (ids.indexOf(e.id) >= 0) {
			this.onXMLError("material id duplicated");
			return 0;
		}
		ids[i] = e.id;
		this.materials[e.id]=[];
		var descNN = e.children.length;

		console.log("material "+e.id);

		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			if (f.tagName == "emission") {
				this.materials[e.id].emission = [];
				this.materials[e.id].emission[0] = f.attributes.getNamedItem('r').value;
				this.materials[e.id].emission[1] = f.attributes.getNamedItem('g').value;
				this.materials[e.id].emission[2] = f.attributes.getNamedItem('b').value;
				this.materials[e.id].emission[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" emission r:"+this.materials[e.id].emission[0]+" g:"+this.materials[e.id].emission[1]+" b:"+this.materials[e.id].emission[2]+" a:"+this.materials[e.id].emission[3]);
			}
			else if (f.tagName == "ambient") {
				this.materials[e.id].ambient = [];
				this.materials[e.id].ambient[0] = f.attributes.getNamedItem('r').value;
				this.materials[e.id].ambient[1] = f.attributes.getNamedItem('g').value;
				this.materials[e.id].ambient[2] = f.attributes.getNamedItem('b').value;
				this.materials[e.id].ambient[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" ambient r:"+this.materials[e.id].ambient[0]+" g:"+this.materials[e.id].ambient[1]+" b:"+this.materials[e.id].ambient[2]+" a:"+this.materials[e.id].ambient[3]);
			}
			else if (f.tagName == "diffuse") {
				this.materials[e.id].diffuse = [];
				this.materials[e.id].diffuse[0] = f.attributes.getNamedItem('r').value;
				this.materials[e.id].diffuse[1] = f.attributes.getNamedItem('g').value;
				this.materials[e.id].diffuse[2] = f.attributes.getNamedItem('b').value;
				this.materials[e.id].diffuse[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" diffuse r:"+this.materials[e.id].diffuse[0]+" g:"+this.materials[e.id].diffuse[1]+" b:"+this.materials[e.id].diffuse[2]+" a:"+this.materials[e.id].diffuse[3]);
			}
			else if (f.tagName == "specular") {
				this.materials[e.id].specular = [];
				this.materials[e.id].specular[0] = f.attributes.getNamedItem('r').value;
				this.materials[e.id].specular[1] = f.attributes.getNamedItem('g').value;
				this.materials[e.id].specular[2] = f.attributes.getNamedItem('b').value;
				this.materials[e.id].specular[3] = f.attributes.getNamedItem('a').value;
				console.log("\tmaterial "+e.id+" specular r:"+this.materials[e.id].specular[0]+" g:"+this.materials[e.id].specular[1]+" b:"+this.materials[e.id].specular[2]+" a:"+this.materials[e.id].specular[3]);
			}
			else if (f.tagName == "shininess") {
				this.materials[e.id].shininess =  f.attributes.getNamedItem('value').value;
				console.log("\tmaterial "+e.id+" shininess:"+this.materials[e.id].shininess);
			}
		}
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

		this.transformations = [];
		this.transformations[i]=[];

		this.transformations[i][0] = e.id;

		var descNN = e.children.length;

		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			if (f.tagName == "translate") {
				this.transformations[i].translate = [];
				this.transformations[i][1] = "translate";
				this.transformations[i].translate[0] = f.attributes.getNamedItem('x').value;
				this.transformations[i].translate[1] = f.attributes.getNamedItem('y').value;
				this.transformations[i].translate[2] = f.attributes.getNamedItem('z').value;
				console.log("\ttransformation "+  this.transformations[i][1]+" ("+this.transformations[i][0]+") x:"+this.transformations[i].translate[0]+" y:"+this.transformations[i].translate[1]+" z:"+this.transformations[i].translate[2]);
			}
			else if (f.tagName == "rotate") {
				this.transformations[i].rotate = [];
				this.transformations[i][1] = "rotate";
				this.transformations[i].rotate[0] = f.attributes.getNamedItem('axis').value;
				this.transformations[i].rotate[1] = f.attributes.getNamedItem('angle').value;
				console.log("\ttransformation "+  this.transformations[i][1]+" ("+this.transformations[i][0]+") axis:"+this.transformations[i].rotate[0]+" angle:"+this.transformations[i].rotate[1]);
			}
			else if (f.tagName == "scale") {
				this.transformations[i].scale = [];
				this.transformations[i][1] = "scale";
				this.transformations[i].scale[0] = f.attributes.getNamedItem('x').value;
				this.transformations[i].scale[1] = f.attributes.getNamedItem('y').value;
				this.transformations[i].scale[2] = f.attributes.getNamedItem('z').value;
				console.log("\ttransformation "+  this.transformations[i][1]+" ("+this.transformations[i][0]+") x:"+this.transformations[i].scale[0]+" y:"+this.transformations[i].scale[1]+" z:"+this.transformations[i].scale[2]);
			}
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
	this.primitives = [];
	var ids = [];

	var descN = prim[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = prim[0].children[i];
		if (e.tagName != "primitive" || e.attributes.length != 1) {
			this.onXMLError("primitive is missing");
			return 0;
		}

		this.primitives = [];
		this.primitives[i] = [];
		if (e.tagName == "primitive" && ids.indexOf(e.id) < 0) {
			ids[i] = e.id;
			var f = e.children[0];
			this.primitives[i][0] = f.tagName;
			this.primitives[i][1] = e.id;
			if (f.tagName == "rectangle" || f.tagName == "triangle") {
				this.primitives[i][2] = f.attributes.getNamedItem("x1").value;
				this.primitives[i][3] = f.attributes.getNamedItem("y1").value;
				this.primitives[i][4] = f.attributes.getNamedItem("x2").value;
				this.primitives[i][5] = f.attributes.getNamedItem("y2").value;
				console.log("\tprimitive "+this.primitives[i][0]+" ("+this.primitives[i][1]+") x1:"+this.primitives[i][2]+" y1:"+this.primitives[i][3]+" x2:"+this.primitives[i][4]+" y2:"+this.primitives[i][5]);
			}
			else if (f.tagName == "cylinder") {
				this.primitives[i][2] = f.attributes.getNamedItem("base").value;
				this.primitives[i][3] = f.attributes.getNamedItem("top").value;
				this.primitives[i][4] = f.attributes.getNamedItem("height").value;
				this.primitives[i][5] = f.attributes.getNamedItem("slices").value;
				this.primitives[i][6] = f.attributes.getNamedItem("stacks").value;
				console.log("\tprimitive "+this.primitives[i][0]+" ("+this.primitives[i][1]+") base:"+this.primitives[i][2]+" top:"+this.primitives[i][3]+" height:"+this.primitives[i][4]+" slices:"+this.primitives[i][5]+" stacks:"+this.primitives[i][6]);
			}
			else if (f.tagName == "sphere") {
				this.primitives[i][2] = f.attributes.getNamedItem("radius").value;
				this.primitives[i][3] = f.attributes.getNamedItem("slices").value;
				this.primitives[i][4] = f.attributes.getNamedItem("stacks").value;
				console.log("\tprimitive "+this.primitives[i][0]+" ("+this.primitives[i][1]+") radius:"+this.primitives[i][2]+" slices:"+this.primitives[i][3]+" stacks:"+this.primitives[i][4]);
			}
			else if (f.tagName == "torus") {
				this.primitives[i][2] = f.attributes.getNamedItem("inner").value;
				this.primitives[i][3] = f.attributes.getNamedItem("outer").value;
				this.primitives[i][4] = f.attributes.getNamedItem("slices").value;
				this.primitives[i][5] = f.attributes.getNamedItem("loops").value;
				console.log("\tprimitive "+this.primitives[i][0]+" ("+this.primitives[i][1]+" inner:"+this.primitives[i][2]+" outer:"+this.primitives[i][3]+" slices:"+this.primitives[i][4]+" stacks:"+this.primitives[i][5]);
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
	console.log("TODO parse components");
}


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
