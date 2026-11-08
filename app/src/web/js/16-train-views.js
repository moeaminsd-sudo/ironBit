/* ================= train views ================= */
let trainView='main',muscleSel=null,muscleSide='front',calSel=today(),calMonth=null,draft=null;
function trainScreen(){
  if(trainView==='muscles')return muscleMapView();if(trainView==='muscle')return muscleDetail(muscleSel);
  if(trainView==='builder')return builderView();if(trainView==='calendar')return calendarView();
  const w=weekPlan(),ti=todayIdx(),R=allR(),tool=(ic,t,v)=>h('button',{class:'tile',onclick:()=>{if(v==='builder')draft=newDraft();trainView=v;render()}},ic,t);
  return[h('h2',{},'THIS WEEK'),
   h('div',{class:'week'},w.map((r,i)=>h('div',{class:(r?'on ':'')+(i===ti?'today':'')},DAYS[i].slice(0,2),r?px('dumb',2):h('span',{},'·'),r?(R[r]?R[r].name.split(' ')[0].slice(0,5):'?'):'REST'))),
   h('span',{class:'small'},`${GOALS[P.goal.type][0].toLowerCase()} · ${P.goal.days} days a week · ${P.goal.level}`),
   h('button',{class:'btn alt wide genbtn',onclick:generatorWizard},px('bolt',2),'GENERATE A ROUTINE FOR ME'),
   h('div',{class:'tools'},tool(bodyThumb(),'MUSCLE MAP','muscles'),tool(px('dumb',4),'BUILD A ROUTINE','builder'),tool(px('cal',4),'CALENDAR','calendar')),
   h('h2',{},'MY ROUTINES'),
   (P.custom||[]).length?h('div',{class:'list'},P.custom.map(r=>h('div',{class:'ritem'},
     h('button',{class:'go',onclick:()=>openWorkout(r.id)},px('star',3),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('h3',{},r.name),h('span',{class:'small'},r.ex.length+' moves · '+stars(rDiff(r))+(r.days.length?' · '+r.days.map(d=>DAYS[d].slice(0,2)).join(' '):'')))),
     h('button',{class:'btn ghost',style:'padding:8px',onclick:()=>{draft={...r,ex:r.ex.map(e=>[...e]),days:[...r.days]};trainView='builder';render()}},'EDIT'),
     h('button',{class:'btn ghost',style:'padding:8px','aria-label':'Delete routine',onclick:()=>{let m;m=modal(h('h2',{},'DELETE '+r.name+'?'),h('p',{},'Your logged workouts stay in the calendar.'),
       h('button',{class:'btn',onclick:()=>{const idx=P.custom.findIndex(x=>x.id===r.id),old=P.custom[idx];P.custom=P.custom.filter(x=>x.id!==r.id);save();m.remove();render(true);undoToast('ROUTINE DELETED',()=>{P.custom.splice(idx,0,old);save();render(true)})}},'DELETE'),h('button',{class:'btn ghost',onclick:()=>m.remove()},'KEEP'))}},'✕')))):
     h('span',{class:'small'},'No custom routines yet. Build one around the muscles you want to train.'),
   h('h2',{},'ALL ROUTINES'),
   h('div',{class:'list'},Object.entries(ROUTINES).map(([id,r])=>h('button',{class:'item',onclick:()=>openWorkout(id)},px('dumb',3),
     h('span',{class:'grow'},h('h3',{},r.name),h('span',{class:'small'},r.ex.length+' moves · '+stars(rDiff(r)))),
     h('span',{class:'tag'+(w.includes(id)?' s':'')},w.includes(id)?'IN PLAN':'EXTRA'))))]}

