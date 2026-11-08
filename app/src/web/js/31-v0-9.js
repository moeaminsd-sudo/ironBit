/* ================= v0.9 ================= */

/* ---- about the developer (edit freely) ---- */
const DEV={name:'Mohamed',role:'Designer & developer of IronBit',bio:'Hi! I\'m Mohamed. I design and build IronBit myself. I wanted a gym app that feels like a game, works offline, costs nothing and speaks to people everywhere, so I made one.',
  more:'Every icon, character and scene is pixel art. If you enjoy IronBit, the best support is a rating on Google Play, a bug report when something breaks, and your ideas for what comes next.',email:SUPPORT_EMAIL};

/* ---- collectables: 140+ gym relics, sorted by rarity ---- */
const RARITY=[['COMMON','#9aa3b5'],['RARE','#3fc1b0'],['EPIC','#b05cf0'],['LEGENDARY','#f2b84b'],['MYTHIC','#ff5a5a']];
const CTYPES=[['plate','Weight Plate'],['dumbbell','Dumbbell'],['kettle','Kettlebell'],['shaker','Shaker'],['belt','Lifting Belt'],['towel','Gym Towel'],['bottle','Water Bottle'],['glove','Gloves'],['medal','Medal'],['trophy','Trophy'],['chalk','Chalk Bag'],['potion','Pre-Workout Potion'],['scroll','Training Scroll'],['gem','Gains Gem']];
const CADJ=[['Rusty','Dusty','Squeaky','Borrowed','Plain','Wobbly'],['Chalked','Polished','Sweaty','Neon','Iron','Lucky'],['Blazing','Titanium','Thunder','Pumped','Shadow','Frozen'],['Golden','Olympian','Dragon','Spartan','Phoenix','Royal'],['Merlift\'s','Cosmic','Eternal']];
const CSPECIAL=[['The Unracked Barbell','dumbbell',4],['Leg Day Survivor Medal','medal',2],['Sock Left in the Locker','towel',0],['Last Rep Crown Jewel','gem',4],['Never-Skip Scroll','scroll',3],['Bro Science Scroll','scroll',1],['Half-Eaten Protein Bar','potion',0],['Mirror Selfie Medal','medal',1],
  ['The 5 a.m. Alarm Trophy','trophy',3],['Spotter\'s Gloves','glove',2],['Cheat Meal Potion','potion',2],['PR Bell of Glory','kettle',3],['Forgotten Gym Bag Bottle','bottle',0],['Chalk Cloud of Mystery','chalk',2],['Plate of a Thousand Reps','plate',4],['Squat Rack Key','gem',3],
  ['Protein Scoop of Destiny','shaker',4],['Deadlift Hook Grip Gloves','glove',3],['Rest Day Pillow Towel','towel',1],['Merlift\'s Beard Comb','gem',4]];
const COLL=(()=>{const out=[];let k=0;CTYPES.forEach(([t,noun],ti)=>CADJ.forEach((adj,r)=>{const n=r===4?1:2;for(let j=0;j<n;j++){const a=adj[(ti+j*3)%adj.length];out.push({id:'c'+(k++),n:a+' '+noun,t,r})}}));
  CSPECIAL.forEach(([n,t,r])=>out.push({id:'c'+(k++),n,t,r}));const seen=new Set();return out.filter(c=>!seen.has(c.n)&&seen.add(c.n))})();
const CBYID=Object.fromEntries(COLL.map(c=>[c.id,c]));
/* level slots: every level without another reward gets a collectable, rarer as you climb */
const COLL_AT=(()=>{const at={},pool=[0,1,2,3,4].map(r=>COLL.filter(c=>c.r===r));for(let L=2;L<=120;L++){if(L%5===0||REWARDS.some(r=>r[0]===L))continue;const r=L<=25?0:L<=50?1:L<=80?2:L<=105?3:4,p=pool[r];if(p.length){const c=p.splice(Math.floor(p.length/2),1)[0];c.lv=L;at[L]=c.id}}return at})();
COLL.forEach(c=>{if(!c.lv)c.chest=true});
const ownsC=id=>(ST.coll||{})[id]>0;
function grantColl(id){ST.coll=ST.coll||{};ST.coll[id]=(ST.coll[id]||0)+1;save()}
function collIcon(c,s=2,locked){const[cv,g]=mk(12,12),col=locked?'#4a4652':RARITY[c.r][1],d=shade(col,-.3),l=shade(col,.35);
  ({plate:()=>{disc(g,col,6,6,5);disc(g,d,6,6,2);R(g,'#1a1433',5,5,2,2);R(g,l,3,2,2,1)},dumbbell:()=>{R(g,col,1,3,3,6);R(g,col,8,3,3,6);R(g,d,4,5,4,2);R(g,l,1,3,1,6)},
    kettle:()=>{R(g,d,3,1,6,2);R(g,d,3,1,1,4);R(g,d,8,1,1,4);disc(g,col,6,7,4);R(g,l,4,6,1,2)},shaker:()=>{R(g,d,3,1,6,2);R(g,col,3,3,6,8);R(g,l,4,4,1,5);R(g,'#f6f3ec',5,6,2,1)},
    belt:()=>{R(g,col,0,4,12,4);R(g,d,0,7,12,1);R(g,'#c0c7d6',5,3,3,6);R(g,d,6,4,1,4)},towel:()=>{R(g,col,2,1,8,10);R(g,d,2,9,8,2);R(g,l,3,2,1,7);R(g,d,2,4,8,1)},
    bottle:()=>{R(g,d,5,0,2,2);R(g,col,4,2,4,9);R(g,l,4,3,1,6);R(g,'#f6f3ec',4,5,4,1)},glove:()=>{R(g,col,2,4,8,6);R(g,col,2,1,2,4);R(g,col,5,0,2,4);R(g,col,8,1,2,4);R(g,d,2,9,8,2);R(g,l,3,5,1,3)},
    medal:()=>{R(g,'#c0392b',3,0,2,5);R(g,'#2d6b8f',7,0,2,5);disc(g,col,6,7,4);disc(g,d,6,7,2);R(g,l,4,5,1,1)},trophy:()=>{R(g,col,3,1,6,5);R(g,col,1,1,2,3);R(g,col,9,1,2,3);R(g,col,5,6,2,2);R(g,d,3,8,6,3);R(g,l,4,2,1,3)},
    chalk:()=>{R(g,col,2,3,8,8);R(g,d,2,2,8,2);R(g,'#f6f3ec',4,0,4,3);R(g,l,3,4,1,5)},potion:()=>{R(g,d,5,0,2,2);R(g,'#f6f3ec',4,2,4,2);disc(g,col,6,7,4);R(g,l,4,5,2,2)},
    scroll:()=>{R(g,'#e6d5b0',2,2,8,8);R(g,col,1,1,10,2);R(g,col,1,9,10,2);R(g,'#8d6e63',4,4,4,1);R(g,'#8d6e63',4,6,3,1)},gem:()=>{R(g,col,3,2,6,2);R(g,col,2,4,8,2);R(g,col,3,6,6,2);R(g,col,4,8,4,2);R(g,l,4,3,2,2);R(g,d,7,6,2,3)}})[c.t]();
  outline(cv);return show(cv,s)}
