/* ================= sound ================= */
let AC=null;
function tone(f,d,type,when=0){if(!SET.sfx)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const pk=SET.sfxPack||'retro',t=AC.currentTime+when;
  const play=(fr,ty,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(fr,t);g.gain.setValueAtTime(.12*SET.vol*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.03)};
  play(pk==='chip'?f*2:f,type||{retro:'square',arcade:'sawtooth',chip:'triangle',legend:'square'}[pk],pk==='arcade'?.7:1);if(pk==='legend'&&!type)play(f*1.5,'triangle',.5)}catch(e){}}
const SFX={tap:()=>tone(520,.04),coin:()=>{tone(988,.07);tone(1319,.22,null,.07)},done:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.16,null,i*.1)),
  beep:()=>{if(SET.timerBeep){tone(880,.14);tone(880,.14,null,.22);tone(1175,.3,null,.44)}},lvl:()=>[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.2,null,i*.09))};
const buzz=ms=>haptic(ms>=200?'level':ms>=60?'success':ms>=25?'click':'tap');
document.addEventListener('click',e=>{if(e.target.closest('button,a.btn')){SFX.tap();haptic('tap')}},true);
