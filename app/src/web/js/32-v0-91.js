/* ================= v0.91 ================= */

/* ---- your icon art (embedded so it works offline and in the prototype) ---- */
const ART_ALIAS={icon_house:'icon_home',icon_leg:'icon_fuel',icon_me:null};
function loadEmbeddedArt(){const D=window.ART_DATA||{},names=Object.keys(D);let n=names.length;if(!n)return;
  names.forEach(k=>{const im=new Image();im.onload=im.onerror=()=>{if(im.naturalWidth){ART[k]=im}if(--n===0){Object.entries(ART_ALIAS).forEach(([a,b])=>{if(b&&ART[b])ART[a]=ART[b]});document.getElementById('logoIcon').replaceChildren(px('logo',2));if(P)render(true)}};im.src='data:image/png;base64,'+D[k]})}
function artCanvas(im,target){const n=Math.max(im.naturalWidth,im.naturalHeight),c=document.createElement('canvas');c.width=n;c.height=n;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.drawImage(im,(n-im.naturalWidth)>>1,(n-im.naturalHeight)>>1);c.className='art';c.style.width=c.style.height=Math.round(target*1.15)+'px';c.setAttribute('aria-hidden','true');return c}
/* keep the code-drawn plus for the green dock button */
const _px=px;px=function(name,s=3){if(name==='plus'){const keep=ART.icon_plus;delete ART.icon_plus;const c=_px(name,s);if(keep)ART.icon_plus=keep;return c}return _px(name,s)};

/* ---- chiptune music: gym-themed tracks made live by the phone (no files) ---- */
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const TRACKS=[
  {id:'pump',n:'PUMP IT UP',lv:0,bpm:132,key:57,prog:[0,5,3,4],lead:[0,4,7,12,7,4,9,7, 0,4,7,11,12,11,7,4],bass:'oct',drums:'four'},
  {id:'iron',n:'IRON GROOVE',lv:0,bpm:112,key:52,prog:[0,0,3,5],lead:[7,-1,5,7,-1,10,7,5, 3,-1,5,3,0,-1,3,5],bass:'walk',drums:'back'},
  {id:'cool',n:'COOL DOWN',lv:0,bpm:84,key:60,prog:[0,4,5,3],lead:[12,-1,11,-1,7,-1,4,-1, 5,-1,7,-1,9,-1,7,-1],bass:'root',drums:'soft'},
  {id:'boss',n:'BOSS SET',lv:10,bpm:150,key:50,prog:[0,1,0,6],lead:[0,3,7,3,0,3,8,7, 0,3,7,10,12,10,8,7],bass:'gallop',drums:'four'},
  {id:'victory',n:'VICTORY LAP',lv:20,bpm:138,key:62,prog:[0,4,5,3],lead:[12,12,14,16,14,12,9,7, 9,12,14,12,16,-1,19,-1],bass:'oct',drums:'back'},
  {id:'merlift',n:'MERLIFT\'S THEME',lv:30,bpm:100,key:55,prog:[0,6,5,4],lead:[7,10,14,12,10,7,5,7, 3,5,7,10,12,-1,7,-1],bass:'walk',drums:'soft'}];
const MINOR={boss:1,iron:1,merlift:1};
const MUS={ctx:null,gain:null,timer:0,step:0,next:0,track:null,on:false};
function musicTrack(){return TRACKS.find(t=>t.id===SET.musicTrack&&musicOk(t))||TRACKS[0]}
const musicOk=t=>SET.unlockAll||lvl()>=t.lv;
function musicStart(){if(SET.music===false||document.hidden)return;try{if(!MUS.ctx){MUS.ctx=new(window.AudioContext||window.webkitAudioContext)();MUS.gain=MUS.ctx.createGain();MUS.gain.connect(MUS.ctx.destination)}
  if(MUS.ctx.state==='suspended')MUS.ctx.resume();MUS.gain.gain.value=(SET.musicVol??.35)*.22;if(MUS.on)return;MUS.on=true;MUS.track=musicTrack();MUS.step=0;MUS.next=MUS.ctx.currentTime+.1;clearInterval(MUS.timer);MUS.timer=setInterval(musicTick,40)}catch(e){}}
