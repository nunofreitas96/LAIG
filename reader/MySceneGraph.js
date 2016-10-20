
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
	this.scene.textures = [];
	this.scene.materials=[];
	this.scene.components = [];
	this.scene.primitives = [];
	this.primitives =[];
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

		this.scene.perspectives[e.id]=[];
		this.scene.perspectives[e.id][0] = e.attributes.getNamedItem("near").value;
		this.scene.perspectives[e.id][1] = e.attributes.getNamedItem("far").value;
		this.scene.perspectives[e.id][2] = e.attributes.getNamedItem("angle").value;
		console.log("perspective "+e.id+" near: "+this.scene.perspectives[e.id][0]+" far: "+this.scene.perspectives[e.id][1]+" angle: "+this.scene.perspectives[e.id][2]);

		var descNN = e.children.length;
		this.scene.perspectives[e.id].from=[];
		this.scene.perspectives[e.id].from[0]=e.children[0].attributes.getNamedItem("x").value;
		this.scene.perspectives[e.id].from[1]=e.children[0].attributes.getNamedItem("y").value;
		this.scene.perspectives[e.id].from[2]=e.children[0].attributes.getNamedItem("z").value;
		console.log("\t"+e.id+" perspective from with x:"+this.scene.perspectives[e.id].from[0]+" y:"+this.scene.perspectives[e.id].from[1]+" z:"+this.scene.perspectives[e.id].from[2]);

		this.scene.perspectives[e.id].to=[];
		this.scene.perspectives[e.id].to[0]=e.children[1].attributes.getNamedItem("x").value;
		this.scene.perspectives[e.id].to[1]=e.children[1].attributes.getNamedItem("y").value;
		this.scene.perspectives[e.id].to[2]=e.children[1].attributes.getNamedItem("z").value;
		console.log("\t"+e.id+" perspective to with x:"+this.scene.perspectives[e.id].to[0]+" y:"+this.scene.perspectives[e.id].to[1]+" z:"+this.scene.perspectives[e.id].to[2]);
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
		this.scene.textures[i] = [];
		this.scene.textures[i][0]=e.attributes.getNamedItem('id').value;
		this.scene.textures[i][1]=e.attributes.getNamedItem('file').value;
		this.scene.textures[i][2]=e.attributes.getNamedItem('length_s').value;
		this.scene.textures[i][3]=e.attributes.getNamedItem('length_t').value;
		//var t= new Texture(this.scene.textures[i][0],this.scene.textures[i][1],this.scene.textures[i][2],this.scene.textures[i][3]);
		console.log("\ttexture ("+this.scene.textures[i][0]+") file:"+this.scene.textures[i][1]+" length_s:"+this.scene.textures[i][2]+" length_t:"+this.scene.textures[i][3]);
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

		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];

			if (f.tagName == "translate") {
				this.scene.transformations[i].translate = [];
				this.scene.transformations[i][1] = "translate";
				this.scene.transformations[i].translate[0] = f.attributes.getNamedItem('x').value;
				this.scene.transformations[i].translate[1] = f.attributes.getNamedItem('y').value;
				this.scene.transformations[i].translate[2] = f.attributes.getNamedItem('z').value;
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") x:"+this.scene.transformations[i].translate[0]+" y:"+this.scene.transformations[i].translate[1]+" z:"+this.scene.transformations[i].translate[2]);
			}
			else if (f.tagName == "rotate") {
				this.scene.transformations[i].rotate = [];
				this.scene.transformations[i][1] = "rotate";
				this.scene.transformations[i].rotate[0] = f.attributes.getNamedItem('axis').value;
				this.scene.transformations[i].rotate[1] = f.attributes.getNamedItem('angle').value;
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") axis:"+this.scene.transformations[i].rotate[0]+" angle:"+this.scene.transformations[i].rotate[1]);
			}
			else if (f.tagName == "scale") {
				this.scene.transformations[i].scale = [];
				this.scene.transformations[i][1] = "scale";
				this.scene.transformations[i].scale[0] = f.attributes.getNamedItem('x').value;
				this.scene.transformations[i].scale[1] = f.attributes.getNamedItem('y').value;
				this.scene.transformations[i].scale[2] = f.attributes.getNamedItem('z').value;
				console.log("\ttransformation "+  this.scene.transformations[i][1]+" ("+this.scene.transformations[i][0]+") x:"+this.scene.transformations[i].scale[0]+" y:"+this.scene.transformations[i].scale[1]+" z:"+this.scene.transformations[i].scale[2]);
			}
		}
	}
	if (ids.length == 0) {
		this.onXMLError("there must be at least one transformation");
		return 0;
	}
	return;
}
/*
MySceneGraph.prototype.getTransformation = function(id){
	var i =0;
	for(i; i <this.scene.transformations.length; i++){
		if(this.scene.transformations[i][0] == id){
			return this.scene.transformations[i];
		}
	}
	return null;
}*/

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
			if (f.tagName == "rectangle" || f.tagName == "triangle") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("x1").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("y1").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("x2").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("y2").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") x1:"+this.scene.primitives[i][2]+" y1:"+this.scene.primitives[i][3]+" x2:"+this.scene.primitives[i][4]+" y2:"+this.scene.primitives[i][5]);
			}
			else if (f.tagName == "cylinder") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("base").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("top").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("height").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][6] = f.attributes.getNamedItem("stacks").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") base:"+this.scene.primitives[i][2]+" top:"+this.scene.primitives[i][3]+" height:"+this.scene.primitives[i][4]+" slices:"+this.scene.primitives[i][5]+" stacks:"+this.scene.primitives[i][6]);
			}
			else if (f.tagName == "sphere") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("radius").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("stacks").value;
				this.primitives[i] = this.scene.primitives[i];
				scene.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+") radius:"+this.scene.primitives[i][2]+" slices:"+this.scene.primitives[i][3]+" stacks:"+this.scene.primitives[i][4]);
			}
			else if (f.tagName == "torus") {
				this.scene.primitives[i][2] = f.attributes.getNamedItem("inner").value;
				this.scene.primitives[i][3] = f.attributes.getNamedItem("outer").value;
				this.scene.primitives[i][4] = f.attributes.getNamedItem("slices").value;
				this.scene.primitives[i][5] = f.attributes.getNamedItem("loops").value;
				this.primitives[i] = this.scene.primitives[i];
				console.log("\tprimitive "+this.scene.primitives[i][0]+" ("+this.scene.primitives[i][1]+" inner:"+this.scene.primitives[i][2]+" outer:"+this.scene.primitives[i][3]+" slices:"+this.scene.primitives[i][4]+" stacks:"+this.scene.primitives[i][5]);
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

	
	var ids = [];

	var descN = comps[0].children.length;
	for (var i = 0; i < descN; i++) {
		this.scene.components[i] = [];
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

		var descNN = e.children.length;
		var transfs = 0;
		var mats = 0;
		var texts = 0;
		var childs = 0;
		if (descNN <= 0) {
			this.onXMLError("there must be at least on transformation in component");
			return 0;
		}

		
		//console.log("transformations2");
		for (var j = 0; j < descNN; j++) {
			var f = e.children[j];
			//console.log(f.tagName);
			
			if (f.tagName == "transformation") {
				transfs++;
				var x =0;
				
				for(x; x < f.children.length; x++){
					//console.log(x);
					//console.log(f.children[x].tagName);
					if(f.children[x].tagName == "transformationref"){
						var trId = f.children[x].attributes.getNamedItem('id').value;
						
						/*console.log(trId);
						console.log(this.scene.transformations[0]);
						console.log(this.scene.components); TODO retirar*/
						this.scene.components[i].push(trId);
						/*console.log(this.scene.components[i]);

						console.log(this.scene.transformations[0][0]);*/
						//TODO retirar
					}
				}

			}
			else if (f.tagName == "materials") {
				mats++;
				if(f.children[0].tagName == "material"){
					var matId = f.children[0].attributes.getNamedItem('id').value;
					this.scene.components[i].push(matId);
				}

			}
			else if (f.tagName == "texture") {
				texts++;
					var texId = f.attributes.getNamedItem('id').value;
					this.scene.components[i].push(texId);
					//this.scene.components[i].texture = texId;
			}
			else if (f.tagName == "children") {
				childs++;
				var x =0;
				
				for(x; x < f.children.length; x++){
					//console.log(x);
					//console.log(f.children[x].tagName);
					//TODO arranjar maneira de identificar!
					if(f.children[x].tagName == "primitiveref"){
						var prId = f.children[x].attributes.getNamedItem('id').value;
						this.scene.components[i].push(prId);
						
					}
					if(f.children[x].tagName == "componentref"){
						var compId = f.children[x].attributes.getNamedItem('id').value;
						this.scene.components[i].push(compId);
						
					}
				}
			}

		}
		console.log("checker");
			console.log(this.scene.components[i][0]);
	}
	
	return;
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