function rarTag(r){return h('span',{class:'tag rar',style:`color:${RARITY[r][1]};border-color:${RARITY[r][1]}`},RARITY[r][0])}
function collModal(c){const own=ownsC(c.id),flavor={plate:'Heavy with history.',dumbbell:'Curl it once and you will feel wiser.',kettle:'Swing responsibly.',shaker:'Still smells faintly of vanilla.',belt:'Holds in core and secrets.',towel:'Has wiped a thousand benches.',bottle:'Hydration level: legendary.',glove:'No calluses were harmed.',medal:'Proof you showed up.',trophy:'Polished by pure effort.',chalk:'Grip like a dragon.',potion:'Side effects: excessive motivation.',scroll:'Contains one forbidden PR technique.',gem:'Glows brighter with every rep.'}[c.t];
  let m;m=modal(h('div',{class:'cdet'},collIcon(c,8,!own),h('h2',{},own?c.n:'???'),rarTag(c.r),h('p',{class:'small'},own?flavor:'Not found yet.'),h('span',{class:'tag'},c.lv?'LEVEL '+c.lv+' REWARD':'FOUND ONLY IN CHESTS'),own&&ST.coll[c.id]>1?h('span',{class:'small'},'You have '+ST.coll[c.id]):null,h('button',{class:'btn',onclick:()=>m.remove()},'OK')))}
function inventoryPage(){let tabI='coll',flt='all';sheet('INVENTORY',redraw=>{const owned=COLL.filter(c=>ownsC(c.id)).length;
  const tabs=h('div',{class:'seg'},[['coll','RELICS'],['gear','OUTFITS'],['decor','DECOR'],['misc','OTHER']].map(([v,t])=>h('button',{'aria-pressed':String(tabI===v),onclick:()=>{tabI=v;redraw()}},t)));
  let body;
  if(tabI==='coll'){const list=[...COLL].sort((a,b)=>b.r-a.r||a.n.localeCompare(b.n)).filter(c=>flt==='all'||(flt==='own'?ownsC(c.id):!ownsC(c.id)));
    body=[h('div',{class:'row spread'},h('span',{class:'label'},owned+' / '+COLL.length+' RELICS'),h('div',{class:'seg',style:'flex:none'},[['all','ALL'],['own','FOUND'],['miss','MISSING']].map(([v,t])=>h('button',{'aria-pressed':String(flt===v),onclick:()=>{flt=v;redraw()}},t)))),
      h('div',{class:'bar t'},h('i',{style:`width:${owned/COLL.length*100}%`})),
      ...RARITY.map((_,r)=>4-r).map(r=>{const L=list.filter(c=>c.r===r);return L.length?h('div',{class:'box'},h('div',{class:'row spread'},rarTag(r),h('span',{class:'small'},L.filter(c=>ownsC(c.id)).length+' / '+COLL.filter(c=>c.r===r).length)),
        h('div',{class:'cgrid'},L.map(c=>{const own=ownsC(c.id);return h('button',{class:'cg'+(own?' got':''),style:`--rc:${RARITY[c.r][1]}`,'aria-label':own?c.n:'Unknown relic',onclick:()=>collModal(c)},collIcon(c,3,!own),h('span',{class:'cgn'},own?c.n:(c.lv?'LVL '+c.lv:'CHEST')),own&&ST.coll[c.id]>1?h('span',{class:'cgx'},'×'+ST.coll[c.id]):null)}))):null})]}
  else if(tabI==='gear'){const got=REWARDS.filter(r=>unlocked(r[1],r[2]));body=[h('span',{class:'label'},got.length+' / '+REWARDS.length+' UNLOCKED'),h('div',{class:'cgrid'},REWARDS.map(r=>{const ok=unlocked(r[1],r[2]);return h('button',{class:'cg'+(ok?' got':''),onclick:()=>ok?toast(r[3]):toast('REACH LVL '+r[0]+' OR BUY IT IN THE SHOP')},ok?rewardIcon(r):px('lock',2),h('span',{class:'cgn'},ok?r[3]:'LVL '+r[0]))}))]}
  else if(tabI==='decor'){body=[h('div',{class:'cgrid'},Object.entries(DECOR).map(([id,[n]])=>{const ok=(ST.deco||[]).includes(id);return h('button',{class:'cg'+(ok?' got':''),onclick:()=>ok?toast(n):itemShop()},px(ok?'house':'lock',2),h('span',{class:'cgn'},ok?n:'SHOP'))}))]}
  else body=[h('div',{class:'list'},h('div',{class:'item'},flameCanvas(2),h('span',{class:'grow'},'Streak freezes'),h('span',{class:'tag s'},(ST.frz||0)+' DAYS')),h('div',{class:'item'},coinIcon(3),h('span',{class:'grow'},'Coins'),h('span',{class:'tag s'},ST.coins||0)),
    ...['gold','silver','bronze'].map(k=>h('div',{class:'item'},cupIcon(k,2),h('span',{class:'grow'},k.toUpperCase()+' TROPHIES'),h('span',{class:'tag'},LG.cups[k]))),h('div',{class:'item'},kbIcon(3),h('span',{class:'grow'},'Keyboard skins'),h('span',{class:'tag'},KB_SKINS.filter(s=>s[0]==='classic'||unlocked('kb',s[0])).length+' / '+KB_SKINS.length)))];
  return[tabs,...body]})}
