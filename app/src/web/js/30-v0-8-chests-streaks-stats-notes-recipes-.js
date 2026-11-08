/* ================= v0.8: chests, streaks, stats, notes, recipes, follows, Merlift, keyboard, backup ================= */

/* ---- chests: 4 sizes, full-screen opening ---- */
const CHEST_KINDS=['bag','locker','crate','vault'];
const CH_ALIAS={wood:'bag',silver:'locker',gold:'crate'};
const CHEST_INFO={bag:['GYM BAG','#c0392b','#7a1f16',[20,45],.15,90,'NORMAL'],locker:['LOCKER','#5ab4f5','#2d6b8f',[50,110],.35,220,'MEDIUM'],crate:['POWER RACK CRATE','#c97a3a','#6b3d1f',[120,260],.55,520,'BIG'],vault:['GOLDEN DUMBBELL VAULT','#f2b84b','#b8680a',[400,800],1,1200,'LEGENDARY']};
CHEST_KINDS.forEach(k=>{CHESTS[k]=CHEST_INFO[k]});Object.entries(CH_ALIAS).forEach(([o,n])=>{CHESTS[o]=CHEST_INFO[n]});
function chestCanvas(kind,open){kind=CH_ALIAS[kind]||kind;const[cc,g]=mk(24,22),[,col,dk]=CHEST_INFO[kind],lt=shade(col,.3),glow='rgba(255,236,150,.9)';
  if(kind==='bag'){R(g,dk,7,3,10,2);R(g,dk,7,3,2,6);R(g,dk,15,3,2,6);disc(g,col,4,14,5);disc(g,col,19,14,5);R(g,col,4,9,16,11);R(g,lt,4,10,16,1);R(g,dk,2,18,20,2);R(g,'#f6f3ec',10,13,4,3);R(g,dk,11,14,2,1);
    if(open){R(g,'#1a1433',5,8,14,3);R(g,glow,6,5,12,4)}else R(g,'#d9d2c3',5,9,14,1)}
  else if(kind==='locker'){if(open){R(g,'#1a1433',6,0,12,22);R(g,glow,7,2,10,18);R(g,col,0,1,6,20);R(g,lt,1,2,1,18);R(g,'#d9d2c3',3,9,1,4)}
    else{R(g,col,5,0,14,22);R(g,lt,6,1,12,1);for(let y=3;y<9;y+=2)R(g,dk,8,y,8,1);R(g,'#d9d2c3',15,10,2,4);R(g,dk,5,20,14,2);for(let y=14;y<19;y+=2)R(g,dk,8,y,8,1)}}
  else if(kind==='crate'){if(open){R(g,glow,3,2,18,6);R(g,col,1,0,22,3);R(g,dk,1,2,22,1)}else{R(g,col,1,4,22,5);R(g,dk,1,8,22,1)}
    R(g,col,1,9,22,12);for(let y=11;y<21;y+=3)R(g,shade(col,-.12),1,y,22,1);R(g,'#5b5f6b',1,9,3,12);R(g,'#5b5f6b',20,9,3,12);R(g,dk,7,13,10,2);R(g,dk,6,12,2,4);R(g,dk,16,12,2,4)}
  else{if(open){R(g,dk,3,1,18,5);R(g,col,4,2,16,3);R(g,glow,5,6,14,4);for(let i=0;i<4;i++)disc(g,'#ffe08a',7+i*3,7,1.5)}else{R(g,dk,2,4,20,7);R(g,col,3,5,18,5);R(g,lt,3,5,18,1);R(g,'#ff5a5a',5,7,2,2);R(g,'#5ae0ff',17,7,2,2)}
    R(g,dk,2,11,20,9);R(g,col,3,12,18,7);R(g,shade(col,-.2),3,17,18,2);R(g,'#26232e',8,13,8,3);R(g,'#f6f3ec',9,14,6,1);R(g,'#f6f3ec',8,13,1,3);R(g,'#f6f3ec',15,13,1,3)}
  outline(cc);return cc}
function rollChest(kind){kind=CH_ALIAS[kind]||kind;const[,,,cr,odds]=CHEST_INFO[kind],r=Math.random,out=[['coins',cr[0]+Math.floor(r()*(cr[1]-cr[0]))]];
  const lk=lockedItems(),dec=Object.keys(DECOR).filter(d=>!(ST.deco||[]).includes(d)),giveItem=()=>{if(lk.length&&(r()<.6||!dec.length)){const[k,id]=lk[Math.floor(r()*lk.length)];out.push(['item',k,id])}else if(dec.length)out.push(['deco',dec[Math.floor(r()*dec.length)]])};
  const cr2={bag:[[0,.8],[1,.2]],locker:[[1,.6],[2,.4]],crate:[[2,.6],[3,.4]],vault:[[3,.7],[4,.3]]}[kind],collP={bag:.35,locker:.5,crate:.7,vault:1}[kind];
  if(r()<collP){let rr=r(),rar=cr2[0][0];for(const[x,w]of cr2){if(rr<w){rar=x;break}rr-=w}const pool=COLL.filter(c=>c.chest&&c.r===rar),un=pool.filter(c=>!ownsC(c.id)),pk=(un.length?un:pool);if(pk.length)out.push(['coll',pk[Math.floor(r()*pk.length)].id])}
  if(kind==='vault'){giveItem();out.push(['xp',300]);return out}
  const p=r();if(p<odds&&(lk.length||dec.length))giveItem();else if(p<odds+.35)out.push(['xp',{bag:30,locker:70,crate:150}[kind]]);return out}
