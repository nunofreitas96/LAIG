
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
	this.parseSceneRoot(rootElement);
	this.parseViews(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parsePrimitives(rootElement);
	this.parseTransformations(rootElement);
	this.parseComponents(rootElement);
}

MySceneGraph.prototype.parseSceneRoot = function(rootElement){
	var sceneRoot = rootElement.getElementsByTagName('scene');
	if (sceneRoot == null) {
		return "root not defined";
	}
	if (sceneRoot.length != 1){
		return "root bad definition";
	}

	this.scene_root = sceneRoot[0].attributes.getNamedItem("root").value;
	this.scene_axis = sceneRoot[0].attributes.getNamedItem("axis_length").value;
	console.log("root id: "+this.scene_root+"; axis length: "+this.scene_axis);
}

MySceneGraph.prototype.parseViews = function(rootElement){
	// declaracao obrigatoria de, pelo menos, uma vista/perspectiva
	var views = rootElement.getElementsByTagName('views');
	if(views == null){
		return "views not defined";
	}
	if (views.length != 1){
		return "views bad definition";
	}

	this.views_default = views[0].attributes.getNamedItem("default").value;
	console.log("view default: "+this.views_default);

	var tempViews=rootElement.getElementsByTagName('views');
	if (tempViews == null || tempViews.length == 0) {
		return "views perspectives are missing";
	}

	this.perspectives=[];

	var descN=tempViews[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = tempViews[0].children[i];
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
}

MySceneGraph.prototype.parseIllumination = function(rootElement){
	var illum = rootElement.getElementsByTagName('illumination');
	if( illum == null){
		return "illumination not defined";
	}
	if (illum.length != 1) {
		return "illumination bad definition";
	}
	this.illumination=[];
	this.illumination[0] = illum[0].attributes.getNamedItem('doublesided').value;
	this.illumination[1] = illum[0].attributes.getNamedItem('local').value;
	if (this.illumination[0] == null || this.illumination[0] == null || this.illumination[1] == null || this.illumination[1] == null) {
		return "illumination doublesided or local are missing";
	}
	//TODO check 0 or 1
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
}

MySceneGraph.prototype.parseLights = function(rootElement){	//TODO
	console.log("TODO parse lights");
}

MySceneGraph.prototype.parseTextures = function(rootElement){	//TODO
	console.log("TODO parse textures");
}

MySceneGraph.prototype.parseMaterials = function(rootElement){

	var mats = rootElement.getElementsByTagName('materials');
	if (mats == null) {
		return "materials not defined";
	}

	var tempMats=rootElement.getElementsByTagName('materials');
	if (tempMats == null || tempMats.length == 0) {
		return "materials are missing";
	}


	this.materials=[];

	var descN=mats[0].children.length;
	for (var i = 0; i < descN; i++) {
		var e = mats[0].children[i];
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
}

MySceneGraph.prototype.parsePrimitives = function(rootElement){	// TODO
	console.log("TODO parse primitives");
}

MySceneGraph.prototype.parseTransformations = function(rootElement){	//TODO
	console.log("TODO parse transformations");
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
