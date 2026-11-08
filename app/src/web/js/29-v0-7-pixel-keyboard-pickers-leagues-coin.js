/* ================= v0.7: pixel keyboard, pickers, leagues, coins, chests, events, tour, generator ================= */

/* ---- pixel keyboard: replaces the phone keyboard for every text and number field ---- */
const KBL={
  en:[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['SHIFT','z','x','c','v','b','n','m','BK'],['NUM','LANG',',','SPACE','.','DONE']],
  ar:[['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج'],['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],['ذ','ء','ؤ','ر','ى','ة','و','ز','ظ','د','BK'],['NUM','LANG','،','SPACE','.','DONE']],
  num:[['1','2','3','4','5','6','7','8','9','0'],['-','/',':',';','(',')','!','@','"','\''],['#','%','&','+','=','?','_','*','BK'],['ABC','LANG',',','SPACE','.','DONE']],
  pad:[['1','2','3'],['4','5','6'],['7','8','9'],['DOT','0','BK'],['DONE']]};
const KB={el:null,inp:null,mode:'en',lang:'en',shift:false,v0:''};
function kbWanted(el){if(!el||SET.pkb===false)return false;if(el.tagName==='TEXTAREA')return true;if(el.tagName!=='INPUT')return false;return['text','number','search','tel','email',''].includes(el.type)&&!el.readOnly&&!el.disabled}
function kbIsPad(el){const m=el.dataset.im!=null?el.dataset.im:(el.getAttribute('inputmode')||'');return el.type==='number'||m==='numeric'||m==='decimal'||m==='tel'}
function kbOpen(el){if(KB.inp!==el){KB.inp=el;KB.v0=el.value}if(el.dataset.im==null)el.dataset.im=el.getAttribute('inputmode')||'';el.setAttribute('inputmode','none');
  KB.mode=kbIsPad(el)?'pad':KB.lang;KB.shift=!el.value&&el.type!=='search'&&KB.mode==='en'&&el.id!=='plq';kbDraw();APP.classList.add('kbon');
  requestAnimationFrame(()=>{if(!KB.el||!el.isConnected)return;const r=el.getBoundingClientRect(),k=KB.el.getBoundingClientRect();if(r.bottom>k.top-8||r.top<60)el.scrollIntoView({block:'center',behavior:'smooth'})})}
function kbClose(){const el=KB.inp;KB.inp=null;if(KB.el)KB.el.remove();KB.el=null;APP.classList.remove('kbon');if(el&&el.value!==KB.v0)el.dispatchEvent(new Event('change',{bubbles:true}))}
function kbDraw(){const L=KBL[KB.mode],ar=KB.mode==='ar';if(!KB.el){KB.el=h('div',{class:'pkb',role:'group','aria-label':'Pixel keyboard'});KB.el.addEventListener('pointerdown',e=>e.preventDefault());KB.el.addEventListener('mousedown',e=>e.preventDefault());APP.append(KB.el)}
  const lab={EMO:'☺',SHIFT:'⇧',BK:'⌫',NUM:'?123',ABC:'ABC',LANG:KB.lang==='en'?'ع':'EN',SPACE:KB.lang==='ar'&&KB.mode!=='num'?'مسافة':'SPACE',DONE:'DONE',DOT:kbDot()},aria={EMO:'Emojis',SHIFT:'Shift',BK:'Delete',NUM:'Numbers and symbols',ABC:'Letters',LANG:KB.lang==='en'?'Arabic keyboard':'English keyboard',SPACE:'Space',DONE:'Done',DOT:'Decimal point'};
  KB.el.className='pkb'+(KB.mode==='pad'?' pad':'')+(ar?' ar':'')+(KB.mode==='emo'?' emo':'')+' sz-'+(SET.kbSize||'m')+((SET.kbSkin&&SET.kbSkin!=='classic'&&unlocked('kb',SET.kbSkin))?' skin-'+SET.kbSkin:'');
  KB.el.replaceChildren(h('div',{class:'kbbar'},h('button',{type:'button',onpointerdown:e=>{e.preventDefault();kbToPhone()},'aria-label':'Switch to the phone keyboard'},kbIcon(1),'PHONE KEYBOARD')),...L.map(row=>h('div',{class:'kr'},row.map(k=>{const sp=lab[k]!=null,t=sp?lab[k]:(KB.shift?k.toUpperCase():k);
    const gl=kbGlyphFor(k),b=h('button',{type:'button',class:'kk'+(sp?' sp k'+k.toLowerCase():'')+(k==='SHIFT'&&KB.shift?' on':''),'aria-label':aria[k]||t,'data-k':k},gl||t);
    b.addEventListener('pointerdown',e=>{e.preventDefault();kbKey(k);b.classList.add('dn');setTimeout(()=>b.classList.remove('dn'),90);if(k==='BK'){clearInterval(KB.rep);const t0=setTimeout(()=>{KB.rep=setInterval(()=>kbKey('BK'),70)},420);const stop=()=>{clearTimeout(t0);clearInterval(KB.rep);b.removeEventListener('pointerup',stop);b.removeEventListener('pointerleave',stop)};b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop)}});
    return b}))))}
function kbDot(){const el=KB.inp;if(!el)return'.';return el.id==='dob'||(el.placeholder||'').includes('DD/')?'/':'.'}
function kbKey(k){const el=KB.inp;if(!el)return;if(SET.kbHap!==false)haptic('tick');if(SET.kbSound!==false)tone(KB.mode==='pad'?660:740,.02);
  if(k==='EMO'){KB.mode='emo';kbDraw();return}
  if(k==='DONE'){el.blur();kbClose();return}
  if(k==='SHIFT'){KB.shift=!KB.shift;kbDraw();return}
  if(k==='NUM'){KB.mode='num';kbDraw();return}if(k==='ABC'){KB.mode=KB.lang;kbDraw();return}
  if(k==='LANG'){KB.lang=KB.lang==='en'?'ar':'en';if(KB.mode!=='pad')KB.mode=KB.mode==='num'?'num':KB.lang;kbDraw();return}
  const num=el.type==='number';
  if(k==='BK'){if(num)el.value=el.value.slice(0,-1);else{let s=el.selectionStart??el.value.length,e=el.selectionEnd??s;if(s===e&&s>0)s--;el.setRangeText('',s,e,'end')}}
  else{let t=k==='SPACE'?' ':k==='DOT'?kbDot():(KB.shift?k.toUpperCase():k);const ml=+el.getAttribute('maxlength')||0;if(ml&&el.value.length>=ml){buzz(15);return}
    if(num){if(t==='.'&&el.value.includes('.'))return;el.value=el.value+t}else{const s=el.selectionStart??el.value.length,e=el.selectionEnd??s;el.setRangeText(t,s,e,'end')}
    if(KB.shift){KB.shift=false;kbDraw()}}
  el.dispatchEvent(new Event('input',{bubbles:true}))}
document.addEventListener('focusin',e=>{const el=e.target;if(kbWanted(el))kbOpen(el)});
document.addEventListener('focusout',e=>{if(e.target===KB.inp)setTimeout(()=>{if(KB.inp&&document.activeElement!==KB.inp)kbClose()},380)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&KB.inp&&KB.inp.tagName==='INPUT'){KB.inp.blur();kbClose()}});

/* ---- pixel pickers: a searchable list that replaces every dropdown ---- */
function pickList(title,items,cur,onPick,o={}){let q='',m;const list=h('div',{class:'plist',role:'listbox','aria-label':title});
  const inp=o.search?h('input',{id:'plq',type:'search',placeholder:o.ph||'Search by name',autocomplete:'off','aria-label':'Search',oninput:e=>{q=e.target.value.trim().toLowerCase();draw()}}):null;
  const draw=()=>{const f=items.filter(it=>it.head||!q||(it.label+' '+(it.key||'')).toLowerCase().includes(q)).filter((it,i,a)=>!it.head||(a[i+1]&&!a[i+1].head));
    list.replaceChildren(...[...f.slice(0,320).map(it=>it.head?h('span',{class:'label phead'},it.head):h('button',{type:'button',class:'pitem'+(it.id===cur?' on':''),role:'option','aria-selected':String(it.id===cur),onclick:()=>{m.remove();haptic('tick');onPick(it.id)}},
      it.icon?it.icon():null,h('span',{class:'grow'},it.label),it.sub?h('span',{class:'tag s'},it.sub):null)),f.some(x=>!x.head)?null:h('span',{class:'small',style:'padding:10px'},'No match. Try another spelling.')].filter(Boolean))};
  draw();m=modal(h('div',{class:'row spread nowrap'},h('h2',{},title),h('button',{class:'btn ghost',style:'padding:8px 10px',onclick:()=>m.remove(),'aria-label':'Close'},'✕')),inp,list);m.classList.add('pick');
  requestAnimationFrame(()=>{const on=list.querySelector('.on');if(on)on.scrollIntoView({block:'center'})});return m}
function pickField(label,cur,show,open){const b=h('button',{type:'button',class:'pfield',onclick:open,'aria-label':label+': '+show.text},show.icon||null,h('span',{class:'grow'},show.text),h('span',{class:'pfa','aria-hidden':'true'},'▼'));
  return h('div',{class:'field'},h('span',{class:'label'},label),b)}
function countryField(cur,onPick,label='NATIONALITY'){const wrap=h('div');const draw=()=>{wrap.replaceChildren(pickField(label,cur,{icon:flag(cur,2),text:(FL[cur]||FL.XX)[0]},()=>pickList('PICK A COUNTRY',COUNTRY_LIST.map(([c,[n,i3]])=>({id:c,label:n,sub:i3,key:i3+' '+c,icon:()=>flag(c,2)})),cur,c=>{cur=c;onPick(c);draw()},{search:true,ph:'Search countries'})))};draw();return wrap}
function cityItems(cc){const all=Object.keys(CITIES).filter(c=>c!=='Other'),mine=all.filter(c=>CITIES[c][0]===cc).sort(),rest=all.filter(c=>CITIES[c][0]!==cc).sort((a,b)=>a.localeCompare(b));
  const it=c=>({id:c,label:c,sub:(FL[CITIES[c][0]]||FL.XX)[1],key:(FL[CITIES[c][0]]||FL.XX)[0],icon:()=>flag(CITIES[c][0],1)});
  return[...(mine.length?[{head:'IN '+(FL[cc]||FL.XX)[0].toUpperCase()},...mine.map(it)]:[]),{head:'ALL CITIES'},...rest.map(it),{head:'NOT LISTED'},{id:'Other',label:'Other city',icon:()=>flag('XX',1)}]}
function cityField(D,onPick){const wrap=h('div');const draw=()=>{const c=D.city||'Other';wrap.replaceChildren(pickField('WHERE YOU LIVE (GYM MAP + WEATHER)',c,{icon:flag((CITIES[c]||CITIES.Other)[0],2),text:c==='Other'?'Other city':c},
  ()=>pickList('WHERE DO YOU LIVE?',cityItems(D.country),c,v=>{D.city=v;onPick&&onPick(v);draw()},{search:true,ph:'Search cities or countries'})))};draw();return wrap}
/* upgrade any remaining <select> into a pixel picker */
function upgradeSelect(sel){if(sel.dataset.px)return;sel.dataset.px='1';sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');sel.style.display='none';const wrap=sel.parentNode;if(wrap&&wrap.classList.contains('sel'))wrap.classList.add('px');
  const lab=(sel.closest('.field')?.querySelector('.label')?.textContent)||sel.getAttribute('aria-label')||'CHOOSE';
  const txt=h('span',{class:'grow'}),b=h('button',{type:'button',class:'pfield',onclick:()=>{const opts=[...sel.options].map(o=>({id:o.value,label:o.textContent}));pickList(lab.replace(/\(.*\)/,'').trim(),opts,sel.value,v=>{sel.value=v;sync();sel.dispatchEvent(new Event('change',{bubbles:true}))},{search:opts.length>10})}},txt,h('span',{class:'pfa','aria-hidden':'true'},'▼'));
  const sync=()=>{const o=sel.options[sel.selectedIndex];txt.textContent=o?o.textContent:''};sync();sel.after(b)}
new MutationObserver(ms=>{if(KB.inp&&!KB.inp.isConnected)kbClose();for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='SELECT')upgradeSelect(n);else n.querySelectorAll&&n.querySelectorAll('select').forEach(upgradeSelect)})}).observe(APP,{childList:true,subtree:true});

/* ---- frameless avatar facing the camera (welcome screens) ---- */
function frontFig(A,getP,getC,o={}){const[c,g]=mk(52,52);c.className='ffig';c.setAttribute('role','img');c.setAttribute('aria-label',o.label||'Your character');const t0=performance.now(),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loop=now=>{if(!c.isConnected)return;const t=still?0:now-t0,dur=A.dur||2000,ph=(1-Math.cos(2*Math.PI*t/dur))/2;g.clearRect(0,0,52,52);
    const face=o.wink&&Math.floor(t/2400)%3===2?'wink':(Math.floor(t/3100)%4===3&&(t%3100)<160?'blink':null);
    g.drawImage(drawFrontPose(getP(),getC(),lerpAny(A.f[0],A.f[1],ph),A,{mood:o.mood||'great',face}),0,0);if(!still)requestAnimationFrame(loop)};requestAnimationFrame(loop);return c}

