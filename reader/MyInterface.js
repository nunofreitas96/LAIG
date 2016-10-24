function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	
	this.gui = new dat.GUI();


	this.Lights = this.gui.addFolder("Lights");	
	this.Lights.open();

    /*
	this.Cameras = this.gui.addFolder("Cameras");
	this.Cameras.add(this.scene,'defaultCamera');
	this.Cameras.open();*/

	return true;
};

MyInterface.prototype.lightBox = function(i,id){
	this.Lights.add(this.scene.enableLight,i,this.scene.enableLight[i]).name(id);
}