/* ---- muscle map ---- */
const MUSCLES={
 chest:{n:'CHEST',l:'Pectoralis major',s:'r',fn:'Pushes your arms forward and brings them across your body.',tip:'Squeeze your shoulder blades together on every press so the chest does the work.',ex:['Bench press','Incline DB press','Push-up']},
 shoulders:{n:'SHOULDERS',l:'Deltoids',s:'l',sb:'l',fn:'Lift your arms forward, out to the side and back.',tip:'Use lighter weights and strict form. Shoulders are easy to overload.',ex:['Overhead press','Lateral raise','Face pull']},
 biceps:{n:'BICEPS',l:'Biceps brachii',s:'l',fn:'Bend your elbow and turn your palm up.',tip:'Keep your elbows pinned and don\'t swing the weight.',ex:['Biceps curl','Barbell row','Lat pulldown']},
 forearms:{n:'FOREARMS',l:'Wrist flexors & extensors',s:'l',sb:'l',fn:'Control your grip and your wrist.',tip:'A stronger grip helps every pulling exercise.',ex:['Farmer carry','Biceps curl','Deadlift']},
 abs:{n:'ABS',l:'Rectus abdominis',s:'r',fn:'Curls your torso forward and keeps your core stable.',tip:'Breathe out as you crunch and keep your lower back down.',ex:['Crunch','Plank','Mountain climber']},
 obliques:{n:'OBLIQUES',l:'External obliques',s:'r',fn:'Twist and bend your torso to the side.',tip:'Rotate slowly from the ribs, not the arms.',ex:['Russian twist','Mountain climber','Plank']},
 quads:{n:'QUADS',l:'Quadriceps',s:'l',fn:'Straighten your knee. Used in squats, stairs and running.',tip:'Let your knees travel over your toes as you squat.',ex:['Back squat','Leg press','Goblet squat','Walking lunge']},
 traps:{n:'TRAPS',l:'Trapezius',sb:'r',fn:'Lift and pull back your shoulder blades.',tip:'Stand tall and keep your neck relaxed.',ex:['Deadlift','Face pull','Farmer carry']},
 lats:{n:'LATS',l:'Latissimus dorsi',sb:'r',fn:'Pull your arms down and back. Builds the V-shape.',tip:'Pull with your elbows, not your hands.',ex:['Lat pulldown','Barbell row','Seated row']},
 triceps:{n:'TRICEPS',l:'Triceps brachii',sb:'l',fn:'Straightens your elbow. Most of your upper-arm size.',tip:'Lock out fully at the end of each rep.',ex:['Triceps pushdown','Push-up','Bench press']},
 lowerback:{n:'LOWER BACK',l:'Erector spinae',sb:'r',fn:'Keeps your spine straight when you bend and lift.',tip:'Keep a neutral spine and never round your back under load.',ex:['Romanian deadlift','Deadlift','Glute bridge']},
 glutes:{n:'GLUTES',l:'Gluteus maximus',sb:'r',fn:'Extend your hips. Your biggest, strongest muscle.',tip:'Squeeze hard at the top of every hip movement.',ex:['Glute bridge','Back squat','Walking lunge']},
 hamstrings:{n:'HAMSTRINGS',l:'Biceps femoris group',sb:'l',fn:'Bend your knee and extend your hip.',tip:'Push your hips back until you feel the stretch.',ex:['Romanian deadlift','Deadlift','Glute bridge']},
 calves:{n:'CALVES',l:'Gastrocnemius & soleus',sb:'r',fn:'Point your foot. Powers walking and jumping.',tip:'Pause at the top and get a full stretch at the bottom.',ex:['Calf raise','Farmer carry','Walking lunge']}
};
const MR={front:{shoulders:[[8,14,4,5],[28,14,4,5]],chest:[[13,15,7,6],[20,15,7,6]],biceps:[[8,19,4,7],[28,19,4,7]],forearms:[[7,27,4,9],[29,27,4,9]],
   abs:[[17,22,6,13]],obliques:[[13,23,4,11],[23,23,4,11]],quads:[[12,41,7,14],[21,41,7,14]]},
 back:{shoulders:[[8,14,4,5],[28,14,4,5]],traps:[[15,12,10,3],[17,15,6,4]],lats:[[12,19,5,11],[23,19,5,11]],lowerback:[[17,27,6,8]],triceps:[[8,19,4,8],[28,19,4,8]],
   forearms:[[7,27,4,9],[29,27,4,9]],glutes:[[12,36,8,6],[20,36,8,6]],hamstrings:[[12,43,7,13],[21,43,7,13]],calves:[[13,57,5,8],[22,57,5,8]]}};