function musicStop(){MUS.on=false;clearInterval(MUS.timer);if(MUS.ctx&&MUS.ctx.state==='running')MUS.ctx.suspend()}
function musicRestart(){musicStop();setTimeout(musicStart,60)}
function voice(type,f,t,d,vol){const c=MUS.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(MUS.gain);o.start(t);o.stop(t+d+.02)}
let NOISE=null;function noise(t,d,vol,hi){const c=MUS.ctx;if(!NOISE){NOISE=c.createBuffer(1,c.sampleRate*.5,c.sampleRate);const a=NOISE.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();s.buffer=NOISE;f.type=hi?'highpass':'lowpass';f.frequency.value=hi?6000:900;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(MUS.gain);s.start(t);s.stop(t+d)}
function musicTick(){const c=MUS.ctx,T=MUS.track;if(!c||!MUS.on)return;const sp=60/T.bpm/2;
  while(MUS.next<c.currentTime+.15){const s=MUS.step,bar=Math.floor(s/16)%4,i=s%16,minor=MUS_MIN(T),chord=T.prog[bar],root=T.key+scaleDeg(chord,minor),t=MUS.next;
    const ln=T.lead[i];if(ln>=0)voice('square',NOTE(root+12+ln),t,sp*.9,.09);
    if(i%2===0){const b=T.bass==='oct'?(i%4?root:root-12):T.bass==='walk'?root-12+[0,3,5,7][(i/2|0)%4]:T.bass==='gallop'?root-12+(i%4?7:0):root-12;voice('triangle',NOTE(b),t,sp*1.6,.22)}
    if(i%4===2)voice('square',NOTE(root+12+(minor?3:4)),t,sp*.5,.03);
    const dr=T.drums;if(dr==='four'?i%4===0:dr==='back'?(i===0||i===6||i===8):i%8===0)voice('sine',110,t,.12,.5);if((dr==='four'||dr==='back')&&(i===4||i===12))noise(t,.12,.25);if(dr!=='soft'||i%4===0)noise(t,.03,i%2?.05:.08,true);
    MUS.next+=sp;MUS.step++}}
const MUS_MIN=T=>!!MINOR[T.id];
function scaleDeg(d,minor){const maj=[0,2,4,5,7,9,11],mn=[0,2,3,5,7,8,10];return(minor?mn:maj)[((d%7)+7)%7]}
document.addEventListener('visibilitychange',()=>{if(document.hidden)musicStop();else if(SET.music!==false&&META.musicStarted)musicStart()});
document.addEventListener('pointerdown',()=>{if(!META.musicStarted&&SET.music!==false&&P){META.musicStarted=true;musicStart()}else if(SET.music!==false&&P&&!MUS.on&&META.musicStarted)musicStart()},{capture:true});
function musicBoxSettings(){const tracks=TRACKS.map(t=>{const ok=musicOk(t),on=musicTrack().id===t.id;return h('button',{class:'opt','aria-pressed':String(on),disabled:!ok,onclick:()=>{SET.musicTrack=t.id;SET.music=true;save();META.musicStarted=true;musicRestart();render(true)}},px('note',3),h('span',{class:'grow'},t.n),h('span',{class:'tag'+(on?' s':'')},on?'PLAYING':ok?'PLAY':'LVL '+t.lv))});
  return h('div',{class:'box'},h('span',{class:'label'},'MUSIC'),h('div',{class:'srow'},h('span',{},'Chiptune music'),h('button',{class:'toggle','aria-pressed':String(SET.music!==false),'aria-label':'Music',onclick:()=>{SET.music=SET.music===false;save();if(SET.music){META.musicStarted=true;musicStart()}else musicStop();render(true)}})),
    SET.music!==false?[h('label',{class:'srow'},h('span',{},'Volume'),h('input',{type:'range',min:0,max:100,value:Math.round((SET.musicVol??.35)*100),'aria-label':'Music volume',style:'flex:1;max-width:55%;accent-color:var(--a1)',oninput:e=>{SET.musicVol=e.target.value/100;if(MUS.gain)MUS.gain.gain.value=SET.musicVol*.22},onchange:()=>save()})),
      h('details',{class:'xp'},h('summary',{},h('span',{},'Track'),h('span',{class:'tag s'},musicTrack().n)),h('div',{class:'list'},tracks))]:null,h('span',{class:'small'},'Music pauses when the app is in the background. More tracks unlock as you level up.'))}

/* ---- keyboard: quick switch to the phone keyboard ---- */
function kbToPhone(){const el=KB.inp;SET.pkb=false;save();kbClose();if(el){el.setAttribute('inputmode',el.dataset.im||'text');el.blur();setTimeout(()=>el.focus(),60)}toast('PHONE KEYBOARD ON · CHANGE IT IN SETTINGS')}

/* ---- birthday picker: fixed size, separate year/month header, year list ---- */
function datePicker(init,onPick){const d0=init?new Date(init+'T12:00'):new Date(2000,0,1),now=new Date().getFullYear(),Y0=now-100,Y1=now-10;let y=clamp(d0.getFullYear(),Y0,Y1),mo=d0.getMonth(),day=d0.getDate(),m,view='days';
  const MON=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],body=h('div',{class:'dp'});
  const move=dm=>{mo+=dm;if(mo<0){mo=11;y--}if(mo>11){mo=0;y++}y=clamp(y,Y0,Y1);draw()};
  function draw(){const dim=new Date(y,mo+1,0).getDate();day=Math.min(day,dim);const st=(new Date(y,mo,1).getDay()+6)%7,iso=dstr(new Date(y,mo,day));
    const head=h('div',{class:'dphead'},h('button',{class:'stp','aria-label':'Previous month',onclick:()=>move(-1)},'‹'),
      h('button',{class:'dpt',onclick:()=>{view=view==='months'?'days':'months';draw()},'aria-label':'Pick month'},MON[mo]),h('button',{class:'dpt y',onclick:()=>{view=view==='years'?'days':'years';draw()},'aria-label':'Pick year'},String(y)+' ▾'),
      h('button',{class:'stp','aria-label':'Next month',onclick:()=>move(1)},'›'));
    let grid;
    if(view==='years'){grid=h('div',{class:'dpy'},Array.from({length:Y1-Y0+1},(_,i)=>Y1-i).map(yy=>h('button',{class:yy===y?'on':'',onclick:()=>{y=yy;view='days';draw()}},String(yy))));requestAnimationFrame(()=>{const on=grid.querySelector('.on');if(on)on.scrollIntoView({block:'center'})})}
    else if(view==='months')grid=h('div',{class:'dpm'},MON.map((n,i)=>h('button',{class:i===mo?'on':'',onclick:()=>{mo=i;view='days';draw()}},n.slice(0,3))));
    else grid=h('div',{class:'cal dpd'},DAYS.map(dd=>h('span',{class:'wd'},dd.slice(0,2))),Array.from({length:42},(_,k)=>{const n=k-st+1;return n>=1&&n<=dim?h('button',{class:n===day?'sel today':'',onclick:()=>{day=n;draw()}},String(n)):h('span',{})}));
    body.replaceChildren(h('h2',{},'PICK YOUR BIRTHDAY'),head,h('div',{class:'dpbox'},grid),
      h('div',{class:'row spread'},h('span',{class:'small'},fmtDob(iso)),h('span',{class:'tag s'},'AGE '+ageFrom(iso))),
      h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>m.remove()},'CANCEL'),h('button',{class:'btn grow',onclick:()=>{m.remove();onPick(iso);haptic('click')}},'CONFIRM')))}
  draw();m=modal(body)}