function openChest(kind,why,then){kind=CH_ALIAS[kind]||kind;const[name,col]=CHEST_INFO[kind],items=rollChest(kind),still=matchMedia('(prefers-reduced-motion: reduce)').matches;let taps=0,done=false;
  const ov=h('div',{class:'chestfs k-'+kind,role:'dialog','aria-label':name}),rays=h('div',{class:'rays','aria-hidden':'true'}),cv=chestCanvas(kind,false),
    box=h('button',{class:'cbox','aria-label':'Tap the chest to open it'},show(cv,6)),hint=h('span',{class:'label'},'TAP ANYWHERE · 3'),list=h('div',{class:'cloot'}),
    [pc,pg]=mk(120,200);pc.className='cfx';pc.setAttribute('aria-hidden','true');
  const btn=h('button',{class:'btn wide',hidden:true,onclick:()=>{ov.remove();render(true);then&&then()}},'COLLECT');
  ov.append(rays,pc,h('div',{class:'ctop'},h('span',{class:'label'},why||'YOU FOUND A CHEST'),h('h2',{},name),h('span',{class:'tag s'},CHEST_INFO[kind][6])),box,hint,list,btn);APP.append(ov);
  let parts=[];const burst=(n,sp)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=.6+Math.random()*sp;parts.push({x:60,y:92,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,l:60+Math.random()*40,c:[col,'#ffe08a','#ffffff',tok('a3')][i%4]})}};
  const loop=()=>{if(!pc.isConnected)return;pg.clearRect(0,0,120,200);parts=parts.filter(p=>p.l-->0);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.05;R(pg,p.c,p.x,p.y,2,2)});requestAnimationFrame(loop)};if(!still)loop();
  const reveal=()=>{done=true;box.replaceChildren(show(chestCanvas(kind,true),10));ov.classList.add('flash');SFX.lvl();haptic('level');burst(90,3.2);hint.remove();
    items.forEach(([t,a,b],i)=>setTimeout(()=>{let row;
      if(t==='coins'){addCoins(a,true);row=h('div',{class:'item'},coinIcon(3),h('span',{class:'grow'},a+' COINS'))}
      if(t==='xp'){const[b0,a0]=addXPRaw(a);row=h('div',{class:'item'},px('star',3),h('span',{class:'grow'},'+'+a+' XP'));if(a0>b0)setTimeout(()=>levelUp(a0),1200)}
      if(t==='item'){grant(a,b);row=h('div',{class:'item'},rewardIcon([0,a,b]),h('span',{class:'grow'},ITEMNAME(a,b)),h('span',{class:'tag s'},'NEW'))}
      if(t==='deco'){ST.deco=[...(ST.deco||[]),a];ST.decoOn=[...(ST.decoOn||[]),a];save();row=h('div',{class:'item'},px('house',3),h('span',{class:'grow'},DECOR[a][0]),h('span',{class:'tag s'},'ROOM'))}
      if(t==='coll'){const c=CBYID[a],dup=ownsC(a);grantColl(a);row=h('div',{class:'item'},collIcon(c,3),h('span',{class:'grow'},c.n),dup?h('span',{class:'tag'},'×'+ST.coll[a]):rarTag(c.r))}
      tone(700+i*180,.12);haptic('success');row.classList.add('pop');list.append(row);if(i===items.length-1){btn.hidden=false;btn.focus()}},500+i*450))};
  ov.addEventListener('click',e=>{if(done||e.target.closest('.btn'))return;taps++;tone(260+taps*140,.09);tone(130+taps*70,.12,null,.05);haptic(taps>2?'success':'click');
    box.firstChild.style.width=(24*(6+taps*1.4))+'px';box.firstChild.style.height=(22*(6+taps*1.4))+'px';
    box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');burst(10+taps*6,1.2+taps*.4);hint.textContent='TAP ANYWHERE · '+(3-taps);if(taps>=3)setTimeout(reveal,180)});
  setTimeout(()=>box.focus(),100);return ov}

/* ---- streaks ---- */
function workDays(){return new Set(ST.log.filter(l=>l.done).map(l=>l.d))}
function streakChain(){const W=workDays(),out=[];const d=new Date();let started=false;
  for(let i=0;i<400;i++){const ds=dstr(d),did=W.has(ds),planned=!!planFor(ds),isToday=i===0;
    const fz=(ST.frozen||[]).includes(ds);if(did){out.push([ds,'done']);started=true}else if(isToday)out.push([ds,fz?'frozen':'today']);else if(fz)out.push([ds,'frozen']);else if(planned)break;else out.push([ds,'rest']);d.setDate(d.getDate()-1)}
  while(out.length&&out[out.length-1][1]!=='done')out.pop();return out.reverse()}
function calcStreak(){const c=streakChain();return c.filter(x=>x[1]==='done').length}
function syncStreak(){const s=calcStreak();ST.streak=s;ST.bestStreak=Math.max(ST.bestStreak||0,s)}
function flameCanvas(s=4){const[c,g]=mk(12,16);c.className='flame';c.setAttribute('aria-hidden','true');show(c,s);const t0=performance.now(),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const F=['#ff3b1f','#ff8c1a','#ffd54a','#fff3b0'];const loop=now=>{if(!c.isConnected)return;const t=(now-t0)/110|0;g.clearRect(0,0,12,16);
    const rows=[[5,1],[4,3],[4,4],[3,6],[2,8],[2,8],[1,10],[1,10],[1,10],[1,10],[2,8],[2,8],[3,6],[4,4]];rows.forEach(([x,w],y)=>{const wob=((t+y)%4===0)?1:((t+y)%4===2?-1:0);R(g,F[0],x+(y<5?wob:0),y+2,w,1)});
    [[5,6,2],[4,7,4],[4,8,4],[3,9,6],[3,10,6],[3,11,6],[4,12,4],[4,13,4]].forEach(([x,y,w])=>R(g,F[1],x+(y<8&&t%2?1:0),y+1,w,1));
    [[5,9,2],[5,10,2],[4,11,4],[4,12,4],[5,13,2]].forEach(([x,y,w])=>R(g,F[2],x,y,w,1));R(g,F[3],5,12,2,1);outline(c);if(!still)requestAnimationFrame(loop)};requestAnimationFrame(loop);return c}
function streakPage(){syncStreak();save();sheet('STREAK',redraw=>{const ch=streakChain(),s=ST.streak,best=ST.bestStreak||s,next=[3,7,14,30,60,100,200,365].find(m=>m>s)||s+100;
  const lastDone=[...ch].reverse().find(x=>x[1]==='done');
  const nodes=[...ch].reverse().slice(0,40).map(([ds,k])=>{const d=new Date(ds+'T12:00'),lab=d.toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'}).toUpperCase(),isLast=lastDone&&ds===lastDone[0];
    return h('div',{class:'snode '+k+(isLast?' last':'')},h('span',{class:'sdot'},isLast?flameCanvas(3):k==='frozen'?freezeIcon(2):k==='done'?px('dumb',2):k==='today'?h('span',{class:'small'},'?'):h('span',{class:'small'},'·')),
      h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('span',{class:'label'},lab),h('span',{class:'small'},k==='done'?(ST.log.filter(l=>l.done&&l.d===ds).map(l=>l.name).join(', ')||'Workout'):k==='today'?'Train today to grow your streak':k==='frozen'?'Streak frozen':'Rest day')))});
  return[h('div',{class:'box sthead'},flameCanvas(6),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:6px'},h('span',{class:'num',style:'font-size:28px'},s),h('span',{class:'label'},s===1?'WORKOUT IN A ROW':'WORKOUTS IN A ROW'),h('span',{class:'small'},'Best: '+best+' · next goal: '+next))),
    h('div',{class:'bar t'},h('i',{style:`width:${Math.min(100,s/next*100)}%`})),
    freezeBox(redraw),
    ch.length?h('div',{class:'sline'},...nodes):h('div',{class:'box'},h('h3',{},'NO STREAK YET'),h('p',{},'Finish a workout to light the first flame. Rest days on your plan never break it; only a missed workout day does.')),
    h('p',{class:'note'},'Your streak counts finished workouts in a row. Planned rest days and frozen days are safe. Skipping a planned workout day resets it.')]})}

/* ---- pixel charts ---- */
function pxBars(vals,labels,col,o={}){const n=vals.length,bw=o.bw||8,gap=2,H=o.h||40,W=n*(bw+gap),max=Math.max(1,...vals),[c,g]=mk(W,H);c.className='pxchart';c.setAttribute('role','img');c.setAttribute('aria-label',(o.label||'Chart')+': '+vals.map((v,i)=>labels[i]+' '+v).join(', '));
  for(let y=H-1;y>=0;y-=10)R(g,tok('line'),0,y,W,1);vals.forEach((v,i)=>{const bh=Math.round(v/max*(H-4));if(bh>0){R(g,shade(col,-.3),i*(bw+gap),H-bh,bw,bh);R(g,col,i*(bw+gap),H-bh,bw-2,bh);R(g,shade(col,.3),i*(bw+gap),H-bh,bw-2,1)}});
  return h('div',{class:'chartw'},show(c,1),h('div',{class:'clabs',style:`grid-template-columns:repeat(${n},1fr)`},labels.map(l=>h('span',{},l))))}
function pxLine(pts,col,o={}){const W=120,H=o.h||40,[c,g]=mk(W,H);c.className='pxchart';c.setAttribute('role','img');c.setAttribute('aria-label',o.label||'Line chart');if(pts.length<2){R(g,tok('line'),0,H/2,W,1);return show(c,1)}
  const mn=Math.min(...pts),mx=Math.max(...pts),rg=Math.max(.5,mx-mn),X=i=>Math.round(i*(W-3)/(pts.length-1))+1,Y=v=>Math.round(H-4-(v-mn)/rg*(H-8));
  for(let y=0;y<H;y+=10)R(g,tok('line'),0,y,W,1);for(let i=1;i<pts.length;i++)lineW(g,[X(i-1),Y(pts[i-1])],[X(i),Y(pts[i])],1,col);pts.forEach((v,i)=>R(g,col,X(i)-1,Y(v)-1,3,3));return show(c,1)}

/* ---- stats page ---- */
function statsPage(){syncStreak();sheet('MY STATS',()=>{const L=ST.log.filter(l=>l.done),mins=L.reduce((a,l)=>a+(l.mins||0),0),wxp=L.reduce((a,l)=>a+l.xp,0);
  const weeks=Array.from({length:8},(_,i)=>{const d=new Date();d.setDate(d.getDate()-7*(7-i));return weekKey(d)}),wc=weeks.map(w=>L.filter(l=>weekKey(new Date(l.d+'T12:00'))===w).length);
  const wd=[0,0,0,0,0,0,0];L.forEach(l=>{const i=(new Date(l.d+'T12:00').getDay()+6)%7;wd[i]++});
  const byR={};L.forEach(l=>{byR[l.name]=(byR[l.name]||0)+1});const top=Object.entries(byR).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const wl=ST.wlog||[],w0=wl[0],w1=wl[wl.length-1],dW=w0&&w1?Math.round((w1[1]-w0[1])*10)/10:0;
  const days7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return dstr(d)}),pl=ST.plog||{},pv=days7.map(d=>pl[d]||0),target=calc().pro,avgP=Math.round(pv.reduce((a,b)=>a+b,0)/7);
  const tile=(v,l)=>h('div',{class:'stat'},h('span',{class:'num'},v),h('span',{class:'label'},l));
  const avgW=Math.round(wc.slice(-4).reduce((a,b)=>a+b,0)/4*10)/10;
  return[h('div',{class:'stats'},tile(L.length,'WORKOUTS'),tile(Math.round(mins/60*10)/10+'H','TIME TRAINED'),tile(wxp,'WORKOUT XP')),
    h('div',{class:'stats'},tile(ST.streak,'STREAK'),tile(ST.bestStreak||ST.streak,'BEST STREAK'),tile(avgW,'PER WEEK')),
    h('div',{class:'box'},h('span',{class:'label'},'WORKOUTS PER WEEK · LAST 8 WEEKS'),pxBars(wc,weeks.map(w=>new Date(w+'T12:00').getDate()+''),tok('a3'),{label:'Workouts per week'})),
    h('div',{class:'box'},h('span',{class:'label'},'YOUR TRAINING DAYS'),pxBars(wd,DAYS.map(d=>d.slice(0,2)),tok('a2'),{label:'Workouts by weekday',bw:14})),
    h('div',{class:'box'},h('span',{class:'label'},'FAVOURITE ROUTINES'),top.length?top.map(([n,c],i)=>h('div',{class:'srow'},h('span',{},(i+1)+'. '+n),h('span',{class:'tag s'},c+'×'))):h('span',{class:'small'},'Finish a workout to see your favourites.')),
    h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'BODY WEIGHT'),h('span',{class:'tag'+(dW<0?' s':'')},wl.length>1?(dW>0?'+':'')+fmtW(dW).replace(' ',' '):'LOG MORE')),pxLine(wl.slice(-30).map(x=>x[1]),tok('a1'),{label:'Weight trend'}),
      h('span',{class:'small'},wl.length?`Start ${fmtW(w0[1])} · now ${fmtW(w1[1])} · ${wl.length} entries`:'Log your weight on the Me page to see your trend.')),
    h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'PROTEIN · LAST 7 DAYS'),h('span',{class:'small'},'avg '+avgP+' / '+target+' g')),pxBars(pv,days7.map(d=>DAYS[(new Date(d+'T12:00').getDay()+6)%7].slice(0,2)),tok('a1'),{label:'Protein per day',bw:14}),
      h('span',{class:'small'},`${PLATE.length} foods on your plate now · ${(NOTES.list.find(n=>n.id==='shop')||{items:[]}).items.length} items on your shopping list`)),
    h('div',{class:'box'},h('span',{class:'label'},'ALL TIME'),...[['Level',lvl()+' · '+rank()],['Total XP',ST.xp],['Coins',ST.coins||0],['League',LG.ko?'Knockout':'League '+lgNum(LG.lg)+' · '+lgName(LG.lg)],['Trophies',LG.cups.gold+LG.cups.silver+LG.cups.bronze],['Member since',META.since||today()]].map(([k,v])=>h('div',{class:'srow'},h('span',{},k),h('span',{class:'tag'},v))))]})}

