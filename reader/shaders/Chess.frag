#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;
uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

void main() {
	gl_FragColor = texture2D(uSampler, vTextureCoord);
	 
	float pX = floor(du * vTextureCoord[0]);
	float pY = floor(dv * vTextureCoord[1]);
	
	if((pX == su) && (pY == sv)){
		gl_FragColor = vec4(0.5*gl_FragColor[0]+0.5*cs[0],0.5*gl_FragColor[1]+0.5*cs[1],0.5*gl_FragColor[2]+0.5*cs[2],0.5*gl_FragColor[3]+0.5*cs[3]);
	}
	else{
		float p = mod((pX+pY),2.0);
		if(p ==0.0){
			gl_FragColor = vec4(0.5*gl_FragColor[0]+0.5*c1[0],0.5*gl_FragColor[1]+0.5*c1[1],0.5*gl_FragColor[2]+0.5*c1[2],0.5*gl_FragColor[3]+0.5*c1[3]);
		}
		else{
			gl_FragColor = vec4(0.5*gl_FragColor[0]+0.5*c2[0],0.5*gl_FragColor[1]+0.5*c2[1],0.5*gl_FragColor[2]+0.5*c2[2],0.5*gl_FragColor[3]+0.5*c2[3]);
		}
	
	
	}
	
	
 }