/* grant relics for levels already reached */
function syncLevelColl(){const L=lvl();let n=0;Object.entries(COLL_AT).forEach(([lv,id])=>{if(+lv<=L&&!ownsC(id)){grantColl(id);n++}});return n}

/* ---- streak freezes ---- */
const FREEZE=[[1,350],[3,900],[7,1800]];
function freezeIcon(s=2){const[c,g]=mk(12,12);R(g,'#bfe9ff',5,0,2,12);R(g,'#bfe9ff',0,5,12,2);[[2,2],[9,2],[2,9],[9,9],[3,3],[8,3],[3,8],[8,8]].forEach(([x,y])=>R(g,'#7fd3f5',x,y,1,1));R(g,'#ffffff',5,5,2,2);outline(c);return show(c,s)}
function useFreeze(n){if((ST.frz||0)<n){toast('NOT ENOUGH FREEZE DAYS');return}ST.frozen=ST.frozen||[];const d=new Date();let added=0;
  for(let i=0;added<n&&i<30;i++){const ds=dstr(d);if(!ST.frozen.includes(ds)&&!workDays().has(ds)){ST.frozen.push(ds);added++}d.setDate(d.getDate()+1)}ST.frz-=added;save();toast(added+' DAY'+(added>1?'S':'')+' FROZEN');haptic('success')}
function freezeBox(redraw){const fz=(ST.frozen||[]).filter(d=>d>=today()).sort();return h('div',{class:'box frzbox'},h('div',{class:'row nowrap'},freezeIcon(3),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('span',{class:'label'},'STREAK FREEZE'),h('span',{class:'small'},'Skip a planned workout without losing your streak. You have '+(ST.frz||0)+' day'+((ST.frz||0)===1?'':'s')+'.'))),
  fz.length?h('span',{class:'small'},'Frozen: '+fz.map(d=>new Date(d+'T12:00').toLocaleDateString('en',{weekday:'short',day:'numeric'})).join(', ')):null,
  h('div',{class:'frzg'},FREEZE.map(([n,p])=>h('button',{class:'tile',disabled:(ST.coins||0)<p,onclick:()=>{if((ST.coins||0)<p)return;ST.coins-=p;ST.frz=(ST.frz||0)+n;save();updCoinTop();SFX.coin();toast('+'+n+' FREEZE DAY'+(n>1?'S':''));redraw()}},freezeIcon(2),h('span',{},n+' DAY'+(n>1?'S':'')),h('span',{class:'row nowrap',style:'gap:4px'},coinIcon(2),p)))),
  (ST.frz||0)>0?h('div',{class:'row nowrap'},[1,3,7].filter(n=>n<=(ST.frz||0)).map(n=>h('button',{class:'btn alt grow',onclick:()=>{useFreeze(n);redraw()}},'USE '+n))):null)}

/* ---- notes: list or grid, colors ---- */
const NOTE_COLS=[null,'#ff6b57','#f2b84b','#7fb069','#3fc1b0','#5ab4f5','#b05cf0','#e84393'];
function noteColorRow(n,after){return h('div',{class:'ncols','aria-label':'Note color'},NOTE_COLS.map(c=>h('button',{class:'ncol'+((n.color||null)===c?' on':''),style:c?`background:${c}`:'','aria-label':c?'Color '+c:'No color',onclick:()=>{n.color=c;saveNotes();after()}},c?null:'∅')))}
function notesPage(){sheet('NOTES',redraw=>{const grid=NOTES.view==='grid';
  const card=n=>h('button',{class:'ncard'+(grid?' g':''),style:n.color?`--nc:${n.color}`:'',onclick:()=>n.id==='shop'?shoppingPage(redraw):noteEditor(n,redraw)},
    h('div',{class:'row nowrap',style:'gap:8px'},px(n.id==='shop'?'leg':'note',2),h('h3',{class:'grow',style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'},n.title||'UNTITLED'),n.fixed?h('span',{class:'tag s'},'PIN'):null),
    h('span',{class:'small nprev'},n.id==='shop'?(n.items.filter(i=>!i.done).slice(0,grid?5:2).map(i=>'▪ '+i.t).join(grid?'\n':'  ')||'Nothing to buy'):(n.text||'Empty note').slice(0,grid?120:70)));
  return[h('div',{class:'row nowrap'},h('button',{class:'btn alt grow',onclick:()=>{const n={id:'n'+Date.now(),title:'',text:'',up:Date.now()};NOTES.list.push(n);saveNotes();noteEditor(n,redraw)}},'+ NEW NOTE'),
    h('div',{class:'seg',style:'flex:none'},[['list','LIST'],['grid','GRID']].map(([v,t])=>h('button',{'aria-pressed':String((NOTES.view||'list')===v),onclick:()=>{NOTES.view=v;saveNotes();redraw()}},t)))),
    h('div',{class:grid?'ngrid':'list'},NOTES.list.map(card))]})}
function noteEditor(n,back){const ov=sheet(n.title||'NEW NOTE',redraw=>{const ti=h('input',{id:'nti',value:n.title,placeholder:'Title',maxlength:40,'aria-label':'Note title',oninput:e=>{n.title=e.target.value;n.up=Date.now();saveNotes()}}),
  tx=h('textarea',{id:'ntx',rows:12,placeholder:'Write anything: PRs, meal ideas, goals…','aria-label':'Note text',style:n.color?`border-color:${n.color}`:'',oninput:e=>{n.text=e.target.value;n.up=Date.now();saveNotes()}});tx.value=n.text;
  return[ti,h('span',{class:'label'},'COLOR'),noteColorRow(n,()=>{tx.style.borderColor=n.color||'';ov.querySelectorAll('.ncol').forEach((b,i)=>b.classList.toggle('on',NOTE_COLS[i]===(n.color||null)))}),tx,h('span',{class:'small'},'Saved automatically.'),
    h('button',{class:'btn ghost',onclick:()=>{let m;m=modal(h('h2',{},'DELETE THIS NOTE?'),h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>m.remove()},'KEEP'),
      h('button',{class:'btn grow',onclick:()=>{NOTES.list=NOTES.list.filter(x=>x!==n);saveNotes();m.remove();ov.remove();back&&back()}},'DELETE')))}},'DELETE NOTE')]});
  ov.querySelector('header .btn').addEventListener('click',()=>{if(!n.title&&!n.text){NOTES.list=NOTES.list.filter(x=>x!==n);saveNotes()}back&&back()})}