/* ---- notes (shopping list can't be deleted) ---- */
let NOTES=store.get('notes',null)||{list:[{id:'shop',title:'SHOPPING LIST',items:[],fixed:true}]};
if(!NOTES.list.some(n=>n.id==='shop'))NOTES.list.unshift({id:'shop',title:'SHOPPING LIST',items:[],fixed:true});
const saveNotes=()=>store.set('notes',NOTES);
const shopList=()=>NOTES.list.find(n=>n.id==='shop');
function addToShopping(items){const S=shopList(),have=new Set(S.items.map(i=>i.t.toLowerCase()));let n=0;items.forEach(t=>{if(!have.has(t.toLowerCase())){S.items.push({t,done:false});n++}});saveNotes();return n}
function shoppingPage(back){const ov=sheet('SHOPPING LIST',redraw=>{const S=shopList(),inp=h('input',{id:'shi',placeholder:'Add an item',maxlength:60,'aria-label':'New item'});
  const add=()=>{const t=inp.value.trim();if(!t)return;S.items.push({t,done:false});saveNotes();redraw();setTimeout(()=>document.getElementById('shi')?.focus(),50)};inp.addEventListener('keydown',e=>{if(e.key==='Enter')add()});
  return[h('div',{class:'row nowrap'},inp,h('button',{class:'btn',onclick:add},'ADD')),
    S.items.length?h('div',{class:'list'},S.items.map((it,i)=>h('div',{class:'item'+(it.done?' dim':'')},h('button',{class:'toggle','aria-pressed':String(it.done),'aria-label':(it.done?'Unmark ':'Mark ')+it.t,onclick:()=>{it.done=!it.done;saveNotes();redraw()}}),
      h('span',{class:'grow',style:it.done?'text-decoration:line-through':''},it.t),h('button',{class:'btn ghost',style:'padding:6px 8px','aria-label':'Remove '+it.t,onclick:()=>{S.items.splice(i,1);saveNotes();redraw()}},'✕')))):h('p',{class:'note'},'Your list is empty. Add items here, or tap "add to shopping list" on any recipe.'),
    S.items.some(i=>i.done)?h('button',{class:'btn ghost',onclick:()=>{S.items=S.items.filter(i=>!i.done);saveNotes();redraw()}},'CLEAR CHECKED ITEMS'):null,
    h('span',{class:'small'},'This list is always here and can\'t be deleted.')]});
  ov.querySelector('header .btn').addEventListener('click',()=>back&&back())}

