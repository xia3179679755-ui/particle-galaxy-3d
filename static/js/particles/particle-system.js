/* A single Points draw call. Orbital positions are derived in the vertex shader, not on the CPU. */
window.Galaxy = window.Galaxy || {};
window.Galaxy.ParticleSystem = class ParticleSystem {
  constructor(THREE, scene, count) {
    this.THREE = THREE; this.scene = scene; this.count = 0; this.currentMode = 0; this.previousMode = 0;
    this.group = new THREE.Group(); scene.add(this.group); this.targetVisible = 1;
    this.uniforms = {
      uTime:{value:0}, uMode:{value:0}, uPreviousMode:{value:0}, uTransition:{value:1}, uCountFade:{value:1},
      uPointer:{value:new THREE.Vector3(99,99,99)}, uPointerVelocity:{value:0}, uHold:{value:0}, uAttract:{value:1},
      uGravity:{value:1}, uRadius:{value:7}, uSize:{value:1}, uSpeed:{value:1}, uExplodeAt:{value:-99},
      uColorA:{value:new THREE.Color('#8c8bff')}, uColorB:{value:new THREE.Color('#e7edff')}, uColorC:{value:new THREE.Color('#f9bd6a')},
      uPixelRatio:{value:Math.min(devicePixelRatio, 2)}
    };
    this.material = new THREE.ShaderMaterial({transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, uniforms:this.uniforms, vertexShader:this.vertex(), fragmentShader:this.fragment()});
    this.setCount(count);
  }
  vertex() { return `
    attribute float aRadius; attribute float aAngle; attribute float aArm; attribute float aSeed; attribute float aSize;
    uniform float uTime,uMode,uPreviousMode,uTransition,uGravity,uRadius,uSize,uSpeed,uPointerVelocity,uHold,uAttract,uExplodeAt,uPixelRatio,uCountFade;
    uniform vec3 uPointer,uColorA,uColorB,uColorC; varying vec3 vColor; varying float vAlpha;
    #define PI 3.14159265
    float hash(float n){return fract(sin(n)*43758.5453123);}
    vec3 formation(float mode){
      float r=aRadius; float t=uTime*uSpeed*(.13+1.1/(1.0+r*.25))+aAngle; vec3 p;
      if(mode<.5){
        /* A warped, thick stellar disc with a dense three-dimensional central bulge. */
        float spiral=aArm*PI*.5+r*.45; float thickness=.8+4.4*exp(-r*.25);
        p=vec3(cos(t+spiral)*r, (hash(aSeed*5.)-.5)*thickness+sin(r*.62+aAngle*3.)*.32, sin(t+spiral)*r);
      }
      else if(mode<1.5){
        /* An actual volume of stars rather than a flat circular force field. */
        float q=t*.7+aSeed; float latitude=(hash(aSeed*2.7)-.5)*2.15; float shell=r*(.72+.28*hash(aSeed*8.));
        p=vec3(cos(q)*cos(latitude)*shell, sin(latitude)*shell, sin(q)*cos(latitude)*shell);
      }
      else if(mode<2.5){
        /* Layered, drifting cloud banks fill depth in every direction. */
        float q=aAngle+uTime*.025; float cloud=(hash(aSeed*7.)-.5)*3.8;
        p=vec3(cos(q)*r*(1.05+cloud*.025), sin(aSeed*7.+uTime*.05)*2.8+cloud, sin(q)*r*.82+cos(aSeed*5.)*cloud*.65);
      }
      else {
        /* A thick, turbulent accretion funnel instead of a paper-thin ring. */
        float pull=max(.35,r-uTime*.015); float q=t*2.5+aSeed; float funnel=(hash(aSeed*3.)-.5)*(1.0+pull*.18);
        p=vec3(cos(q)*pull, funnel+sin(q*3.+uTime)*.22, sin(q)*pull);
      }
      p += vec3(sin(aSeed*18.+uTime*.4),cos(aSeed*11.+uTime*.3),sin(aSeed*7.+uTime*.2))*.055; return p;
    }
    void main(){
      vec3 base=mix(formation(uPreviousMode),formation(uMode),smoothstep(0.,1.,uTransition));
      vec3 delta=uPointer-base; float d=length(delta)+.12; float influence=smoothstep(uRadius,0.,d);
      vec3 swirl=normalize(cross(delta,vec3(0.,1.,0.)))*influence*(uPointerVelocity+.35)*(.35+uHold*.9);
      base += normalize(delta)*influence*uGravity*uAttract*(.25+uPointerVelocity*.12+uHold*1.85)+swirl;
      float blast=max(0.,uTime-uExplodeAt); float wave=exp(-pow((d-blast*9.)/1.5,2.)); base+=normalize(base-uPointer)*wave*3.5*exp(-blast*.45);
      float twinkle=.68+.32*sin(uTime*(1.+hash(aSeed)*3.)+aSeed*20.); vColor=mix(uColorA,uColorB,hash(aSeed*9.)); vColor=mix(vColor,uColorC,step(.975,hash(aSeed*13.)))*twinkle;
      vec4 mv=modelViewMatrix*vec4(base,1.); gl_PointSize=clamp((aSize*uSize*(10.+20.*hash(aSeed*4.))*uPixelRatio*(1.+influence*(.35+uHold*.9)))/max(.5,-mv.z),1.5,64.); gl_Position=projectionMatrix*mv; vAlpha=(.42+.58*hash(aSeed*6.))*uCountFade;
    }`;
  }
  fragment() { return `varying vec3 vColor; varying float vAlpha; void main(){float d=length(gl_PointCoord-.5);float glow=pow(max(0.,1.-d*2.),1.8); gl_FragColor=vec4(vColor,glow*vAlpha);}`; }
  setCount(count) {
    count = Math.max(1000, Math.min(120000, Math.round(count))); if (count === this.count) return;
    const T=this.THREE, geo=new T.BufferGeometry(), radii=new Float32Array(count), angles=new Float32Array(count), arms=new Float32Array(count), seeds=new Float32Array(count), sizes=new Float32Array(count);
    for(let i=0;i<count;i++){const x=Math.random(); radii[i]=Math.pow(x,.52)*20; angles[i]=Math.random()*Math.PI*2; arms[i]=Math.floor(Math.random()*4); seeds[i]=Math.random()*1000; sizes[i]=.4+Math.random()*.9;}
    geo.setAttribute('position',new T.BufferAttribute(new Float32Array(count*3),3)); geo.setAttribute('aRadius',new T.BufferAttribute(radii,1)); geo.setAttribute('aAngle',new T.BufferAttribute(angles,1)); geo.setAttribute('aArm',new T.BufferAttribute(arms,1)); geo.setAttribute('aSeed',new T.BufferAttribute(seeds,1)); geo.setAttribute('aSize',new T.BufferAttribute(sizes,1));
    if(this.points){this.group.remove(this.points);this.points.geometry.dispose();}
    this.points=new T.Points(geo,this.material);this.group.add(this.points);this.count=count;
  }
  setMode(name){const map={galaxy:0,gravity:1,nebula:2,blackhole:3};const m=map[name] ?? 0;this.previousMode=this.currentMode;this.currentMode=m;this.uniforms.uPreviousMode.value=this.previousMode;this.uniforms.uMode.value=m;this.uniforms.uTransition.value=0;}
  setTheme(name){const c={violet:['#7776ff','#ebedff','#f6c364'],gold:['#d68733','#fff0b0','#ffffff'],ice:['#1f8fd4','#c7f7ff','#9de7ff'],red:['#9f2e69','#ffd0db','#f0715a'],mono:['#6f7785','#ffffff','#d1d1d1']}[name]||[];if(c.length){this.uniforms.uColorA.value.set(c[0]);this.uniforms.uColorB.value.set(c[1]);this.uniforms.uColorC.value.set(c[2]);}}
  update(time, dt, pointer){const u=this.uniforms;u.uTime.value=time;u.uTransition.value=Math.min(1,u.uTransition.value+dt*.65);u.uCountFade.value+=(this.targetVisible-u.uCountFade.value)*Math.min(1,dt*7);u.uPointer.value.copy(pointer.position);u.uPointerVelocity.value=pointer.velocity;u.uHold.value=pointer.hold;u.uAttract.value=pointer.repel?-1:1;}
  explode(time, position){this.uniforms.uExplodeAt.value=time;this.uniforms.uPointer.value.copy(position);}
  visible(show){this.targetVisible=show?1:0;}
  dispose(){this.group.remove(this.points);this.points.geometry.dispose();this.material.dispose();this.scene.remove(this.group);}
};