/* ---- AM/PM time picker for "your day" ---- */
const ampm=hr=>{const h12=hr%12||12;return h12+':00 '+(hr<12?'AM':'PM')};
function timeField(label,val,set,icon){return pickField(label,val,{icon:px(icon||'sun',2),text:ampm(val)},()=>pickList(label,Array.from({length:24},(_,i)=>({id:i,label:ampm(i),sub:i<5||i>21?'NIGHT':i<12?'MORNING':i<17?'AFTERNOON':'EVENING'})),val,v=>{set(+v)}))}

/* ---- random look respects the chosen sex ---- */
const HAIR_BY_SEX={m:['short','buzz','curly','afro','bald'],f:['long','bun','curly','afro']};

/* ---- remember where you were on every page ---- */
const SCROLLS={};const viewKey=()=>tab+':'+(tab==='train'?trainView:tab==='fuel'?fuelTab:tab==='club'?clubTab+(clubTab==='board'?lbTab:''):'');
scr.addEventListener('scroll',()=>{SCROLLS[viewKey()]=scr.scrollTop},{passive:true});

/* ---- account: sign-in options, locked for now ---- */
function signIcon(k,s=2){const[c,g]=mk(12,12);
  if(k==='mail'){R(g,'#f6f3ec',0,2,12,8);R(g,'#9aa3b5',1,3,1,1);for(let i=0;i<5;i++){R(g,'#9aa3b5',1+i,3+i,1,1);R(g,'#9aa3b5',10-i,3+i,1,1)}}
  else if(k==='google'){disc(g,'#ffffff',6,6,5);R(g,'#4a4652',4,4,4,4);R(g,'#ffffff',5,5,2,2)}
  else if(k==='facebook'){R(g,'#3b5ba5',1,1,10,10);R(g,'#ffffff',6,3,2,8);R(g,'#ffffff',5,5,4,1)}
  else{R(g,'#1d1d24',2,3,8,8);R(g,'#1d1d24',4,1,2,2);R(g,'#f6f3ec',5,5,2,2)}
  outline(c);return show(c,s)}