/* ---- equipment picker on the Me page ---- */
const topOk=(t,sex)=>!(sex==='f'&&t==='kandura');
function gearPicker(cat){const C=P.char,sex=P.sex,mini=(patch,kind)=>{const ch={...C,...patch,acc:[...(patch.acc||C.acc)]};return kind==='head'?headIcon(P,ch,2):show(drawFront(P,ch,'great'),1)};
  const DEF={head:['HEADWEAR','head',HEADS.filter(x=>headOk(x,sex)),'headC'],top:['TOP','top',TOPS.filter(x=>topOk(x,sex)),'topC'],bottom:['BOTTOMS','bottom',BOTS,'botC'],feet:['SHOES',null,null,'shoeC'],
    lw:['LEFT WRIST','lw',['none','watch']],rw:['RIGHT WRIST','rw',['none','wristband','ring']]}[cat];
  let m;const draw=()=>{const[title,key,opts,colKey]=DEF;const items=[];
    if(key==='lw'||key==='rw'){opts.forEach(o=>{const on=o==='none'?!(key==='lw'?C.acc.includes('watch'):C.acc.some(a=>a==='wristband'||a==='ring')):C.acc.includes(o);const ok=o==='none'||unlocked('acc',o);
      items.push(h('button',{class:'gp'+(on?' on':''),disabled:!ok,onclick:()=>{C.acc=C.acc.filter(a=>key==='lw'?a!=='watch':(a!=='wristband'&&a!=='ring'));if(o!=='none')C.acc.push(o);save();render(true);draw()}},o==='none'?h('span',{class:'gpn'},'∅'):px(o==='watch'?'cal':o==='ring'?'chain':'shirt',2),h('span',{class:'cgn'},(LABELS[o]||o).toUpperCase())))})}
    else if(key)opts.forEach(o=>{const ok=unlocked(key,o),on=C[key]===o;items.push(h('button',{class:'gp'+(on?' on':''),'aria-pressed':String(on),onclick:()=>{if(!ok){toast('UNLOCKS AT LVL '+lockLvl(key,o));return}C[key]=o;save();render(true);draw()}},
      ok?mini({[key]:o},key==='head'?'head':'body'):px('lock',2),h('span',{class:'cgn'},(LABELS[o]||o).toUpperCase())))});
    m.querySelector('.gpbody').replaceChildren(items.length?h('div',{class:'gpg'},items):null,colKey?h('span',{class:'label'},'COLOR'):null,colKey?h('div',{class:'sw'},CLOTH.map(col=>h('button',{'aria-label':'Color '+col,'aria-pressed':String(C[colKey]===col),style:`background:${col}`,onclick:()=>{C[colKey]=col;save();render(true);draw()}}))):null)};
  m=modal(h('div',{class:'row spread nowrap'},h('h2',{},DEF[0]),h('button',{class:'btn ghost',style:'padding:8px 10px','aria-label':'Close',onclick:()=>m.remove()},'✕')),h('div',{class:'gpbody'}));m.classList.add('pick');draw()}
function toggleAcc(a){const C=P.char;if(!unlocked('acc',a)){toast('UNLOCKS AT LVL '+lockLvl('acc',a));return}C.acc=C.acc.includes(a)?C.acc.filter(x=>x!==a):[...C.acc,a];save();haptic('tick');render(true)}

/* ---- undo toast ---- */
function undoToast(msg,undo){APP.querySelectorAll('.toast').forEach(t=>t.remove());const t=h('div',{class:'toast undo',role:'status'},h('span',{},msg),h('button',{class:'btn alt',style:'padding:6px 10px',onclick:()=>{undo();t.remove();toast('RESTORED')}},'UNDO'));APP.append(t);setTimeout(()=>t.remove(),5000)}

/* ---- medals ---- */
function medalIcon(i,s=2){const[c,g]=mk(10,12),col=['#f2b84b','#c0c7d6','#c97a3a'][i];R(g,'#c0392b',2,0,2,4);R(g,'#2d6b8f',6,0,2,4);disc(g,col,5,7,4);disc(g,shade(col,-.25),5,7,2);R(g,shade(col,.4),3,5,1,1);outline(c);return show(c,s)}