/* ---- recipes ---- */
let RQ={q:'',p:0,k:0,t:0,sort:'p'};
FUEL.recipes=function(){const res=h('div',{class:'list'}),cnt=h('span',{class:'small'});
  const draw=()=>{const q=RQ.q.toLowerCase();let L=RECIPES.filter(r=>(!q||r.n.toLowerCase().includes(q)||r.st.toLowerCase().includes(q)||r.ing.some(i=>i.toLowerCase().includes(q)))&&(!RQ.p||r.p>=RQ.p)&&(!RQ.k||r.kcal<=RQ.k)&&(!RQ.t||r.mins<=RQ.t));
    const S={p:(a,b)=>b.p-a.p,k:(a,b)=>a.kcal-b.kcal,t:(a,b)=>a.mins-b.mins,r:(a,b)=>b.p/b.kcal-a.p/a.kcal,n:(a,b)=>a.n.localeCompare(b.n)}[RQ.sort];L.sort(S);
    cnt.textContent=L.length+' of '+RECIPES.length+' recipes';
    res.replaceChildren(...L.map(r=>h('button',{class:'opt rcard',onclick:()=>recipePage(r)},foodIcon(r.ic,3),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:5px;min-width:0'},h('h3',{},r.n),
      h('span',{class:'small'},r.st+' · serves '+r.sv),h('span',{class:'row',style:'gap:4px'},h('span',{class:'tag s'},r.p+'G P'),h('span',{class:'tag'},r.kcal+' KCAL'),h('span',{class:'tag'},r.mins+' MIN'))))),
      L.length?null:h('p',{class:'note'},'No recipe matches. Try fewer filters.'))};
  const seg=(key,label,opts)=>h('div',{class:'field'},h('span',{class:'label'},label),h('div',{class:'seg'},opts.map(([v,t])=>h('button',{'aria-pressed':String(RQ[key]===v),onclick:e=>{RQ[key]=v;[...e.currentTarget.parentNode.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));draw()}},t))));
  const q=h('input',{id:'rq',type:'search',value:RQ.q,placeholder:'Search name or ingredient (e.g. chicken, oats)','aria-label':'Search recipes',oninput:e=>{RQ.q=e.target.value;draw()}});
  const sort=h('select',{id:'rs','aria-label':'Sort recipes',onchange:e=>{RQ.sort=e.target.value;draw()}},[['p','Most protein'],['r','Most protein per calorie'],['k','Fewest calories'],['t','Quickest'],['n','Name A–Z']].map(([v,t])=>h('option',{value:v,selected:RQ.sort===v},t)));
  draw();return[h('div',{class:'row spread'},h('h2',{},'RECIPES'),h('span',{class:'tag s'},RECIPES.length)),q,
    h('details',{class:'box filt'},h('summary',{class:'label'},'FILTERS & SORT'),seg('p','PROTEIN AT LEAST',[[0,'ANY'],[20,'20G'],[30,'30G'],[40,'40G']]),seg('k','CALORIES UP TO',[[0,'ANY'],[400,'400'],[600,'600'],[800,'800']]),seg('t','READY IN',[[0,'ANY'],[10,'10M'],[20,'20M'],[30,'30M'],[60,'1H']]),
      h('label',{class:'field',for:'rs'},h('span',{class:'label'},'SORT BY'),h('div',{class:'sel'},sort))),cnt,res,h('p',{class:'note'},'Calories and macros are estimates per serving.')]};
