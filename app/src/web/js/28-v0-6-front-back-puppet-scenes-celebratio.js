/* ================= v0.6: front/back puppet, scenes, celebration, briefing ================= */
UIC.cloud=g=>{disc(g,'#c7cde0',6,10,3.6);disc(g,'#e8ecf2',11,8,4.6);R(g,'#c7cde0',3,10,13,4);R(g,'#e8ecf2',5,10,10,3)};
const MEALPLANS={lose:[[['egg',150],['foul',150]],[['chicken',200],['rice',100],['broccoli',100]],[['greek',170],['dates',24]],[['hammour',180],['sweetpotato',150]]],
   muscle:[[['oats',80],['banana',118],['whey',30]],[['machboos',400]],[['laban',250],['almonds',28]],[['kofta',150],['rice',200],['hummus',60]]],
   strength:[[['egg',200],['khubz',60],['labneh',30]],[['chicken',200],['rice',200]],[['whey',30],['banana',118]],[['salmon',180],['sweetpotato',200]]],
   fit:[[['greek',170],['oats',40],['dates',24]],[['shawarma',250]],[['laban',250]],[['lentils',300],['khubz',60]]]};
const DAYDEF={wake:7,sleep:23,work:true,ws:9,we:17};
const tierAt=L=>Math.min(3,Math.floor((L-1)/5));
function muscleTier(pr){return pr&&pr.me?tierAt(lvl()):0}
const tok=n=>getComputedStyle(document.documentElement).getPropertyValue('--'+n).trim()||'#33285f';
function lerpAny(a,b,p){const o={};new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{const x=a[k]??b[k],y=b[k]??a[k];
  o[k]=Array.isArray(x)||Array.isArray(y)?[0,1].map(i=>{const xi=Array.isArray(x)?x[i]:x,yi=Array.isArray(y)?y[i]:y;return xi+(yi-xi)*p}):x+(y-x)*p});return o}
function faceExpr(g,f,cx,ey,S){const K=shade(S,-.45),close=x=>{R(g,S,x,ey,2,2);R(g,K,x,ey+1,2,1)};
  if(f==='blink'||f==='sleep'){close(cx-4);close(cx+1)}
  if(f==='wink'){close(cx+1);R(g,S,cx-1,ey+3,2,1);R(g,K,cx-2,ey+3,4,1);R(g,K,cx-3,ey+2,1,1);R(g,K,cx+2,ey+2,1,1)}
  if(f==='surprised'){R(g,S,cx-2,ey+3,4,1);R(g,K,cx-1,ey+3,2,2);R(g,'#ffffff',cx-4,ey-1,2,1);R(g,'#ffffff',cx+1,ey-1,2,1)}
  if(f==='smile'){R(g,S,cx-1,ey+3,2,1);R(g,K,cx-2,ey+3,4,1);R(g,'#ffffff',cx-1,ey+3,2,1);R(g,K,cx-3,ey+2,1,1);R(g,K,cx+2,ey+2,1,1)}
  if(f==='chew'){R(g,S,cx-1,ey+3,2,1);R(g,K,cx-2,ey+3,4,1)}
  if(f==='sleep'){R(g,shade(S,-.12),cx-4,ey+2,2,1);R(g,shade(S,-.12),cx+1,ey+2,2,1)}}
const FP={
 squat:{prop:'barBack',f:[{sq:0,ua:100,fa:170},{sq:1,ua:100,fa:170}]},
 goblet:{prop:'db1',f:[{sq:0,ua:-14,fa:-160,fl:.8},{sq:1,ua:-14,fa:-160,fl:.8}]},
 bwsquat:{f:[{sq:0,ua:6,fa:6},{sq:1,ua:25,fa:25,ul:.45,fl:.35}]},
 deadlift:{prop:'bar',f:[{sq:.75,ua:3,fa:2},{sq:0,ua:3,fa:2}]},
 rdl:{prop:'bar',f:[{sq:0,ua:3,fa:2},{sq:.35,ua:3,fa:2}]},
 ohp:{prop:'bar',f:[{ua:100,fa:172},{ua:166,fa:176}]},
 lateral:{prop:'db',f:[{ua:6,fa:8},{ua:88,fa:92}]},
 pushdown:{prop:'cable',f:[{ua:4,fa:-172,fl:.45},{ua:4,fa:3}]},
 pulldown:{prop:'barCable',f:[{sq:.5,ua:165,fa:172},{sq:.5,ua:95,fa:170}]},
 row:{prop:'bar',f:[{sq:.35,ua:3,fa:2},{sq:.35,ua:28,fa:-25,fl:.6}]},
 facepull:{prop:'rope',f:[{ua:80,fa:82,fl:.5},{ua:96,fa:165}]},
 curl:{prop:'db',f:[{ua:3,fa:3},{ua:3,fa:172,fl:.45}]},
 lunge:{f:[{sq:0,ua:5,fa:4},{sq:.8,ua:5,fa:4}]},
 calf:{f:[{lift:0,ua:5,fa:4},{lift:3,ua:5,fa:4}]},
 farmer:{prop:'db',f:[{sq:0,ua:4,fa:3},{sq:.08,ua:5,fa:4}]},
 idle:{f:[{ua:6,fa:8},{ua:9,fa:16}]}};
for(const k in FP)FP[k].dur=(ANIM[k]||{}).dur||2000;
const SIDEWALK={ax:'hip',hx:26,ay:'feet',dur:1000,f:[{torso:182,thigh:24,shin:6,thigh2:-22,shin2:-40,uarm:-24,farm:-8,uarm2:22,farm2:40},{torso:182,thigh:-22,shin:-40,thigh2:24,shin2:6,uarm:22,farm:40,uarm2:-24,farm2:-8}]};
const SCN={walk:{f:[{ua:[-14,14],fa:[-8,8]},{ua:[14,-14],fa:[8,-8]}],dur:900},cheer:{f:[{ua:150,fa:165},{ua:168,fa:178}],dur:700},wave:{f:[{ua:[6,135],fa:[8,172]},{ua:[6,135],fa:[8,120]}],dur:650},
 eat:{f:[{ua:[6,8],fa:[8,-25]},{ua:[6,-60],fa:[8,-155]}],dur:1700},type:{f:[{ua:[-20,-20],fa:[-60,-60],fl:[.5,.5]},{ua:[-18,-23],fa:[-66,-54],fl:[.5,.5]}],dur:260}};
function drawFrontPose(pr,C0,pose,A,o={}){
  const back=o.view==='back',[c,g]=mk(52,52),C=effChar(pr,C0),body=drawFront(pr,C0,o.mood,{noArms:true,noLegs:true,back,face:o.face}),d=body.dims,ox=8;
  const sq=pose.sq||0,lift=pose.lift||0,dy=Math.round(sq*d.legLen*.5)-Math.round(lift),val=(v,i,df)=>v==null?df:Array.isArray(v)?v[i]:v;
  const S=C.skin,B=C.botC,SH=C.shoeC,T=C.topC,full=C.top==='kandura',longSl=['hoodie','compression','kandura','kurta','tracksuit','armor'].includes(C.top),
    tee=['tee','kit','trad'].includes(C.top),has=a=>C.acc.includes(a),rad=a=>a*Math.PI/180,RD=p=>[Math.round(p[0]),Math.round(p[1])];
  if(!o.noShadow)R(g,'rgba(0,0,0,.22)',ox+d.cx-10,50,20,1);
  // legs
  const legs=[0,1].map(i=>{const s=i?1:-1,hx=ox+(i?d.cx+1+d.lw/2:d.cx-1-d.lw/2),hip=[hx,d.hipY+dy+1],an=[hx+s*sq*1.5,d.shoeTop-1-lift];
    return{s,hip,an,kn:[(hip[0]+an[0])/2+s*sq*3.5,(hip[1]+an[1])/2]}});
  if(!full){legs.forEach(L=>{lineW(g,RD(L.hip),RD(L.kn),d.lw+2,OL);lineW(g,RD(L.kn),RD(L.an),d.lw+2,OL)});
    legs.forEach(L=>{lineW(g,RD(L.hip),RD(L.kn),d.lw,B);lineW(g,RD(L.kn),RD(L.an),d.lw,d.shorts?S:B)})}
  legs.forEach(L=>{const sx=Math.round(L.an[0]-d.lw/2-.5),sy=d.shoeTop-lift;R(g,OL,sx-1,sy-1,d.lw+3,4);R(g,SH,sx,sy,d.lw+1,1);R(g,'#f3efe6',sx,sy+1,d.lw+1,1)});
  // arms geometry
  const Lb=(d.torsoLen+1)*.5,arms=[0,1].map(i=>{const s=i?1:-1,sh=[ox+d.cx+s*(d.hw+d.aw/2)-(i?0:0),d.shY+2+dy],dir=a=>[s*Math.sin(rad(a)),Math.cos(rad(a))];
    const u=dir(val(pose.ua,i,5)),f=dir(val(pose.fa,i,5)),Lu=Lb*val(pose.ul,i,1),Lf=Lb*val(pose.fl,i,1),el=[sh[0]+u[0]*Lu,sh[1]+u[1]*Lu];return{sh,el,ha:[el[0]+f[0]*Lf,el[1]+f[1]*Lf]}});
  const hands=arms.map(a=>RD(a.ha)),hy=Math.round((hands[0][1]+hands[1][1])/2);
  const bar=y=>{const x0=Math.min(hands[0][0],hands[1][0])-7,x1=Math.max(hands[0][0],hands[1][0])+7;R(g,OL,x0-1,y-1,x1-x0+2,3);R(g,'#c7cde0',x0,y,x1-x0,1);
    [x0,x1-2].forEach(x=>{R(g,OL,x-1,y-5,4,11);R(g,'#3d3a4f',x,y-4,2,9);R(g,'#5b5873',x,y-4,1,9)})};
  if(A.prop==='barBack')bar(hy);
  if(full){const rows=Math.max(1,49-dy);g.drawImage(body,0,0,36,rows,ox,dy,36,rows)}else g.drawImage(body,ox,dy);
  if(A.prop==='cable'||A.prop==='barCable'){const pts2=A.prop==='cable'?hands:[[Math.round((hands[0][0]+hands[1][0])/2),hy]];pts2.forEach(([x,y])=>R(g,'#9aa3b5',x,0,1,Math.max(0,y-1)))}
  arms.forEach(a=>{lineW(g,RD(a.sh),RD(a.el),d.aw+2,OL);lineW(g,RD(a.el),RD(a.ha),d.aw+2,OL)});
  arms.forEach((a,i)=>{const up=longSl||tee?T:S;lineW(g,RD(a.sh),RD(a.el),d.aw,S);if(longSl||tee)lineW(g,RD(a.sh),RD(tee?[(a.sh[0]+a.el[0])/2,(a.sh[1]+a.el[1])/2]:a.el),d.aw,up);
    lineW(g,RD(a.el),RD(a.ha),d.aw,longSl?T:S);
    if(i===(back?1:0)&&has('watch')){const w=RD([a.el[0]+(a.ha[0]-a.el[0])*.7,a.el[1]+(a.ha[1]-a.el[1])*.7]);R(g,'#1d1d24',w[0]-1,w[1]-1,2,2);R(g,'#3fc1b0',w[0],w[1]-1,1,1)}
    if(i===(back?0:1)&&has('wristband')){const w=RD([a.el[0]+(a.ha[0]-a.el[0])*.7,a.el[1]+(a.ha[1]-a.el[1])*.7]);R(g,C.accC,w[0]-1,w[1]-1,2,2)}});
  if(A.prop==='bar'||A.prop==='barCable')bar(hy);
  if(A.prop==='db')hands.forEach(([x,y])=>{R(g,OL,x-4,y-2,9,5);R(g,'#3d3a4f',x-3,y-1,2,3);R(g,'#3d3a4f',x+2,y-1,2,3);R(g,'#9aa3b5',x-1,y,3,1)});
  if(A.prop==='db1'){const x=Math.round((hands[0][0]+hands[1][0])/2);R(g,OL,x-2,hy-5,5,10);R(g,'#3d3a4f',x-1,hy-4,3,2);R(g,'#3d3a4f',x-1,hy+1,3,2);R(g,'#9aa3b5',x,hy-2,1,3)}
  if(A.prop==='rope')hands.forEach(([x,y])=>lineW(g,[x,y],[ox+d.cx,y-6],1,'#d9c39a'));
  hands.forEach(([x,y])=>{disc(g,OL,x,y,1.7);disc(g,has('gloves')?'#2b2b33':S,x,y,1)});
  c.hands=hands;c.dims=d;return c}