function swipeMain(el,go){let x0=null,y0=0;el.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY});el.addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){haptic('tick');go(dx<0?1:-1)}});
  el.addEventListener('pointercancel',()=>{x0=null});el.style.touchAction='pan-y';return el}
/* ---- jobs + weekend (shape the home scenes) ---- */
const JOBS=[['office','OFFICE / DESK'],['student','STUDENT'],['remote','WORK FROM HOME'],['shop','SHOP / SERVICE'],['health','HEALTHCARE'],['field','DRIVER / OUTDOORS'],['none','NOT WORKING NOW']];
const FRISAT=['SA','KW','QA','OM','BH','EG','SD','JO','IQ','YE','DZ','LY','SY','PS','BD','MV'];
function defWeekend(cc){return cc==='IR'||cc==='AF'?[4]:FRISAT.includes(cc)?[4,5]:[5,6]}
function dayOf(){const D={...DAYDEF,...(P&&P.day||{})};if(!D.job)D.job=D.work===false?'none':'office';if(!D.wk)D.wk=defWeekend(P&&P.country);return D}
function isWeekendToday(){return dayOf().wk.includes(todayIdx())}

/* ---- coins ---- */
function coinIcon(s=2){const[c,g]=mk(9,9);disc(g,'#c98a12',4,4,4);disc(g,'#f2b84b',4,4,3);R(g,'#ffe08a',3,2,1,4);R(g,'#c98a12',5,3,1,3);R(g,'#fff6c8',2,2,1,1);outline(c);return show(c,s)}
function updCoinTop(){const el=document.getElementById('coinTop');if(!el)return;if(!P){el.hidden=true;return}el.hidden=false;el.replaceChildren(coinIcon(3),h('span',{},fmtN(ST.coins||0)));el.setAttribute('aria-label',(ST.coins||0)+' coins. Open item shop')}
const fmtN=n=>n>=10000?Math.round(n/1000)+'K':String(n);
function addCoins(n,silent){ST.coins=(ST.coins||0)+n;save();updCoinTop();if(!silent){SFX.coin();toast('+'+n+' COINS')}const el=document.getElementById('coinTop');if(el){el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse')}}

/* ---- owned cosmetics (bought in the shop or found in chests) ---- */
const owns=(k,id)=>(ST.owned||[]).includes(k+':'+id);
function grant(k,id){ST.owned=[...new Set([...(ST.owned||[]),k+':'+id])];save()}
const ITEMNAME=(k,id)=>k==='kb'?(KB_SKINS.find(x=>x[0]===id)||[0,id])[1]+' KEYBOARD':k==='pal'?PALS[id].name:k==='sfx'?id.toUpperCase()+' SOUND PACK':(LABELS[id]||id.toUpperCase());
function lockedItems(){const o=[];for(const[k,m]of Object.entries(UNLOCK))for(const[id,L]of Object.entries(m))if(!unlocked(k,id))o.push([k,id,L]);return o}

/* ---- decorations for the home room ---- */
const DECOR={rug:['PIXEL RUG',120],lamp:['FLOOR LAMP',150],rack:['DUMBBELL RACK',220],trophy:['TROPHY SHELF',260],cat:['GYM CAT',400],neon:['NEON SIGN',320]};
function drawDecor(g,id,night){
  if(id==='rug'){R(g,OL,30,48,40,5);R(g,tok('a2'),31,49,38,3);for(let x=33;x<68;x+=4)R(g,tok('a1'),x,50,2,1)}
  if(id==='lamp'){R(g,OL,88,18,7,5);R(g,'#f2b84b',89,19,5,3);R(g,OL,91,23,1,17);R(g,OL,89,40,5,2);if(night){g.fillStyle='rgba(255,224,138,.18)';g.fillRect(80,22,16,20)}}
  if(id==='rack'){R(g,OL,62,30,14,12);R(g,'#5b4a63',63,31,12,10);[[64,33],[69,33],[64,38],[69,38]].forEach(([x,y])=>{R(g,OL,x,y,5,2);R(g,'#9aa3b5',x+1,y,3,1)})}
  if(id==='trophy'){R(g,OL,24,8,14,2);R(g,'#8d6e63',24,9,14,1);R(g,'#f2b84b',26,4,3,4);R(g,'#c98a12',27,8,1,1);R(g,'#c0c7d6',31,5,2,3);R(g,'#c97a3a',35,5,2,3)}
  if(id==='cat'){const x=8,y=44;R(g,OL,x,y,8,5);R(g,'#f29f4b',x+1,y+1,6,3);R(g,OL,x+6,y-2,4,4);R(g,'#f29f4b',x+7,y-1,2,2);R(g,OL,x+7,y-3,1,1);R(g,OL,x+9,y-3,1,1);R(g,OL,x-2,y,2,1)}
  if(id==='neon'){R(g,OL,40,3,24,10);R(g,'#1a1433',41,4,22,8);const c=tok('a3');R(g,c,44,5,2,6);R(g,c,46,6,1,4);R(g,c,47,7,10,2);R(g,c,57,6,1,4);R(g,c,58,5,2,6);g.fillStyle='rgba(63,193,176,.18)';g.fillRect(38,2,28,12)}}

/* ---- chests ---- */
const CHESTS={wood:['WOODEN CHEST','#a0662f','#6b3d1f',[20,45]],silver:['SILVER CHEST','#c0c7d6','#6d7380',[50,110]],gold:['GOLDEN CHEST','#f2b84b','#b8680a',[120,260]]};
function itemShop(){let cat='CHESTS';sheet('ITEM SHOP',redraw=>{const coins=ST.coins||0;
  const buy=(price,fn)=>{if((ST.coins||0)<price){toast('NOT ENOUGH COINS');buzz(40);return}ST.coins-=price;save();updCoinTop();SFX.coin();haptic('success');fn();redraw()};
  const row=(icon,name,sub,price,fn,own)=>h('div',{class:'item'},icon,h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('span',{},name),sub?h('span',{class:'small'},sub):null),
    own?h('span',{class:'tag'},own):h('button',{class:'btn alt',style:'padding:8px;display:flex;gap:6px;align-items:center',disabled:coins<price,onclick:fn},coinIcon(2),price));
  const panes={CHESTS:()=>CHEST_KINDS.map(k=>{const[n,,,cr,,price,tier]=CHEST_INFO[k];return row(show(chestCanvas(k,false),2),n,tier+' · '+cr[0]+'–'+cr[1]+' coins'+(k==='vault'?' + a guaranteed item + 300 XP':' + a chance of XP, outfits or decor'),price,()=>buy(price,()=>openChest(k,'BOUGHT IN THE SHOP')))}),
    COINS:()=>[h('p',{class:'note'},'Coins unlock looks, chests and decor only. Nothing you buy makes you rank higher.'),...COIN_PACKS.map(([id,n,price,tag])=>h('button',{class:'item opt',onclick:()=>buyCoins(id)},coinIcon(3),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('span',{},n+' COINS'),tag?h('span',{class:'small'},tag):null),h('span',{class:'tag s'},price)))],
    OUTFITS:()=>{const all=[];for(const[k,m]of Object.entries(UNLOCK))if(k!=='pal'&&k!=='sfx')for(const[id,L]of Object.entries(m))if(k!=='kb')all.push([k,id,L]);
      return all.map(([k,id,L])=>{const ok=unlocked(k,id),p=L*45;return row(rewardIcon([0,k,id]),ITEMNAME(k,id),ok?null:'Unlocks free at level '+L+', or buy it now',p,()=>buy(p,()=>{grant(k,id);toast(ITEMNAME(k,id)+' UNLOCKED')}),ok?'OWNED':null)})},
    DECOR:()=>[h('p',{class:'note'},'Decorations appear in the room on your home screen. Tap OWNED ones to show or hide them.'),
      ...Object.entries(DECOR).map(([id,[n,p]])=>{const own=(ST.deco||[]).includes(id),on=(ST.decoOn||[]).includes(id);return own?h('button',{class:'item opt','aria-pressed':String(on),onclick:()=>{ST.decoOn=on?ST.decoOn.filter(x=>x!==id):[...(ST.decoOn||[]),id];save();redraw()}},px('house',3),h('span',{class:'grow'},n),h('span',{class:'tag'+(on?' s':'')},on?'IN ROOM':'HIDDEN')):
        row(px('house',3),n,'For your home room',p,()=>buy(p,()=>{ST.deco=[...(ST.deco||[]),id];ST.decoOn=[...(ST.decoOn||[]),id];save();toast(n+' ADDED TO YOUR ROOM')}))})],
    THEMES:()=>[...Object.entries(UNLOCK.pal||{}).map(([id,L])=>{const ok=unlocked('pal',id),p=L*45;return row(rewardIcon([0,'pal',id]),PALS[id].name,ok?null:'Color theme · level '+L,p,()=>buy(p,()=>grant('pal',id)),ok?'OWNED':null)}),
      ...Object.entries(UNLOCK.sfx||{}).map(([id,L])=>{const ok=unlocked('sfx',id),p=L*40;return row(px('note',3),ITEMNAME('sfx',id),ok?null:'Sound pack · level '+L,p,()=>buy(p,()=>grant('sfx',id)),ok?'OWNED':null)}),
      ...Object.entries(UNLOCK.kb).map(([id,L])=>{const ok=unlocked('kb',id),p=L*40;return row(kbIcon(3,id),ITEMNAME('kb',id),ok?null:'Keyboard skin · level '+L,p,()=>buy(p,()=>grant('kb',id)),ok?'OWNED':null)})]};
  return[h('div',{class:'box row nowrap',style:'gap:10px'},coinIcon(4),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('span',{class:'num'},coins+' COINS'),h('span',{class:'small'},'Earn coins from every finished workout, chests, leagues and level-ups.'))),
    h('div',{class:'seg'},Object.keys(panes).map(k=>h('button',{'aria-pressed':String(cat===k),onclick:()=>{cat=k;redraw()}},k))),h('div',{class:'list'},...panes[cat]())]})}