function recipePage(r){sheet('RECIPE',()=>[h('div',{class:'row nowrap',style:'gap:12px'},foodIcon(r.ic,5),h('div',{style:'display:flex;flex-direction:column;gap:6px'},h('h2',{},r.n),h('span',{class:'small'},r.st+' · '+r.mins+' min · serves '+r.sv))),
  h('div',{class:'macro',style:'grid-template-columns:repeat(4,1fr)'},[['PROTEIN',r.p+'g'],['KCAL',r.kcal],['CARBS',r.c+'g'],['FAT',r.f+'g']].map(([k,v])=>h('div',{},h('span',{class:'label'},k),h('span',{class:'num',style:'font-size:11px'},v)))),
  splitBar({p:r.p,c:r.c,f:r.f}),h('span',{class:'small'},'Per serving. '+Math.round(r.p/calc().pro*100)+'% of your daily protein target.'),
  h('div',{class:'box'},h('span',{class:'label'},'INGREDIENTS · '+r.sv+(r.sv>1?' SERVINGS':' SERVING')),...r.ing.map(i=>h('div',{class:'row nowrap',style:'align-items:flex-start'},h('span',{style:'color:var(--a1)'},'▪'),h('span',{},i))),
    h('button',{class:'btn alt',onclick:()=>{const n=addToShopping(r.ing);toast(n?n+' ITEMS ADDED TO SHOPPING LIST':'ALREADY ON YOUR LIST');haptic('success')}},'+ ADD TO SHOPPING LIST')),
  h('div',{class:'box'},h('span',{class:'label'},'STEPS'),...r.steps.map((s,i)=>h('div',{class:'row nowrap',style:'align-items:flex-start'},h('span',{class:'tag s'},i+1),h('span',{},s+'.')))),
  h('div',{class:'row nowrap'},h('button',{class:'btn grow',onclick:()=>{ST.protein+=r.p;save();toast('+'+r.p+' G PROTEIN LOGGED');haptic('success')}},'I ATE THIS · +'+r.p+' G'),h('button',{class:'btn ghost',onclick:()=>{shoppingPage()}},'LIST'))])}

/* ---- follows (demo players until the online version) ---- */
if(!CLUB.follow)CLUB.follow={};if(!CLUB.followers)CLUB.followers=[1,3,6];
const isFollow=i=>!!CLUB.follow[i];
function followBtn(i,small){const b=h('button',{class:'btn '+(isFollow(i)?'ghost':'alt'),style:small?'padding:6px 8px;font-size:calc(7px*var(--dz))':'','aria-pressed':String(isFollow(i)),onclick:e=>{e.stopPropagation();CLUB.follow[i]=!isFollow(i);if(!CLUB.follow[i])delete CLUB.follow[i];saveClub();
  b.setAttribute('aria-pressed',String(isFollow(i)));b.className='btn '+(isFollow(i)?'ghost':'alt');b.textContent=isFollow(i)?'FOLLOWING':'FOLLOW';if(isFollow(i)){SFX.coin();toast('FOLLOWING '+demoUser(i).name.toUpperCase())}}},isFollow(i)?'FOLLOWING':'FOLLOW');return b}
function followPage(start){let t=start||'following';sheet('COMMUNITY',redraw=>{const fol=Object.keys(CLUB.follow).map(Number),all=DEMO_USERS.map((_,i)=>i);
  const ids=t==='following'?fol:t==='followers'?CLUB.followers:all.filter(i=>!isFollow(i));
  const row=i=>{const u=demoUser(i);return h('div',{class:'item'},headIcon(u,u.char,2),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px;min-width:0'},h('div',{class:'flagline'},h('span',{},u.name),flag(u.country,1)),h('span',{class:'small'},'LV '+Math.max(1,Math.floor(Math.sqrt(DEMO_USERS[i][3]/50)))+' · '+(CLUB.followers.includes(i)?'follows you':'IronBit player'))),followBtn(i,true))};
  return[h('div',{class:'seg'},[['following','FOLLOWING · '+fol.length],['followers','FOLLOWERS · '+CLUB.followers.length],['find','FIND']].map(([v,l])=>h('button',{'aria-pressed':String(t===v),onclick:()=>{t=v;redraw()}},l))),
    ids.length?h('div',{class:'list'},ids.map(row)):h('p',{class:'note'},t==='following'?'You\'re not following anyone yet. Tap FIND to discover players.':'Nobody here yet.'),
    h('p',{class:'note'},'Players are demo data until the online version is live. Then follows sync with your account.')]})}

/* ---- buying coins ---- */
const COIN_PACKS=[['c500',500,'$0.99',''],['c1200',1200,'$1.99','+20% BONUS'],['c3500',3500,'$4.99','POPULAR'],['c8000',8000,'$9.99','BEST VALUE']];
function buyCoins(id){const pk=COIN_PACKS.find(p=>p[0]===id);if(window.IronBitNative&&IronBitNative.buyCoins){IronBitNative.buyCoins(id);return}
  let m;m=modal(h('div',{class:'row nowrap'},coinIcon(4),h('h2',{},pk[1]+' COINS')),h('p',{},'Buying coins opens when IronBit is on Google Play. Google shows the price in your local currency and handles the payment.'),
    h('span',{class:'small'},'Coins only unlock looks, chests and decor. Nothing you can buy makes training easier or ranks you higher.'),h('button',{class:'btn',onclick:()=>m.remove()},'OK'))}
window.ibCoinsBought=(id)=>{const pk=COIN_PACKS.find(p=>p[0]===id);if(pk){addCoins(pk[1]);SFX.lvl();haptic('level')}};

/* ---- export / import ---- */
function exportData(){const data={app:'IronBit',v:VERSION,at:new Date().toISOString(),keys:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('ib2_'))data.keys[k]=localStorage.getItem(k)}
  const txt=JSON.stringify(data),name='ironbit-backup-'+today()+'.json';
  if(window.IronBitNative&&IronBitNative.saveFile){IronBitNative.saveFile(name,txt);return}
  const a=h('a',{href:URL.createObjectURL(new Blob([txt],{type:'application/json'})),download:name});document.body.append(a);a.click();a.remove();toast('BACKUP SAVED')}
window.ibSaved=ok=>toast(ok?'BACKUP SAVED':'BACKUP NOT SAVED');
function importData(){const inp=h('input',{type:'file',accept:'application/json,.json',style:'display:none'});document.body.append(inp);
  inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0];inp.remove();if(!f)return;const rd=new FileReader();rd.onload=()=>{let d;try{d=JSON.parse(rd.result)}catch(e){d=null}
    if(!d||d.app!=='IronBit'||!d.keys){modal(h('h2',{},'NOT AN IRONBIT BACKUP'),h('p',{},'Pick a file that IronBit exported, named like ironbit-backup-2026-11-06.json.'),h('button',{class:'btn',onclick:e=>e.target.closest('.modal').remove()},'OK'));return}
    let m;m=modal(h('h2',{},'RESTORE THIS BACKUP?'),h('p',{},'Backup from '+new Date(d.at).toLocaleString('en',{dateStyle:'medium',timeStyle:'short'})+' (IronBit v'+d.v+'). It replaces everything in the app now.'),
      h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>m.remove()},'CANCEL'),h('button',{class:'btn grow',onclick:()=>{Object.keys(localStorage).filter(k=>k.startsWith('ib2_')).forEach(k=>localStorage.removeItem(k));
        Object.entries(d.keys).forEach(([k,v])=>{if(k.startsWith('ib2_'))localStorage.setItem(k,v)});location.reload()}},'RESTORE')))};rd.readAsText(f)});inp.click()}