function accountBox(){const opts=[['google','Continue with Google'],['mail','Continue with email'],['facebook','Continue with Facebook'],['apple','Continue with Apple ID']];
  return h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'ACCOUNT'),h('span',{class:'tag'},'COMING SOON')),
    h('span',{class:'small'},'No account needed. Signing in arrives with the online version: cloud backup, your data on a new phone, real leagues and follows.'),
    h('div',{class:'list'},opts.map(([k,t])=>h('button',{class:'opt signin',disabled:true,'aria-disabled':'true'},signIcon(k,2),h('span',{class:'grow'},t),px('lock',2)))),
    h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',disabled:true},'SIGN IN'),h('button',{class:'btn ghost grow',disabled:true},'CREATE ACCOUNT')))}

/* ---- developer options: hidden, password protected ---- */
const DEV_PASS='224#224';let devUnlocked=false;
function devHold(el){let t=0,ring=null;const start=()=>{clearTimeout(t);el.classList.add('holding');t=setTimeout(()=>{el.classList.remove('holding');META.devShown=!META.devShown;save();haptic('level');toast(META.devShown?'DEVELOPER OPTIONS SHOWN':'DEVELOPER OPTIONS HIDDEN');if(tab==='settings')render(true)},10000)};
  const stop=()=>{clearTimeout(t);el.classList.remove('holding')};el.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,stop));el.addEventListener('contextmenu',e=>e.preventDefault())}