function drawBody(view,sel,only){const[c,g]=mk(40,72),B='#d9c4ae',B2='#b9a28a';
  if(!only){disc(g,B,20,6,5);R(g,B,18,10,4,3);R(g,B,12,13,16,24);R(g,B,9,14,3,5);R(g,B,28,14,3,5);R(g,B,8,17,4,11);R(g,B,28,17,4,11);R(g,B,7,27,4,10);R(g,B,29,27,4,10);
    R(g,B,7,37,4,3);R(g,B,29,37,4,3);R(g,B,12,36,16,4);R(g,B,12,39,7,18);R(g,B,21,39,7,18);R(g,B,13,56,5,11);R(g,B,22,56,5,11);R(g,B,12,67,6,2);R(g,B,22,67,6,2);
    R(g,B2,27,13,1,24);R(g,B2,18,39,1,18);R(g,B2,27,39,1,18);R(g,B2,17,56,1,11);R(g,B2,26,56,1,11);
    if(view==='front'){pts(g,'#3b2a1a',[[18,6],[22,6]]);R(g,B2,19,9,2,1)}else R(g,'#6b4423',16,2,8,6)}
  for(const[id,rs]of Object.entries(MR[view])){if(only&&id!==sel)continue;const on=Array.isArray(sel)?sel.includes(id):id===sel,base=on?'#f2b84b':'#b5452f',dark=on?'#c98a1f':'#8a2f20',hi=on?'#ffe08a':'#d9634a';
    rs.forEach(([x,y,w,hh])=>{R(g,base,x,y,w,hh);for(let j=1;j<hh;j+=2)R(g,dark,x+(j%4===1?1:0),y+j,w-1,1);R(g,hi,x,y,1,hh);
      if(id==='abs'){for(let j=y+3;j<y+hh;j+=3)R(g,dark,x,j,w,1);R(g,dark,x+(w>>1),y,1,hh)}})}
  return outline(c)}
function bodyThumb(){const c=drawBody('front',null,false);return show(c,1)}
function muscleMapView(){const view=muscleSide,c=drawBody(view,null,false),NS='http://www.w3.org/2000/svg';
  const box=h('div',{class:'mm'}),svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 340 300');svg.setAttribute('preserveAspectRatio','none');
  c.setAttribute('role','img');c.setAttribute('aria-label','Pixel body, '+view+' view');box.append(c,svg);
  const open=id=>{muscleSel=id;trainView='muscle';render()};
  c.addEventListener('click',e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*40,y=(e.clientY-b.top)/b.height*72;
    for(const[id,rs]of Object.entries(MR[view]))if(rs.some(([rx,ry,w,hh])=>x>=rx&&x<rx+w&&y>=ry&&y<ry+hh)){open(id);return}});
  const items=Object.entries(MR[view]).map(([id,rs])=>{const M=MUSCLES[id],side=(view==='back'?M.sb:M.s)||'l',rr=side==='l'?rs[0]:rs[rs.length-1];
    return{id,side,mx:90+(rr[0]+rr[2]/2)*4,my:6+(rr[1]+rr[3]/2)*4}});
  ['l','r'].forEach(sd=>{let last=-99;items.filter(i=>i.side===sd).sort((a,b)=>a.my-b.my).forEach(i=>{i.ly=Math.max(i.my,last+26);last=i.ly})});
  items.forEach(i=>{const lx=i.side==='l'?80:260,ln=document.createElementNS(NS,'polyline');
    ln.setAttribute('points',`${lx},${i.ly} ${i.side==='l'?lx+8:lx-8},${i.ly} ${i.mx},${i.my}`);ln.style.fill='none';ln.style.stroke='var(--a1)';ln.setAttribute('stroke-width','2');ln.setAttribute('vector-effect','non-scaling-stroke');
    const dot=document.createElementNS(NS,'rect');dot.setAttribute('x',i.mx-3);dot.setAttribute('y',i.my-3);dot.setAttribute('width',6);dot.setAttribute('height',6);dot.style.fill='var(--a1)';svg.append(ln,dot);
    box.append(h('button',{class:'ml '+i.side,style:`top:${i.ly/300*100}%`,onclick:()=>open(i.id)},MUSCLES[i.id].n))});
  return[backRow('main'),h('div',{class:'row spread'},h('h2',{},'MUSCLE MAP'),h('div',{class:'seg'},[['front','FRONT'],['back','BACK']].map(([v,t])=>h('button',{'aria-pressed':String(v===muscleSide),onclick:()=>{muscleSide=v;render(true)}},t)))),
    h('span',{class:'small'},'Tap a muscle or its name to see what it does and how to train it.'),box]}