/* ---- auto dark/light by the time of day ---- */
function timeMode(){const hr=new Date().getHours(),D=P?dayOf():DAYDEF;return hr>=Math.max(6,D.wake||7)&&hr<19?'light':'dark'}
let lastMode=null;setInterval(()=>{if(SET.modeTime){const m=timeMode();if(m!==lastMode){lastMode=m;applyTheme();refreshModeIcons()}}},60000);

/* ---- sleeping easter egg ---- */
const SLEEP_LINES=['Shh! Your avatar is asleep. Why aren\'t you?','Your avatar is dreaming about deadlifts. Let it rest.','Zzz… muscles grow while you sleep. Go to bed!','Your avatar says: "5 more minutes…"','Even Merlift sleeps. Well, he meditates loudly.','Poke me one more time and I\'m doing burpees in my sleep.','Recovery mode: ON. Phone mode: should be OFF.','Sleeping is a rep too. The most important one.'];
let sleepTaps=0,sleepTapT=0;
function sleepPoke(st){const now=Date.now();if(now-sleepTapT>4000)sleepTaps=0;sleepTapT=now;sleepTaps++;haptic('tap');if(sleepTaps<10)return false;sleepTaps=0;
  const i=(META.sleepEgg||0)%SLEEP_LINES.length;META.sleepEgg=i+1;save();const box=h('div',{class:'stage scene sleepegg',role:'status'},h('span',{class:'zz'},'Z z z'),h('p',{},SLEEP_LINES[i]));st.replaceWith(box);SFX.coin();
  setTimeout(()=>{if(box.isConnected)box.replaceWith(homeScene('sleep'))},3800);return true}
function isAsleepNow(){const D=dayOf(),hr=new Date().getHours();return D.sleep>D.wake?(hr>=D.sleep||hr<D.wake):(hr>=D.sleep&&hr<D.wake)}

/* ---- level-up aura (Dragon Ball style) ---- */
const auraOn=()=>(META.auraUntil||0)>Date.now();
function drawAura(g,x,y,w,hh,t){const cols=['#fff3b0','#ffd54a','#ffb300'];for(let k=0;k<28;k++){const a=k/28*Math.PI*2,rr=1+((Math.sin(t/90+k*1.7)+1)/2),px2=x+w/2+Math.cos(a)*(w/2+rr*2),py=y+hh/2+Math.sin(a)*(hh/2+rr*1.2)-((t/40+k*5)%8);
  g.fillStyle=cols[k%3];g.globalAlpha=.55;g.fillRect(px2|0,py|0,2,3)}g.globalAlpha=1;if(Math.floor(t/120)%9===0){g.fillStyle='#ffffff';g.fillRect(x+w/2+((t/7)%10)-5|0,y+4,1,hh-8)}}

/* ---- full-screen level up ---- */
function levelUp(L){SFX.lvl();buzz(200);const rw=REWARDS.filter(r=>r[0]===L),cid=COLL_AT[L],c=cid&&CBYID[cid];if(c&&!ownsC(cid))grantColl(cid);META.auraUntil=Date.now()+20*60000;save();
  const ov=h('div',{class:'lvfs',role:'dialog','aria-label':'Level up'}),[cv,g]=mk(60,60),[fx,fg]=mk(120,200);cv.className='lvav';fx.className='cfx';const t0=performance.now();
  const parts=Array.from({length:90},()=>({x:60,y:80,vx:(Math.random()-.5)*4,vy:-Math.random()*4-1,c:['#f2b84b','#ff6b57','#3fc1b0','#f6e9d0','#ffd54a'][Math.floor(Math.random()*5)],l:80+Math.random()*60}));
  const loop=now=>{if(!cv.isConnected)return;const t=now-t0;g.clearRect(0,0,60,60);drawAura(g,8,4,44,52,t);g.drawImage(drawFrontPose(P,P.char,lerpAny(SCN.cheer.f[0],SCN.cheer.f[1],(1-Math.cos(t/300))/2),SCN.cheer,{mood:'great',tier:tierAt(L)}),4,6);
    fg.clearRect(0,0,120,200);parts.forEach(p=>{if(p.l-->0){p.x+=p.vx;p.y+=p.vy;p.vy+=.06;R(fg,p.c,p.x,p.y,2,2)}});requestAnimationFrame(loop)};requestAnimationFrame(loop);
  const nr=nextReward(),close=then=>{ov.remove();then&&then()};
  ov.append(h('div',{class:'rays','aria-hidden':'true'}),fx,h('span',{class:'label'},'LEVEL UP!'),h('div',{class:'bigl'},'LVL '+L),h('h2',{},rank()),show(cv,4),
    h('div',{class:'cloot'},...rw.map(r=>h('div',{class:'item pop'},rewardIcon(r),h('span',{class:'grow'},r[3]),h('span',{class:'tag s'},'UNLOCKED'))),c?h('div',{class:'item pop'},collIcon(c,3),h('span',{class:'grow'},c.n),rarTag(c.r)):null,
      !rw.length&&!c?h('p',{class:'small',style:'text-align:center'},nr?`Next reward at LVL ${nr[0]}: ${nr[3].toLowerCase()}`:'You unlocked everything. Legend.'):null),
    h('span',{class:'small',style:'text-align:center;color:#ffe08a'},'Your avatar glows with power for the next 20 minutes!'),
    h('div',{class:'row nowrap',style:'width:100%;max-width:340px'},h('button',{class:'btn ghost grow',onclick:()=>close(openLevelMap)},'LEVEL MAP'),h('button',{class:'btn grow',onclick:()=>close(()=>afterLevel(L))},'AWESOME!')));
  APP.append(ov)}

/* ---- Android back: press twice to exit ---- */
let backT=0;