function devGate(){if(devUnlocked){devPanel();return}let m;const inp=h('input',{id:'devpw',type:'text',autocomplete:'off',placeholder:'Password','aria-label':'Developer password'}),go=()=>{if(inp.value===DEV_PASS){devUnlocked=true;m.remove();devPanel()}else{buzz(60);toast('WRONG PASSWORD');inp.value=''}};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});m=modal(h('div',{class:'row nowrap'},px('lock',3),h('h2',{},'DEVELOPER OPTIONS')),h('span',{class:'small'},'For testing only.'),inp,h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>m.remove()},'CANCEL'),h('button',{class:'btn grow',onclick:go},'UNLOCK')))}
function devPanel(){sheet('DEVELOPER',redraw=>{const tg=(k,l,after)=>h('div',{class:'srow'},h('span',{},l),h('button',{class:'toggle','aria-pressed':String(!!SET[k]),'aria-label':l,onclick:()=>{SET[k]=!SET[k];save();applyTheme();after&&after();redraw()}}));
  const b=(t,fn)=>h('button',{class:'btn ghost grow',onclick:()=>{fn();redraw()}},t);
  return[h('div',{class:'box'},h('span',{class:'label'},'CHEATS'),tg('testFast','Fast session timer (20×)'),tg('pro','Preview Pro (hides ads)'),tg('unlockAll','Unlock all rewards'),
      h('div',{class:'row'},b('+500 COINS',()=>addCoins(500)),b('+1 LEVEL',()=>{const L=lvl();ST.xp=xpAt(L+1);save();levelUp(L+1)}),b('+5 FREEZES',()=>{ST.frz=(ST.frz||0)+5;save()})),
      h('div',{class:'row'},...CHEST_KINDS.map(k=>b(CHEST_INFO[k][0].split(' ').pop(),()=>openChest(k,'TEST CHEST')))),
      h('div',{class:'row'},b('ALL RELICS',()=>{COLL.forEach(c=>grantColl(c.id))}),b('RESET RELICS',()=>{ST.coll={};save()}))),
    h('div',{class:'box'},h('span',{class:'label'},'LEAGUES'),h('div',{class:'row'},b(LG.ko?'END KNOCKOUT WEEK':'END LEAGUE MONTH',()=>checkLeague(true)),b('JUMP TO LEAGUE 1',()=>{LG.lg=9;LG.ko=0;saveLG()}))),
    h('div',{class:'box'},h('span',{class:'label'},'EVENTS & VISITORS'),h('div',{class:'row'},Object.keys(EVENTS).map(id=>h('button',{class:'btn ghost',style:'padding:6px 8px',onclick:()=>{SET.evPreview=SET.evPreview===id?null:id;SET.evOffDay=null;save();applyTheme();redraw()}},(SET.evPreview===id?'■ ':'')+EVENTS[id].n))),
      h('div',{class:'row'},b('SUMMON MERLIFT',()=>{APP.querySelectorAll('.overlay').forEach(o=>o.remove());tab='home';render();setTimeout(()=>maybeMerlift(true),600)}),b('START TOUR',()=>{APP.querySelectorAll('.overlay').forEach(o=>o.remove());META.tour=false;startTour()}),b('REP RUSH',repRush))),
    h('div',{class:'box'},h('span',{class:'label'},'DATA'),h('div',{class:'row'},b('ADD 2 WEEKS OF WORKOUTS',()=>{const d=new Date();for(let i=14;i>0;i--){if(i%3===0)continue;const x=new Date(d);x.setDate(d.getDate()-i);ST.log.push({d:dstr(x),rid:'push',name:i%2?'PUSH DAY':'LEG DAY',xp:180,done:true,mins:45})}ST.workouts=ST.log.filter(l=>l.done).length;save()}),
      b('CLEAR WORKOUTS',()=>{ST.log=[];ST.workouts=0;save()})),h('div',{class:'row'},b('RESET TIPS + BRIEFING',()=>{META.tour=false;META.brief=null;save()}),b('LOCK CLUB AGAIN',()=>{META.clubDemo=false;save()}))),
    h('div',{class:'box'},h('span',{class:'label'},'REWARD ECONOMY'),...ECONOMY.map(([k,v])=>h('div',{class:'srow'},h('span',{class:'small'},k),h('span',{class:'tag'},v)))),
    h('div',{class:'box'},h('span',{class:'label'},'BUILD'),h('div',{class:'srow'},h('span',{},'Version'),h('span',{class:'tag'},VERSION)),h('div',{class:'srow'},h('span',{},'Screen'),h('span',{class:'tag'},innerWidth+'×'+innerHeight)),h('div',{class:'srow'},h('span',{},'Storage used'),h('span',{class:'tag'},Math.round(Object.keys(localStorage).filter(k=>k.startsWith('ib2_')).reduce((a,k)=>a+localStorage.getItem(k).length,0)/1024)+' KB')),
      h('button',{class:'btn ghost',onclick:()=>{devUnlocked=false;APP.querySelectorAll('.overlay').forEach(o=>o.remove());render(true)}},'LOCK DEVELOPER OPTIONS'))]})}