function muscleDetail(id){const M=MUSCLES[id],view=MR[muscleSide][id]?muscleSide:(MR.front[id]?'front':'back'),rs=MR[view][id];
  let x0=99,y0=99,x1=0,y1=0;rs.forEach(([x,y,w,hh])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+w);y1=Math.max(y1,y+hh)});
  const full=drawBody(view,id,true),bw=x1-x0+2,bh=y1-y0+2,[c,g]=mk(bw,bh);g.drawImage(full,x0-1,y0-1,bw,bh,0,0,bw,bh);
  show(c,Math.max(2,Math.min(Math.floor(250/bw),Math.floor(160/bh))));
  return[backRow('muscles'),h('div',{class:'stage',style:'display:grid;place-items:center;padding:22px 10px;overflow:hidden;background:var(--panel2)'},h('div',{class:'zoom'},c)),
    h('div',{class:'row spread'},h('h1',{},M.n),h('span',{class:'tag'},view.toUpperCase())),h('span',{class:'label'},M.l),
    h('div',{class:'box'},h('span',{class:'label'},'WHAT IT DOES'),h('p',{},M.fn),h('span',{class:'label'},'COACH TIP'),h('p',{},M.tip)),
    h('h2',{},'TRAIN IT'),h('div',{class:'list'},M.ex.map(n=>h('button',{class:'item',onclick:()=>exPreview(n)},px('dumb',3),
      h('span',{class:'grow'},h('h3',{},n.toUpperCase()),h('span',{class:'small'},'Difficulty '+stars(diffOf(n)))),h('span',{class:'tag s'},'▶ WATCH')))),
    h('button',{class:'btn alt',onclick:()=>{draft=newDraft();draft.name=M.n+' DAY';M.ex.forEach(n=>draft.ex.push([n,3,'10']));trainView='builder';render()}},'BUILD A '+M.n+' ROUTINE')]}

/* ---- routine builder ---- */
const newDraft=()=>({id:null,name:'MY ROUTINE',ex:[],days:[]});
function builderView(){if(!draft)draft=newDraft();const d=draft;let filt='ALL';const lib=h('div',{class:'list'});
  const drawLib=()=>lib.replaceChildren(...Object.keys(EX).filter(n=>filt==='ALL'||MUSCLES[filt].ex.includes(n)).map(n=>h('div',{class:'ritem'},
    h('button',{class:'go',onclick:()=>exPreview(n),'aria-label':'Watch '+n},px('dumb',2),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('span',{},n),h('span',{class:'small'},EX[n][1]+' · '+stars(diffOf(n))))),
    h('button',{class:'btn alt',style:'padding:8px',onclick:()=>{d.ex.push([n,3,'10']);render(true);toast('ADDED')}},'+ ADD'))));
  const sel=h('select',{id:'mf',onchange:e=>{filt=e.target.value;drawLib()}},h('option',{value:'ALL'},'All muscles'),Object.entries(MUSCLES).map(([k,M])=>h('option',{value:k},M.n.charAt(0)+M.n.slice(1).toLowerCase())));
  drawLib();const nb=(t,lab,fn)=>h('button',{class:'stp','aria-label':lab,onclick:fn},t);
  return[backRow('main'),h('h2',{},d.id?'EDIT ROUTINE':'ROUTINE BUILDER'),d.id?null:h('button',{class:'opt',onclick:generatorWizard},px('bolt',3),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('h3',{},'NOT SURE WHAT TO DO?'),h('span',{class:'small'},'Answer 7 quick questions and get a full weekly plan.')),h('span',{class:'tag s'},'GENERATE')),
   h('label',{class:'field',for:'rn'},h('span',{class:'label'},'NAME'),h('input',{id:'rn',maxlength:18,value:d.name,oninput:e=>d.name=e.target.value})),
   h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'YOUR EXERCISES'),h('span',{class:'tag s'},d.ex.length?'DIFFICULTY '+stars(rDiff(d)):'EMPTY')),
     d.ex.length?d.ex.map((e,i)=>h('div',{class:'item',style:'flex-wrap:wrap'},h('span',{class:'grow'},h('span',{},(i+1)+'. '+e[0]),h('span',{class:'small'},EX[e[0]][1])),
       h('div',{class:'row nowrap',style:'gap:4px;width:100%'},h('span',{class:'label'},'SETS'),h('div',{style:'width:128px;flex:none'},stepper('rs'+i,null,e[1],1,8,1,v=>{e[1]=v})),
         h('span',{class:'label',style:'margin-left:6px'},'REPS'),h('input',{id:'rr'+i,style:'width:60px',value:e[2],maxlength:4,'aria-label':'Reps',onchange:ev=>{e[2]=ev.target.value||'10'}}),
         h('span',{class:'grow'}),nb('▲','Move up',()=>{if(i>0){[d.ex[i-1],d.ex[i]]=[d.ex[i],d.ex[i-1]];render(true)}}),nb('✕','Remove',()=>{d.ex.splice(i,1);render(true)})))):h('span',{class:'small'},'Add exercises from the list below, or start from the muscle map.')),
   h('span',{class:'label'},'REPEAT ON (OPTIONAL)'),h('div',{class:'seg'},DAYS.map((dn,i)=>h('button',{'aria-pressed':String(d.days.includes(i)),onclick:()=>{d.days=d.days.includes(i)?d.days.filter(x=>x!==i):[...d.days,i];render(true)}},dn))),
   h('button',{class:'btn',disabled:!d.ex.length,onclick:saveDraft},'SAVE ROUTINE'),
   h('h2',{},'EXERCISE LIBRARY'),h('label',{class:'field',for:'mf'},h('span',{class:'label'},'FILTER BY MUSCLE'),sel),lib]}
