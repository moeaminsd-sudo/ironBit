/* ================= exercise animations ================= */
const ST0={torso:180,thigh:0,shin:0,uarm:4,farm:4};
const ANIM={
 squat:{prop:'barBack',fx:24,dur:2600,f:[{torso:180,thigh:0,shin:0,uarm:30,farm:168},{torso:142,thigh:84,shin:-32,uarm:40,farm:172}]},
 goblet:{prop:'db',fx:24,dur:2400,f:[{torso:178,thigh:0,shin:0,uarm:18,farm:165},{torso:155,thigh:86,shin:-34,uarm:30,farm:170}]},
 bwsquat:{fx:24,dur:2000,f:[{torso:180,thigh:0,shin:0,uarm:8,farm:8},{torso:146,thigh:86,shin:-32,uarm:96,farm:92}]},
 deadlift:{prop:'bar',fx:21,dur:2800,f:[{torso:102,thigh:58,shin:-26,uarm:0,farm:0},{torso:180,thigh:0,shin:0,uarm:2,farm:2}]},
 rdl:{prop:'bar',fx:21,dur:2800,f:[{torso:180,thigh:0,shin:0,uarm:2,farm:2},{torso:100,thigh:14,shin:-8,uarm:0,farm:0}]},
 ohp:{prop:'bar',fx:24,dur:2300,f:[{torso:180,thigh:0,shin:0,uarm:28,farm:170},{torso:182,thigh:0,shin:0,uarm:178,farm:180}]},
 bench:{prop:'bar',bench:'flat',fx:40,dur:2400,f:[{torso:-90,thigh:84,shin:0,uarm:180,farm:180},{torso:-90,thigh:84,shin:0,uarm:22,farm:178}]},
 inclinedb:{prop:'db',bench:'incline',fx:36,dur:2300,f:[{torso:-145,thigh:84,shin:0,uarm:24,farm:172},{torso:-145,thigh:84,shin:0,uarm:174,farm:178}]},
 lateral:{prop:'db',fx:24,dur:2300,f:[{...ST0},{torso:180,thigh:0,shin:0,uarm:88,farm:92}]},
 pushdown:{prop:'cableTop',fx:20,dur:2000,f:[{torso:172,thigh:4,shin:-4,uarm:8,farm:150},{torso:172,thigh:4,shin:-4,uarm:6,farm:4}]},
 pulldown:{prop:'cableTop',seat:true,fx:28,dur:2400,f:[{torso:176,thigh:90,shin:0,uarm:174,farm:178},{torso:168,thigh:90,shin:0,uarm:28,farm:166}]},
 row:{prop:'bar',fx:20,dur:2200,f:[{torso:112,thigh:36,shin:-22,uarm:0,farm:0},{torso:112,thigh:36,shin:-22,uarm:-62,farm:8}]},
 seatedrow:{prop:'cableFront',ay:'hip',ax:'hip',hx:13,hy:44,mat:true,dur:2300,f:[{torso:168,thigh:88,shin:88,uarm:92,farm:90},{torso:182,thigh:88,shin:88,uarm:-58,farm:86}]},
 facepull:{prop:'cableFront',fx:16,dur:2200,f:[{torso:180,thigh:0,shin:0,uarm:96,farm:92},{torso:182,thigh:0,shin:0,uarm:-100,farm:150}]},
 curl:{prop:'db',fx:24,dur:2000,f:[{torso:180,thigh:0,shin:0,uarm:3,farm:3},{torso:180,thigh:0,shin:0,uarm:8,farm:156}]},
 legpress:{prop:'sled',bench:'incline',ay:'hip',ax:'hip',hx:27,hy:35,dur:2400,f:[{torso:-122,thigh:146,shin:56,uarm:40,farm:40},{torso:-122,thigh:118,shin:116,uarm:40,farm:40}]},
 lunge:{ay:'lowest',fx:30,dur:2400,f:[{torso:180,thigh:0,shin:0,thigh2:0,shin2:0,uarm:4,farm:4},{torso:180,thigh:84,shin:-2,thigh2:-24,shin2:-86,uarm:4,farm:4}]},
 calf:{fx:24,dur:1600,f:[{...ST0,lift:0},{...ST0,lift:3}]},
 pushup:{ay:'lowest',fx:10,mat:true,dur:2000,f:[{torso:102,thigh:-78,shin:-78,uarm:4,farm:2},{torso:96,thigh:-84,shin:-84,uarm:-146,farm:14}]},
 plank:{ay:'lowest',fx:10,mat:true,dur:3000,f:[{torso:100,thigh:-80,shin:-80,uarm:2,farm:90},{torso:101.5,thigh:-79,shin:-79,uarm:2,farm:90}]},
 bridge:{ay:'lowest',fx:40,mat:true,dur:2200,f:[{torso:-93,neck:-93,thigh:118,shin:8,uarm:88,farm:90},{torso:-70,neck:-96,thigh:96,shin:4,uarm:84,farm:90}]},
 climber:{ay:'lowest',ax:'hand',fx:40,mat:true,dur:900,f:[{torso:105,thigh:-75,shin:-75,thigh2:28,shin2:-60,uarm:2,farm:2},{torso:105,thigh:28,shin:-60,thigh2:-75,shin2:-75,uarm:2,farm:2}]},
 crunch:{ay:'lowest',fx:40,mat:true,dur:1800,f:[{torso:-92,neck:-95,thigh:118,shin:8,uarm:80,farm:80},{torso:-128,neck:-140,thigh:118,shin:8,uarm:100,farm:95}]},
 farmer:{prop:'db',ay:'lowest',ax:'hip',hx:24,dur:1100,f:[{torso:180,thigh:18,shin:-8,thigh2:-14,shin2:-22,uarm:3,farm:2},{torso:180,thigh:-14,shin:-22,thigh2:18,shin2:-8,uarm:3,farm:2}]},
 twist:{prop:'db',ay:'hip',ax:'hip',hx:22,hy:44,mat:true,dur:1800,f:[{torso:205,neck:195,thigh:125,shin:60,uarm:122,farm:96},{torso:205,neck:195,thigh:125,shin:60,uarm:56,farm:72}]},
 idle:{fx:24,dur:3000,f:[{...ST0,uarm:6,farm:6},{torso:181,thigh:0,shin:0,uarm:10,farm:30}]}
};
function lerpPose(a,b,p){const o={};new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{const x=a[k]??b[k],y=b[k]??a[k];o[k]=x+(y-x)*p});return o}
/* plays a character animation into a canvas; returns controller */
function player(key,scale,opts={}){
  const A=ANIM[key],[c,g]=mk(52,52);c.setAttribute('role','img');c.setAttribute('aria-label','Pixel coach demonstrating the move');
  if(scale)show(c,scale);
  let t=0,last=performance.now(),playing=opts.autoplay!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=opts.speed||1,raf=0;
  const getC=opts.getChar||(()=>P.char),getP=opts.getProf||(()=>P);
  function draw(){const F=opts.view&&opts.view!=='side'&&FP[key],ph=(1-Math.cos(2*Math.PI*t/((F&&F.dur)||A.dur)))/2;g.clearRect(0,0,52,52);g.drawImage(F?drawFrontPose(getP(),getC(),lerpAny(F.f[0],F.f[1],ph),F,{view:opts.view}):drawSide(getP(),getC(),lerpPose(A.f[0],A.f[1],ph),A),0,0)}
  function loop(now){if(!c.isConnected){cancelAnimationFrame(raf);return}if(playing)t+=(now-last)*speed;last=now;draw();raf=requestAnimationFrame(loop)}
  draw();raf=requestAnimationFrame(loop);
  return{el:c,play(){playing=true},pause(){playing=false},toggle(){playing=!playing;return playing},get playing(){return playing},setSpeed(s){speed=s},redraw:draw}}