/* ---- home-screen widget data (Android) ---- */
let wT=0;function pushWidget(){if(!(window.IronBitNative&&IronBitNative.updateWidget)||!P)return;if(Date.now()-wT<3000)return;wT=Date.now();const pr=lvlProg(),rid=planFor(today()),r=rid&&allR()[rid],done=ST.log.some(l=>l.done&&l.d===today());
  IronBitNative.updateWidget(JSON.stringify({name:P.name||'Player',streak:ST.streak,level:pr.L,pct:Math.round(pr.pct),rank:rank(),plan:done?'DONE TODAY ✔':r?r.name:'REST DAY',coins:ST.coins||0}))}

/* ---- Merlift: talks inside the avatar scene, automatic, leaves in a poof ---- */
function poof(stage,x){const[c,g]=mk(60,40);c.className='poof';c.setAttribute('aria-hidden','true');stage.append(c);tone(300,.15);tone(180,.2,null,.05);const ps=Array.from({length:26},()=>({x:x+Math.random()*10-5,y:24+Math.random()*10,vx:(Math.random()-.5)*1.6,vy:-Math.random()*1.2,r:2+Math.random()*3,l:30+Math.random()*20}));
  const loop=()=>{if(!c.isConnected)return;g.clearRect(0,0,60,40);let alive=false;ps.forEach(p=>{if(p.l-->0){alive=true;p.x+=p.vx;p.y+=p.vy;p.r+=.12;g.globalAlpha=Math.min(1,p.l/20);disc(g,p.l>20?'#f6f3ec':'#c9c2d6',p.x,p.y,p.r)}});g.globalAlpha=1;
    if(Math.random()<.3)R(g,'#ffd54a',x+Math.random()*16-8,14+Math.random()*16,1,1);if(alive)requestAnimationFrame(loop);else c.remove()};loop()}
function merliftTalk(){const st=APP.querySelector('.stage.scene');if(!st||tab!=='home')return;const lines=wizardLines();let i=0,tm=0,done=false;
  st.replaceWith(homeScene('listen'));const st2=APP.querySelector('.stage.scene');const wc=h('canvas',{class:'mwiz',width:40,height:50,'aria-hidden':'true'}),wg=wc.getContext('2d');
  const bub=h('div',{class:'mbubble',role:'status','aria-live':'polite'});st2.append(wc);st2.prepend(bub);
  const t0=performance.now();const anim=now=>{if(!wc.isConnected)return;const t=now-t0,pose=i===lines.length-2?'flex':Math.floor(t/2200)%3===1?'flex':'idle',face=Math.floor(t/2700)%5===4?'blink':(i===lines.length-2&&Math.floor(t/900)%2?'wink':'open');
    wg.clearRect(0,0,40,50);wg.drawImage(drawWizard(pose,t,face),0,0);requestAnimationFrame(anim)};requestAnimationFrame(anim);
  const showL=()=>{bub.replaceChildren(h('span',{class:'mname'},'MERLIFT'),h('span',{class:'mtxt'},lines[i]),h('span',{class:'mdots'},lines.map((_,k)=>h('i',{class:k===i?'on':''}))));bub.classList.remove('pop');void bub.offsetWidth;bub.classList.add('pop');tone(520+i*60,.05);
    clearTimeout(tm);tm=setTimeout(nextL,Math.min(7500,2600+lines[i].length*45))};
  const nextL=()=>{if(done)return;i++;if(i>=lines.length)end();else showL()};
  const end=()=>{done=true;clearTimeout(tm);bub.remove();const r=wc.getBoundingClientRect(),s=st2.getBoundingClientRect();poof(st2,((r.left-s.left)+r.width/2)/s.width*60);wc.remove();setTimeout(()=>{if(st2.isConnected)st2.replaceWith(homeScene(pickScene()))},900)};
  st2.onclick=e=>{e.stopPropagation();haptic('tap');nextL()};showL();wizardSchedule()}

/* ---- events: shown to everyone, can be switched off for the rest of the day only ---- */
function myCountries(){return[P&&P.country,P&&(CITIES[P.city]||[])[0]].filter(Boolean)}
function eventToday(){if(SET.evPreview&&EVENTS[SET.evPreview])return SET.evPreview;const d=today();return Object.keys(EVENTS).find(k=>EVENTS[k].when(d))||null}
function activeEvent(){const id=eventToday();if(!id)return null;if(SET.evPreview===id)return id;const off=SET.evOffDay;return off&&off[0]===id&&off[1]===today()?null:id}
EVENTS.national.when=d=>myCountries().some(cc=>NATDAY[cc]===d.slice(5));
EVENTS.national.cc=()=>myCountries().find(cc=>NATDAY[cc]===today().slice(5))||P.country;
function eventBox(){const id=eventToday();if(!id)return null;const E=EVENTS[id],on=!!activeEvent(),cc=id==='national'?EVENTS.national.cc():null,n=id==='national'?(FL[cc]||FL.XX)[0].toUpperCase()+' NATIONAL DAY':E.n;
  return h('div',{class:'box evbox'},eventIcon(id,4),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:5px'},h('span',{class:'label'},'EVENT · '+n),h('span',{},id==='national'?'Happy National Day! Proud of you, '+(P.name||'champ')+'.':E.msg),
    h('div',{class:'srow',style:'padding:0'},h('span',{class:'small'},on?'Theme on for today':'Theme off until tomorrow'),h('button',{class:'toggle','aria-pressed':String(on),'aria-label':'Event theme today',onclick:()=>{SET.evOffDay=on?[id,today()]:null;if(SET.evPreview&&on)SET.evPreview=null;save();applyTheme();render(true)}}))))}