/* ---- reward economy (balanced: steady, not too generous) ---- */
xpAt=L=>L<=1?0:Math.round(120*Math.pow(L-1,1.65)/10)*10;
const ECONOMY=[['XP per workout','~150–300'],['Level 10 / 30 / 60 / 120 at','~5 wk / 8 mo / 2.5 yr / 7 yr'],['Coins per workout','8 + XP ÷ 20'],['Bonus chest after a workout','15%'],['Level-up chest','Bag · Crate every 5 · Vault every 10'],
  ['Gym Bag / Locker / Crate / Vault coins','15–35 / 40–90 / 100–200 / 250–450'],['Shop chests','90 / 220 / 520 / 1200'],['Outfits in shop','level × 45'],['Streak freeze 1 / 3 / 7 days','350 / 900 / 1800'],['Typical week (4 workouts)','~110–150 coins']];
CHEST_INFO.bag[3]=[15,35];CHEST_INFO.locker[3]=[40,90];CHEST_INFO.crate[3]=[100,200];CHEST_INFO.vault[3]=[250,450];

/* ---- club: locked until you choose to try the demo ---- */
function clubLocked(){return[h('div',{class:'box clublock'},px('lock',5),h('h2',{},'THE CLUB IS COMING'),h('p',{},'Posts, comments, leagues and following other players go live with the online version of IronBit.'),
  h('p',{class:'small'},'Want a peek? The demo uses made-up players so you can try everything now.'),h('button',{class:'btn',onclick:()=>{META.clubDemo=true;save();render();toast('CLUB DEMO UNLOCKED')}},'TRY THE DEMO'))]}

/* ---- gym map: change city with a search list ---- */
function cityPicker(){pickList('PICK A CITY',cityItems(P.country),P.city||'Other',v=>{P.city=v;save();weatherClear&&weatherClear();render()},{search:true,ph:'Search cities or countries'})}
const weatherClear=()=>{try{store.set('wx',null)}catch(e){}};