/* ---- keyboard: pixel glyphs, emojis, skins, size ---- */
const EMOJIS='💪 🔥 🏋️ 😀 😂 🤣 😎 😍 🤩 😅 😤 🥵 😴 🤕 🙌 👏 👍 👎 🙏 💯 ⚡ ✨ 💦 ❤️ 🎉 🏆 🥇 🏃 🚴 🧘 ⏰ ✅ ❌ 🍗 🥚 🍌 🥑 🍚 🥗 🥤 ☕ 🍕 🍔 🍩 🎧 🏠 🌙 ☀️'.split(' ');
const GLY={};
function cpCanvas(src){const[c,g]=mk(src.width,src.height);g.drawImage(src,0,0);c.className=src.className;c.setAttribute('aria-hidden','true');return c}
function glyph(ch,col,emoji){const key=ch+col+(emoji?1:0);if(key in GLY)return GLY[key]&&cpCanvas(GLY[key]);const S=emoji?14:14,[c,g]=mk(S,S);g.textBaseline='middle';g.textAlign='center';
  g.font=emoji?'11px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif':'bold 12px "Noto Sans Arabic","Noto Naskh Arabic",Tahoma,sans-serif';g.fillStyle=col;g.fillText(ch,S/2,S/2+1);
  const d=g.getImageData(0,0,S,S);let any=false;for(let i=0;i<d.data.length;i+=4){if(d.data[i+3]>110){d.data[i+3]=255;any=true;if(!emoji){const v=parseInt(col.slice(1),16);d.data[i]=v>>16;d.data[i+1]=v>>8&255;d.data[i+2]=v&255}}else d.data[i+3]=0}g.putImageData(d,0,0);
  if(!any){GLY[key]=null;return null}c.className='kg';GLY[key]=c;return cpCanvas(c)}
function cloneCanvas(c){return c}
KBL.en[3]=['NUM','LANG','EMO',',','SPACE','.','DONE'];KBL.ar[3]=['NUM','LANG','EMO','،','SPACE','.','DONE'];KBL.num[3]=['ABC','LANG','EMO',',','SPACE','.','DONE'];
KBL.emo=[EMOJIS.slice(0,8),EMOJIS.slice(8,16),EMOJIS.slice(16,24),EMOJIS.slice(24,32),EMOJIS.slice(32,40),[...EMOJIS.slice(40,47),'BK'],['ABC','SPACE','DONE']];
const KB_SKINS=[['classic','CLASSIC',0],['retro','RETRO TERMINAL',6],['neon','NEON NIGHT',14],['wood','OAK WOOD',22],['gold','SOLID GOLD',40]];
UNLOCK.kb={retro:6,neon:14,wood:22,gold:40};
REWARDS.push([6,'kb','retro','RETRO KEYBOARD'],[14,'kb','neon','NEON KEYBOARD'],[22,'kb','wood','WOOD KEYBOARD'],[40,'kb','gold','GOLD KEYBOARD']);REWARDS.sort((a,b)=>a[0]-b[0]);
function kbIcon(s=2,skin){const[c,g]=mk(12,9),cols={classic:['#3a3a46','#9aa3b5'],retro:['#0b1a0b','#33ff66'],neon:['#1a1433','#ff5ac8'],wood:['#6b3d1f','#e6c38c'],gold:['#b8680a','#ffe08a']}[skin||'classic'];
  R(g,cols[0],0,0,12,9);for(let y=1;y<7;y+=3)for(let x=1;x<11;x+=3)R(g,cols[1],x,y,2,2);R(g,cols[1],3,7,6,1);outline(c);return show(c,s)}
function kbGlyphFor(k){const fg=getComputedStyle(APP).getPropertyValue('--fg').trim()||'#f6e9d0';const skinCol={retro:'#33ff66',neon:'#ff9ff0',wood:'#3b2414',gold:'#3b2414'}[SET.kbSkin];
  const col=(skinCol||fg).length===4?'#ffffff':(skinCol||fg);
  if(KB.mode==='emo'&&EMOJIS.includes(k))return glyph(k,col,true);if(/[؀-ۿ]/.test(k))return glyph(k,col,false);if(k==='LANG'&&KB.lang==='en')return glyph('ع',col,false);if(k==='EMO')return glyph('😀',col,true);return null}