function saveDraft(){const d=draft;P.custom=P.custom||[];if(!d.id&&P.custom.length>=3&&!SET.pro){proModal('The free version holds 3 custom routines. Pro removes the limit.');return}
  const r={id:d.id||'c'+Date.now(),name:(d.name.trim()||'MY ROUTINE').toUpperCase(),ex:d.ex.map(e=>[...e]),days:[...d.days],custom:true};
  const i=P.custom.findIndex(x=>x.id===r.id);if(i>=0)P.custom[i]=r;else P.custom.push(r);save();draft=null;trainView='main';render();toast('ROUTINE SAVED')}

/* ---- calendar ---- */
function calendarView(){const base=calMonth?new Date(calMonth+'-01T12:00'):new Date(),y=base.getFullYear(),m=base.getMonth();calMonth=dstr(new Date(y,m,1)).slice(0,7);
  const start=(new Date(y,m,1).getDay()+6)%7,R=allR(),td=today(),cells=[];
  for(let i=0;i<42;i++){const d=new Date(y,m,1-start+i),ds=dstr(d),logs=ST.log.filter(l=>l.d===ds),plan=ds>=td?planFor(ds):null;
    cells.push(h('button',{class:(d.getMonth()!==m?'other ':'')+(ds===td?'today ':'')+(ds===calSel?'sel':''),'aria-label':ds,onclick:()=>{calSel=ds;render(true)}},String(d.getDate()),
      h('div',{class:'mk'},logs.slice(0,3).map(l=>h('i',{style:`background:${l.done?'var(--a3)':'var(--a2)'}`})),plan&&!logs.length?h('i',{style:'background:var(--a1)'}):null)))}
  const sd=new Date(calSel+'T12:00'),sl=ST.log.filter(l=>l.d===calSel),sp=calSel>=td?planFor(calSel):null;
  const sel=h('select',{id:'schs'},h('option',{value:'rest'},'Rest day'),Object.entries(R).map(([id,r])=>{const o=h('option',{value:id},r.name);if(id===sp)o.selected=true;return o}));
  const nav2=(t,lab,dm)=>h('button',{class:'btn ghost',style:'padding:8px 10px','aria-label':lab,onclick:()=>{calMonth=dstr(new Date(y,m+dm,1)).slice(0,7);render(true)}},t);
  const done=ST.log.filter(l=>l.done&&l.d.startsWith(calMonth));
  return[backRow('main'),h('div',{class:'row spread nowrap'},nav2('◀','Previous month',-1),h('h2',{},base.toLocaleString('en',{month:'long',year:'numeric'}).toUpperCase()),nav2('▶','Next month',1)),
   h('div',{class:'cal'},DAYS.map(d=>h('span',{class:'wd'},d.slice(0,2))),cells),
   h('div',{class:'row'},h('span',{class:'tag'},'■ DONE'),h('span',{class:'tag c'},'■ ENDED EARLY'),h('span',{class:'tag s'},'■ PLANNED')),
   h('div',{class:'box'},h('span',{class:'label'},sd.toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long'})),
     sl.length?sl.map(l=>h('div',{class:'srow'},h('span',{},l.name),h('span',{class:'tag'+(l.done?'':' c')},l.done?'+'+l.xp+' XP':'ENDED EARLY'))):h('span',{class:'small'},calSel<=td?'No workouts logged on this day.':'Nothing logged yet.'),
     calSel>=td?h('label',{class:'field',for:'schs'},h('span',{class:'label'},'PLANNED WORKOUT'),sel):null,
     calSel>=td?h('button',{class:'btn alt',onclick:()=>{ST.sched[calSel]=sel.value;save();render(true);toast('PLAN SAVED')}},'SAVE PLAN'):null,
     calSel===td&&sp?h('button',{class:'btn',onclick:()=>openWorkout(sp)},'▶ START NOW'):null),
   h('div',{class:'stats'},h('div',{class:'stat'},h('span',{class:'num'},done.length),h('span',{class:'label'},'WORKOUTS')),h('div',{class:'stat'},h('span',{class:'num'},done.reduce((a,l)=>a+l.mins,0)),h('span',{class:'label'},'MINUTES')),
     h('div',{class:'stat'},h('span',{class:'num'},done.reduce((a,l)=>a+l.xp,0)),h('span',{class:'label'},'XP THIS MONTH')))]}