/* ---- real UAE gyms (first batch, for testing; prices are starting rates and may change) ---- */
const UAE_GYMS={
  Dubai:[['GymNation Al Quoz','Al Quoz',99,'24/7',['24H','BUDGET']],['GymNation Bur Dubai','Bur Dubai',99,'24/7',['24H','BUDGET']],['GymNation Downtown','Downtown',99,'24/7',['24H','BUDGET']],['GymNation Mirdif','Mirdif',99,'24/7',['24H','BUDGET']],
    ['GymNation Motor City','Motor City',99,'24/7',['24H','BUDGET']],['GymNation Silicon Oasis','Silicon Oasis',99,'24/7',['24H','BUDGET']],
    ['Fitness First Media City','Media City',0,'5AM–11PM',[]],['Fitness First Al Barsha','Al Barsha',0,'5AM–11PM',[]],['Fitness First Bay Gate','Business Bay',0,'5AM–11PM',[]],['Fitness First BurJuman','Bur Dubai',0,'6AM–11PM',[]],
    ['Fitness First DAMAC Hills','DAMAC Hills',0,'6AM–11PM',[]],['Fitness First Deira City Centre','Deira',0,'6AM–12AM',[]],['Fitness First DIFC','DIFC',0,'5AM–11PM',[]],['Fitness First Festival City','Festival City',0,'6AM–11PM',[]],
    ['Fitness First Ibn Battuta','Jebel Ali',0,'6AM–11PM',[]],['Fitness First Marina Gate','Dubai Marina',0,'5AM–11PM',['POOL']],['Fitness First Mirdif City Centre','Mirdif',0,'6AM–12AM',[]],['Fitness First Motor City','Motor City',0,'6AM–11PM',[]],
    ['Fitness First Mudon','Mudon',0,'6AM–11PM',[]],['Fitness First Oasis Centre','Al Quoz',0,'6AM–11PM',[]],['Fitness First The Palm','Palm Jumeirah',0,'6AM–11PM',['POOL']],['Fitness First Uptown Mirdif (Ladies)','Mirdif',0,'6AM–11PM',['LADIES']],
    ['Fitness Zone JLT','JLT',400,'6AM–11PM',[]],['Vogue Fitness JLT','JLT',999,'6AM–10PM',[]],['F45 Dubai Hills','Dubai Hills',1299,'6AM–9PM',['CLASSES']],['PureGym Al Barsha','Al Barsha',0,'24/7',['24H']],['Warehouse Gym Al Quoz','Al Quoz',0,'24/7',['24H']]],
  'Abu Dhabi':[['Fitness First Abu Dhabi Mall','Tourist Club',0,'6AM–11PM',[]],['Fitness First Al Seef Mall','Al Seef',0,'6AM–11PM',[]],['Fitness First Bawabat Al Sharq','Baniyas',0,'6AM–11PM',[]],['Fitness First Dalma Mall','Mussafah',0,'6AM–12AM',[]],
    ['Fitness First Marina Mall','Breakwater',0,'6AM–11PM',[]],['Fitness First Al Wahda Mall','Al Wahda',0,'6AM–12AM',[]],['Fitness First Forsan Central (Ladies)','Khalifa City',0,'6AM–11PM',['LADIES']],['GymNation Abu Dhabi','Abu Dhabi',99,'24/7',['24H','BUDGET']]],
  'Al Ain':[['Fitness First Hili Mall','Hili',0,'6AM–11PM',[]],['GymNation Al Ain','Al Ain',99,'24/7',['24H','BUDGET']]],
  Sharjah:[['GymNation Al Zahia (Men)','Al Zahia',99,'24/7',['24H','BUDGET']],['GymNation Al Zahia (Ladies)','Al Zahia',99,'24/7',['24H','LADIES']],['GymNation Mega Mall (Men)','Al Qasimia',99,'24/7',['24H','BUDGET']],['GymNation Mega Mall (Ladies)','Al Qasimia',99,'24/7',['24H','LADIES']],
    ['GymNation Sharjah Central (Men)','Industrial Area',99,'24/7',['24H','BUDGET']],['GymNation Sharjah Central (Ladies)','Industrial Area',99,'24/7',['24H','LADIES']],['Fitness First Sahara Centre','Al Nahda',0,'6AM–12AM',[]],['Fitness First Zero 6','Al Majaz',0,'6AM–11PM',[]]]};
const _cityGyms=cityGyms;cityGyms=function(city){const real=UAE_GYMS[city];if(!real)return _cityGyms(city);const C0=CITIES[city]||CITIES.Other,coast=C0[3];
  const list=real.map(([n,a,p,hrs,t])=>{const r=rng('g'+n),[x,y]=landSpot(r,coast);return{n,a,x,y,p,hrs,t,cur:'AED',real:true}});((P.myGyms||{})[city]||[]).forEach(g=>list.push({...g,cur:'AED',mine:true}));return list};