/* ---- Merlift, the most jacked wizard ---- */
const WZ={robe:'#6c3fc4',robeD:'#4d2a94',star:'#ffd54a',skin:'#e0a372',skinD:'#b97a4c',beard:'#f3efe6',beardD:'#cfc8bb',belt:'#f2b84b'};
function drawWizard(pose='idle',t=0,face='open'){const[c,g]=mk(40,50);const bob=pose==='flex'?Math.round(Math.sin(t/180)):0;
  // hat
  for(let y=0;y<13;y++){const w=Math.max(2,Math.round(2+y*1.5)),x=Math.round(20-w/2+(12-y)*.25);R(g,y%5===2?WZ.robeD:WZ.robe,x,y+bob,w,1)}
  R(g,WZ.robeD,6,13+bob,28,3);R(g,WZ.robe,7,13+bob,26,1);R(g,WZ.star,18,5+bob,1,1);R(g,WZ.star,22,9+bob,1,1);R(g,WZ.star,15,10+bob,1,1);R(g,WZ.star,21,3+bob,1,1);
  // head
  R(g,WZ.skin,13,16+bob,14,8);R(g,WZ.skinD,13,23+bob,14,1);
  if(face==='blink'){R(g,OL,15,19+bob,3,1);R(g,OL,22,19+bob,3,1)}else if(face==='wink'){R(g,OL,15,18+bob,2,2);R(g,OL,22,19+bob,3,1)}else{R(g,OL,15,18+bob,2,2);R(g,OL,23,18+bob,2,2);R(g,'#ffffff',15,18+bob,1,1);R(g,'#ffffff',23,18+bob,1,1)}
  R(g,WZ.beard,14,16+bob,5,1);R(g,WZ.beard,21,16+bob,5,1);R(g,WZ.skinD,19,19+bob,2,2);
  // beard
  R(g,WZ.beard,12,21+bob,16,6);R(g,WZ.beard,14,27+bob,12,3);R(g,WZ.beard,16,30+bob,8,2);R(g,WZ.beard,18,32+bob,4,1);R(g,WZ.beardD,15,22+bob,10,1);R(g,'#8c3a2e',18,23+bob,4,1);
  R(g,WZ.beardD,17,27+bob,1,3);R(g,WZ.beardD,22,27+bob,1,3);
  // body: robe vest, huge shoulders
  R(g,WZ.robe,11,26,18,14);R(g,WZ.robeD,11,26,2,14);R(g,WZ.robeD,27,26,2,14);R(g,WZ.belt,11,36,18,2);R(g,WZ.robeD,19,36,2,2);
  disc(g,WZ.skin,9,28,3.5);disc(g,WZ.skin,31,28,3.5);
  const arm=(side,p)=>{const X=side<0?0:40,m=v=>side<0?v:X-v-1,r=(x,y,w,hh,col)=>R(g,col,side<0?x:40-x-w,y,w,hh);
    if(p==='flex'){r(2,26,8,5,WZ.skin);r(1,17,6,10,WZ.skin);disc(g,WZ.skin,m(6),25,3.5);r(1,15,6,3,WZ.skinD);r(3,24,4,1,WZ.skinD)}
    else if(p==='wave'){r(4,18,5,10,WZ.skin);r(3,12,6,7,WZ.skin);disc(g,WZ.skin,m(6),22,3);r(3,10,6,3,WZ.skinD)}
    else{r(5,28,6,11,WZ.skin);disc(g,WZ.skin,m(7),32,3.5);r(5,39,6,3,WZ.skinD)}};
  arm(-1,pose==='flex'?'flex':'idle');arm(1,pose==='flex'?'flex':pose==='wave'?'wave':'idle');
  // dumbbell staff for idle
  if(pose==='idle'){R(g,'#8d6e63',33,14,2,30);R(g,'#5b5f6b',30,10,8,3);R(g,'#5b5f6b',30,14,8,1);R(g,'#9aa3b5',31,11,6,1)}
  // robe skirt + boots
  R(g,WZ.robe,12,40,16,7);R(g,WZ.robeD,12,46,16,1);R(g,WZ.star,14,42,1,1);R(g,WZ.star,24,44,1,1);R(g,'#3b2a1a',13,47,6,3);R(g,'#3b2a1a',21,47,6,3);
  outline(c);return c}
function wizardFace(s=1){const[c,g]=mk(32,32);g.drawImage(drawWizard('idle',0,'open'),-4,0);return show(c,s)}
const WZ_JOKES=['I don\'t skip leg day. Leg day skips ME, out of respect.','My spell book is just a training log with more lightning.','They asked me to pull a sword from a stone. I deadlifted the stone.','I once cast "Fireball". It was just my pre-workout.',
  'Other wizards ride dragons. I carry mine to the car, for cardio.','My beard has abs. Don\'t ask how.','I\'m 900 years old and I\'ve never missed a protein window.','The mirror on the wall says I\'m the most jacked of them all. It\'s scared of me.',
  'My staff is a 40 kg dumbbell. Walking sticks are for warm-ups.','I turned a frog into a prince. Then I put the prince on a bulking plan.','Abracadabra! …that\'s what I yell on my last rep.','My hat is tall so my biceps have room to flex.',
  'I don\'t do magic tricks. I do magic SETS.','Gandalf said "You shall not pass." I said "You shall not pass up protein."','My potions are 90% whey, 10% mystery.','I can teleport, but I walk. 10,000 steps, wizard rules.'];
const WZ_TIPS=['Add a little weight or one extra rep each week. That\'s the real magic: progressive overload.','Sleep 7–9 hours. Muscles are built in bed, not in the gym.','Spread your protein over 3–4 meals; your body uses it better that way.','Warm up with 2 light sets before your first heavy lift.',
  'Drink water before you feel thirsty. A 2% drop in hydration costs you strength.','Every 6–8 weeks, take an easier week. Wizards call it a deload.','Film one set from the side. Your form will thank you.','Slow down the lowering part of each rep. 2–3 seconds builds more muscle.',
  'Can\'t make the gym? 20 push-ups, 30 squats and a 1-minute plank still counts.','Track your lifts. If it\'s not written down, it didn\'t happen.'];
