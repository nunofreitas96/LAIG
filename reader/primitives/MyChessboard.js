function MyChessboard(scene, texture, du, dv, c1, c2, cs, su, sv ){
	CGFobject.call(this,scene);
	this.texture = texture;
	this.du = du;
	this.dv =dv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;
	this.su = su;
	this.sv = sv;
	
	this.chessTexture = new CGFappearance(this.scene);
	this.chessTexture.loadTexture(this.texture);
	
	this.board = new Plane(this.scene,1.0,1.0,this.du*4,this.dv*4);
	this.chessShader = new CGFshader(this.scene.gl, "shaders/Chess.vert", "shaders/Chess.frag");
	this.chessShader.setUniformsValues({du : this.du});
	this.chessShader.setUniformsValues({dv : this.dv});
	this.chessShader.setUniformsValues({su : this.su});
	this.chessShader.setUniformsValues({sv : this.sv});
	this.chessShader.setUniformsValues({c1 : this.c1});
	this.chessShader.setUniformsValues({c2 : this.c2});
	this.chessShader.setUniformsValues({cs : this.cs});
	this.initBuffers();
}

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function() {
  this.chessTexture.apply();
  this.scene.setActiveShader(this.chessShader);
  this.board.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}