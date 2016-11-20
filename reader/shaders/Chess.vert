
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float su;
uniform float sv;
uniform float du;
uniform float dv;

void main(){
	vec3 offset=vec3(0.0,0.0,0.0);
	vTextureCoord = aTextureCoord;

    float pX = floor(du * vTextureCoord[0]);
    float pY = floor(dv * vTextureCoord[1]);
	
	if((pX == su) && (pY == sv)){
        offset[2] += 0.1;
      }

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition[0]+offset[0],aVertexPosition[1]+offset[1],aVertexPosition[2]+offset[2], 1.0);
	
}