/* ---- REP RUSH: secret mini game (tap the version 10 times) ---- */
let verTaps=0,verT=0;function verTap(){const n=Date.now();if(n-verT>1500)verTaps=0;verT=n;verTaps++;if(verTaps>=10){verTaps=0;repRush()}else if(verTaps>=6)toast((10-verTaps)+' MORE…')}
function repRush(){const W=96,H=150,[c,g]=mk(W,H);c.className='rrc';const ov=h('div',{class:'rrfs',role:'dialog','aria-label':'Rep Rush mini game'});let st='ready',score=0,lives=3,cur=0,dir=1,speed=.012,zone=.28,zc=.5,lift=0,shake=0,msg='',raf=0;
  const best=()=>META.rrBest||0;
  const tap=e=>{e&&e.preventDefault();if(st==='ready'||st==='over'){st='play';score=0;lives=3;speed=.012;zone=.28;zc=.3+Math.random()*.4;msg='';SFX.coin();return}
    const hit=Math.abs(cur-zc)<=zone/2;if(hit){score++;lift=1;speed=Math.min(.045,speed*1.07);zone=Math.max(.09,zone*.95);zc=.15+Math.random()*.7;tone(500+score*15,.07);haptic('tick');msg=pick(['CLEAN!','PERFECT!','LIGHT WEIGHT!','YEAH BUDDY!','ONE MORE!'])}
    else{lives--;shake=10;tone(140,.2);haptic('error');msg=pick(['MISSED!','FORM CHECK!','SPOT ME!']);if(lives<=0){st='over';if(score>best()){META.rrBest=score;save();msg='NEW BEST!'}else msg='BAR DROPPED!'}}};
  const loop=()=>{if(!c.isConnected)return;g.fillStyle='#1a1433';g.fillRect(0,0,W,H);R(g,'#26232e',0,112,W,38);for(let x=0;x<W;x+=8)R(g,'#2f2a3d',x,112,4,38);
    if(st==='play'){cur+=dir*speed;if(cur>1){cur=1;dir=-1}if(cur<0){cur=0;dir=1}}
    lift=Math.max(0,lift-.04);const ph=lift>0?Math.sin(lift*Math.PI):0,sx=shake>0?(shake--%2?2:-2):0,A=FP.ohp||FP.squat;
    g.drawImage(drawFrontPose(P,P.char,lerpAny(A.f[0],A.f[1],ph),A,{mood:lift?'great':st==='over'?'tired':'great'}),22+sx,60,52,52);
    R(g,'#3a3446',10,124,76,8);R(g,'#7fb069',10+Math.round((zc-zone/2)*76),124,Math.max(2,Math.round(zone*76)),8);R(g,'#ffffff',10+Math.round(cur*76)-1,121,3,14);R(g,'#ffd54a',10+Math.round(cur*76),122,1,12);
    g.fillStyle='#f6e9d0';g.font='8px "Press Start 2P",monospace';g.textAlign='center';g.fillText(st==='ready'?'TAP TO START':st==='over'?'GAME OVER':score+' REPS',W/2,28);
    g.font='6px "Press Start 2P",monospace';g.fillStyle='#ffd54a';g.fillText(msg,W/2,40);g.fillStyle='#9aa3b5';g.fillText('BEST '+Math.max(best(),st==='over'?0:0),W/2,146);
    for(let k=0;k<3;k++){const x=4+k*9,on=k<lives;R(g,on?'#6b2a1f':'#2a2633',x,3,7,2);R(g,on?'#c0392b':'#3a3446',x,5,7,7);R(g,on?'#f6f3ec':'#4a4652',x+1,7,5,3);R(g,on?'#c0392b':'#3a3446',x+2,8,3,1)}
    if(st!=='play'){g.fillStyle='#cfc8bb';g.fillText(st==='ready'?'TAP WHEN THE BAR':'TAP TO TRY AGAIN',W/2,50);if(st==='ready')g.fillText('HITS THE GREEN',W/2,58)}
    raf=requestAnimationFrame(loop)};
  ov.append(h('div',{class:'row spread',style:'width:100%;max-width:360px'},h('span',{class:'label'},'SECRET · REP RUSH'),h('button',{class:'btn ghost',style:'padding:8px 10px','aria-label':'Close game',onclick:()=>{cancelAnimationFrame(raf);ov.remove()}},'✕')),c,h('span',{class:'small',style:'text-align:center'},'Tap anywhere when the white marker is in the green zone. 3 misses and you drop the bar.'));
  c.addEventListener('pointerdown',tap);ov.addEventListener('pointerdown',e=>{if(e.target===ov)tap(e)});APP.append(ov);loop()}