/* ---- multi-view exercise player ---- */
function multiView(ak,speed,label){const avail=['front','side','back'].filter(v=>v==='side'||FP[ak]);let views=store.get('views',['side']).filter(v=>avail.includes(v));if(!views.length)views=['side'];
  let pls=[];const cur={speed},grid=h('div',{class:'vgrid'});
  const build=()=>{pls=views.map(v=>player(ak,0,{speed:cur.speed,view:v}));grid.className='vgrid'+(views.length===1?' one':'');grid.style.gridTemplateColumns=`repeat(${views.length},minmax(0,1fr))`;
    grid.replaceChildren(...pls.map((p,i)=>h('div',{class:'vcell'},p.el,views.length>1?h('span',{class:'vlab'},views[i].toUpperCase()):null)))};
  const seg=h('div',{class:'seg'},avail.map(v=>h('button',{'aria-pressed':String(views.includes(v)),onclick:()=>{if(views.includes(v)){if(views.length===1)return;views=views.filter(x=>x!==v)}else views=avail.filter(x=>x===v||views.includes(x));
    store.set('views',views);[...seg.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(views.includes(avail[i]))));build()}},v.toUpperCase())));
  build();
  return{stage:h('div',{class:'stage view'},grid,label?h('div',{class:'mtag'},label.split(/ & |, /).map(t=>h('span',{class:'tag s'},t.toUpperCase()))):null),seg:avail.length>1?h('div',{class:'row nowrap'},h('span',{class:'label'},'VIEW'),seg):null,
    toggle(){const on=!pls[0].playing;pls.forEach(p=>on?p.play():p.pause());return on},setSpeed(s){cur.speed=s;pls.forEach(p=>p.setSpeed(s))},get playing(){return pls[0].playing}}}

/* ---- home life scenes ---- */
let lastScene=null,curScene=null,renderKeep=false;
function lastExKey(){const l=[...ST.log].reverse().find(x=>x.done),r=l&&allR()[l.rid];const exs=r?r.ex.map(e=>e[0]):[];const n=exs.find(n=>FP[EX[n][0]]);return n?[EX[n][0],n,r.name]:['curl','Biceps curl',null]}
function pickScene(){const hr=new Date().getHours(),D=dayOf(),asleep=D.sleep>D.wake?(hr>=D.sleep||hr<D.wake):(hr>=D.sleep&&hr<D.wake),wd=!isWeekendToday();
  if(asleep)return'sleep';const o=['train','train','face','wave','drink'];const wj=D.job==='student'?'study':D.job==='remote'?'office':D.job==='shop'?'shop':D.job==='health'?'clinic':D.job==='field'?'field':'office';
  if(D.job!=='none'&&wd&&hr>=D.ws&&hr<D.we)o.push(wj,wj,wj,wj);if(D.job!=='none'&&D.job!=='remote'&&wd&&(hr===D.ws-1||hr===D.we))o.push('walk','walk');if(!wd&&hr>=9&&hr<20)o.push('walk','walk','eat');if([D.wake,12,13,19,20].includes(hr))o.push('eat','eat');
  let k;do{k=pick(o)}while(k===lastScene&&new Set(o).size>1);lastScene=k;return k}