function wizardLines(){const n=P.name||'champ',L=ST.log.filter(l=>l.done),last=L[L.length-1],out=[];const H=new Date().getHours();
  out.push(pick([`Ah, ${n}! Merlift the Magnificent, most jacked wizard in all the realms, at your service.`,`*POOF* Greetings, ${n}! Don't mind the smoke. That's just my pump.`,`Hail, ${n}! I sensed weak excuses nearby, so I teleported in.`]));
  const facts=[];
  if(!L.length)facts.push('Zero workouts in your log? Even my staff has more reps. Let\'s change that today.');
  else{const days=Math.round((Date.now()-new Date(last.d+'T12:00'))/864e5);if(days>=3)facts.push(`It's been ${days} days since your last workout. My biceps are worried about you.`);else facts.push(`${L.length} workout${L.length>1?'s':''} in your log. My crystal ball says: gains incoming.`);
    const byR={};L.forEach(l=>byR[l.name]=(byR[l.name]||0)+1);const fav=Object.entries(byR).sort((a,b)=>b[1]-a[1])[0];if(fav&&fav[1]>1)facts.push(`Your favourite spell is ${fav[0]}. You've cast it ${fav[1]} times.`)}
  if(ST.streak>=2)facts.push(`A ${ST.streak}-workout streak! I once held one for 300 years. Then I discovered cake.`);
  const t=calc().pro;if(H>=14&&ST.protein<t*.5)facts.push(`You're at ${ST.protein} g of ${t} g protein today. Even a potion of chicken would help.`);
  const pr=lvlProg();facts.push(`Level ${pr.L}. ${pr.need-pr.cur} XP to level ${pr.L+1}, and ${120-pr.L} levels before you're as swole as me. Not that anyone is.`);
  const wl=ST.wlog||[];if(wl.length>1){const d=Math.round((wl[wl.length-1][1]-wl[0][1])*10)/10;if(d)facts.push(`Your weight moved ${d>0?'+':''}${fmtW(d)} since you started logging. The scrolls don't lie.`)}
  try{const rows=standings(false),rk=rows.findIndex(r=>r.me)+1;facts.push(`You're #${rk} in ${LG.ko?'the knockout':lgName(LG.lg)+' League'} this ${LG.ko?'week':'month'}. ${rk<=20?'Top 20! Keep it up.':'Top 20 move up. I believe in you.'}`)}catch(e){}
  for(let i=facts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[facts[i],facts[j]]=[facts[j],facts[i]]}
  out.push(...facts.slice(0,2),'Tip: '+pick(WZ_TIPS),pick(WZ_JOKES),pick(['Merlift OUT! *flexes into a cloud of smoke*','I must go. A dragon needs a spotter.','Farewell! May your pump be eternal.']));return out}
function wizardOK(force){if(force)return true;if(SET.wizard===false||!P||!P.me||tab!=='home')return false;if(APP.querySelector('.overlay,.modal,.tour,.chestfs,.mpeek'))return false;
  const D=dayOf(),hr=new Date().getHours(),asleep=D.sleep>D.wake?(hr>=D.sleep||hr<D.wake):(hr>=D.sleep&&hr<D.wake);if(asleep||curScene==='sleep')return false;
  const last=META.wiz||0;if(Date.now()-last<5*36e5)return false;return!META.wiz?(META.launches||0)>=2:Math.random()<.22}
function maybeMerlift(force){if(!wizardOK(force))return;META.wiz=Date.now();save();
  const peek=h('div',{class:'mpeek','aria-hidden':'true'},show(drawWizard('wave',0),3),h('div',{class:'mbub'},'HEY '+(P.name||'CHAMP').toUpperCase()+'!'));APP.append(peek);tone(660,.08);tone(990,.12,null,.1);
  setTimeout(()=>peek.classList.add('in'),30);setTimeout(()=>peek.classList.remove('in'),2300);setTimeout(()=>{peek.remove();merliftTalk()},2900)}
function wizardSchedule(){if(!(window.IronBitNative&&IronBitNative.wizardSchedule))return;if(SET.wizard===false||SET.wizNotif===false){IronBitNative.wizardSchedule('[]');return}
  const D=dayOf(),out=[];let day=new Date();const L=ST.log.filter(l=>l.done),fav=L.length?L[L.length-1].name:null,n=P&&P.name||'champ';
  const pool=[['Merlift has a message','Hey '+n+', your muscles called. They miss you.'],['Merlift says','Protein check! Have you hit '+calc().pro+' g today?'],['Merlift says','Drink a glass of water. Wizard\'s orders.'],
    fav?['Merlift remembers',fav+' is waiting for you. Shall we?']:['Merlift says','One workout today keeps the noodle arms away.'],['A joke from Merlift',pick(WZ_JOKES)],['Merlift\'s tip',pick(WZ_TIPS)]];
  for(let k=0;k<4;k++){day=new Date(day.getTime()+(2+Math.floor(Math.random()*3))*864e5);const lo=Math.min(D.wake+2,20),hi=Math.max(lo+1,Math.min(D.sleep-2,21));day.setHours(lo+Math.floor(Math.random()*(hi-lo)),Math.floor(Math.random()*60),0,0);
    const[ti,tx]=pool[Math.floor(Math.random()*pool.length)];out.push({at:day.getTime(),title:ti,text:tx})}
  IronBitNative.wizardSchedule(JSON.stringify(out))}

function kbSettings(){const segK=(key,label,opts)=>h('div',{class:'srow'},h('span',{},label),h('div',{class:'seg',style:'flex:none'},opts.map(([v,t])=>h('button',{'aria-pressed':String(SET[key]===v),onclick:()=>{SET[key]=v;save();render(true)}},t))));
  const tgK=(key,label)=>h('div',{class:'srow'},h('span',{},label),h('button',{class:'toggle','aria-pressed':String(SET[key]!==false),'aria-label':label,onclick:()=>{SET[key]=SET[key]===false;save();render(true)}}));
  return h('div',{class:'box'},h('span',{class:'label'},'KEYBOARD'),segK('pkb','Keyboard',[[true,'PIXEL'],[false,'PHONE']]),
    SET.pkb!==false?[segK('kbSize','Key size',[['s','S'],['m','M'],['l','L']]),tgK('kbSound','Key sounds'),tgK('kbHap','Key vibration'),
      h('details',{class:'xp'},h('summary',{},h('span',{class:'label'},'SKINS'),h('span',{class:'tag s'},(KB_SKINS.find(x=>x[0]===(SET.kbSkin||'classic'))||KB_SKINS[0])[1])),h('div',{class:'list'},KB_SKINS.map(([id,n,L])=>{const ok=id==='classic'||unlocked('kb',id),on=(SET.kbSkin||'classic')===id;
        return h('button',{class:'opt','aria-pressed':String(on),disabled:!ok,onclick:()=>{SET.kbSkin=id;save();render(true)}},kbIcon(3,id),h('span',{class:'grow'},n),h('span',{class:'tag'+(on?' s':'')},on?'ON':ok?'USE':'LVL '+L))}))),
      h('label',{class:'field',for:'kbt'},h('span',{class:'label'},'TRY IT'),h('input',{id:'kbt',placeholder:'Type here to test the keyboard'}))]:h('span',{class:'small'},'Using your phone\'s own keyboard.'))}
/* ---- sign in (explained, coming with the online version) ---- */