/* ---- about IronBit: full page with changelog, help, developer, rate, donate ---- */
function aboutPage(){sheet('ABOUT IRONBIT',()=>[h('div',{class:'abhead'},ART.icon_logo?artCanvas(ART.icon_logo,72):px('dumb',6),h('div',{style:'display:flex;flex-direction:column;gap:6px'},h('h1',{},'IRONBIT'),h('span',{class:'tag s'},'GET FIT, BIT BY BIT.'),h('span',{class:'small'},'Version '+VERSION))),
  h('p',{},'IronBit is a pixel-art gym companion: training plans, a coach that looks like you, a muscle map, nutrition facts, recipes and a map of gyms in your city.'),
  h('div',{class:'box'},[['Internet needed','WEATHER ONLY'],['Account needed','NO'],['Ads','NONE'],['Your data','STAYS ON PHONE'],['Price','FREE']].map(([a,b])=>h('div',{class:'srow'},h('span',{},a),h('span',{class:'tag'},b)))),
  h('div',{class:'box'},h('span',{class:'label'},'SUPPORT IRONBIT'),h('button',{class:'opt',onclick:rateModal},px('star',3),h('span',{class:'grow'},'Rate IronBit on Google Play')),h('button',{class:'opt',onclick:donateModal},px('heart',3),h('span',{class:'grow'},'Donate to the developer'))),
  h('div',{class:'box'},h('span',{class:'label'},'HELP IRONBIT GROW'),h('button',{class:'opt',onclick:()=>feedbackModal('bug')},px('gear',3),h('span',{class:'grow'},'Report a bug'),h('span',{class:'tag'},'EMAIL')),h('button',{class:'opt',onclick:()=>feedbackModal('idea')},px('bolt',3),h('span',{class:'grow'},'Suggest a feature'),h('span',{class:'tag'},'EMAIL'))),
  h('button',{class:'opt',onclick:devPage},headIcon(P,P.char,2),h('span',{class:'grow'},'About the developer'),h('span',{class:'tag'},'HI!')),
  h('div',{class:'box'},h('span',{class:'label'},'CHANGELOG'),...CHANGELOG.map(([v,items],i)=>h('details',{class:'xp chg',open:i===0},h('summary',{},h('h3',{},'VERSION '+v),i===0?h('span',{class:'tag s'},'NEW'):h('span',{class:'small'},items.length+' changes')),h('ul',{class:'chl'},items.map(x=>h('li',{},x)))))),
  h('span',{class:'label'},'FOLLOW IRONBIT · COMING SOON'),h('div',{class:'socials'},['WEB','FB','IG','X','TT','GH'].map(x=>h('span',{class:'soc',title:x+' (coming soon)'},x))),
  h('span',{class:'small'},'Fonts: Press Start 2P, VT323, Silkscreen, Pixelify Sans, DotGothic16, Jersey 10 (SIL Open Font License). Music and sounds are generated live by the app.')])}
function changelogModal(){aboutPage()}
function aboutModal(){aboutPage()}

/* ---- about the developer: compact, fits the screen ---- */
DEV.name='Mohamed Amin';DEV.bio='I design and build IronBit myself: a gym app that feels like a game, works offline, costs nothing and speaks to people everywhere.';DEV.more='';DEV.email=SUPPORT_EMAIL;
function devPage(){sheet('THE DEVELOPER',()=>[h('div',{class:'devcard'},show(drawFront(P,P.char,'great'),2),h('h1',{class:'devname'},DEV.name.toUpperCase()),h('span',{class:'tag s'},'DESIGNER & DEVELOPER'),h('p',{class:'devbio'},DEV.bio)),
  h('div',{class:'box'},h('span',{class:'label'},'GET IN TOUCH'),h('div',{class:'srow'},h('span',{},'Email'),h('span',{class:'tag',style:'text-transform:none;overflow-wrap:anywhere'},DEV.email)),
    h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>feedbackModal('bug')},'REPORT BUG'),h('button',{class:'btn ghost grow',onclick:()=>feedbackModal('idea')},'SEND IDEA'))),
  h('p',{class:'note'},'Made with pixels, protein and too much coffee.')])}