function homeScene(force){const kind=force||(renderKeep&&curScene)||pickScene();if(!force)curScene=kind;const W=96,H=56,[c,g]=mk(W,H);g.imageSmoothingEnabled=false;c.setAttribute('role','img');
  const [ek,exName,rName]=lastExKey(),night=kind==='sleep',FX=['smile','blink','wink','surprised','smile','blink'];
  const cap={train:rName?'REPLAYING '+rName:'WARMING UP',sleep:'SLEEPING · ZZZ',office:dayOf().job==='remote'?'WORKING FROM HOME':'AT WORK',study:'STUDYING',shop:'AT THE SHOP',clinic:'ON SHIFT',field:'ON THE ROAD',walk:isWeekendToday()?'WEEKEND WALK':'ON THE WAY',eat:'SNACK TIME',drink:'HYDRATING',face:'HEY THERE!',listen:'LISTENING TO MERLIFT',wave:'HI, '+(P.name||'CHAMP').toUpperCase()+'!'}[kind];
  c.setAttribute('aria-label','Your avatar: '+cap.toLowerCase());
  const wall=night?'#232046':tok('panel2'),floor=night?'#1a1733':tok('line');
  const out=kind==='walk'||kind==='field';
  function room(){if(out){outdoor();return}const jw={shop:'#f3d9a4',clinic:'#e6f2f2',study:'#d9cdb8'}[kind];if(jw&&!night){R(g,jw,0,0,W,40);R(g,floor,0,40,W,16);R(g,shade(floor,-.18),0,40,W,1);jobBg();return}R(g,wall,0,0,W,40);R(g,floor,0,40,W,16);R(g,shade(floor,-.18),0,40,W,1);for(let x=0;x<W;x+=12)R(g,shade(floor,-.08),x,41,1,15);
    R(g,OL,70,5,19,15);R(g,night?'#0f1530':'#8fd3f5',71,6,17,13);if(night){disc(g,'#f6e9d0',79,11,3);disc(g,'#0f1530',80,10,2.5);pts(g,'#ffffff',[[73,8],[86,15],[75,16]])}else{disc(g,'#ffe08a',75,10,2.4);R(g,'#ffffff',80,13,6,2);R(g,'#ffffff',82,12,3,1)}
    R(g,OL,79,6,1,13);R(g,OL,71,12,17,1);
    if(!night){R(g,OL,7,6,13,15);R(g,'#ff6b57',8,7,11,13);R(g,'#f6e9d0',10,9,7,1);R(g,'#f6e9d0',12,11,3,6);R(g,'#f2b84b',9,18,9,1);
      R(g,'#5f9a52',2,30,6,10);disc(g,'#7fb069',5,28,4);disc(g,'#5f9a52',3,25,2.5);R(g,'#c97a3a',2,34,6,6)}
    if(kind!=='office'||dayOf().job==='remote')(ST.decoOn||[]).forEach(d=>drawDecor(g,d,night))}
  let scroll=0;function outdoor(){const day=new Date().getHours()<18;R(g,day?'#8fd3f5':'#2b2a5a',0,0,W,34);disc(g,day?'#ffe08a':'#f6e9d0',80,8,4);
    for(let k=0;k<4;k++){const x=((k*30-scroll*.3)%120+120)%120-14;R(g,day?'#b7a9d6':'#3d3570',x,14+(k%2)*4,14,20);R(g,day?'#9a8cc0':'#2e2858',x+2,17+(k%2)*4,3,2);R(g,day?'#9a8cc0':'#2e2858',x+8,17+(k%2)*4,3,2);R(g,day?'#9a8cc0':'#2e2858',x+2,24+(k%2)*4,3,2)}
    R(g,'#7fb069',0,34,W,3);R(g,'#9aa3b5',0,37,W,8);R(g,'#6d7380',0,45,W,11);for(let x=(-scroll%12+12)%12-12;x<W;x+=12)R(g,'#f6f3ec',x,50,6,1);
    for(let k=0;k<3;k++){const x=((k*44-scroll*.8)%132+132)%132-18;R(g,'#8d6e63',x+7,22,2,12);disc(g,'#5f9a52',x+8,19,5);disc(g,'#7fb069',x+7,17,3)}
    if(kind==='field'){R(g,OL,58,30,30,14);R(g,tok('a3'),59,31,28,12);R(g,'#c7e8f5',78,33,8,5);R(g,OL,62,43,6,5);R(g,OL,78,43,6,5);R(g,'#9aa3b5',64,44,2,2);R(g,'#9aa3b5',80,44,2,2)}}
  function jobBg(){if(kind==='shop'){for(let y=6;y<34;y+=9){R(g,'#8d6e63',4,y+6,40,2);[[6,'#ff6b57'],[12,'#3fc1b0'],[18,'#f2b84b'],[24,'#7b6fb0'],[30,'#ff6b57'],[36,'#3fc1b0']].forEach(([x,c],i)=>R(g,c,x,y+1+(i%2),4,5-(i%2)))}}
    if(kind==='clinic'){R(g,'#ffffff',70,6,14,14);R(g,'#ff5a5a',75,8,4,10);R(g,'#ff5a5a',72,11,10,4);R(g,'#bfe3e3',0,30,W,10)}
    if(kind==='study'){R(g,'#2e4d3a',6,5,40,20);R(g,'#8d6e63',5,4,42,1);R(g,'#8d6e63',5,25,42,2);R(g,'#f6f3ec',10,9,14,1);R(g,'#f6f3ec',10,13,22,1);R(g,'#f6f3ec',10,17,10,1);R(g,'#f2b84b',36,15,6,1)}}
  let t0=performance.now(),raf=0;
  function frame(now){if(!c.isConnected){cancelAnimationFrame(raf);return}const t=now-t0;g.clearRect(0,0,W,H);room();
    if(kind==='sleep'){R(g,OL,8,36,76,12);R(g,'#7b6fb0',9,37,74,10);R(g,'#5b4a63',9,45,74,2);R(g,OL,8,28,4,20);R(g,'#7b6fb0',9,29,2,18);R(g,OL,10,26,16,9);R(g,'#f6f3ec',11,27,14,7);
      const img=drawFront(P,P.char,null,{face:'sleep'}),br=Math.round(Math.sin(t/900));g.save();g.translate(0,50);g.rotate(-Math.PI/2);g.drawImage(img,0,0);g.restore();
      R(g,OL,30,25+br,52,13);R(g,tok('a3'),31,26+br,50,11);for(let x=33;x<80;x+=6)R(g,shade(tok('a3'),-.2),x,27+br,3,9);R(g,'#f6f3ec',31,26+br,50,2);
      for(let k=0;k<3;k++){const p=((t/1400)+k/3)%1,x=Math.round(20+p*14+k),y=Math.round(22-p*18),col=`rgba(246,233,208,${1-p})`;R(g,col,x,y,4,1);R(g,col,x+2,y+1,1,1);R(g,col,x+1,y+2,1,1);R(g,col,x,y+3,4,1)}}
    else if(kind==='face'){const f=FX[Math.floor(t/1300)%FX.length],img=drawFront(P,P.char,null,{face:f}),d=img.dims;g.drawImage(img,d.cx-10,d.hT-6,20,22,25,1,46,51)}
    else if(kind==='walk'){scroll=t/30;const A=SIDEWALK,ph=(1-Math.cos(2*Math.PI*t/A.dur))/2;g.drawImage(drawSide(P,P.char,lerpPose(A.f[0],A.f[1],ph),A),22,3)}
    else if(kind==='listen'){const A=FP.idle,ph=(1-Math.cos(2*Math.PI*t/(A.dur||2000)))/2,f=Math.floor(t/2600)%4===3?'blink':(Math.floor(t/4000)%3===2?'surprised':'smile');g.drawImage(drawFrontPose(P,P.char,lerpAny(A.f[0],A.f[1],ph),A,{face:f,mood:'great'}),46,3)}
    else{if(out)scroll=t/30;const A=kind==='train'?FP[ek]:kind==='office'||kind==='study'?SCN.type:kind==='walk'?SCN.walk:kind==='wave'||kind==='shop'||kind==='clinic'||kind==='field'?SCN.wave:SCN.eat,dur=A.dur||2000,ph=(1-Math.cos(2*Math.PI*t/dur))/2;
      const face=(kind==='eat'||kind==='drink')&&ph>.7?(Math.floor(t/180)%2?'chew':null):(kind==='wave'&&Math.floor(t/2600)%3===2?'wink':null);
      const img=drawFrontPose(P,P.char,lerpAny(A.f[0],A.f[1],ph),A,{face,mood:kind==='wave'?'great':todayMood()});if(auraOn())drawAura(g,kind==='field'?18:26,6,44,48,t);g.drawImage(img,kind==='field'?14:22,kind==='walk'?3+Math.round(Math.abs(Math.sin(t/220))*-1):3);
      const[hx,hy]=img.hands[1].map((v,i)=>v+(i?3:22));
      if(kind==='drink'){R(g,OL,hx-2,hy-7,5,10);R(g,'#7fd3ff',hx-1,hy-6,3,8);R(g,'#bff0ff',hx-1,hy-6,1,8);R(g,tok('a3'),hx-1,hy-7,3,1)}
      if(kind==='eat'){R(g,OL,hx-4,hy-3,8,6);R(g,'#e6c38c',hx-3,hy-2,6,4);R(g,'#4caf50',hx-3,hy,6,1);R(g,'#c0392b',hx-3,hy-1,6,1)}
      if(kind==='shop'){R(g,OL,0,40,W,3);R(g,'#c97a3a',0,41,W,15);R(g,'#a0662f',0,41,W,1);R(g,OL,62,32,14,9);R(g,'#26232e',63,33,12,7);R(g,'#7fd3c4',64,34,10,3)}
      if(kind==='clinic'){R(g,OL,hx-2,hy-5,5,7);R(g,'#ffffff',hx-1,hy-4,3,5);R(g,'#5ab4f5',hx-1,hy-4,3,1)}
      if(kind==='study'){R(g,OL,0,37,W,3);R(g,'#8d6e63',0,38,W,18);R(g,OL,34,30,24,8);R(g,'#f6f3ec',35,31,11,6);R(g,'#f6f3ec',47,31,10,6);R(g,'#9aa3b5',37,33,7,1);R(g,'#9aa3b5',49,33,6,1);R(g,'#ff6b57',66,32,12,6);R(g,'#3fc1b0',67,28,10,4)}
      if(kind==='office'){R(g,OL,0,37,W,3);R(g,'#8d6e63',0,38,W,18);R(g,'#6d4f45',0,38,W,1);R(g,OL,35,24,26,14);R(g,'#c7cde0',36,25,24,12);R(g,'#9aa3b5',36,36,24,1);disc(g,tok('a3'),48,30,1.6);
        R(g,OL,66,29,7,9);R(g,'#f6f3ec',67,30,5,7);R(g,'#c97a3a',67,30,5,2);if(Math.floor(t/500)%2)R(g,'rgba(255,255,255,.6)',68,26,1,2)}}
    raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
  const st=h('div',{class:'stage scene',role:'button',tabindex:'0','aria-label':'Your avatar. Tap to change the scene',onclick:()=>{if(kind==='sleep'){sleepPoke(st);return}haptic('tap');st.replaceWith(homeScene(pickScene()))}},c,h('span',{class:'scap tag s'},cap));return st}

/* ---- XP top bar + celebration ---- */
function updXpTop(){const el=document.getElementById('xpTop');if(!el)return;if(!P){el.hidden=true;return}el.hidden=false;const p=lvlProg();
  el.replaceChildren(h('span',{class:'xl'},'LV '+p.L),h('span',{class:'xb'},h('i',{style:`width:${p.pct}%`})),h('span',{class:'xn'},ST.xp+' XP'));el.setAttribute('aria-label',`Level ${p.L}, ${ST.xp} XP. Open level map`)}
function addXPRaw(n){const b=lvl();ST.xp+=n;save();updXpTop();return[b,lvl()]}
function muscleIdsFor(names){return Object.keys(MUSCLES).filter(id=>MUSCLES[id].ex.some(n=>names.includes(n)))}
function celebrate(sm){const ov=h('div',{class:'overlay celeb'});ov.style.top=(document.getElementById('hdr').offsetHeight)+'px';APP.append(ov);haptic('success');
  const[c,g]=mk(64,60);c.className='celebfig';c.setAttribute('role','img');c.setAttribute('aria-label','Your avatar celebrating');
  const total=sm.rows.reduce((a,r)=>a+r[1],0),rows=sm.rows.map(([l,x])=>{const n=h('span',{class:'tag s'},'+'+x+' XP');return[h('div',{class:'srow'},h('span',{},l),n),n,x]});
  const coins=8+Math.round(total/20),rr=Math.random(),chest=ST.workouts<=1||rr<.15?(rr<.01?'vault':rr<.06?'crate':rr<.15?'locker':'bag'):null,totEl=h('span',{class:'num'},total),btn=h('button',{class:'btn wide'},'FINISH');
  ov.append(h('main',{class:'anim'},h('div',{class:'cfig'},c),h('h1',{style:'text-align:center;color:#fff;text-shadow:3px 3px 0 rgba(0,0,0,.35)'},'WORKOUT COMPLETE!'),
    h('div',{class:'row nowrap',style:'justify-content:center;gap:16px'},show(drawBody('front',sm.muscles,false),2),show(drawBody('back',sm.muscles,false),2)),
    h('div',{class:'row',style:'justify-content:center;gap:6px'},sm.muscles.map(id=>h('span',{class:'tag',style:'background:#fff;color:#1a1433;border-color:#fff'},MUSCLES[id].n))),
    h('div',{class:'box csum'},h('div',{class:'macro'},[['TIME',sm.mins+' MIN'],['SETS',sm.sets],['MOVES',sm.moves]].map(([a,b])=>h('div',{},h('span',{class:'label'},a),h('span',{class:'num',style:'font-size:11px'},b)))),
      ...rows.map(r=>r[0]),h('div',{class:'srow',style:'border-top:3px solid var(--line);padding-top:8px'},h('span',{class:'label'},'TOTAL XP'),totEl),h('div',{class:'srow'},h('span',{class:'row nowrap',style:'gap:6px'},coinIcon(2),h('span',{},'COINS')),h('span',{class:'tag s'},'+'+coins)),chest?h('div',{class:'srow'},h('span',{class:'row nowrap',style:'gap:6px'},show(chestCanvas(chest,false),1),h('span',{},'BONUS')),h('span',{class:'tag s'},CHESTS[chest][0])):null,btn)));
  const sp=Array.from({length:18},()=>({x:Math.random()*64,y:Math.random()*60,s:Math.random()}));let t0=performance.now();
  const loop=now=>{if(!c.isConnected)return;const t=now-t0,ph=(1-Math.cos(t/350))/2;g.clearRect(0,0,64,60);sp.forEach(p=>{p.y-=.3+p.s*.3;if(p.y<0){p.y=60;p.x=Math.random()*64}R(g,p.s>.5?'#ffe08a':'#ffffff',p.x,p.y,1,1)});
    g.drawImage(drawFrontPose(P,P.char,lerpAny(SCN.cheer.f[0],SCN.cheer.f[1],ph),SCN,{mood:'great',noShadow:true}),6,Math.round(3+Math.sin(t/300)*3));requestAnimationFrame(loop)};requestAnimationFrame(loop);
  btn.onclick=()=>{btn.disabled=true;btn.textContent='COLLECTING XP…';let k=0;const N=22,iv=setInterval(()=>{k++;rows.forEach(([,el,x])=>el.textContent='+'+Math.round(x*(1-k/N))+' XP');if(k%3===0){tone(700+k*40,.05);haptic('tick')}if(k>=N){clearInterval(iv);fly()}},40)};
  function fly(){const a=APP.getBoundingClientRect(),from=totEl.getBoundingClientRect(),to=document.getElementById('xpTop').getBoundingClientRect(),f=h('div',{class:'xpfly'},'+'+total+' XP');
    f.style.left=(from.left-a.left-20)+'px';f.style.top=(from.top-a.top)+'px';APP.append(f);totEl.textContent='0';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to.left-from.left+20}px,${to.top-from.top}px) scale(.55)`;f.style.opacity='.3'}));
    setTimeout(()=>{f.remove();const[b,a2]=addXPRaw(total);addCoins(coins,true);SFX.coin();haptic('success');const x=document.getElementById('xpTop');x.classList.remove('pulse');void x.offsetWidth;x.classList.add('pulse');
      setTimeout(()=>{ov.remove();render();const after=()=>{if(a2>b)levelUp(a2);else if(ST.workouts===1&&!META.rated)setTimeout(rateModal,900)};if(chest)openChest(chest,'WORKOUT BONUS',after);else after()},650)},800)}}
function afterLevel(L){openChest(L%10===0?'vault':L%5===0?'crate':'bag','LEVEL '+L+' REWARD',()=>{if(tierAt(L)>tierAt(L-1))transformModal(P,P,'YOU GOT STRONGER!','Level '+L+': your avatar shows the work.',tierAt(L-1),tierAt(L))})}
function transformModal(a,b,title,sub,aT,bT){const st=h('div',{class:'stage tf'},show(drawFront(a,a.char,null,{tier:aT}),4)),lab=h('span',{class:'label'},'BEFORE');let m;
  m=modal(h('div',{class:'lvlup'},h('span',{class:'label'},'TRANSFORMATION'),st,lab,h('h2',{},title),h('span',{class:'small'},sub),h('button',{class:'btn wide',onclick:()=>{m.remove();render(true)}},'NICE!')));m.classList.add('center');
  setTimeout(()=>{if(!st.isConnected)return;st.classList.add('flash');SFX.lvl();haptic('level');setTimeout(()=>{st.replaceChildren(show(drawFront(b,b.char,'great',{tier:bT}),4));lab.textContent='AFTER'},260)},1100)}
function weighBox(){const lb=SET.units==='lb';let v=P.weight;const wl=ST.wlog||[],last=wl[wl.length-1];
  return h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'WEIGH-IN'),h('span',{class:'small'},last?'Last: '+last[0].slice(8,10)+'/'+last[0].slice(5,7):'Log once a week')),
    stepper('wlog',null,lb?Math.round(v*2.2046):v,lb?66:30,lb?550:250,lb?1:.5,x=>{v=lb?Math.round(x/2.2046*10)/10:x}),
    h('button',{class:'btn alt',onclick:()=>logWeight(v)},'LOG WEIGHT'))}
function logWeight(v){const old=P.weight;P.weight=v;ST.wlog=(ST.wlog||[]).concat([[today(),v]]).slice(-60);save();gainXP(3);
  if(Math.abs(v-old)>=.5){const down=v<old,t=down?(P.goal.type==='lose'?'YOU\'RE GETTING LEANER!':'WEIGHT DOWN'):(['muscle','strength'].includes(P.goal.type)?'BULKING UP!':'WEIGHT UP');
    transformModal({...P,weight:old},{...P},t,fmtW(old)+' → '+fmtW(v))}else render(true)}

/* ---- birthday ---- */
const isBday=()=>P&&P.dob&&P.dob.slice(5)===today().slice(5);
function balloons(){if(window._bday)return;window._bday=true;const lay=h('div',{class:'balloons','aria-hidden':'true'});APP.append(lay);const cols=['#ff6b57','#f2b84b','#3fc1b0','#7b6fb0','#e84393'];
  for(let i=0;i<14;i++){const[c,g]=mk(12,22),col=cols[i%5];ell(g,col,6,6,5,6);R(g,shade(col,.35),3,3,2,3);R(g,shade(col,-.2),5,12,3,1);for(let y=13;y<22;y++)R(g,'#f6f3ec',6+((y>>1)%2),y,1,1);outline(c);
    show(c,3);c.className='bl';c.style.left=(Math.random()*90)+'%';c.style.animationDelay=(Math.random()*2.5)+'s';c.style.animationDuration=(5+Math.random()*3)+'s';lay.append(c)}
  haptic('success');setTimeout(()=>lay.remove(),11000)}

/* ---- daily briefing ---- */
const CITY_LL={'Dubai':[25.2,55.27],'Abu Dhabi':[24.45,54.38],'Sharjah':[25.35,55.42],'Riyadh':[24.71,46.68],'Jeddah':[21.54,39.17],'Doha':[25.29,51.53],'Kuwait City':[29.38,47.99],'Muscat':[23.59,58.41],
  'Manama':[26.23,50.59],'Cairo':[30.04,31.24],'Khartoum':[15.5,32.56],'Amman':[31.95,35.93],'Istanbul':[41.01,28.98],'London':[51.51,-.13],'New York':[40.71,-74.01],'Mumbai':[19.08,72.88],'Karachi':[24.86,67.01],'Manila':[14.6,120.98]};
function weatherInfo(cb){const city=P.city,ll=CITY_LL[city];if(!ll){cb(null);return}const c=store.get('wx',null);if(c&&c.d===today()&&c.city===city){cb(c);return}
  try{fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ll[0]}&longitude=${ll[1]}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
    .then(r=>r.json()).then(j=>{const w={d:today(),city,t:Math.round(j.current.temperature_2m),code:j.current.weather_code,hi:Math.round(j.daily.temperature_2m_max[0]),lo:Math.round(j.daily.temperature_2m_min[0])};store.set('wx',w);cb(w)}).catch(()=>cb(null))}catch(e){cb(null)}}
const wxText=c=>c===0?'Clear skies':c<=3?'Partly cloudy':c<=48?'Foggy':c<=67?'Rainy':c<=77?'Snowy':c<=82?'Showers':'Thunderstorms';
const wxTip=w=>w.t>=33?'Hot one. Drink extra water and train indoors.':w.code>=51&&w.code<=82?'Wet outside. Perfect day for an indoor session.':w.t<=8?'Cold out. Warm up a little longer today.':'Nice weather for a walk on your rest day.';
const FACTS=['Muscles grow while you rest, not during the workout.','Your body has more than 600 muscles.','Sleeping under 6 hours can lower strength and slow recovery.','Muscle burns more energy at rest than fat does.',
  'Protein is spread best across 3–5 meals a day.','A 10-minute walk after meals helps steady blood sugar.','Most strength gains in the first months come from your nervous system learning the move.','Even 2 workouts a week can build real strength.'];
const MOTTOS=['Get fit, bit by bit.','Small reps, big results.','Show up. That\'s the hardest set.','Beat yesterday\'s you.','Every rep is XP.'];
function openBriefing(){META.brief=today();save();const hr=new Date().getHours(),greet=hr<12?'GOOD MORNING':hr<17?'GOOD AFTERNOON':'GOOD EVENING',rid=planFor(today()),r=rid&&allR()[rid],c=calc(),
  plan=MEALPLANS[P.goal.type]||MEALPLANS.fit,dayN=Math.floor(Date.now()/864e5),wxBox=h('div',{class:'box',hidden:true});
  weatherInfo(w=>{if(!w||!wxBox.isConnected)return;wxBox.hidden=false;wxBox.replaceChildren(h('span',{class:'label'},'WEATHER IN '+P.city.toUpperCase()),
    h('div',{class:'row nowrap'},px(w.code===0||w.code===1?'sun':'cloud',4),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('span',{class:'num'},w.t+'°C'),h('span',{class:'small'},`${wxText(w.code)} · H ${w.hi}° L ${w.lo}°`))),h('p',{class:'note'},wxTip(w)))});
  const ov=sheet('TODAY',(redraw,close)=>[h('span',{class:'tag s',style:'align-self:flex-start'},pick(MOTTOS).toUpperCase()),
    h('h1',{},greet+', '+(P.name||'CHAMP').toUpperCase()),h('span',{class:'small'},new Date().toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long'})),
    homeScene(isAsleepNow()?'sleep':'wave'),
    h('div',{class:'box'},h('span',{class:'label'},'TODAY\'S TRAINING'),r?[h('h3',{},r.name+' · '+r.ex.length+' MOVES'),h('span',{class:'small'},r.ex.map(e=>e[0]).join(', ')),h('button',{class:'btn',onclick:()=>{close();openWorkout(rid)}},'▶ START WORKOUT')]
      :[h('h3',{},'REST DAY'),h('span',{class:'small'},'Recovery day. A walk, some stretching and good sleep.')]),
    wxBox,
    h('div',{class:'box'},h('span',{class:'label'},'TODAY\'S FUEL'),h('div',{class:'macro'},[['PROTEIN',c.pro+'G'],['KCAL',c.kcal],['WATER','2.5L+']].map(([a,b])=>h('div',{},h('span',{class:'label'},a),h('span',{class:'num',style:'font-size:11px'},b)))),
      ...plan.map((meal,i)=>h('div',{class:'row nowrap',style:'align-items:flex-start'},foodIcon(meal[0][0],2),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:2px'},h('span',{class:'label'},['BREAKFAST','LUNCH','SNACK','DINNER'][i]),h('span',{},meal.map(([id])=>FOOD[id].n).join(' + ')))))),
    h('div',{class:'box'},h('span',{class:'label'},dayN%2?'DID YOU KNOW?':'JOKE OF THE DAY'),h('p',{},dayN%2?FACTS[dayN%FACTS.length]:JOKES[dayN%JOKES.length])),
    h('button',{class:'btn wide',onclick:close},'LET\'S GO!')]);
  return ov}

/* ---- music controller (native bridge in the APK) ---- */
function musicBox(){const N=window.IronBitNative,box=h('div',{class:'box'});
  if(!N||!N.musicState){box.append(h('div',{class:'row nowrap'},px('note',3),h('span',{class:'grow small'},'Music controls for Spotify, Anghami, YouTube Music and more work in the Android app.')));return box}
  let t=0;const draw=()=>{if(!box.isConnected){clearInterval(t);return}let st={};try{st=JSON.parse(N.musicState())}catch(e){}
    if(!st.access){box.replaceChildren(h('div',{class:'row nowrap'},px('note',3),h('span',{class:'grow'},'Control your music without leaving IronBit')),
      h('div',{class:'row nowrap'},h('button',{class:'btn alt grow',onclick:()=>N.musicAccess()},'ALLOW MUSIC CONTROL'),h('button',{class:'btn ghost',onclick:()=>N.openSpotify()},'SPOTIFY')),
      h('span',{class:'small'},'Android asks once for notification access so IronBit can see what is playing.'));return}
    box.replaceChildren(h('div',{class:'row nowrap'},px('note',3),h('div',{class:'grow',style:'min-width:0;display:flex;flex-direction:column;gap:3px'},h('span',{class:'label'},(st.app||'MUSIC').toUpperCase()),
      h('span',{style:'white-space:nowrap;overflow:hidden;text-overflow:ellipsis'},st.title||'Nothing playing'),st.artist?h('span',{class:'small'},st.artist):null)),
      h('div',{class:'row nowrap'},[['prev','⏮','Previous track'],['toggle',st.playing?'❚❚':'▶',st.playing?'Pause music':'Play music'],['next','⏭','Next track']].map(([cmd,ic,lab])=>h('button',{class:'stp grow','aria-label':lab,onclick:()=>{N.musicCmd(cmd);setTimeout(draw,350)}},ic)),
        h('button',{class:'btn ghost',onclick:()=>N.openSpotify()},'SPOTIFY')))};
  t=setInterval(draw,2500);draw();return box}

/* ---- art loader: drop PNGs in art/ and list them in art/manifest.json ---- */
const ART={};
function loadArt(){try{fetch('art/manifest.json').then(r=>r.ok?r.json():[]).then(list=>{let n=list.length;if(!n)return;list.forEach(name=>{const im=new Image();
  im.onload=im.onerror=()=>{if(im.naturalWidth)ART[name]=im;if(--n===0&&P)render(true)};im.src='art/'+name+'.png'})}).catch(()=>{})}catch(e){}}
setInterval(()=>{const n=new Date();document.querySelectorAll('[data-clock]').forEach(el=>{el.textContent=el.dataset.clock==='t'?n.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}):n.toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'}).toUpperCase()})},10000);


/* ---- v0.7: every country (flags are simplified 15×10 pixel versions) + a city for each ---- */
{const W='#ffffff',K='#000000',H=c=>[['h',c]],V=c=>[['v',c]],T=[1,2,3,4,5,5,4,3,2,1],
  nord=(bg,cr,inn)=>[['r',bg,0,0,15,10],['r',cr,3,0,3,10],['r',cr,0,3,15,4]].concat(inn?[['r',inn,4,0,1,10],['r',inn,0,4,15,2]]:[]),
  uk=[['r','#012169',0,0,7,5],['r',W,3,0,1,5],['r',W,0,2,7,1],['r','#c8102e',3,2,1,1]];
const ADD=[
['AF','Afghanistan','AFG','Kabul',34.53,69.17,V([K,'#be0000','#007a36'])],
['AL','Albania','ALB','Tirana',41.33,19.82,[['r','#e41e20',0,0,15,10],['c',K,7,5,2]]],
['DZ','Algeria','DZA','Algiers',36.75,3.06,[['v',['#006233',W]],['c','#d21034',7,5,2],['c',W,8,5,2]]],
['AD','Andorra','AND','Andorra la Vella',42.51,1.52,V(['#10069f','#fedf00','#d50032'])],
['AO','Angola','AGO','Luanda',-8.84,13.23,[['h',['#cc092f',K]],['c','#ffcb00',7,5,1]]],
['AG','Antigua and Barbuda','ATG','St. John\'s',17.12,-61.85,[['r','#ce1126',0,0,15,10],['r',K,3,0,9,4],['r','#fcd116',6,2,3,2],['r','#0072c6',4,4,7,2],['r',W,5,6,5,2],['r',W,6,8,3,1]]],
['AR','Argentina','ARG','Buenos Aires',-34.6,-58.38,[['h',['#74acdf',W,'#74acdf']],['c','#f6b40e',7,5,1]]],
['AM','Armenia','ARM','Yerevan',40.18,44.51,H(['#d90012','#0033a0','#f2a800'])],
['AU','Australia','AUS','Canberra',-35.28,149.13,[['r','#012169',0,0,15,10],...uk.slice(1),['r',W,3,7,1,1],['r',W,11,2,1,1],['r',W,9,5,1,1],['r',W,12,4,1,1],['r',W,11,8,1,1]]],
['AT','Austria','AUT','Vienna',48.21,16.37,H(['#ed2939',W,'#ed2939'])],
['AZ','Azerbaijan','AZE','Baku',40.41,49.87,[['h',['#00b5e2','#ef3340','#509e2f']],['c',W,7,5,1]]],
['BS','Bahamas','BHS','Nassau',25.05,-77.35,[['h',['#00abc9','#fae042','#00abc9']],['rows',K,T]]],
['BB','Barbados','BRB','Bridgetown',13.1,-59.62,[['v',['#00267f','#ffc726','#00267f']],['r',K,7,3,1,4]]],
['BY','Belarus','BLR','Minsk',53.9,27.57,[['h',['#c8313e','#c8313e','#4aa657']],['r',W,0,0,2,10],['dots','#c8313e',0,0,2,10]]],
['BE','Belgium','BEL','Brussels',50.85,4.35,V([K,'#fdda24','#ef3340'])],
['BZ','Belize','BLZ','Belmopan',17.25,-88.77,[['r','#003f87',0,0,15,10],['r','#ce1126',0,0,15,1],['r','#ce1126',0,9,15,1],['c',W,7,5,2]]],
['BJ','Benin','BEN','Porto-Novo',6.5,2.6,[['h',['#fcd116','#e8112d']],['r','#008751',0,0,6,10]]],
['BT','Bhutan','BTN','Thimphu',27.47,89.64,[['r','#ff4e12',0,0,15,10],['rows','#ffd520',[15,13,12,10,9,7,6,4,3,1]],['c',W,7,5,1]]],
['BO','Bolivia','BOL','La Paz',-16.5,-68.15,H(['#d52b1e','#f9e300','#007934'])],
['BA','Bosnia and Herzegovina','BIH','Sarajevo',43.86,18.41,[['r','#002395',0,0,15,10],['rows','#fecb00',[0,0,0,0,0,0,0,0,0,0]],['r','#fecb00',5,0,2,1],['r','#fecb00',6,1,2,2],['r','#fecb00',7,3,2,2],['r','#fecb00',8,5,2,2],['r','#fecb00',9,7,2,2],['r','#fecb00',10,9,2,1],['r',W,4,1,1,1],['r',W,5,3,1,1],['r',W,6,5,1,1],['r',W,7,7,1,1]]],
['BW','Botswana','BWA','Gaborone',-24.65,25.91,H(['#75aadb','#75aadb','#75aadb',W,K,K,W,'#75aadb','#75aadb','#75aadb'])],
['BR','Brazil','BRA','Brasília',-15.79,-47.88,[['r','#009c3b',0,0,15,10],['r','#ffdf00',6,1,3,1],['r','#ffdf00',4,2,7,1],['r','#ffdf00',2,3,11,1],['r','#ffdf00',1,4,13,2],['r','#ffdf00',2,6,11,1],['r','#ffdf00',4,7,7,1],['r','#ffdf00',6,8,3,1],['c','#002776',7,5,2]]],
['BN','Brunei','BRN','Bandar Seri Begawan',4.89,114.94,[['r','#f7e017',0,0,15,10],['r',W,0,3,15,2],['r',K,0,5,15,2],['c','#cf1126',7,5,2]]],
['BG','Bulgaria','BGR','Sofia',42.7,23.32,H([W,'#00966e','#d62612'])],
['BF','Burkina Faso','BFA','Ouagadougou',12.37,-1.52,[['h',['#ef2b2d','#009e49']],['c','#fcd116',7,5,1]]],
['BI','Burundi','BDI','Gitega',-3.43,29.93,[['r','#ce1126',0,0,15,10],['r','#1eb53a',0,3,3,4],['r','#1eb53a',12,3,3,4],['d',W],['c',W,7,5,2],['c','#ce1126',7,5,1]]],
['CV','Cabo Verde','CPV','Praia',14.93,-23.51,[['r','#003893',0,0,15,10],['r',W,0,6,15,1],['r','#cf2027',0,7,15,1],['r',W,0,8,15,1],['r','#f7d116',4,5,1,1],['r','#f7d116',6,4,1,1],['r','#f7d116',4,8,1,1]]],
['KH','Cambodia','KHM','Phnom Penh',11.56,104.92,[['h',['#032ea1','#e00025','#e00025','#032ea1']],['r',W,6,4,3,2],['r',W,5,5,5,1]]],
['CM','Cameroon','CMR','Yaoundé',3.85,11.5,[['v',['#007a5e','#ce1126','#fcd116']],['r','#fcd116',7,4,1,2]]],
['CA','Canada','CAN','Ottawa',45.42,-75.7,[['v',['#d52b1e',W,W,'#d52b1e']],['r','#d52b1e',7,2,1,6],['r','#d52b1e',5,4,5,2],['r','#d52b1e',6,3,3,1]]],
['CF','Central African Republic','CAF','Bangui',4.39,18.56,[['h',['#003082',W,'#289728','#ffce00']],['r','#d21034',6,0,3,10],['r','#ffce00',1,0,2,2]]],
['TD','Chad','TCD','N\'Djamena',12.13,15.05,V(['#002664','#fecb00','#c60c30'])],
['CL','Chile','CHL','Santiago',-33.45,-70.67,[['h',[W,'#d52b1e']],['r','#0039a6',0,0,5,5],['r',W,2,2,1,1]]],
['CO','Colombia','COL','Bogotá',4.71,-74.07,H(['#fcd116','#fcd116','#003893','#ce1126'])],
['KM','Comoros','COM','Moroni',-11.7,43.26,[['h',['#ffc61e',W,'#ce1126','#3a75c4']],['rows','#3d8e33',T],['r',W,1,4,1,2]]],
['CG','Congo','COG','Brazzaville',-4.26,15.24,[['r','#dc241f',0,0,15,10],['rows','#009543',[13,11,10,8,7,5,4,2,1,0]],['u','#fbde4a']]],
['CD','DR Congo','COD','Kinshasa',-4.32,15.31,[['r','#007fff',0,0,15,10],['u2','#f7d618'],['u','#ce1021'],['r','#f7d618',1,1,2,2]]],
['CR','Costa Rica','CRI','San José',9.93,-84.08,H(['#002b7f',W,'#ce1126','#ce1126',W,'#002b7f'])],
['CI','Côte d\'Ivoire','CIV','Abidjan',5.36,-4.01,V(['#f77f00',W,'#009e60'])],
['HR','Croatia','HRV','Zagreb',45.81,15.98,[['h',['#ff0000',W,'#171796']],['r','#ff0000',6,3,3,4],['r',W,6,3,1,1],['r',W,8,3,1,1],['r',W,7,4,1,1],['r',W,6,5,1,1],['r',W,8,5,1,1]]],
['CU','Cuba','CUB','Havana',23.11,-82.37,[['h',['#002a8f',W,'#002a8f',W,'#002a8f']],['rows','#cf142b',T],['r',W,1,4,2,2]]],
['CY','Cyprus','CYP','Nicosia',35.17,33.36,[['r',W,0,0,15,10],['r','#d57800',4,3,7,2],['r','#d57800',5,5,4,1],['r','#4e5b31',5,7,2,1],['r','#4e5b31',8,7,2,1]]],
['CZ','Czechia','CZE','Prague',50.08,14.44,[['h',[W,'#d7141a']],['rows','#11457e',[1,2,3,4,6,6,4,3,2,1]]]],
['DK','Denmark','DNK','Copenhagen',55.68,12.57,nord('#c8102e',W)],
['DJ','Djibouti','DJI','Djibouti',11.59,43.15,[['h',['#6ab2e7','#12ad2b']],['rows',W,T],['r','#d7141a',1,4,2,2]]],
['DM','Dominica','DMA','Roseau',15.3,-61.39,[['r','#006b3f',0,0,15,10],['r','#fcd116',6,0,1,10],['r',K,7,0,1,10],['r',W,8,0,1,10],['r','#fcd116',0,4,15,1],['r',K,0,5,15,1],['r',W,0,6,15,1],['c','#d41c30',7,5,2]]],
['DO','Dominican Republic','DOM','Santo Domingo',18.49,-69.93,[['r','#002d62',0,0,15,10],['r','#ce1126',8,0,7,4],['r','#ce1126',0,6,6,4],['r',W,6,0,2,10],['r',W,0,4,15,2]]],
['EC','Ecuador','ECU','Quito',-0.18,-78.47,[['h',['#ffdd00','#ffdd00','#034ea2','#ed1c24']],['c','#8a6a2c',7,5,1]]],
['SV','El Salvador','SLV','San Salvador',13.69,-89.22,[['h',['#0047ab',W,'#0047ab']],['c','#b6a75a',7,5,1]]],
['GQ','Equatorial Guinea','GNQ','Malabo',3.75,8.78,[['h',['#3e9a00',W,'#e32118']],['rows','#0073ce',[1,2,3,4,4,4,4,3,2,1]]]],
['ER','Eritrea','ERI','Asmara',15.32,38.93,[['h',['#12ad2b','#4189dd']],['rows','#ea0437',[2,4,6,8,13,13,8,6,4,2]],['c','#ffc726',3,5,1]]],
['EE','Estonia','EST','Tallinn',59.44,24.75,H(['#0072ce',K,W])],
['SZ','Eswatini','SWZ','Mbabane',-26.31,31.14,[['h',['#3e5eb9','#3e5eb9','#ffd900','#b10c0c','#b10c0c','#b10c0c','#b10c0c','#ffd900','#3e5eb9','#3e5eb9']],['r',W,4,4,4,2],['r',K,8,4,3,2]]],
['ET','Ethiopia','ETH','Addis Ababa',9.03,38.74,null],
['FJ','Fiji','FJI','Suva',-18.14,178.44,[['r','#68bfe5',0,0,15,10],...uk,['r',W,10,3,3,4],['r','#ce1126',10,3,3,1]]],
['FI','Finland','FIN','Helsinki',60.17,24.94,nord(W,'#003580')],
['GA','Gabon','GAB','Libreville',0.42,9.47,H(['#009e60','#fcd116','#3a75c4'])],
['GM','Gambia','GMB','Banjul',13.45,-16.58,H(['#ce1126','#ce1126','#ce1126',W,'#0c1c8c','#0c1c8c',W,'#3a7728','#3a7728','#3a7728'])],
['GE','Georgia','GEO','Tbilisi',41.72,44.78,[['r',W,0,0,15,10],['r','#ff0000',6,0,3,10],['r','#ff0000',0,4,15,2],['r','#ff0000',2,1,1,2],['r','#ff0000',12,1,1,2],['r','#ff0000',2,7,1,2],['r','#ff0000',12,7,1,2]]],
['GH','Ghana','GHA','Accra',5.6,-0.19,[['h',['#ce1126','#fcd116','#006b3f']],['r',K,7,4,1,2],['r',K,6,5,3,1]]],
['GR','Greece','GRC','Athens',37.98,23.73,[['h',['#0d5eaf',W,'#0d5eaf',W,'#0d5eaf',W,'#0d5eaf',W,'#0d5eaf',W]],['r','#0d5eaf',0,0,6,5],['r',W,2,0,2,5],['r',W,0,2,6,1]]],
['GD','Grenada','GRD','St. George\'s',12.05,-61.75,[['r','#ce1126',0,0,15,10],['r','#007a5e',1,1,13,8],['rows','#fcd116',[0,0,0,0,0,0,0,0,0,0]],['d','#fcd116'],['c','#ce1126',7,5,1]]],
['GT','Guatemala','GTM','Guatemala City',14.63,-90.51,[['v',['#4997d0',W,'#4997d0']],['c','#6c8d3b',7,5,1]]],
['GN','Guinea','GIN','Conakry',9.64,-13.58,V(['#ce1126','#fcd116','#009460'])],
['GW','Guinea-Bissau','GNB','Bissau',11.86,-15.6,[['h',['#fcd116','#009e49']],['r','#ce1126',0,0,5,10],['r',K,2,4,1,2]]],
['GY','Guyana','GUY','Georgetown',6.8,-58.16,[['r','#009e49',0,0,15,10],['rows','#fcd116',[3,5,7,9,15,15,9,7,5,3]],['rows','#ce1126',[1,2,3,4,6,6,4,3,2,1]]]],
['HT','Haiti','HTI','Port-au-Prince',18.54,-72.34,[['h',['#00209f','#d21034']],['r',W,5,3,5,4],['r','#016a16',6,5,3,1]]],
['HN','Honduras','HND','Tegucigalpa',14.07,-87.19,[['h',['#0073cf',W,'#0073cf']],['r','#0073cf',5,4,1,1],['r','#0073cf',9,4,1,1],['r','#0073cf',7,5,1,1],['r','#0073cf',5,6,1,1],['r','#0073cf',9,6,1,1]]],
['HU','Hungary','HUN','Budapest',47.5,19.04,H(['#ce2939',W,'#477050'])],
['IS','Iceland','ISL','Reykjavík',64.15,-21.94,nord('#02529c',W,'#dc1e35')],
['ID','Indonesia','IDN','Jakarta',-6.21,106.85,H(['#ce1126',W])],
['IR','Iran','IRN','Tehran',35.69,51.39,[['h',['#239f40',W,'#da0000']],['c','#da0000',7,5,1]]],
['IE','Ireland','IRL','Dublin',53.35,-6.26,V(['#169b62',W,'#ff883e'])],
['IL','Israel','ISR','Tel Aviv',32.09,34.78,[['r',W,0,0,15,10],['r','#0038b8',0,1,15,1],['r','#0038b8',0,8,15,1],['r','#0038b8',6,3,3,1],['r','#0038b8',6,6,3,1],['r','#0038b8',6,3,1,4],['r','#0038b8',8,3,1,4]]],
['JM','Jamaica','JAM','Kingston',17.97,-76.79,[['r','#009b3a',0,0,15,10],['rows',K,[0,0,1,2,3,3,2,1,0,0]],['r',K,12,2,3,6],['r',K,13,1,2,1],['r',K,13,8,2,1],['d','#fed100']]],
['JP','Japan','JPN','Tokyo',35.68,139.69,[['r',W,0,0,15,10],['c','#bc002d',7,5,3]]],
['KZ','Kazakhstan','KAZ','Astana',51.17,71.45,[['r','#00afca',0,0,15,10],['c','#fec50c',7,4,2],['r','#fec50c',1,0,1,10]]],
['KI','Kiribati','KIR','South Tarawa',1.33,172.98,[['h',['#ce1126','#ce1126','#ce1126','#ce1126','#ce1126',W,'#003f87',W,'#003f87',W]],['c','#fcd116',7,4,2]]],
['KP','North Korea','PRK','Pyongyang',39.04,125.76,[['h',['#024fa2','#024fa2',W,'#ed1c27','#ed1c27','#ed1c27','#ed1c27',W,'#024fa2','#024fa2']],['c',W,4,5,2],['c','#ed1c27',4,5,1]]],
['KR','South Korea','KOR','Seoul',37.57,126.98,[['r',W,0,0,15,10],['c','#cd2e3a',7,5,2],['r','#0047a0',5,5,5,2],['r','#0047a0',6,7,3,1],['r',K,2,2,1,2],['r',K,12,2,1,2],['r',K,2,6,1,2],['r',K,12,6,1,2]]],
['XK','Kosovo','XKX','Pristina',42.66,21.17,[['r','#244aa5',0,0,15,10],['r','#d0a650',5,4,5,3],['r',W,4,2,1,1],['r',W,6,1,1,1],['r',W,8,1,1,1],['r',W,10,2,1,1]]],
['KG','Kyrgyzstan','KGZ','Bishkek',42.87,74.59,[['r','#e8112d',0,0,15,10],['c','#ffef00',7,5,2],['c','#e8112d',7,5,1]]],
['LA','Laos','LAO','Vientiane',17.97,102.6,[['h',['#ce1126','#002868','#002868','#ce1126']],['c',W,7,5,2]]],
['LV','Latvia','LVA','Riga',56.95,24.11,H(['#9e3039','#9e3039',W,'#9e3039','#9e3039'])],
['LS','Lesotho','LSO','Maseru',-29.31,27.48,[['h',['#00209f',W,'#009543']],['r',K,7,4,1,2],['r',K,6,5,3,1]]],
['LR','Liberia','LBR','Monrovia',6.3,-10.8,[['h',['#bf0a30',W,'#bf0a30',W,'#bf0a30',W,'#bf0a30',W,'#bf0a30',W]],['r','#002868',0,0,5,5],['r',W,2,2,1,1]]],
['LY','Libya','LBY','Tripoli',32.89,13.19,[['h',['#e70013',K,K,'#239e46']],['c',W,7,5,1],['r',K,8,5,1,1]]],
['LI','Liechtenstein','LIE','Vaduz',47.14,9.52,[['h',['#002b7f','#ce1126']],['r','#ffd83d',3,1,2,2]]],
['LT','Lithuania','LTU','Vilnius',54.69,25.28,H(['#fdb913','#006a44','#c1272d'])],
['LU','Luxembourg','LUX','Luxembourg',49.61,6.13,H(['#ed2939',W,'#00a1de'])],
['MG','Madagascar','MDG','Antananarivo',-18.88,47.51,[['h',['#fc3d32','#007e3a']],['r',W,0,0,5,10]]],
['MW','Malawi','MWI','Lilongwe',-13.96,33.79,[['h',[K,'#ce1126','#339e35']],['r','#ce1126',5,1,5,1],['r','#ce1126',6,0,3,1]]],
['MY','Malaysia','MYS','Kuala Lumpur',3.14,101.69,[['h',['#cc0001',W,'#cc0001',W,'#cc0001',W,'#cc0001',W,'#cc0001',W]],['r','#010066',0,0,7,5],['c','#ffcc00',2,2,2],['c','#010066',3,2,1],['r','#ffcc00',5,2,1,1]]],
['MV','Maldives','MDV','Malé',4.18,73.51,[['r','#d21034',0,0,15,10],['r','#007e3a',3,2,9,6],['c',W,7,5,2],['c','#007e3a',8,5,2]]],
['ML','Mali','MLI','Bamako',12.64,-8.0,V(['#14b53a','#fcd116','#ce1126'])],
['MT','Malta','MLT','Valletta',35.9,14.51,[['v',[W,'#cf142b']],['r','#a0a0a0',1,1,2,2]]],
['MH','Marshall Islands','MHL','Majuro',7.09,171.38,[['r','#003893',0,0,15,10],['u','#dd7500'],['c',W,3,3,1]]],
['MR','Mauritania','MRT','Nouakchott',18.08,-15.98,[['r','#00a95c',0,0,15,10],['r','#d01c1f',0,0,15,1],['r','#d01c1f',0,9,15,1],['c','#ffd700',7,5,2],['c','#00a95c',7,4,2],['r','#ffd700',7,3,1,1]]],
['MU','Mauritius','MUS','Port Louis',-20.16,57.5,H(['#ea2839','#1a206d','#ffd500','#00a551'])],
['MX','Mexico','MEX','Mexico City',19.43,-99.13,[['v',['#006847',W,'#ce1126']],['c','#8c5a2b',7,5,1]]],
['FM','Micronesia','FSM','Palikir',6.92,158.16,[['r','#75b2dd',0,0,15,10],['r',W,7,2,1,1],['r',W,5,4,1,1],['r',W,9,4,1,1],['r',W,7,6,1,1]]],
['MD','Moldova','MDA','Chișinău',47.01,28.86,[['v',['#003da5','#ffd200','#cc092f']],['r','#b07e55',7,4,1,2]]],
['MC','Monaco','MCO','Monaco',43.73,7.42,H(['#ce1126',W])],
['MN','Mongolia','MNG','Ulaanbaatar',47.89,106.91,[['v',['#c4272f','#015197','#c4272f']],['r','#f9cf02',2,2,1,6]]],
['ME','Montenegro','MNE','Podgorica',42.44,19.26,[['r','#d4af37',0,0,15,10],['r','#c40308',1,1,13,8],['r','#d4af37',6,3,3,4]]],
['MZ','Mozambique','MOZ','Maputo',-25.97,32.57,[['h',['#009a44','#009a44','#009a44',W,K,K,W,'#fce100','#fce100','#fce100']],['rows','#d21034',T],['r','#fce100',1,4,2,2]]],
['MM','Myanmar','MMR','Naypyidaw',19.76,96.08,[['h',['#fecb00','#34b233','#ea2839']],['c',W,7,5,2]]],
['NA','Namibia','NAM','Windhoek',-22.56,17.08,[['r','#009543',0,0,15,10],['rows','#003580',[14,12,10,8,6,4,2,0,0,0]],['u','#d21034'],['c','#ffce00',2,2,1]]],
['NR','Nauru','NRU','Yaren',-0.55,166.92,[['r','#002b7f',0,0,15,10],['r','#ffc61e',0,4,15,1],['r',W,3,6,2,2]]],
['NL','Netherlands','NLD','Amsterdam',52.37,4.9,H(['#ae1c28',W,'#21468b'])],
['NZ','New Zealand','NZL','Wellington',-41.29,174.78,[['r','#012169',0,0,15,10],...uk.slice(1),['r','#c8102e',11,2,1,1],['r','#c8102e',9,5,1,1],['r','#c8102e',12,4,1,1],['r','#c8102e',11,7,1,1]]],
['NI','Nicaragua','NIC','Managua',12.11,-86.24,[['h',['#0067c6',W,'#0067c6']],['c','#c9a14a',7,5,1]]],
['NE','Niger','NER','Niamey',13.51,2.11,[['h',['#e05206',W,'#0db02b']],['c','#e05206',7,5,1]]],
['MK','North Macedonia','MKD','Skopje',42.0,21.43,[['r','#d20000',0,0,15,10],['d','#ffe600'],['r','#ffe600',0,4,15,2],['r','#ffe600',6,0,3,10],['c','#ffe600',7,5,2]]],
['NO','Norway','NOR','Oslo',59.91,10.75,nord('#ba0c2f',W,'#00205b')],
['PW','Palau','PLW','Ngerulmud',7.5,134.62,[['r','#4aadd6',0,0,15,10],['c','#ffde00',6,5,3]]],
['PS','Palestine','PSE','Ramallah',31.9,35.2,[['h',[K,W,'#007a3d']],['rows','#ce1126',T]]],
['PA','Panama','PAN','Panama City',8.98,-79.52,[['r',W,0,0,15,10],['r','#da121a',8,0,7,5],['r','#072357',0,5,7,5],['r','#072357',3,2,1,1],['r','#da121a',11,7,1,1]]],
['PG','Papua New Guinea','PNG','Port Moresby',-9.44,147.18,[['r','#ce1126',0,0,15,10],['rows',K,[1,3,4,6,7,9,10,12,13,15]],['r','#fcd116',10,2,2,2],['r',W,3,6,1,1],['r',W,5,7,1,1]]],
['PY','Paraguay','PRY','Asunción',-25.26,-57.58,[['h',['#d52b1e',W,'#0038a8']],['c','#fedf00',7,5,1]]],
['PE','Peru','PER','Lima',-12.05,-77.04,V(['#d91023',W,'#d91023'])],
['PL','Poland','POL','Warsaw',52.23,21.01,H([W,'#dc143c'])],
['PT','Portugal','PRT','Lisbon',38.72,-9.14,[['v',['#006600','#006600','#ff0000','#ff0000','#ff0000']],['c','#ffe900',6,5,2],['c','#ff0000',6,5,1]]],
['RO','Romania','ROU','Bucharest',44.43,26.1,V(['#002b7f','#fcd116','#ce1126'])],
['RW','Rwanda','RWA','Kigali',-1.94,30.06,[['h',['#00a1de','#00a1de','#00a1de','#00a1de','#00a1de','#00a1de','#fad201','#fad201','#20603d','#20603d']],['c','#fad201',12,2,1]]],
['KN','Saint Kitts and Nevis','KNA','Basseterre',17.3,-62.73,[['r','#009e49',0,0,15,10],['rows','#ce1126',[0,0,1,3,4,6,7,9,10,12].map(w=>0)],['r','#ce1126',8,5,7,5],['r','#ce1126',11,3,4,2],['u2','#fcd116'],['u',K]]],
['LC','Saint Lucia','LCA','Castries',14.01,-60.99,[['r','#66ccff',0,0,15,10],['r',W,6,2,3,1],['r',W,5,3,5,6],['r',K,6,3,3,5],['r','#fcd116',6,6,3,3]]],
['VC','Saint Vincent and the Grenadines','VCT','Kingstown',13.16,-61.22,[['v',['#002674','#fcd022','#fcd022','#009e60']],['r','#009e60',5,3,1,2],['r','#009e60',9,3,1,2],['r','#009e60',7,5,1,2]]],
['WS','Samoa','WSM','Apia',-13.83,-171.76,[['r','#ce1126',0,0,15,10],['r','#002b7f',0,0,7,5],['r',W,3,1,1,1],['r',W,2,3,1,1],['r',W,4,3,1,1],['r',W,5,2,1,1]]],
['SM','San Marino','SMR','San Marino',43.94,12.45,[['h',[W,'#5eb6e4']],['r','#d4a017',7,4,1,2]]],
['ST','São Tomé and Príncipe','STP','São Tomé',0.34,6.73,[['h',['#12ad2b','#ffce00','#ffce00','#12ad2b']],['rows','#d21034',T],['r',K,7,4,1,2],['r',K,11,4,1,2]]],
['SN','Senegal','SEN','Dakar',14.72,-17.47,[['v',['#00853f','#fdef42','#e31b23']],['r','#00853f',7,4,1,2],['r','#00853f',6,5,3,1]]],
['RS','Serbia','SRB','Belgrade',44.79,20.45,[['h',['#c6363c','#0c4076',W]],['r','#c6363c',3,2,3,5],['r',W,4,3,1,3]]],
['SC','Seychelles','SYC','Victoria',-4.62,55.45,[['h',['#003f87','#fcd856','#d62828',W,'#007a3d']],['rows','#003f87',[6,4,2,0,0,0,0,0,0,0]],['rows','#fcd856',[0,0,0,3,0,0,0,0,0,0]]]],
['SL','Sierra Leone','SLE','Freetown',8.47,-13.23,H(['#1eb53a',W,'#0072c6'])],
['SG','Singapore','SGP','Singapore',1.35,103.82,[['h',['#ef3340',W]],['c',W,3,2,2],['c','#ef3340',4,2,2],['r',W,6,1,1,1],['r',W,7,3,1,1],['r',W,5,3,1,1]]],
['SK','Slovakia','SVK','Bratislava',48.15,17.11,[['h',[W,'#0b4ea2','#ee1c25']],['r',W,2,2,5,6],['r','#ee1c25',3,2,3,5],['r',W,4,3,1,3],['r','#0b4ea2',3,6,3,1]]],
['SI','Slovenia','SVN','Ljubljana',46.06,14.51,[['h',[W,'#0000ff','#ff0000']],['r',W,3,1,3,5],['r','#0000ff',3,1,3,3],['r',W,4,2,1,1],['r','#ff0000',3,4,3,1]]],
['SB','Solomon Islands','SLB','Honiara',-9.43,159.95,[['r','#215b33',0,0,15,10],['rows','#0051ba',[14,12,11,9,8,6,5,3,2,0]],['u','#fcd116'],['r',W,2,1,1,1],['r',W,4,1,1,1],['r',W,3,2,1,1],['r',W,2,3,1,1],['r',W,4,3,1,1]]],
['ZA','South Africa','ZAF','Pretoria',-25.75,28.19,[['h',['#e03c31','#e03c31','#e03c31',W,'#007749','#007749',W,'#001489','#001489','#001489']],['rows',W,[2,3,4,5,7,7,5,4,3,2]],['rows','#007749',[1,2,3,4,15,15,4,3,2,1]],['rows','#ffb81c',[1,2,3,4,5,5,4,3,2,1]],['rows',K,[0,1,2,3,4,4,3,2,1,0]]]],
['SS','South Sudan','SSD','Juba',4.85,31.58,[['h',[K,K,K,W,'#da121a','#da121a',W,'#078930','#078930','#078930']],['rows','#0f47af',T],['r','#fcdd09',1,4,2,2]]],
['ES','Spain','ESP','Madrid',40.42,-3.7,[['h',['#aa151b','#f1bf00','#f1bf00','#aa151b']],['r','#aa151b',3,4,2,2]]],
['SR','Suriname','SUR','Paramaribo',5.85,-55.2,[['h',['#377e3f','#377e3f',W,'#b40a2d','#b40a2d','#b40a2d','#b40a2d',W,'#377e3f','#377e3f']],['r','#ecc81d',7,4,1,2],['r','#ecc81d',6,5,3,1]]],
['SE','Sweden','SWE','Stockholm',59.33,18.07,nord('#006aa7','#fecc00')],
['CH','Switzerland','CHE','Bern',46.95,7.45,[['r','#da291c',0,0,15,10],['r',W,6,2,3,6],['r',W,4,4,7,2]]],
['TW','Taiwan','TWN','Taipei',25.03,121.57,[['r','#fe0000',0,0,15,10],['r','#000095',0,0,7,5],['c',W,3,2,1]]],
['TJ','Tajikistan','TJK','Dushanbe',38.56,68.77,[['h',['#cc0000','#cc0000','#cc0000',W,W,W,W,'#006600','#006600','#006600']],['r','#f8c300',6,4,3,1],['r','#f8c300',7,3,1,1]]],
['TZ','Tanzania','TZA','Dodoma',-6.16,35.75,[['r','#00a3dd',0,0,15,10],['rows','#1eb53a',[14,12,11,9,8,6,5,3,2,0]],['u2','#fcd116'],['u',K]]],
['TH','Thailand','THA','Bangkok',13.76,100.5,H(['#a51931','#f4f5f8','#2d2a4a','#2d2a4a','#f4f5f8','#a51931'])],
['TL','Timor-Leste','TLS','Dili',-8.56,125.57,[['r','#dc241f',0,0,15,10],['rows','#ffc726',[1,2,3,4,6,6,4,3,2,1]],['rows',K,[1,1,2,3,4,4,3,2,1,1]]]],
['TG','Togo','TGO','Lomé',6.13,1.22,[['h',['#006a4e','#ffce00','#006a4e','#ffce00','#006a4e']],['r','#d21034',0,0,6,6],['r',W,2,2,2,2]]],
['TO','Tonga','TON','Nukuʻalofa',-21.14,-175.2,[['r','#c10000',0,0,15,10],['r',W,0,0,6,5],['r','#c10000',2,1,2,3],['r','#c10000',1,2,4,1]]],
['TT','Trinidad and Tobago','TTO','Port of Spain',10.65,-61.52,[['r','#ce1126',0,0,15,10],['dn',W],['dn2',K]]],
['TN','Tunisia','TUN','Tunis',36.81,10.18,[['r','#e70013',0,0,15,10],['c',W,7,5,3],['c','#e70013',7,5,2],['c',W,8,5,1]]],
['TM','Turkmenistan','TKM','Ashgabat',37.96,58.33,[['r','#00843d',0,0,15,10],['r','#d22630',2,0,3,10],['r','#ffd700',3,1,1,1],['r','#ffd700',3,4,1,1],['r','#ffd700',3,7,1,1],['r',W,8,2,1,2],['r',W,10,1,1,1]]],
['TV','Tuvalu','TUV','Funafuti',-8.52,179.2,[['r','#5b97b1',0,0,15,10],...uk,['r','#ffce00',10,2,1,1],['r','#ffce00',12,4,1,1],['r','#ffce00',9,6,1,1],['r','#ffce00',13,7,1,1]]],
['UG','Uganda','UGA','Kampala',0.35,32.58,[['h',[K,'#fcdc04','#d90000',K,'#fcdc04','#d90000']],['c',W,7,5,2]]],
['UA','Ukraine','UKR','Kyiv',50.45,30.52,H(['#0057b7','#ffd700'])],
['UY','Uruguay','URY','Montevideo',-34.9,-56.16,[['h',[W,'#0038a8',W,'#0038a8',W,'#0038a8',W,'#0038a8',W]],['r',W,0,0,5,5],['c','#fcd116',2,2,1]]],
['UZ','Uzbekistan','UZB','Tashkent',41.3,69.24,[['h',['#0099b5','#0099b5','#0099b5','#ce1126',W,W,'#ce1126','#1eb53a','#1eb53a','#1eb53a']],['r',W,1,0,1,2],['r',W,4,1,1,1],['r',W,6,1,1,1]]],
['VU','Vanuatu','VUT','Port Vila',-17.73,168.32,[['h',['#d21034','#009543']],['rows','#fdce12',[2,3,4,5,15,15,5,4,3,2]],['rows',K,T]]],
['VA','Vatican City','VAT','Vatican City',41.9,12.45,[['v',['#ffe000',W]],['r','#a0a0a0',10,4,2,2]]],
['VE','Venezuela','VEN','Caracas',10.48,-66.9,[['h',['#ffcc00','#00247d','#cf142b']],['r',W,5,4,5,1],['r',W,4,5,1,1],['r',W,10,5,1,1]]],
['VN','Vietnam','VNM','Hanoi',21.03,105.85,[['r','#da251d',0,0,15,10],['r','#ffff00',6,3,3,4],['r','#ffff00',5,4,5,1],['r','#da251d',7,6,1,1]]],
['ZM','Zambia','ZMB','Lusaka',-15.39,28.32,[['r','#198a00',0,0,15,10],['r','#de2010',10,4,1,6],['r',K,11,4,1,6],['r','#ef7d00',12,4,1,6],['r','#ef7d00',11,1,2,2]]],
['ZW','Zimbabwe','ZWE','Harare',-17.83,31.05,[['h',['#319208','#ffd200','#de2010',K,'#de2010','#ffd200','#319208']],['rows',W,T],['r','#de2010',1,4,2,2]]],
/* already drawn: just add their capital or main city */
['AE','','','Abu Dhabi'],['SA','','','Riyadh'],['SD','','','Khartoum'],['EG','','','Cairo'],['IN','','','New Delhi',28.61,77.21],['PK','','','Islamabad',33.68,73.05],
['PH','','','Manila'],['GB','','','London'],['US','','','Washington',38.9,-77.04],['JO','','','Amman'],['LB','','','Beirut',33.89,35.5],['SY','','','Damascus',33.51,36.29],
['KW','','','Kuwait City'],['QA','','','Doha'],['OM','','','Muscat'],['BH','','','Manama'],['BD','','','Dhaka',23.81,90.41],['NP','','','Kathmandu',27.72,85.32],
['LK','','','Colombo',6.93,79.86],['TR','','','Ankara',39.93,32.86],['MA','','','Rabat',34.02,-6.84],['IQ','','','Baghdad',33.31,44.36],['YE','','','Sanaa',15.37,44.19],
['SO','','','Mogadishu',2.05,45.32],['KE','','','Nairobi',-1.29,36.82],['NG','','','Abuja',9.08,7.4],['DE','','','Berlin',52.52,13.4],
['FR','','','Paris',48.86,2.35],['IT','','','Rome',41.9,12.5],['RU','','','Moscow',55.76,37.62],['CN','','','Beijing',39.9,116.4],
/* extra big cities */
['NG','','','Lagos',6.52,3.38],['MA','','','Casablanca',33.57,-7.59],['CA','','','Toronto',43.65,-79.38],['US','','','Los Angeles',34.05,-118.24],['AU','','','Sydney',-33.87,151.21],
['BR','','','São Paulo',-23.55,-46.63],['ZA','','','Johannesburg',-26.2,28.05],['EG','','','Alexandria',31.2,29.92],['SD','','','Omdurman',15.64,32.48],['SD','','','Port Sudan',19.62,37.22],
['AE','','','Al Ain',24.21,55.74],['AE','','','Ajman',25.4,55.48],['SA','','','Dammam',26.43,50.1],['SA','','','Mecca',21.39,39.86],['SA','','','Medina',24.47,39.61],
['DE','','','Munich',48.14,11.58],['GB','','','Manchester',53.48,-2.24],['IN','','','Bengaluru',12.97,77.59],['TR','','','Izmir',38.42,27.14],['PK','','','Lahore',31.55,74.34]];
const GEN=['City center','North side','South side','East side','West side'];
ADD.forEach(([c,n,i3,city,la,lo,spec])=>{if(n&&!FL[c])FL[c]=[n,i3,spec];if(city&&!CITIES[city])CITIES[city]=[c,'USD',35,0,GEN];if(la!=null&&!CITY_LL[city])CITY_LL[city]=[la,lo]});}
const COUNTRY_LIST=Object.entries(FL).filter(([c])=>c!=='XX').sort((a,b)=>a[1][0].localeCompare(b[1][0])).concat([['XX',FL.XX]]);