/* ---- pixel camera v2: full screen, editor before posting ---- */
const CAM_FX={ORIGINAL:null,PIXEL:CAM_PALS.PIXEL,GAMEBOY:CAM_PALS.GAMEBOY,MONO:CAM_PALS.MONO,SUNSET:CAM_PALS.SUNSET,NEON:['#0b0221','#2a0a4a','#ff2a6d','#05d9e8','#d1f7ff','#ff9f1c'],VAPOR:['#1a1433','#ff71ce','#01cdfe','#05ffa1','#b967ff','#fffb96']};
function flipIcon(s=2){const[c,g]=mk(14,12);R(g,'#f6f3ec',2,2,10,1);R(g,'#f6f3ec',11,2,1,4);R(g,'#f6f3ec',9,0,1,5);R(g,'#f6f3ec',8,1,1,3);R(g,'#f6f3ec',2,9,10,1);R(g,'#f6f3ec',2,6,1,4);R(g,'#f6f3ec',4,7,1,5);R(g,'#f6f3ec',5,8,1,3);return show(c,s)}
function galleryIcon(s=2){const[c,g]=mk(14,12);R(g,'#f6f3ec',0,0,14,12);R(g,'#5ab4f5',1,1,12,10);R(g,'#7fb069',1,7,12,4);R(g,'#2e7d32',4,5,4,6);R(g,'#ffd54a',10,2,2,2);return show(c,s)}
function pixelCamera(onDone){let px_=96,fxName='PIXEL',stream=null,raf=0,frozen=false,facing='environment',src=null,adj={b:0,c:0,s:0};
  const ov=h('div',{class:'camfs'}),stage=h('div',{class:'camstage'}),video=h('video',{playsinline:'',autoplay:''});video.muted=true;APP.append(ov);
  const dims=()=>{const r=stage.getBoundingClientRect(),ar=r.height&&r.width?r.height/r.width:4/3;return[px_,Math.round(px_*Math.min(2.2,Math.max(1,ar)))]};
  let[W,H]=[96,128],[cv,g]=mk(W,H);stage.append(cv);
  const resize=()=>{[W,H]=dims();cv.width=W;cv.height=H};
  const stop=()=>{cancelAnimationFrame(raf);stream&&stream.getTracks().forEach(t=>t.stop());stream=null};const close=()=>{stop();document.removeEventListener('visibilitychange',vis);ov.remove()};
  const paint=()=>{if(!src)return;const[s,sw,sh]=src,k=Math.max(W/sw,H/sh);g.filter=`brightness(${100+adj.b}%) contrast(${100+adj.c}%) saturate(${100+adj.s}%)`;g.fillStyle='#000';g.fillRect(0,0,W,H);
    if(facing==='user'&&!frozen){g.save();g.translate(W,0);g.scale(-1,1)}g.drawImage(s,(W-sw*k)/2,(H-sh*k)/2,sw*k,sh*k);if(facing==='user'&&!frozen)g.restore();g.filter='none';if(CAM_FX[fxName])quantize(g,W,H,CAM_FX[fxName])};
  const loop=()=>{if(!ov.isConnected)return;if(!frozen&&video.readyState>=2){src=[video,video.videoWidth,video.videoHeight];paint()}raf=requestAnimationFrame(loop)};
  const status=h('span',{class:'camstat'},'Starting camera…');
  async function start(){stop();frozen=false;resize();try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw 0;stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing},audio:false});
      video.srcObject=stream;await video.play();status.textContent='';ui();loop()}
    catch(e){status.textContent='Camera not available here. Pick a photo from your gallery.';g.fillStyle='#1a1433';g.fillRect(0,0,W,H);ui()}}
  const vis=()=>{if(document.visibilityState==='hidden'){if(!frozen)stop()}else if(ov.isConnected&&!frozen)start()};document.addEventListener('visibilitychange',vis);
  const fileIn=h('input',{type:'file',accept:'image/*',style:'display:none','aria-label':'Choose a photo',onchange:e=>{const f=e.target.files[0];if(!f)return;const img=new Image();
    img.onload=()=>{stop();status.textContent='';src=[img,img.naturalWidth,img.naturalHeight];frozen=true;resize();paint();ui()};img.src=URL.createObjectURL(f)}});
  const shoot=()=>{if(!stream||video.readyState<2){toast('CAMERA NOT READY');return}const sc=document.createElement('canvas');sc.width=video.videoWidth;sc.height=video.videoHeight;const sg=sc.getContext('2d');
    if(facing==='user'){sg.translate(sc.width,0);sg.scale(-1,1)}sg.drawImage(video,0,0);stop();src=[sc,sc.width,sc.height];frozen=true;ov.classList.add('flash');setTimeout(()=>ov.classList.remove('flash'),300);paint();SFX.coin();haptic('click');ui()};
  const top=h('div',{class:'camtop'}),bottom=h('div',{class:'cambot'});let etab='FILTER';
  function ui(){const fxRow=h('div',{class:'camfx'},Object.keys(CAM_FX).map(k=>h('button',{class:'fxb','aria-pressed':String(k===fxName),onclick:()=>{fxName=k;if(frozen)paint();ui()}},k)));
    if(!frozen){top.replaceChildren(h('button',{class:'cbtn','aria-label':'Close camera',onclick:close},'✕'),h('span',{class:'logo'},'PIXEL CAM'),h('div',{class:'seg',style:'flex:none'},[[64,'S'],[96,'M'],[128,'L']].map(([v,t])=>h('button',{'aria-pressed':String(px_===v),'aria-label':'Pixel size '+t,onclick:()=>{px_=v;resize();ui()}},t))));
      bottom.replaceChildren(fxRow,h('div',{class:'camctl'},h('button',{class:'cbtn round','aria-label':'Choose from gallery',onclick:()=>fileIn.click()},galleryIcon(2)),h('button',{class:'shutter big','aria-label':'Take photo',onclick:shoot}),
        h('button',{class:'cbtn round','aria-label':'Switch camera',onclick:()=>{facing=facing==='user'?'environment':'user';start()}},flipIcon(2))))}
    else{top.replaceChildren(h('button',{class:'cbtn','aria-label':'Retake',onclick:()=>{src=null;adj={b:0,c:0,s:0};start()}},'◀'),h('span',{class:'logo'},'EDIT'),h('button',{class:'btn',style:'padding:8px 12px',onclick:()=>{onDone(cv.toDataURL('image/png'));close()}},'NEXT ▶'));
      const sl=(k,lab)=>h('label',{class:'camsl'},h('span',{class:'label'},lab),h('input',{type:'range',min:-50,max:50,value:adj[k],'aria-label':lab,oninput:e=>{adj[k]=+e.target.value;paint()}}));
      bottom.replaceChildren(h('div',{class:'seg camtabs'},['FILTER','ADJUST','PIXELS'].map(t=>h('button',{'aria-pressed':String(etab===t),onclick:()=>{etab=t;ui()}},t))),
        etab==='FILTER'?fxRow:etab==='ADJUST'?h('div',{class:'camadj'},sl('b','BRIGHTNESS'),sl('c','CONTRAST'),sl('s','SATURATION')):h('div',{class:'seg',style:'justify-content:center'},[[48,'CHUNKY'],[64,'BIG'],[96,'MEDIUM'],[128,'FINE']].map(([v,t])=>h('button',{'aria-pressed':String(px_===v),onclick:()=>{px_=v;resize();paint();ui()}},t))))}}
  ov.append(stage,status,top,bottom,fileIn);ui();requestAnimationFrame(start)}