/* ---- leagues (Duolingo style): 10 leagues, monthly promotion, weekly knockout at the top ---- */
const LEAGUES=[['WOOD','#8d6e63'],['STONE','#9aa3b5'],['IRON','#6d7380'],['BRONZE','#c97a3a'],['SILVER','#c0c7d6'],['GOLD','#f2b84b'],['PLATINUM','#7fd3c4'],['DIAMOND','#5ab4f5'],['MASTER','#b05cf0'],['LEGEND','#ff5a5a']];
const KO={3:['ROUND OF 30',30,20],2:['SEMI-FINAL',20,10],1:['FINAL',10,3]};
const NAMES_F=['Layla','Aisha','Fatima','Mei','Grace','Sofia','Amara','Nadia','Zara','Emma','Priya','Yara','Chloe','Hana','Lina','Maryam','Ana','Salma','Nour','Mia','Reem','Elif','Huda','Sara','Amina','Ines','Keiko','Zainab','Olivia','Rania'];
const NAMES_M=['Omar','Ravi','Jake','Yusuf','Hassan','Lucas','Kenji','Diego','Ali','Noah','Mateo','Ibrahim','Arjun','Tariq','Ethan','Kwame','Leo','Ivan','Sami','Tomás','Kofi','Daniel','Malik','Chen','Musa','Ahmed','Luca','Hiro','Mohamed','Felix'];
const monthKey=d=>dstr(d).slice(0,7);
let LG={lg:0,mk:monthKey(new Date()),ko:0,kk:'',hist:[],cups:{gold:0,silver:0,bronze:0},best:0,...store.get('league',{})};
const saveLG=()=>store.set('league',LG);
const lgName=i=>LEAGUES[i][0],lgNum=i=>10-i;
function lgBadge(i,s=2,dim){const[c,g]=mk(14,16),col=dim?'#6e6a73':LEAGUES[i][1];R(g,col,1,1,12,8);for(let y=9;y<15;y++){const w=12-(y-8)*2;if(w>0)R(g,col,1+(12-w)/2,y,w,1)}
  R(g,shade(col,.35),2,2,10,1);R(g,shade(col,-.25),2,8,10,1);const n=String(lgNum(i));g.fillStyle=dim?'#3a3a42':'#1a1433';
  const DIG={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111']};
  [...n].forEach((d,k)=>DIG[d].forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')g.fillRect((n.length===1?6:3+k*4)+x-1,3+y,1,1)})));outline(c);return show(c,s)}
const BOTC={};function bots(seed,n,lvl){if(BOTC[seed])return BOTC[seed];const r=rng(seed),out=[];const used=new Set();for(let i=0;i<n;i++){const s=r()<.5?'f':'m',pool=s==='f'?NAMES_F:NAMES_M;let nm;do{nm=pool[Math.floor(r()*pool.length)]+(r()<.25?' '+String.fromCharCode(65+Math.floor(r()*26))+'.':'')}while(used.has(nm));used.add(nm);
  const cc=COUNTRY_LIST[Math.floor(r()*(COUNTRY_LIST.length-1))][0],act=Math.pow(r(),1.6);out.push({name:nm,sex:s,country:cc,height:156+Math.floor(r()*34),weight:52+Math.floor(r()*40),fin:Math.round((260+lvl*170)*(.08+act*2.3)),pace:.75+r()*.5,char:randCharR(r,s),_r:r})}return BOTC[seed]=out}
function periodFrac(kind){const now=new Date();if(kind==='m'){const a=new Date(now.getFullYear(),now.getMonth(),1),b=new Date(now.getFullYear(),now.getMonth()+1,1);return(now-a)/(b-a)}
  const a=new Date(weekKey(now)+'T00:00');return(now-a)/(7*864e5)}
function myXP(from,to){return ST.log.filter(l=>l.done&&l.d>=from&&l.d<to).reduce((a,l)=>a+l.xp,0)}
function monthRange(mk){const[y,m]=mk.split('-').map(Number);return[mk+'-01',dstr(new Date(y,m,1))]}
function weekRange(wk){const d=new Date(wk+'T12:00');d.setDate(d.getDate()+7);return[wk,dstr(d)]}
function standings(final){const ko=LG.ko,seed=ko?'ko'+ko+LG.kk:'lg'+LG.lg+LG.mk,n=ko?KO[ko][1]-1:29,lvl=ko?11+(3-ko):LG.lg,fr=final?1:Math.min(1,periodFrac(ko?'w':'m')),B=bots(seed,n,lvl);
  const mine=ko?myXP(...weekRange(LG.kk)):myXP(...monthRange(LG.mk));
  const rows=B.map(b=>({u:b,pts:Math.round(b.fin*Math.min(1,Math.pow(fr,b.pace)))})).concat([{u:P,me:true,pts:mine}]).sort((a,b)=>b.pts-a.pts||(a.me?-1:b.me?1:0));return rows}
let lgQueue=[];
function checkLeague(force){const mkNow=monthKey(new Date()),wkNow=weekKey(new Date());let changed=false;
  if(LG.ko&&(LG.kk!==wkNow||force)){const rows=standings(!force),rank=rows.findIndex(r=>r.me)+1,[nm,,cut]=KO[LG.ko],my=rows[rank-1].pts;
    if(LG.ko===1){const cup=rank===1?'gold':rank===2?'silver':rank===3?'bronze':null;LG.lastCup=cup;if(cup&&my>0){LG.cups[cup]++;lgQueue.push(['cup',cup,rank])}else lgQueue.push(['koout',nm,rank]);LG.ko=0;LG.lg=9;LG.mk=mkNow}
    else if(rank<=cut&&my>0){LG.ko--;LG.kk=wkNow;lgQueue.push(['koup',KO[LG.ko][0],rank])}
    else{lgQueue.push(['koout',nm,rank]);LG.ko=0;LG.lg=9;LG.mk=mkNow}changed=true}
  else if(!LG.ko&&(LG.mk!==mkNow||force)){const rows=standings(!force),rank=rows.findIndex(r=>r.me)+1,my=rows[rank-1].pts,old=LG.lg;
    if(rank<=20&&my>0){if(LG.lg===9){LG.ko=3;LG.kk=wkNow;lgQueue.push(['ko',null,rank])}else{LG.lg++;lgQueue.push(['up',LG.lg,rank])}}
    else if(rank>25&&LG.lg>0){LG.lg--;lgQueue.push(['down',LG.lg,rank])}else lgQueue.push(['stay',LG.lg,rank]);
    LG.hist=[[LG.mk,old,rank],...LG.hist].slice(0,24);LG.mk=mkNow;changed=true}
  LG.best=Math.max(LG.best,LG.lg);if(changed){saveLG();setTimeout(showLeagueNews,force?100:1600)}}
function showLeagueNews(){const n=lgQueue.shift();if(!n)return;const next=()=>setTimeout(showLeagueNews,300);let m;const[t,a,rank]=n;
  const body={up:()=>[lgBadge(a,5),h('span',{class:'label'},'PROMOTED · YOU FINISHED #'+rank),h('h2',{},'WELCOME TO '+lgName(a)+' LEAGUE'),h('span',{class:'small'},'League '+lgNum(a)+'. A golden chest is waiting for you.')],
    down:()=>[lgBadge(a,5),h('span',{class:'label'},'YOU FINISHED #'+rank),h('h2',{},'BACK TO '+lgName(a)+' LEAGUE'),h('span',{class:'small'},'Finish in the top 20 this month to climb again.')],
    stay:()=>[lgBadge(a,5),h('span',{class:'label'},'YOU FINISHED #'+rank),h('h2',{},'YOU STAY IN '+lgName(a)),h('span',{class:'small'},'Top 20 move up at the end of the month.')],
    ko:()=>[px('crown',6),h('span',{class:'label'},'TOP OF LEAGUE 1 · #'+rank),h('h2',{},'YOU MADE THE KNOCKOUT!'),h('span',{class:'small'},'3 weekly rounds: 30 players, then 20, then a final of 10. Each week the top players go through.')],
    koup:()=>[px('crown',6),h('span',{class:'label'},'YOU FINISHED #'+rank),h('h2',{},'ON TO THE '+a+'!'),h('span',{class:'small'},'A new round starts this week.')],
    koout:()=>[lgBadge(9,5),h('span',{class:'label'},a+' · #'+rank),h('h2',{},'GREAT RUN!'),h('span',{class:'small'},'You return to League 1 · LEGEND. Make the top 20 this month to try again.')],
    cup:()=>[cupIcon(a,6),h('span',{class:'label'},'KNOCKOUT FINAL · #'+rank),h('h2',{},rank===1?'CHAMPION!':'ON THE PODIUM!'),h('span',{class:'small'},'Your trophy is on your profile. You return to League 1.')]}[t]();
  const chest=t==='up'?'crate':t==='cup'?(a==='gold'?'vault':'crate'):t==='koup'||t==='ko'?'locker':null;
  m=modal(h('div',{class:'lvlup'},...body,h('button',{class:'btn wide',onclick:()=>{m.remove();if(chest)openChest(chest,'LEAGUE REWARD',next);else next()}},chest?'OPEN REWARD':'OK')));m.classList.add('center');SFX.lvl()}
function cupIcon(kind,s=3){const[c,g]=mk(12,12),col={gold:'#f2b84b',silver:'#c0c7d6',bronze:'#c97a3a'}[kind];R(g,col,2,1,8,5);R(g,col,3,6,6,1);R(g,col,5,7,2,2);R(g,col,3,9,6,2);R(g,col,0,2,2,1);R(g,col,10,2,2,1);R(g,col,0,2,1,3);R(g,col,11,2,1,3);R(g,shade(col,.4),3,2,1,3);outline(c);return show(c,s)}
function timeLeft(kind){const now=new Date(),end=kind==='m'?new Date(now.getFullYear(),now.getMonth()+1,1):new Date(new Date(weekKey(now)+'T00:00').getTime()+7*864e5),ms=end-now,d=Math.floor(ms/864e5),hh=Math.floor(ms/36e5)%24;return d>0?d+' DAYS LEFT':hh+' HOURS LEFT'}
function lbRow(r,i,extra){return h('div',{class:'lb-row'+(r.me?' me':'')},h('span',{class:'num',style:'font-size:10px;min-width:22px'},i+1),headIcon(r.u,r.u.char,2),
  h('div',{class:'flagline',style:'min-width:0'},h('span',{style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'},r.me?(P.name||'You'):r.u.name),flag(r.u.country,1)),extra||null,h('span',{class:'tag s'},r.pts+' XP'))}
function leagueView(){checkLeague();const ko=LG.ko,rows=standings(false),me=rows.findIndex(r=>r.me)+1;
  const head=ko?h('div',{class:'box lghead'},px('crown',4),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:5px'},h('span',{class:'label'},'KNOCKOUT · '+KO[ko][0]),h('h2',{},'TOP '+KO[ko][2]+(ko===1?' WIN TROPHIES':' GO THROUGH')),h('span',{class:'small'},'You are #'+me+' · '+timeLeft('w'))),h('span',{class:'tag s'},timeLeft('w').split(' ')[0]+(timeLeft('w').includes('DAYS')?'D':'H')))
    :h('div',{class:'box lghead'},lgBadge(LG.lg,3),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:5px'},h('span',{class:'label'},'LEAGUE '+lgNum(LG.lg)+' OF 10'),h('h2',{},lgName(LG.lg)+' LEAGUE'),h('span',{class:'small'},'You are #'+me+' this month · '+timeLeft('m'))));
  const ladder=h('div',{class:'ladder','aria-label':'All leagues'},LEAGUES.map((_,i)=>h('span',{class:'lstep'+(i===LG.lg&&!ko?' on':''),title:'League '+lgNum(i)+' · '+lgName(i)},lgBadge(i,2,i>LG.best&&i!==LG.lg))),h('span',{class:'lstep'+(ko?' on':''),title:'Knockout'},px('crown',2)));
  const cut=ko?KO[ko][2]:20,list=[];rows.forEach((r,i)=>{if(i===cut)list.push(h('div',{class:'zone up'},ko?'▲ TOP '+cut+(ko===1?' WIN A TROPHY':' GO THROUGH'):(LG.lg===9?'▲ TOP 20 ENTER THE KNOCKOUT':'▲ TOP 20 MOVE UP')));if(!ko&&i===25&&LG.lg>0)list.push(h('div',{class:'zone dn'},'▼ BOTTOM 5 MOVE DOWN'));list.push(lbRow(r,i))});
  const cups=LG.cups.gold+LG.cups.silver+LG.cups.bronze;
  return[head,ladder,cups?h('div',{class:'row',style:'gap:8px'},h('span',{class:'label'},'YOUR TROPHIES'),...['gold','silver','bronze'].flatMap(k=>Array.from({length:LG.cups[k]},()=>cupIcon(k,2)))):null,
    h('div',{class:'list'},list),
    h('div',{class:'box'},h('span',{class:'label'},'HOW LEAGUES WORK'),h('p',{},'Your total XP and level never reset. The league only counts XP you earn this month, in a group of 30 players. At the end of each month the top 20 move up a league and the bottom 5 move down.'),
      h('p',{},'Reach League 1 · LEGEND and finish in its top 20 to enter the knockout: 3 weekly rounds of 30, 20 and 10 players. The top 3 of the final win trophies, then everyone returns to League 1.'))]}
const GLOBAL=(()=>{let G=null;return()=>G||(G=bots('global',40,6).map((b,i)=>({...b,all:Math.round(800+Math.pow(b._r(),1.3)*16000),wk:()=>Math.round(40+b.fin*.28*Math.min(1,Math.pow(periodFrac('w'),b.pace)))}))).concat(DEMO_USERS.map((d,i)=>{const u=demoUser(i);return{...u,all:d[3],wk:()=>Math.round(d[3]/11*Math.min(1,periodFrac('w')+.15))}}))})();
function hallOfFame(){const G=GLOBAL(),myA=ST.xp,wk=weekKey(new Date()),myW=myXP(...weekRange(wk));
  const all=G.map(u=>({u,pts:u.all})).concat([{u:P,me:true,pts:myA}]).sort((a,b)=>b.pts-a.pts),week=G.map(u=>({u,pts:u.wk()})).concat([{u:P,me:true,pts:myW}]).sort((a,b)=>b.pts-a.pts);
  const lastWk=dstr(new Date(new Date(wk+'T12:00').getTime()-7*864e5)),lastTop=G.map(u=>({u,pts:Math.round(u.fin*.28)+Math.floor(rng('lw'+lastWk+u.name)()*60)})).sort((a,b)=>b.pts-a.pts).slice(0,3);
  const card=(lab,r,sub)=>h('div',{class:'box hof'},h('span',{class:'label'},lab),h('div',{class:'row nowrap',style:'gap:10px'},headIcon(r.u,r.u.char,3),h('div',{class:'grow',style:'min-width:0;display:flex;flex-direction:column;gap:4px'},
    h('div',{class:'flagline'},h('span',{style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'},r.me?(P.name||'You'):r.u.name),flag(r.u.country,1)),h('span',{class:'tag s',style:'align-self:flex-start'},r.pts+' XP'+(sub?' · '+sub:''))),px('crown',3)));
  const podium=h('div',{class:'podium'},[1,0,2].map(i=>{const r=week[i];return r?h('div',{class:'pod p'+(i+1)+(r.me?' me':'')},headIcon(r.u,r.u.char,2),h('span',{class:'small',style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%'},r.me?(P.name||'You'):r.u.name),h('div',{class:'step'},h('span',{class:'num'},i+1),h('span',{class:'small'},r.pts+' XP'))):null}));
  return{all,week,cards:[card('ALL-TIME BEST PLAYER',all[0]),h('div',{class:'box hof'},h('span',{class:'label'},'LAST WEEK\'S TOP 3 · WEEK OF '+new Date(lastWk+'T12:00').toLocaleDateString('en',{day:'numeric',month:'short'}).toUpperCase()),...lastTop.map((r,i)=>h('div',{class:'row nowrap',style:'gap:10px'},medalIcon(i,3),headIcon(r.u,r.u.char,2),h('div',{class:'flagline grow',style:'min-width:0'},h('span',{style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'},r.u.name),flag(r.u.country,1)),h('span',{class:'tag s'},r.pts+' XP')))),h('span',{class:'label'},'THIS WEEK\'S BEST · RESETS MONDAY'),podium]}}
function boardView(){const tabs=[['league','LEAGUE'],['week','WEEK'],['all','ALL TIME']];if(!tabs.some(t=>t[0]===lbTab))lbTab='league';
  const top=h('div',{class:'seg'},tabs.map(([v,t])=>h('button',{'aria-pressed':String(v===lbTab),onclick:()=>{lbTab=v;render(true)}},t)));
  if(lbTab==='league')return[top,...leagueView(),h('p',{class:'note'},'Other players are demo data until the online version is live.')];
  const F=hallOfFame(),rows=lbTab==='week'?F.week:F.all;
  return[top,...(lbTab==='week'?F.cards.slice(1):F.cards.slice(0,1)),h('div',{class:'box'},h('span',{class:'label'},lbTab==='week'?'WEEKLY RANKING':'ALL-TIME RANKING'),h('p',{class:'small'},lbTab==='week'?'Weekly XP resets every Monday. Your total XP and level stay.':'Total XP earned since you started. This never resets.')),
    h('div',{class:'list'},rows.slice(0,30).map((r,i)=>lbRow(r,i,i<3?medalIcon(i,2):null))),rows.findIndex(r=>r.me)>=30?h('div',{class:'list'},lbRow(rows.find(r=>r.me),rows.findIndex(r=>r.me))):null,h('p',{class:'note'},'Other players are demo data until the online version is live.')]}

/* ---- event themes ---- */
const ISLAMIC={ramadan:[['2026-02-18','2026-03-19'],['2027-02-08','2027-03-09'],['2028-01-28','2028-02-25'],['2029-01-16','2029-02-13'],['2030-01-06','2030-02-04'],['2030-12-26','2031-01-24']],
  fitr:[['2026-03-20','2026-03-22'],['2027-03-10','2027-03-12'],['2028-02-26','2028-02-28'],['2029-02-14','2029-02-16'],['2030-02-05','2030-02-07'],['2031-01-25','2031-01-27']],
  adha:[['2026-05-26','2026-05-29'],['2027-05-15','2027-05-18'],['2028-05-04','2028-05-07'],['2029-04-23','2029-04-26'],['2030-04-12','2030-04-15']],
  diwali:[['2026-11-07','2026-11-09'],['2027-10-28','2027-10-30'],['2028-10-16','2028-10-18'],['2029-11-04','2029-11-06'],['2030-10-25','2030-10-27']],
  lunar:[['2027-02-05','2027-02-08'],['2028-01-25','2028-01-28'],['2029-02-12','2029-02-15'],['2030-02-02','2030-02-05']]};
const NATDAY={AE:'12-02',SA:'09-23',QA:'12-18',KW:'02-25',BH:'12-16',OM:'11-20',JO:'05-25',EG:'07-23',IN:'08-15',PK:'08-14',PH:'06-12',US:'07-04',TR:'10-29',MA:'11-18',FR:'07-14',DE:'10-03',NG:'10-01',KE:'12-12',CN:'10-01',LB:'11-22',IQ:'10-03',YE:'05-22',BD:'03-26',LK:'02-04',ID:'08-17',MY:'08-31',MX:'09-16',BR:'09-07',CA:'07-01',AU:'01-26',SD:'01-01',KR:'08-15',JP:'02-11',IT:'06-02',ES:'10-12',GB:'04-23'};
const EVENTS={
  newyear:{n:'NEW YEAR',msg:'Happy New Year! New year, new PRs.',fx:'fire',a:['#ffd54a','#ff5ac8','#5ae0ff'],dk:'#0d0b2a',when:d=>{const md=d.slice(5);return md>='12-30'||md<='01-02'}},
  halloween:{n:'HALLOWEEN',msg:'Happy Halloween! Lift something scary today.',fx:'bats',a:['#ff8c1a','#b05cf0','#7fe36a'],dk:'#160d1f',when:d=>{const md=d.slice(5);return md>='10-25'&&md<='10-31'}},
  ramadan:{n:'RAMADAN',msg:'Ramadan Kareem! Train light after iftar and drink plenty of water before suhoor.',fx:'lanterns',a:['#f2c14b','#3fc1a0','#e8e2c8'],dk:'#0b1d1a',when:d=>ISLAMIC.ramadan.some(([a,b])=>d>=a&&d<=b)},
  fitr:{n:'EID AL-FITR',msg:'Eid Mubarak! Enjoy the sweets, then get back to it.',fx:'stars',a:['#f2c14b','#5ae0c0','#ff9fb0'],dk:'#0f1a24',when:d=>ISLAMIC.fitr.some(([a,b])=>d>=a&&d<=b)},
  adha:{n:'EID AL-ADHA',msg:'Eid Mubarak! Lots of protein on the table this week.',fx:'stars',a:['#f2c14b','#5ae0c0','#ff9fb0'],dk:'#0f1a24',when:d=>ISLAMIC.adha.some(([a,b])=>d>=a&&d<=b)},
  diwali:{n:'DIWALI',msg:'Happy Diwali! Light up your training.',fx:'fire',a:['#ffb300','#ff5a5a','#c86bff'],dk:'#1a0f08',when:d=>ISLAMIC.diwali.some(([a,b])=>d>=a&&d<=b)},
  lunar:{n:'LUNAR NEW YEAR',msg:'Happy Lunar New Year! Wishing you a strong year.',fx:'lanterns',a:['#ffcc33','#ff4040','#ff9a3c'],dk:'#1f0808',when:d=>ISLAMIC.lunar.some(([a,b])=>d>=a&&d<=b)},
  xmas:{n:'CHRISTMAS',msg:'Merry Christmas! Snowy cardio counts double. Not really.',fx:'snow',a:['#ff4d4d','#4ccf6a','#ffffff'],dk:'#0b1622',when:d=>{const md=d.slice(5);return md>='12-20'&&md<='12-26'}},
  national:{n:'NATIONAL DAY',msg:'Happy National Day!',fx:'confetti',a:null,dk:null,when:d=>{const cc=P&&P.country,md=NATDAY[cc];return!!md&&d.slice(5)===md}}};
function eventPal(t,mode){const id=activeEvent();if(!id)return t;const E=EVENTS[id];let a=E.a,dk=E.dk;
  if(id==='national'){const cols=flagCols(EVENTS.national.cc()).filter(c=>lum(c)>.12&&lum(c)<.95);a=[cols[0]||'#f2b84b',cols[1]||cols[0]||'#ff6b57',cols[2]||'#3fc1b0']}
  const o={...t,a1:a[0],a2:a[1],a3:a[2]};if(mode==='dark'&&dk){o.bg=mix(t.bg,dk,.7);o.panel=mix(t.panel,dk,.45);o.outer=mix(t.outer,dk,.8)}
  if(mode==='light'){o.a1=shade(a[0],-.35);o.a2=shade(a[1],-.25);o.a3=shade(a[2],-.35)}return o}
function eventIcon(id,s=3){const[c,g]=mk(12,12);
  if(id==='halloween'){R(g,'#2e7d32',5,0,2,2);disc(g,'#ff8c1a',6,7,4.5);R(g,'#c25e00',4,4,1,7);R(g,'#c25e00',7,4,1,7);R(g,'#1a1433',3,6,2,1);R(g,'#1a1433',7,6,2,1);R(g,'#1a1433',4,9,4,1)}
  else if(id==='ramadan'||id==='lunar'){const col=id==='lunar'?'#ff4040':'#f2c14b';R(g,'#6d4f45',5,0,2,2);R(g,col,3,2,6,8);R(g,shade(col,.4),4,3,1,6);R(g,'#ffe9a8',6,4,1,4);R(g,'#6d4f45',4,10,4,2)}
  else if(id==='fitr'||id==='adha'){disc(g,'#f2c14b',5,6,4.5);disc(g,'rgba(0,0,0,0)',7,5,3.5);g.clearRect(5,2,5,7);disc(g,'#f2c14b',4,6,3);R(g,'#ffffff',9,3,1,1)}
  else if(id==='xmas'){R(g,'#ffd54a',5,0,2,1);for(let y=1;y<10;y++){const w=Math.min(11,1+Math.floor(y*1.2)*1);R(g,'#2e9e4f',6-w/2|0,y,w|0,1)}R(g,'#8d6e63',5,10,2,2);R(g,'#ff4d4d',4,5,1,1);R(g,'#5ae0ff',7,7,1,1)}
  else if(id==='diwali'){R(g,'#ffb300',5,1,2,4);R(g,'#ff5a5a',5,3,2,2);R(g,'#c97a3a',1,7,10,2);R(g,'#a0662f',2,9,8,2)}
  else if(id==='national'){g.drawImage(flag(EVENTS.national.cc(),1),0,0,12,9)}
  else{[[6,0],[6,11],[0,6],[11,6],[2,2],[9,2],[2,9],[9,9]].forEach(([x,y])=>R(g,'#ffd54a',x,y,1,1));disc(g,'#ff5ac8',6,6,2.5)}
  if(id!=='national')outline(c);return show(c,s)}
let evRaf=0;
function eventFX(){const id=activeEvent(),old=APP.querySelector('.evfx');if(old)old.remove();cancelAnimationFrame(evRaf);if(!id||matchMedia('(prefers-reduced-motion: reduce)').matches||SET.evFx===false)return;
  const E=EVENTS[id],W=120,H=200,[c,g]=mk(W,H);c.className='evfx';c.setAttribute('aria-hidden','true');APP.append(c);const cols=id==='national'?flagCols(EVENTS.national.cc()):[...E.a,'#ffffff'];
  const N={snow:28,bats:5,lanterns:5,stars:14,fire:3,confetti:24}[E.fx]||12,ps=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,v:.15+Math.random()*.35,p:Math.random()*6,c:cols[Math.floor(Math.random()*cols.length)],t:0}));
  const loop=()=>{if(!c.isConnected)return;g.clearRect(0,0,W,H);ps.forEach(p=>{p.p+=.04;
    if(E.fx==='snow'){p.y+=p.v;p.x+=Math.sin(p.p)*.2;R(g,'#ffffff',p.x,p.y,1,1)}
    else if(E.fx==='confetti'){p.y+=p.v*1.4;p.x+=Math.sin(p.p)*.3;R(g,p.c,p.x,p.y,Math.sin(p.p*2)>0?2:1,1)}
    else if(E.fx==='stars'){p.y+=p.v*.3;const on=Math.sin(p.p*1.5)>.2;if(on){R(g,p.c,p.x,p.y,1,1);if(Math.sin(p.p*1.5)>.8){R(g,p.c,p.x-1,p.y,3,1);R(g,p.c,p.x,p.y-1,1,3)}}}
    else if(E.fx==='bats'){p.x+=p.v*1.2;p.y+=Math.sin(p.p)*.3;const f=Math.sin(p.p*6)>0;R(g,'#1a1028',p.x,p.y,2,1);R(g,'#1a1028',p.x-2,p.y-(f?1:-1),2,1);R(g,'#1a1028',p.x+2,p.y-(f?1:-1),2,1)}
    else if(E.fx==='lanterns'){p.y-=p.v*.4;p.x+=Math.sin(p.p)*.15;R(g,p.c,p.x,p.y,2,3);R(g,'#ffe9a8',p.x,p.y+1,1,1)}
    else if(E.fx==='fire'){p.t++;if(p.t>90){p.t=0;p.x=10+Math.random()*(W-20);p.y=20+Math.random()*60;p.c=cols[Math.floor(Math.random()*cols.length)]}const r=p.t*.25;if(p.t<40)for(let k=0;k<10;k++){const a=k/10*6.283;R(g,p.c,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r+p.t*.03,1,1)}}
    if(p.y>H+4)p.y=-4;if(p.y<-6)p.y=H+4;if(p.x>W+4)p.x=-4;if(p.x<-4)p.x=W+4});evRaf=requestAnimationFrame(loop)};loop()}

/* ---- first-run tips tour ---- */
const TOUR=[['#xpTop','YOUR LEVEL','Every finished workout fills this XP bar. Tap it to see the level map and the rewards on the way.'],
  ['#coinTop','COINS','You earn coins from workouts, chests and leagues. Tap here to open the item shop.'],
  ['.clockbar .tag','TODAY\'S PLAN','Your workout for today. Tap it to start.'],
  ['.stage.scene','YOUR AVATAR','Your character lives your day: training, working, eating and sleeping. Tap it to change the scene.'],
  ['nav .plus','QUICK ACTIONS','Start a routine or log food from anywhere.'],
  ['nav button:nth-child(2)','TRAIN','Routines, the routine generator, the muscle map and your calendar.'],
  ['nav button:nth-child(3)','FUEL','Plate calculator and nutrition facts for every food.'],
  ['nav button:nth-child(5)','CLUB','Posts, leagues and the weekly leaderboard.'],
  ['nav button:nth-child(6)','GYMS','Gyms in your city with prices and opening hours.'],
  ['nav button:nth-child(7)','ME','Your character, inventory, weight log and daily briefing.'],
  ['#gear','SETTINGS','Change almost everything here. You can replay these tips from Settings any time.']];
function startTour(){if(tab!=='home'){tab='home';render()}let i=0;const ov=h('div',{class:'tour',role:'dialog','aria-label':'App tips'}),hole=h('div',{class:'thole'}),tip=h('div',{class:'box ttip'});ov.append(hole,tip);APP.append(ov);
  const end=()=>{META.tour=true;save();ov.remove()};
  const find=k=>{const el=APP.querySelector(TOUR[k][0]);return el&&!el.hidden&&el.getClientRects().length?el:null};
  const step=(dir=1)=>{let el=null;while(i>=0&&i<TOUR.length&&!(el=find(i)))i+=dir;if(i<0){i=0;step(1);return}
    if(i>=TOUR.length){end();return}const[,t,x]=TOUR[i];el.scrollIntoView({block:'nearest'});const a=APP.getBoundingClientRect(),r=el.getBoundingClientRect();
    Object.assign(hole.style,{left:(r.left-a.left-4)+'px',top:(r.top-a.top-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
    const below=r.top-a.top<a.height/2;tip.style.top=below?(r.bottom-a.top+14)+'px':'';tip.style.bottom=below?'':(a.bottom-r.top+14)+'px';
    tip.replaceChildren(h('div',{class:'row spread nowrap'},h('span',{class:'label'},'TIP '+(i+1)+' / '+TOUR.length),h('button',{class:'btn ghost',style:'padding:6px 8px',onclick:end},'SKIP TIPS')),h('h3',{},t),h('p',{},x),
      h('div',{class:'row nowrap'},i>0?h('button',{class:'btn ghost',onclick:()=>{i--;step(-1)},'aria-label':'Previous tip'},'◀'):null,h('button',{class:'btn grow',onclick:()=>{i++;haptic('tap');step()}},i===TOUR.length-1?'GOT IT!':'NEXT ▶')));
    tip.querySelector('.btn.grow').focus({preventScroll:true})};step()}

/* ---- bug reports + feature ideas ---- */
const SUPPORT_EMAIL='moepixelsapps@gmail.com';
function deviceInfo(){const ua=navigator.userAgent,an=(ua.match(/Android [\d.]+/)||[''])[0],mdl=(ua.match(/Android [\d.]+; ([^;)]+)/)||[,''])[1];
  return['App: IronBit '+VERSION,an?'Phone: '+an+(mdl?' · '+mdl:''):'Platform: '+(navigator.platform||'web'),'Screen: '+screen.width+'×'+screen.height,'Language: '+navigator.language,'Theme: '+curMode()+' · '+SET.pal,'Level: '+lvl()].join('\n')}
function feedbackModal(kind){const bug=kind==='bug';let cat=bug?'CRASH':'TRAINING',info=true,m;
  const cats=bug?['CRASH','LOOKS WRONG','WRONG INFO','OTHER']:['TRAINING','FOOD','CHARACTER','OTHER'],
    ta=h('textarea',{id:'fbt',maxlength:600,rows:5,placeholder:bug?'What happened? What did you tap just before?':'What should IronBit do? How would it help you?'}),
    send=h('button',{class:'btn wide',onclick:()=>{const txt=ta.value.trim();if(txt.length<5){toast('WRITE A FEW WORDS FIRST');return}
      const subj=(bug?'[IronBit bug] ':'[IronBit idea] ')+cat+' · v'+VERSION,body=txt+(info?'\n\n---\n'+deviceInfo():'');
      META.fb=[{k:kind,c:cat,d:today(),t:txt.slice(0,80)},...(META.fb||[])].slice(0,20);save();
      const url='mailto:'+SUPPORT_EMAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);try{window.location.href=url}catch(e){}
      m.remove();modal(h('h2',{},'THANK YOU!'),h('p',{},'Your email app opens with the message ready. Press send there. If nothing opened, write to '+SUPPORT_EMAIL+'.'),h('button',{class:'btn',onclick:e=>e.target.closest('.modal').remove()},'OK'))}},bug?'SEND BUG REPORT':'SEND IDEA');
  const segEl=h('div',{class:'seg'},cats.map(c=>h('button',{'aria-pressed':String(c===cat),onclick:e=>{cat=c;[...segEl.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},c)));
  const tg=h('button',{class:'toggle','aria-pressed':'true','aria-label':'Include phone and app details',onclick:e=>{info=!info;e.currentTarget.setAttribute('aria-pressed',String(info))}});
  m=modal(h('div',{class:'row nowrap'},px(bug?'gear':'bolt',4),h('h2',{},bug?'REPORT A BUG':'SUGGEST A FEATURE')),h('p',{class:'small'},bug?'Tell the developer what went wrong. Screenshots help: you can attach them in your email app.':'Got an idea that would make IronBit better? The best ideas get built.'),
    segEl,h('label',{class:'field',for:'fbt'},h('span',{class:'label'},bug?'WHAT WENT WRONG':'YOUR IDEA'),ta),h('div',{class:'srow'},h('span',{},'Include phone and app details'),tg),
    bug?h('span',{class:'small'},'Details sent: '+deviceInfo().replace(/\n/g,' · ')):null,send,h('button',{class:'btn ghost',onclick:()=>m.remove()},'CANCEL'))}

/* ---- routine generator ---- */
const EXQ={'Bench press':['gym','ph',['sh']],'Overhead press':['gym','pv',['sh','lb']],'Incline DB press':['db','ph',['sh']],'Lateral raise':['db','pv2',[]],'Triceps pushdown':['gym','tri',[]],'Deadlift':['gym','hinge',['lb']],
  'Lat pulldown':['gym','vv',[]],'Barbell row':['gym','hr',['lb']],'Face pull':['gym','rear',[]],'Biceps curl':['db','bi',[]],'Back squat':['gym','sq',['kn','lb']],'Romanian deadlift':['gym','hinge',['lb']],
  'Leg press':['gym','sq',['kn']],'Walking lunge':['db','sq',['kn']],'Calf raise':['none','calf',[]],'Goblet squat':['db','sq',['kn']],'Push-up':['none','ph',['sh']],'Seated row':['gym','hr',[]],
  'Plank':['none','core',[]],'Bodyweight squat':['none','sq',['kn']],'Glute bridge':['none','hinge',[]],'Mountain climber':['none','core',['kn']],'Crunch':['none','core',[]],'Farmer carry':['db','carry',[]],'Russian twist':['none','core',['lb']]};
const SPLITS={full:['sq','ph','hr','hinge','pv','core','vv','calf'],upper:['ph','vv','pv','hr','bi','tri','rear','pv2'],lower:['sq','hinge','sq','calf','core','hinge','core'],push:['ph','pv','ph','pv2','tri','core'],pull:['vv','hr','hinge','rear','bi','carry'],legs:['sq','hinge','sq','calf','core','hinge']};
const FALLBACK={vv:['hr','rear'],hr:['vv','rear'],pv:['pv2','ph'],tri:['ph'],bi:['hr'],rear:['hr'],carry:['core'],calf:['core'],pv2:['pv']};
const FOCUS={chest:['chest'],back:['lats','traps'],shoulders:['shoulders'],arms:['biceps','triceps'],legs:['quads','hamstrings','calves'],glutes:['glutes'],core:['abs','obliques']};
function genPlan(a,seed){const r=rng('gen'+seed+JSON.stringify(a)),avail=n=>{const[eq,,j]=EXQ[n];return(a.equip==='gym'||(a.equip==='db'&&eq!=='gym')||(a.equip==='none'&&eq==='none'))&&!j.some(x=>a.avoid.includes(x))};
  const types=a.days<=3?['full','full','full']:a.days===4?['upper','lower']:['push','pull','legs'],nr=a.days<=3?Math.min(a.days,a.days===2?2:3):types.length,names={full:'FULL BODY',upper:'UPPER',lower:'LOWER',push:'PUSH',pull:'PULL',legs:'LEGS'};
  const per={30:4,45:5,60:6,90:7}[a.mins],sets0={beginner:3,intermediate:3,advanced:4}[a.level];
  const reps=(n,comp)=>{if(n==='Plank')return a.goal==='endurance'||a.goal==='lose'?'45s':'30s';if(n==='Mountain climber')return a.goal==='endurance'?'40s':'30s';if(n==='Farmer carry')return'30s';
    return({strength:comp?'5':'8',muscle:comp?'8':'12',lose:comp?'12':'15',endurance:comp?'15':'20'})[a.goal]};
  const comp=n=>['sq','hinge','ph','pv','hr','vv'].includes(EXQ[n][1]);
  const out=[];for(let i=0;i<nr;i++){const t=types[i],used=new Set(out.length&&types[i]===types[i-1]?[]:[]),ex=[];let slots=[...SPLITS[t]];
    if(t==='full'&&i>0)slots=slots.map((s,k)=>k<4?s:s);
    a.focus.filter(f=>({chest:'full upper push',back:'full upper pull',shoulders:'full upper push',arms:'full upper push pull',legs:'full lower legs',glutes:'full lower legs',core:'full upper lower push pull legs'})[f].split(' ').includes(t)).forEach(f=>{const ids=FOCUS[f]||[],cand=Object.keys(EXQ).filter(n=>avail(n)&&ids.some(id=>MUSCLES[id]&&MUSCLES[id].ex.includes(n)));if(cand.length)slots.splice(2,0,'@'+f)});
    for(const s of slots){if(ex.length>=per)break;let cand;
      if(s[0]==='@'){const ids=FOCUS[s.slice(1)];cand=Object.keys(EXQ).filter(n=>avail(n)&&ids.some(id=>MUSCLES[id].ex.includes(n)))}
      else{cand=Object.keys(EXQ).filter(n=>EXQ[n][1]===s&&avail(n));if(!cand.length)for(const f of FALLBACK[s]||[]){cand=Object.keys(EXQ).filter(n=>EXQ[n][1]===f&&avail(n));if(cand.length)break}}
      cand=(cand||[]).filter(n=>!ex.some(e=>e[0]===n));if(!cand.length)continue;
      const prev=out.flatMap(o=>o.ex.map(e=>e[0])),fresh=cand.filter(n=>!prev.includes(n)),pool=(t==='full'&&fresh.length)?fresh:cand,n=pool[Math.floor(r()*pool.length)];
      ex.push([n,clamp(sets0+(comp(n)&&a.goal==='strength'?1:0)-(a.mins<=30&&!comp(n)?1:0),2,5),reps(n,comp(n))])}
    while(ex.length<Math.min(per,3)){const c=Object.keys(EXQ).filter(n=>avail(n)&&!ex.some(e=>e[0]===n));if(!c.length)break;const n=c[Math.floor(r()*c.length)];ex.push([n,sets0,reps(n,comp(n))])}
    if(a.goal==='lose'&&avail('Mountain climber')&&!ex.some(e=>e[0]==='Mountain climber')&&ex.length<per+1)ex.push(['Mountain climber',3,'30s']);
    out.push({name:(names[t]+(types.filter(x=>x===t).length>1||nr>1&&t==='full'?' '+'ABC'[i]:'')).slice(0,18),ex})}
    const wk=dayOf().wk||[5,6],free=[0,1,2,3,4,5,6].filter(d=>!wk.includes(d)),pool=a.days<=free.length?free:[0,1,2,3,4,5,6],n=a.days;
  const daysSel=n<=1?[pool[0]]:[...new Set(Array.from({length:n},(_,k)=>pool[Math.round(k*(pool.length-1)/(n-1))]))];
  while(daysSel.length<n){const d=pool.find(x=>!daysSel.includes(x))??[0,1,2,3,4,5,6].find(x=>!daysSel.includes(x));daysSel.push(d)}daysSel.sort((x,y)=>x-y);
  out.forEach(o=>o.days=[]);daysSel.forEach((d,k)=>out[k%out.length].days.push(d));return out}
function generatorWizard(){const G=P.goal,a={goal:G.type==='fit'?'endurance':G.type,level:G.level,equip:G.equip,days:G.days,mins:G.mins,focus:[],avoid:[]};let q=0,seed=1,plan=null;const ov=h('div',{class:'overlay'});APP.append(ov);
  const Q=[['goal','WHAT DO YOU WANT MOST?',[['muscle','BUILD MUSCLE','Bigger, fuller muscles'],['strength','GET STRONGER','Lift heavier'],['lose','LOSE FAT','Burn fat, keep muscle'],['endurance','FITNESS & ENDURANCE','Move better, last longer']]],
    ['level','HOW MUCH HAVE YOU TRAINED?',[['beginner','I\'M NEW','Less than 6 months'],['intermediate','SOME','6 months to 2 years'],['advanced','A LOT','More than 2 years']]],
    ['equip','WHERE WILL YOU TRAIN?',[['gym','FULL GYM','Barbells, machines, cables'],['db','DUMBBELLS','Home or hotel gym'],['none','NO EQUIPMENT','Bodyweight only']]],
    ['days','HOW MANY DAYS A WEEK?',[[2,'2 DAYS','Busy weeks'],[3,'3 DAYS','Best for most people'],[4,'4 DAYS','Upper / lower split'],[5,'5 DAYS','Push / pull / legs'],[6,'6 DAYS','For experienced lifters']]],
    ['mins','HOW LONG PER SESSION?',[[30,'30 MIN','4 moves'],[45,'45 MIN','5 moves'],[60,'60 MIN','6 moves'],[90,'90 MIN','7 moves']]],
    ['focus','ANY MUSCLES TO FOCUS ON?',[['chest','CHEST'],['back','BACK'],['shoulders','SHOULDERS'],['arms','ARMS'],['legs','LEGS'],['glutes','GLUTES'],['core','CORE']],true],
    ['avoid','ANYTHING THAT HURTS?',[['kn','KNEES','No squats or lunges'],['lb','LOWER BACK','No heavy hinges or barbell squats'],['sh','SHOULDERS','No overhead or heavy pressing']],true]];
  const close=()=>{ov.remove();render()};
  const draw=()=>{const last=q===Q.length;if(last&&!plan)plan=genPlan(a,seed);
    const head=h('header',{},h('button',{class:'btn ghost',style:'padding:8px 10px',onclick:()=>{if(q===0)close();else{q--;plan=null;draw()}},'aria-label':q===0?'Close':'Back'},q===0?'✕':'◀'),h('span',{class:'logo grow',style:'font-size:10px'},'ROUTINE GENERATOR'),h('span',{class:'chip'},last?'DONE':(q+1)+'/'+Q.length));
    if(!last){const[key,title,opts,multi]=Q[q];
      ov.replaceChildren(head,h('main',{class:'anim'},h('div',{class:'dots'},Q.map((_,i)=>h('i',{class:i===q?'on':''}))),h('h2',{},title),multi?h('span',{class:'small'},'Pick any, or none. You can skip this question.'):null,
        h('div',{class:'list'},opts.map(([v,t,d])=>{const on=multi?a[key].includes(v):a[key]===v;return h('button',{class:'opt','aria-pressed':String(on),onclick:()=>{if(multi)a[key]=on?a[key].filter(x=>x!==v):[...a[key],v];else a[key]=v;haptic('tick');if(!multi){q++;plan=null}draw()}},h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('h3',{},t),d?h('span',{class:'small'},d):null),on?px('star',2):null)}))),
        h('div',{style:'padding:12px 14px;display:flex;gap:10px;background:var(--panel);border-top:4px solid var(--line)'},h('button',{class:'btn grow',onclick:()=>{q++;plan=null;draw()}},multi?(a[key].length?'NEXT ▶':'SKIP ▶'):'NEXT ▶')));return}
    const total=plan.reduce((s,o)=>s+o.ex.length,0);
    ov.replaceChildren(head,h('main',{class:'anim'},h('h2',{},'YOUR NEW PLAN'),h('span',{class:'small'},`${a.days} days a week · ${a.mins} min · ${GOALS[a.goal==='endurance'?'endurance':a.goal][0].toLowerCase()}`+(a.avoid.length?' · avoiding '+a.avoid.map(x=>({kn:'knee',lb:'lower-back',sh:'shoulder'})[x]).join(', ')+' strain':'')),
      h('div',{class:'week'},DAYS.map((dn,i)=>{const o=plan.find(p=>p.days.includes(i));return h('div',{class:o?'on':''},dn.slice(0,2),o?px('dumb',2):h('span',{},'·'),o?o.name.split(' ').pop().slice(0,5):'REST')})),
      ...plan.map(o=>h('div',{class:'box'},h('div',{class:'row spread'},h('h3',{},o.name),h('span',{class:'tag s'},o.days.map(d=>DAYS[d]).join(' '))),...o.ex.map((e,i)=>h('button',{class:'item',onclick:()=>exPreview(e[0])},h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:3px'},h('span',{},(i+1)+'. '+e[0]),h('span',{class:'small'},EX[e[0]][1])),h('span',{class:'tag'},e[1]+' × '+e[2]))))),
      h('p',{class:'note'},'Tap an exercise to watch it. Saving replaces routines made by the generator before; your own routines stay.')),
      h('div',{style:'padding:12px 14px;display:flex;gap:10px;background:var(--panel);border-top:4px solid var(--line)'},h('button',{class:'btn ghost',onclick:()=>{seed++;plan=null;draw();haptic('tick')}},'NEW MIX'),h('button',{class:'btn grow',onclick:()=>{
        const mine=(P.custom||[]).filter(r=>!r.gen);if(mine.length+plan.length>3&&!SET.pro){proModal('The free version holds 3 custom routines. Delete one of yours or go Pro to keep this plan.');return}
        P.custom=[...mine,...plan.map((o,i)=>({id:'g'+Date.now()+i,name:o.name,ex:o.ex,days:o.days,custom:true,gen:true}))];Object.assign(P.goal,{days:a.days,mins:a.mins,equip:a.equip,level:a.level});save();ov.remove();trainView='main';render();SFX.done();toast('PLAN SAVED · '+total+' MOVES');haptic('success')}},'SAVE THIS PLAN ▶')))};
  draw()}


/* ---- recipes: name|style|minutes|kcal|protein|carbs|fat|serves|icon|ingredients;...|steps;... (macros per serving, estimates) ---- */
const RECIPES_RAW=`Chicken rice bowl|Meal prep|30|560|48|62|11|2|chicken|400 g chicken breast;160 g dry rice;1 cup broccoli;1 tbsp olive oil;1 tsp paprika;salt and pepper|Cook the rice;Season the chicken with paprika, salt and pepper;Pan-fry the chicken in oil 6 min per side, then slice;Steam the broccoli and serve everything in bowls
Greek yogurt protein bowl|Breakfast|5|380|34|42|8|1|greek|250 g greek yogurt;1 banana;30 g oats;1 tbsp honey;10 g almonds|Spoon the yogurt into a bowl;Slice the banana on top;Add oats, almonds and honey
Egg white omelette|Breakfast|10|260|32|8|10|1|egg|6 egg whites;1 whole egg;handful spinach;40 g feta;3 cherry tomatoes;1 tsp olive oil|Whisk the whites and egg;Wilt the spinach in oil;Pour in the eggs, add tomatoes and feta;Fold when set
Overnight protein oats|Breakfast|5|450|35|55|10|1|oats|60 g oats;1 scoop whey;200 ml milk;1 tbsp chia seeds;handful berries|Mix oats, whey, milk and chia in a jar;Refrigerate overnight;Top with berries in the morning
Shakshuka|Arabic|25|340|22|18|20|2|egg|5 eggs;1 can chopped tomatoes;1 onion;1 red pepper;2 garlic cloves;1 tsp cumin;1 tsp paprika;1 tbsp olive oil|Soften onion, pepper and garlic in oil;Add tomatoes and spices, simmer 10 min;Make wells and crack in the eggs;Cover and cook 6 min until whites set
Foul medames|Sudanese|15|420|22|52|14|2|foul|2 cans fava beans;2 garlic cloves;1 lemon;2 tbsp olive oil;1 tsp cumin;1 tomato;1 boiled egg;salt|Heat the beans with a splash of water;Mash with garlic, cumin, lemon and salt;Top with oil, chopped tomato and egg
Chicken shawarma plate|Arabic|35|540|52|38|18|2|shawarma|500 g chicken thighs;3 tbsp yogurt;1 tbsp shawarma spice;1 lemon;2 garlic cloves;2 khubz;salad vegetables;2 tbsp garlic sauce|Marinate chicken in yogurt, spice, lemon and garlic;Grill or pan-fry 12 min and slice;Serve with khubz, salad and garlic sauce
Tuna pasta salad|Meal prep|20|520|40|58|12|2|salmon|2 cans tuna in water;160 g dry pasta;1 cup sweetcorn;1 cucumber;3 tbsp light mayo;1 lemon|Cook and cool the pasta;Drain the tuna;Mix pasta, tuna, corn, cucumber, mayo and lemon
Beef chili|Meal prep|45|480|42|38|16|4|kofta|600 g lean ground beef;1 can kidney beans;1 can tomatoes;1 onion;1 red pepper;2 tsp chili powder;1 tsp cumin;2 garlic cloves|Brown the beef, drain fat;Add onion, pepper and garlic;Stir in tomatoes, beans and spices;Simmer 25 min
Salmon sweet potato tray|Western|35|560|38|45|24|2|salmon|2 salmon fillets;2 sweet potatoes;1 cup green beans;1 tbsp olive oil;1 lemon;salt and pepper|Cube sweet potatoes, roast 15 min at 200°C;Add salmon and beans to the tray;Season, drizzle oil and roast 12 min more;Squeeze lemon over
Protein pancakes|Breakfast|15|420|36|44|10|1|oats|1 banana;2 eggs;40 g oats;1 scoop whey;1/2 tsp baking powder;handful berries|Blend banana, eggs, oats, whey and baking powder;Cook small pancakes 2 min per side;Top with berries
Lentil soup|Arabic|35|330|20|48|6|4|lentils|300 g red lentils;1 onion;1 carrot;1 tsp cumin;1.2 l stock;1 lemon;1 tbsp olive oil|Soften onion and carrot in oil;Add lentils, cumin and stock;Simmer 20 min and blend;Finish with lemon
Kofta with tahini|Arabic|30|520|40|10|36|3|kofta|500 g lean minced beef;1 onion grated;handful parsley;1 tsp seven spice;3 tbsp tahini;1 lemon|Mix beef, onion, parsley and spice;Shape into fingers and grill 10 min;Whisk tahini with lemon and water;Serve kofta with tahini sauce
Chicken machboos|Gulf|60|610|45|70|16|4|machboos|1 kg chicken pieces;400 g basmati rice;1 onion;2 tomatoes;2 tbsp machboos spice;1 dried lime;2 tbsp oil;1 l water|Brown the onion in oil, add chicken and spices;Add tomatoes, dried lime and water, simmer 25 min;Remove chicken, add rice to the broth and cook 20 min;Grill the chicken briefly and serve on the rice
Grilled hammour with rice|Gulf|30|480|42|50|10|2|hammour|2 hammour fillets;160 g basmati rice;1 lemon;1 tsp turmeric;1 tsp cumin;2 garlic cloves;1 tbsp oil|Rub fish with spices, garlic and lemon;Cook the rice;Grill fish 4 min per side;Serve with lemon
Egg fried rice with chicken|Asian|20|560|40|62|15|2|rice|300 g cooked rice;250 g chicken breast;3 eggs;1 cup peas and carrots;2 tbsp soy sauce;2 spring onions;1 tbsp oil|Stir-fry diced chicken until cooked;Push aside and scramble the eggs;Add rice, vegetables and soy sauce;Toss 3 min and top with spring onion
Turkey burger|Western|20|450|40|34|16|2|kofta|400 g lean turkey mince;2 wholegrain buns;1 tomato;lettuce;1 tsp garlic powder;2 slices cheese|Season turkey and form 2 patties;Grill 5 min per side;Add cheese at the end;Build burgers with lettuce and tomato
Cottage cheese pasta|Western|20|520|38|64|11|2|labneh|160 g dry pasta;250 g cottage cheese;1 cup tomato sauce;2 garlic cloves;handful spinach;30 g parmesan|Cook pasta;Blend cottage cheese with tomato sauce and garlic;Warm the sauce with spinach;Toss with pasta and parmesan
Chicken fajita wraps|Mexican|25|480|42|40|15|2|chicken|400 g chicken breast;2 peppers;1 onion;1 tbsp fajita spice;4 small tortillas;4 tbsp greek yogurt;1 lime|Slice chicken and vegetables;Stir-fry with spice 10 min;Fill tortillas with chicken and veg;Top with yogurt and lime
Steak and potatoes|Western|30|620|50|42|26|2|kofta|2 sirloin steaks (200 g each);500 g baby potatoes;1 cup asparagus;1 tbsp butter;2 garlic cloves;rosemary|Boil potatoes 12 min, then crisp in a pan;Sear steaks 3 min per side, rest 5 min;Cook asparagus in butter and garlic;Slice and serve
Khubz chicken pizza|Arabic|15|430|38|40|12|1|khubz|1 khubz;100 g cooked chicken;3 tbsp tomato sauce;40 g light mozzarella;1/2 pepper;oregano|Spread sauce on khubz;Top with chicken, pepper and cheese;Bake 8 min at 220°C;Sprinkle oregano
Peanut butter protein shake|Shake|5|520|42|48|18|1|pb|1 scoop whey;300 ml milk;1 banana;1 tbsp peanut butter;30 g oats;ice|Blend everything until smooth
Mass gainer shake|Shake|5|880|50|110|24|1|tubG|2 scoops whey;400 ml whole milk;2 bananas;60 g oats;2 tbsp peanut butter;1 tbsp honey|Blend everything until smooth;Drink between meals
Green recovery shake|Shake|5|320|32|36|5|1|whey|1 scoop whey;1 banana;handful spinach;250 ml almond milk;1 tbsp chia seeds|Blend until smooth
Labneh breakfast plate|Arabic|10|420|28|30|20|1|labneh|150 g labneh;2 boiled eggs;1 khubz;cucumber;tomato;olives;1 tsp zaatar;1 tsp olive oil|Spread labneh on a plate;Drizzle oil and sprinkle zaatar;Serve with eggs, khubz and vegetables
Chicken and chickpea curry|Indian|35|520|44|40|18|4|chicken|700 g chicken breast;1 can chickpeas;1 can light coconut milk;1 onion;2 tbsp curry paste;1 can tomatoes;handful spinach|Brown chicken pieces;Fry onion with curry paste;Add tomatoes, coconut milk and chickpeas;Simmer 15 min with chicken and spinach
Dal with paneer|Indian|35|480|28|48|18|3|lentils|250 g yellow lentils;200 g paneer;1 onion;2 tomatoes;1 tsp turmeric;1 tsp garam masala;1 tsp cumin seeds;1 tbsp ghee|Boil lentils with turmeric 20 min;Fry cumin, onion and tomato in ghee;Add cubed paneer and garam masala;Stir into the dal and simmer 5 min
Tandoori chicken|Indian|40|380|48|8|16|3|chicken|900 g chicken thighs;200 g yogurt;2 tbsp tandoori spice;1 lemon;2 garlic cloves;1 tsp ginger|Mix yogurt, spice, lemon, garlic and ginger;Marinate chicken at least 30 min;Bake at 220°C for 25 min;Char under the grill 3 min
Chicken tikka skewers|Indian|30|340|44|8|14|2|chicken|500 g chicken breast;150 g yogurt;1 tbsp tikka spice;1 red onion;1 pepper;1 lemon|Marinate chicken in yogurt and spice;Thread on skewers with onion and pepper;Grill 12 min, turning;Squeeze lemon over
Egg bhurji with roti|Indian|15|420|26|36|18|1|egg|4 eggs;1 small onion;1 tomato;1 green chili;1/2 tsp turmeric;2 roti;1 tsp oil|Fry onion, chili and tomato;Add turmeric and beaten eggs;Scramble until just set;Serve with roti
Chicken adobo|Filipino|45|460|44|10|26|4|chicken|1 kg chicken thighs;80 ml soy sauce;80 ml vinegar;6 garlic cloves;3 bay leaves;1 tsp peppercorns|Simmer chicken with soy, vinegar, garlic, bay and pepper 30 min;Remove chicken and brown it in a pan;Reduce the sauce and pour over
Beef and broccoli|Asian|20|460|42|22|22|2|kofta|350 g flank steak;2 cups broccoli;3 tbsp soy sauce;1 tbsp oyster sauce;1 tsp cornflour;2 garlic cloves;1 tbsp oil|Slice beef thin and toss in cornflour;Stir-fry beef 2 min, remove;Stir-fry broccoli and garlic;Return beef with sauces, toss 2 min
Teriyaki salmon bowl|Asian|25|590|40|58|20|2|salmon|2 salmon fillets;160 g dry rice;3 tbsp teriyaki sauce;1 cucumber;1 avocado;sesame seeds|Cook rice;Pan-fry salmon 4 min per side, glaze with teriyaki;Slice cucumber and avocado;Assemble bowls and sprinkle sesame
Shrimp stir-fry|Asian|15|380|36|30|12|2|salmon|400 g shrimp;2 cups mixed stir-fry vegetables;2 tbsp soy sauce;1 tsp ginger;1 garlic clove;150 g rice noodles;1 tbsp oil|Soak noodles;Stir-fry shrimp 3 min;Add vegetables, ginger and garlic;Toss with noodles and soy
Chicken caesar salad|Western|20|420|44|14|20|2|chicken|400 g chicken breast;1 romaine lettuce;30 g parmesan;3 tbsp light caesar dressing;1 slice wholegrain bread|Grill and slice the chicken;Toast and cube the bread;Toss lettuce with dressing;Top with chicken, croutons and parmesan
Quinoa black bean bowl|Vegetarian|25|480|22|70|12|2|lentils|150 g quinoa;1 can black beans;1 cup sweetcorn;1 avocado;1 lime;salsa|Cook quinoa;Warm beans and corn;Assemble bowls with avocado and salsa;Squeeze lime over
Tofu scramble|Vegan|15|320|26|12|18|1|egg|250 g firm tofu;handful spinach;1/2 onion;1/2 tsp turmeric;1 tbsp nutritional yeast;1 tsp oil|Crumble tofu;Fry onion, add tofu and turmeric;Stir in spinach and yeast;Cook 5 min
Chickpea spinach stew|Vegan|25|380|18|50|10|3|hummus|2 cans chickpeas;1 can tomatoes;2 handfuls spinach;1 onion;2 garlic cloves;1 tsp cumin;1 tsp paprika|Soften onion and garlic;Add spices, tomatoes and chickpeas;Simmer 15 min;Stir in spinach
Hummus chicken wrap|Arabic|10|460|40|42|14|1|hummus|1 large tortilla;120 g grilled chicken;3 tbsp hummus;lettuce;tomato;pickles|Spread hummus on the tortilla;Add chicken, salad and pickles;Roll tightly and slice
Falafel salad bowl|Arabic|15|480|20|52|20|1|falafel|5 falafel;1 cup lettuce;1 tomato;1 cucumber;2 tbsp tahini;1 lemon;handful parsley|Warm the falafel;Chop the salad;Top salad with falafel;Drizzle tahini and lemon
Sudanese mullah with chicken|Sudanese|45|420|36|24|20|4|chicken|600 g chicken;2 onions;3 tomatoes;2 tbsp peanut butter;1 tsp cumin;1 tsp coriander;2 garlic cloves;1 tbsp oil|Brown the onions in oil;Add chicken, garlic and spices;Add tomatoes and water, simmer 20 min;Stir in peanut butter and cook 5 min
Sudanese salata dakwa with fish|Sudanese|25|440|38|20|24|2|hammour|2 white fish fillets;2 tomatoes;1 onion;2 tbsp peanut butter;1 lemon;1 green chili;1 tsp cumin|Season and grill the fish;Chop tomato, onion and chili;Mix peanut butter with lemon and water;Toss the salad in the dressing and serve with fish
Kisra with beef stew|Sudanese|60|560|40|56|18|4|kofta|600 g beef cubes;2 onions;3 tomatoes;1 tsp cumin;1 tsp coriander;4 kisra or flatbread;1 tbsp oil|Brown beef and onions;Add tomatoes and spices;Simmer covered 45 min;Serve with kisra
Fatteh with chicken|Arabic|25|560|42|50|20|3|chicken|500 g cooked chicken;2 khubz;400 g yogurt;1 can chickpeas;2 garlic cloves;2 tbsp pine nuts;1 tbsp butter|Toast torn khubz until crispy;Layer bread, warm chickpeas and chicken;Mix yogurt with garlic and spoon over;Top with pine nuts fried in butter
Mujaddara|Arabic|45|440|18|72|10|4|lentils|250 g brown lentils;200 g rice;3 onions;2 tbsp olive oil;1 tsp cumin|Boil lentils 15 min;Add rice and cumin, cook 18 min;Fry onions in oil until dark;Top rice with crispy onions
Chicken kabsa|Gulf|60|600|44|68|16|4|machboos|1 kg chicken;400 g basmati rice;1 onion;2 tomatoes;2 tbsp kabsa spice;2 tbsp tomato paste;1 carrot;2 tbsp oil|Fry onion, add chicken and spices;Add tomatoes, paste, carrot and water, simmer 25 min;Remove chicken, cook rice in broth 20 min;Roast chicken 10 min and serve on rice
Harees|Gulf|120|420|36|46|10|4|oats|300 g whole wheat;500 g chicken or lamb;1 tsp cinnamon;1 tbsp ghee;salt|Soak wheat overnight;Cook wheat and meat in water 1.5 h;Beat until smooth;Top with ghee and cinnamon
Balaleet with eggs|Gulf|20|440|22|60|12|2|egg|150 g vermicelli;4 eggs;2 tbsp sugar;1/4 tsp saffron;1/2 tsp cardamom;1 tbsp butter|Boil vermicelli and drain;Toss with butter, sugar, saffron and cardamom;Make a thin omelette;Serve the omelette on top
Karak protein latte|Shake|5|220|26|20|4|1|karak|1 cup strong karak tea;1 scoop vanilla whey;100 ml milk;pinch cardamom|Let the tea cool slightly;Blend with whey, milk and cardamom
Date and oat energy bites|Snack|15|180|8|26|6|6|dates|150 g dates;80 g oats;1 scoop whey;2 tbsp peanut butter;1 tbsp cocoa|Blend dates into a paste;Mix in oats, whey, peanut butter and cocoa;Roll into 12 balls;Chill 30 min
Protein brownies|Snack|30|160|12|18|5|8|bar|2 bananas;2 eggs;60 g oats;2 scoops chocolate whey;30 g cocoa;1 tsp baking powder|Blend everything;Pour into a lined tin;Bake 20 min at 180°C;Cut into 8 squares
Cottage cheese pancakes|Breakfast|15|360|32|30|12|1|labneh|150 g cottage cheese;2 eggs;40 g oats;1/2 tsp cinnamon;honey|Blend cottage cheese, eggs, oats and cinnamon;Cook small pancakes;Drizzle honey
Chicken pesto pasta|Western|25|620|48|64|18|2|chicken|160 g dry pasta;300 g chicken breast;2 tbsp pesto;cherry tomatoes;handful spinach;20 g parmesan|Cook pasta;Pan-fry sliced chicken;Toss pasta, chicken, pesto, tomatoes and spinach;Top with parmesan
Lean beef bolognese|Meal prep|40|560|44|62|14|4|kofta|500 g lean beef mince;320 g dry spaghetti;1 can tomatoes;1 onion;1 carrot;2 garlic cloves;1 tsp oregano|Brown beef with onion, carrot and garlic;Add tomatoes and oregano, simmer 25 min;Cook spaghetti;Serve with sauce
Chicken burrito bowl|Mexican|30|580|46|62|14|3|chicken|500 g chicken breast;200 g dry rice;1 can black beans;1 cup corn;salsa;1 lime;1 tsp chili;1 tsp cumin|Cook rice with lime;Season and grill chicken;Warm beans and corn;Assemble with salsa
Baked chicken thighs and veg|Meal prep|45|520|40|30|26|4|chicken|1 kg chicken thighs;2 zucchini;2 peppers;1 red onion;2 tbsp olive oil;1 tbsp mixed herbs|Chop vegetables;Toss everything with oil and herbs;Roast 40 min at 200°C
Garlic butter shrimp and rice|Western|20|520|38|56|14|2|rice|400 g shrimp;160 g dry rice;3 garlic cloves;1 tbsp butter;1 lemon;parsley|Cook rice;Sauté garlic in butter;Add shrimp, cook 3 min;Finish with lemon and parsley
Tuna avocado toast|Breakfast|5|420|34|30|18|1|avocado|1 can tuna;1/2 avocado;2 slices sourdough;1 lemon;chili flakes|Toast the bread;Mash avocado with lemon;Top with tuna and chili
Smoked salmon bagel|Breakfast|5|440|30|46|14|1|salmon|1 wholegrain bagel;80 g smoked salmon;2 tbsp light cream cheese;cucumber;capers|Toast the bagel;Spread cream cheese;Layer salmon, cucumber and capers
Chicken noodle soup|Western|35|360|34|36|8|4|chicken|500 g chicken breast;150 g egg noodles;2 carrots;2 celery sticks;1 onion;1.5 l stock|Simmer chicken in stock 15 min, then shred;Add chopped vegetables, cook 10 min;Add noodles, cook 5 min
Stuffed peppers|Meal prep|50|420|34|36|14|4|kofta|4 large peppers;400 g lean beef or turkey;150 g cooked rice;1 can tomatoes;1 onion;60 g cheese|Brown mince with onion;Mix with rice and half the tomatoes;Fill the peppers, pour remaining tomatoes around;Bake 35 min, add cheese for the last 5
Egg muffins|Meal prep|25|90|8|2|5|12|egg|10 eggs;1 pepper;handful spinach;1/2 onion;50 g cheese|Chop the vegetables;Whisk eggs and mix everything;Pour into a 12-cup muffin tin;Bake 20 min at 180°C
Chicken sausage hash|Breakfast|20|480|32|38|20|2|sweetpotato|4 chicken sausages;2 sweet potatoes;1 pepper;1 onion;2 eggs;1 tbsp oil|Cube and pan-fry sweet potato 10 min;Add sliced sausage, onion and pepper;Make 2 wells and fry the eggs
Lamb kofta with yogurt|Arabic|30|540|38|12|38|3|kofta|500 g lamb mince;1 onion;parsley;1 tsp cumin;200 g yogurt;1 cucumber;1 garlic clove|Mix lamb, onion, parsley and cumin;Shape and grill 10 min;Mix yogurt, grated cucumber and garlic;Serve together
Molokhia with chicken|Arabic|45|420|40|20|20|4|chicken|800 g chicken;400 g frozen molokhia;6 garlic cloves;1 tsp coriander;1.2 l stock;1 tbsp ghee|Boil chicken in stock 25 min;Add molokhia to the stock;Fry garlic and coriander in ghee and stir in;Serve with chicken and rice
Chicken liver with onions|Arabic|20|320|34|10|16|2|chicken|400 g chicken livers;1 onion;2 garlic cloves;1 lemon;1 tsp pomegranate molasses;1 tbsp oil|Fry onions until soft;Add livers and garlic, cook 6 min;Finish with lemon and molasses
Grilled halloumi salad|Vegetarian|15|440|26|16|30|2|labneh|200 g halloumi;1 cup quinoa cooked;cucumber;tomatoes;1 lemon;mint;1 tbsp olive oil|Slice and grill halloumi 2 min per side;Toss quinoa with chopped vegetables, lemon and oil;Top with halloumi and mint
Beef shawarma bowl|Arabic|30|600|46|52|22|2|shawarma|400 g beef strips;1 tbsp shawarma spice;160 g rice;2 tbsp tahini;pickles;tomato;parsley|Marinate and sear the beef;Cook rice;Serve beef on rice with salad;Drizzle tahini
Protein French toast|Breakfast|15|420|34|40|12|1|khubz|2 slices wholegrain bread;2 eggs;1/2 scoop whey;50 ml milk;1/2 tsp cinnamon;berries|Whisk eggs, whey, milk and cinnamon;Soak the bread;Fry 2 min per side;Top with berries
Chicken satay|Asian|30|460|44|14|26|3|chicken|600 g chicken breast;3 tbsp peanut butter;2 tbsp soy sauce;1 lime;1 tsp curry powder;1 tsp honey|Marinate chicken in soy, curry and honey;Thread on skewers and grill 10 min;Whisk peanut butter with lime and warm water;Serve with the sauce
Korean beef rice bowl|Asian|20|600|40|62|20|2|kofta|400 g lean beef mince;160 g rice;2 tbsp soy sauce;1 tbsp honey;1 tsp sesame oil;2 garlic cloves;spring onions;2 eggs|Cook rice;Brown beef with garlic, add soy, honey and sesame oil;Fry the eggs;Serve beef and egg on rice
Fish tacos|Mexican|25|450|36|42|14|2|hammour|2 white fish fillets;4 small tortillas;1 cup red cabbage;1 lime;3 tbsp greek yogurt;1 tsp chili|Season fish with chili and grill;Shred cabbage with lime;Fill tortillas with fish and slaw;Top with yogurt
Chicken quesadilla|Mexican|15|520|44|40|20|1|chicken|1 large tortilla;120 g cooked chicken;40 g cheese;1/2 pepper;salsa|Fill half the tortilla with chicken, pepper and cheese;Fold and toast 3 min per side;Slice and serve with salsa
Black bean burgers|Vegetarian|30|380|18|52|10|4|lentils|2 cans black beans;60 g oats;1 egg;1 tsp cumin;1 tsp paprika;4 buns|Mash beans;Mix with oats, egg and spices;Shape 4 patties and pan-fry 4 min per side;Serve in buns
Edamame noodle bowl|Vegan|15|440|26|52|14|1|broccoli|80 g soba noodles;100 g edamame;1 carrot;1 tbsp soy sauce;1 tsp sesame oil;1 tsp peanut butter|Cook soba and edamame;Shred the carrot;Whisk soy, sesame oil and peanut butter;Toss everything
Turkey meatballs|Meal prep|35|380|38|14|18|4|kofta|600 g lean turkey mince;1 egg;40 g breadcrumbs;1 can tomatoes;2 garlic cloves;basil|Mix turkey, egg and breadcrumbs, shape 20 balls;Brown the meatballs;Add tomatoes and garlic, simmer 15 min;Top with basil
Chicken stuffed sweet potato|Meal prep|50|460|38|52|10|2|sweetpotato|2 sweet potatoes;250 g cooked chicken;3 tbsp greek yogurt;2 spring onions;1 tsp smoked paprika|Bake sweet potatoes 45 min;Mix chicken with yogurt and paprika;Split potatoes and fill;Top with spring onion
Grilled chicken with tabbouleh|Arabic|30|460|44|30|18|2|chicken|400 g chicken breast;60 g bulgur;2 bunches parsley;2 tomatoes;1 lemon;2 tbsp olive oil;mint|Soak bulgur in hot water 15 min;Chop parsley, mint and tomatoes;Mix with bulgur, lemon and oil;Serve with grilled chicken
Spiced lentil and egg breakfast|Arabic|15|380|26|36|14|1|lentils|150 g cooked lentils;2 eggs;1/2 onion;1 tsp cumin;1 tsp olive oil;1 khubz|Fry onion and cumin;Add lentils and warm through;Fry or poach the eggs;Serve on lentils with khubz
Chicken tagine|Moroccan|60|480|42|34|18|4|chicken|1 kg chicken thighs;2 onions;1 can chickpeas;100 g dried apricots;1 tsp ras el hanout;1 tsp cinnamon;500 ml stock|Brown chicken;Soften onions with spices;Add stock, chickpeas and apricots;Cover and simmer 40 min
Moroccan harira|Moroccan|50|360|24|42|8|5|lentils|300 g lamb or beef;150 g lentils;1 can chickpeas;1 can tomatoes;1 onion;1 tsp ginger;1 tsp cinnamon;handful coriander|Brown meat and onion;Add spices, tomatoes, lentils and water;Simmer 35 min;Add chickpeas and coriander
Turkish menemen|Turkish|15|320|20|14|20|2|egg|4 eggs;2 tomatoes;2 green peppers;1 small onion;1 tbsp olive oil;chili flakes|Soften peppers and onion;Add chopped tomatoes, cook 5 min;Stir in eggs gently until creamy;Sprinkle chili
Chicken doner wrap|Turkish|30|520|44|46|16|2|shawarma|400 g chicken thighs;1 tsp cumin;1 tsp paprika;3 tbsp yogurt;2 lavash wraps;red onion;tomato|Marinate chicken with spices and yogurt;Grill and slice thinly;Fill wraps with chicken and salad
Greek chicken souvlaki|Greek|30|460|46|24|20|2|chicken|400 g chicken breast;1 lemon;1 tsp oregano;2 pita;tzatziki;tomato;red onion|Marinate chicken in lemon and oregano;Skewer and grill 12 min;Serve in pita with tzatziki and salad
Japanese chicken katsu (baked)|Asian|35|520|44|50|14|2|chicken|2 chicken breasts;1 egg;60 g panko;160 g rice;3 tbsp katsu sauce;cabbage|Coat chicken in egg and panko;Bake 25 min at 210°C;Cook rice and shred cabbage;Slice chicken and serve with sauce
Thai basil chicken|Asian|15|480|40|46|14|2|chicken|400 g chicken mince;2 cups thai basil;2 tbsp soy sauce;1 tbsp oyster sauce;2 chilies;3 garlic cloves;160 g rice;2 eggs|Cook rice;Stir-fry garlic and chili, add chicken;Add sauces and basil;Serve with rice and a fried egg
Vietnamese chicken salad|Asian|20|360|38|20|12|2|chicken|300 g cooked chicken;1/2 cabbage;1 carrot;mint;coriander;2 tbsp fish sauce;1 lime;1 tsp honey|Shred chicken, cabbage and carrot;Mix fish sauce, lime and honey;Toss with herbs
Beef bibimbap|Asian|30|580|36|70|16|2|rice|160 g rice;250 g lean beef strips;1 carrot;1 zucchini;handful spinach;2 eggs;2 tbsp gochujang|Cook rice;Sauté each vegetable and the beef;Fry eggs;Arrange on rice with gochujang
Chicken biryani|Indian|60|620|44|72|16|4|machboos|800 g chicken;400 g basmati rice;200 g yogurt;2 onions;2 tbsp biryani masala;1/4 tsp saffron;mint|Marinate chicken in yogurt and masala;Fry onions until golden;Layer half-cooked rice over chicken with onions and saffron;Cover and cook 25 min on low
Palak chicken|Indian|35|420|42|12|22|3|chicken|600 g chicken breast;300 g spinach;1 onion;2 tomatoes;1 tsp garam masala;2 garlic cloves;1 tsp ginger;2 tbsp yogurt|Blanch and blend spinach;Fry onion, garlic, ginger and tomato;Add chicken and spices, cook 12 min;Stir in spinach and yogurt
Chana masala|Indian|30|380|16|52|12|3|hummus|2 cans chickpeas;1 onion;2 tomatoes;1 tbsp chana masala spice;2 garlic cloves;1 tsp ginger;coriander|Fry onion, garlic and ginger;Add tomatoes and spice;Add chickpeas and simmer 15 min;Top with coriander
Pakistani chicken karahi|Pakistani|40|480|44|10|28|3|chicken|900 g chicken;4 tomatoes;2 green chilies;1 tsp ginger;2 garlic cloves;1 tsp cumin;2 tbsp oil;coriander|Fry chicken with garlic and ginger;Add chopped tomatoes and spices;Cook on high until oil separates;Top with chili and coriander
Bangladeshi fish curry|Bangladeshi|30|380|36|12|20|3|hammour|600 g white fish;1 onion;2 tomatoes;1 tsp turmeric;1 tsp mustard seeds;2 green chilies;1 tbsp mustard oil|Rub fish with turmeric and fry lightly;Fry mustard seeds and onion;Add tomatoes and chilies;Simmer fish in the sauce 10 min
Sri Lankan chicken curry|Sri Lankan|45|460|42|14|26|4|chicken|1 kg chicken;1 can light coconut milk;1 onion;2 tbsp roasted curry powder;curry leaves;1 cinnamon stick;2 garlic cloves|Fry onion, garlic and curry leaves;Add chicken and spices;Pour in coconut milk;Simmer 30 min
Nigerian jollof rice with chicken|Nigerian|60|620|40|76|16|4|rice|800 g chicken;400 g long grain rice;1 can tomatoes;2 red peppers;1 onion;2 tbsp tomato paste;1 tsp thyme;1 tsp curry powder|Blend tomatoes, peppers and onion;Fry paste then the blend 15 min;Add rice, spices and stock, cook covered 25 min;Serve with grilled chicken
Ethiopian lentil wat|Ethiopian|40|360|18|52|8|4|lentils|300 g red lentils;2 onions;2 tbsp berbere;3 garlic cloves;1 tsp ginger;1 tbsp oil|Cook onions slowly until soft;Add berbere, garlic and ginger;Add lentils and water;Simmer 25 min until thick
Kenyan beef and sukuma|Kenyan|35|480|40|20|26|3|kofta|500 g beef strips;1 bunch kale;2 tomatoes;1 onion;1 tbsp oil;ugali or rice to serve|Brown beef with onion;Add tomatoes and cook 10 min;Fry chopped kale separately;Serve together
Brazilian chicken and beans|Brazilian|40|540|44|56|12|4|chicken|800 g chicken breast;2 cans black beans;200 g rice;1 onion;2 garlic cloves;1 tsp cumin;1 orange|Cook rice;Simmer beans with onion, garlic and cumin;Grill chicken;Serve with orange slices
Peruvian chicken with green sauce|Peruvian|50|480|46|20|24|4|chicken|1 kg chicken thighs;1 tsp cumin;1 tsp paprika;1 lime;coriander;1 jalapeño;3 tbsp greek yogurt|Season and roast chicken 40 min at 200°C;Blend coriander, jalapeño, yogurt and lime;Serve chicken with the sauce
Greek yogurt chicken salad sandwich|Western|10|420|40|34|12|1|greek|120 g cooked chicken;3 tbsp greek yogurt;1 celery stick;1 tsp mustard;2 slices wholegrain bread;lettuce|Chop chicken and celery;Mix with yogurt and mustard;Fill the sandwich with lettuce
Cheesy protein omelette wrap|Breakfast|10|440|38|26|20|1|egg|3 eggs;1 tortilla;40 g cheese;50 g turkey slices;spinach|Whisk eggs and pour into a pan;Lay the tortilla on top and flip after 1 min;Add cheese, turkey and spinach;Roll up
Banana oat protein muffins|Snack|30|190|12|26|4|10|banana|3 bananas;2 eggs;150 g oats;2 scoops whey;1 tsp baking powder;handful blueberries|Mash bananas;Mix with eggs, oats, whey and baking powder;Fold in blueberries;Bake in 10 cups for 20 min at 180°C
Chocolate protein pudding|Snack|5|220|30|16|4|1|whey|200 g greek yogurt;1/2 scoop chocolate whey;1 tsp cocoa;1 tsp honey|Whisk everything until smooth;Chill 10 min
Labneh and cucumber dip|Snack|5|160|10|8|10|2|labneh|200 g labneh;1 cucumber;1 tsp dried mint;1 tsp olive oil;carrot sticks|Grate the cucumber and squeeze out water;Mix with labneh and mint;Drizzle oil and serve with carrots
Hummus and veg snack box|Snack|5|260|10|26|14|1|hummus|4 tbsp hummus;1 carrot;1 cucumber;1 pepper;6 almonds|Cut the vegetables into sticks;Pack with hummus and almonds
Boiled egg and avocado snack|Snack|10|280|14|8|22|1|avocado|2 eggs;1/2 avocado;chili flakes;salt|Boil eggs 9 min;Slice with avocado;Season
Grilled chicken and hummus plate|Arabic|20|520|50|30|22|1|hummus|200 g chicken breast;4 tbsp hummus;1/2 khubz;salad vegetables;1 tsp sumac|Grill the chicken;Plate with hummus and salad;Sprinkle sumac and serve with khubz
Lean lamb and rice (mandi style)|Gulf|90|640|44|66|22|4|machboos|1 kg lean lamb;400 g basmati rice;2 tbsp mandi spice;1 onion;2 dried limes;1 tbsp ghee|Rub lamb with spice and slow-roast 75 min at 170°C;Cook rice in the lamb juices with onion and dried lime;Serve lamb on the rice
Shrimp machboos|Gulf|40|520|36|66|10|4|machboos|600 g shrimp;400 g basmati rice;1 onion;2 tomatoes;2 tbsp machboos spice;1 dried lime;handful coriander|Fry onion and spice;Add tomatoes, dried lime, water and rice;Cook 15 min, add shrimp on top;Cover and cook 8 min more
Emirati chicken salona|Gulf|45|420|40|26|16|4|chicken|800 g chicken;2 potatoes;1 zucchini;2 tomatoes;1 onion;1 tbsp bzar spice;1 dried lime|Brown chicken and onion;Add tomatoes and spice;Add vegetables, dried lime and water;Simmer 30 min`;
const RECIPES=RECIPES_RAW.split('\n').map((l,i)=>{const[n,st,mins,kcal,p,c,f,sv,ic,ing,steps]=l.split('|');return{id:'r'+i,n,st,mins:+mins,kcal:+kcal,p:+p,c:+c,f:+f,sv:+sv,ic,ing:ing.split(';'),steps:steps.split(';')}});
