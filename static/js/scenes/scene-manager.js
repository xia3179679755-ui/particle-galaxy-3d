window.Galaxy = window.Galaxy || {};
/* Coordinates scene transitions without replacing the particle material or WebGL context. */
window.Galaxy.SceneManager = class SceneManager {
  constructor(particles, solar, onChanged){this.particles=particles;this.solar=solar;this.onChanged=onChanged;this.current='galaxy';}
  activate(name){this.current=name;const solar=name==='solar';this.solar.setVisible(solar);this.particles.visible(!solar);if(!solar)this.particles.setMode(name);this.onChanged(name,solar);}
  dispose(){this.particles.dispose();this.solar.dispose();}
};
