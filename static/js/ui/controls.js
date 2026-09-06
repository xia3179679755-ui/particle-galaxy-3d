window.Galaxy = window.Galaxy || {};
window.Galaxy.Controls = class Controls {
  constructor(state, actions){this.s=state;this.a=actions;this.$=id=>document.getElementById(id);this.bind();this.sync();}
  bind(){
    const $=this.$,s=this.s,a=this.a;
    $('earthButton').onclick=a.focusEarth;$('panelButton').onclick=()=>$('app').classList.add('panel-open');$('panelClose').onclick=()=>$('app').classList.remove('panel-open');
    $('sceneSelect').onchange=e=>a.scene(e.target.value);$('themeSelect').onchange=e=>a.theme(e.target.value);
    [['repelToggle','repel'],['driftToggle','drift'],['rotateToggle','rotate']].forEach(([id,key])=>$(id).onchange=e=>{s[key]=e.target.checked;a.save();});
    $('orbitToggle').onchange=e=>a.orbits(e.target.checked);$('namesToggle').onchange=e=>a.names(e.target.checked);$('resetScene').onclick=a.resetScene;$('resetAll').onclick=a.resetAll;
    $('fullscreenButton').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();$('backButton').onclick=a.back;$('soundButton').onclick=()=>a.toast('未附带音频资源；所有视觉功能不受影响。');
    $('closeCard').onclick=()=>{$('planetCard').hidden=true;a.clearFocus();};$('solarPause').onclick=e=>{s.solarPaused=!s.solarPaused;a.solarPause(s.solarPaused);a.save();e.target.textContent=s.solarPaused?'▶':'Ⅱ';};
    $('focusEarth').onclick=a.focusEarth;$('dateMode').onclick=e=>{s.dateMode=!s.dateMode;a.dateMode(s.dateMode);e.target.classList.toggle('active',s.dateMode);};$('topView').onclick=a.topView;$('resetCamera').onclick=a.resetCamera;$('dismissInstructions').onclick=()=>{$('instructions').hidden=true;localStorage.setItem('galaxy.instructions','1');};
    [['countControl','count','countOut',v=>Number(v).toLocaleString()],['sizeControl','particleSize','sizeOut',v=>Number(v).toFixed(2)+'×'],['speedControl','speed','speedOut',v=>Number(v).toFixed(2)+'×'],['gravityControl','gravity','gravityOut',v=>Number(v).toFixed(2)+'×'],['radiusControl','radius','radiusOut',v=>Number(v).toFixed(1)]].forEach(([id,key,out,format])=>{const el=$(id);el.oninput=()=>{s[key]=Number(el.value);$(out).value=format(el.value);a.setting(key,s[key]);};});
    document.querySelectorAll('#qualityButtons button').forEach(b=>b.onclick=()=>a.quality(b.dataset.quality));document.querySelectorAll('#solarBar [data-time]').forEach(b=>b.onclick=()=>a.timeScale(Number(b.dataset.time),b));
  }
  sync(){const $=this.$,s=this.s;[['countControl','count','countOut',v=>Number(v).toLocaleString()],['sizeControl','particleSize','sizeOut',v=>Number(v).toFixed(2)+'×'],['speedControl','speed','speedOut',v=>Number(v).toFixed(2)+'×'],['gravityControl','gravity','gravityOut',v=>Number(v).toFixed(2)+'×'],['radiusControl','radius','radiusOut',v=>Number(v).toFixed(1)]].forEach(([id,k,o,f])=>{$(id).value=s[k];$(o).value=f(s[k]);});$('sceneSelect').value=s.scene;$('themeSelect').value=s.theme;$('repelToggle').checked=s.repel;$('driftToggle').checked=s.drift;$('rotateToggle').checked=s.rotate;$('orbitToggle').checked=s.orbits;$('namesToggle').checked=s.names;document.querySelectorAll('#qualityButtons button').forEach(x=>x.classList.toggle('active',x.dataset.quality===s.quality));}
};
