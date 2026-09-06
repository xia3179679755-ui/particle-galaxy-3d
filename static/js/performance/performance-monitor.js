window.Galaxy = window.Galaxy || {};
window.Galaxy.PerformanceMonitor = class PerformanceMonitor {
  constructor(onLow){this.onLow=onLow;this.frames=0;this.total=0;this.last=performance.now();this.fps=60;this.cooldown=0;}
  tick(dt){this.frames++;this.total+=dt;if(performance.now()-this.last>1000){this.fps=Math.round(this.frames/this.total);this.frames=0;this.total=0;this.last=performance.now();if(this.fps<30&&performance.now()>this.cooldown){this.cooldown=performance.now()+15000;this.onLow(this.fps);} }return this.fps;}
};
