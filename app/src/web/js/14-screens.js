/* ================= screens ================= */
const scr=document.getElementById('screen');let tab='home',fuelTab='targets';
function avatarRow(){return h('div',{style:'display:flex;flex-direction:column;gap:6px;min-width:0;width:100%'},h('div',{class:'pname fit'},(P.name||'PLAYER').toUpperCase()),h('div',{class:'flagline'},flag(P.country,2),h('span',{class:'tag s'},(FL[P.country]||FL.XX)[1])))}
const SCREENS={
 home(){syncStreak();if(!ST.plog)ST.plog={};ST.plog[today()]=ST.protein;const ti=todayIdx(),rid=planFor(today()),r=rid&&allR()[rid],target=calc().pro,now=new Date(),bd=isBday();
  const showDonate=META.launches%4===0&&META.donateHide!==today();
  if(bd){balloons();const yr=now.getFullYear();if(META.bdayGift!==yr){META.bdayGift=yr;save();setTimeout(()=>gainXP(100),1400)}}
  return[
   h('div',{class:'clockbar'},h('button',{class:'clkb','aria-label':'Open calendar',onclick:()=>{tab='train';trainView='calendar';calSel=today();render()}},h('span',{class:'clk','data-clock':'t'},now.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})),
       h('span',{class:'label','data-clock':'d'},now.toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'}).toUpperCase())),
     h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:6px;align-items:flex-end;text-align:right;min-width:0'},h('span',{class:'label'},'TODAY\'S PLAN'),
       h('button',{class:'tag'+(r?' s':''),style:'cursor:pointer',onclick:()=>r?openWorkout(rid):(tab='train',render())},r?r.name+' · '+r.ex.length+' MOVES ▶':'REST DAY'))),
   bd?h('div',{class:'box bday'},h('h2',{},'HAPPY BIRTHDAY, '+(P.name||'CHAMP').toUpperCase()+'!'),h('span',{class:'small'},'Have a great day. Here is 100 XP from IronBit, and cake counts as carbs today.')):null,
   eventBox(),homeScene(),
   h('div',{class:'stats'},
     h('button',{class:'stat tap',onclick:streakPage,'aria-label':'Streak: '+ST.streak+'. Open streak page'},px('flame',3),h('span',{class:'num'},ST.streak),h('span',{class:'label'},'STREAK')),
     h('button',{class:'stat tap',onclick:openLevelMap,'aria-label':'Level '+lvl()+'. Open level map'},px('star',3),h('span',{class:'num'},'LV '+lvl()),h('span',{class:'label'},rank())),
     h('button',{class:'stat tap',onclick:statsPage,'aria-label':ST.workouts+' workouts. Open stats'},px('dumb',3),h('span',{class:'num'},ST.workouts),h('span',{class:'label'},'WORKOUTS'))),
   P.incomplete?h('button',{class:'opt',style:'border-color:var(--a2)',onclick:()=>onboard('info',true)},px('bolt',3),h('span',{class:'grow'},'Finish your profile so your plan and protein target fit you'),h('span',{class:'tag c'},'SETUP')):null,
   r?h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'TODAY\'S WORKOUT · '+DAYS[ti]),h('span',{class:'tag s'},'+XP')),
       h('h3',{},`${r.name} · ${r.ex.length} MOVES`),h('span',{class:'small'},r.ex.map(e=>e[0]).join(', ')),
       h('button',{class:'btn',onclick:()=>openWorkout(rid)},'▶ START WORKOUT'))
    :h('div',{class:'box'},h('span',{class:'label'},'TODAY · '+DAYS[ti]),h('h3',{},'REST DAY'),h('span',{class:'small'},'Recovery is part of the plan. A 20-minute walk and some stretching is plenty.'),
       h('button',{class:'btn ghost',onclick:()=>{tab='train';render()}},'TRAIN ANYWAY')),
   h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'PROTEIN TODAY'),h('span',{class:'small'},`${ST.protein} / ${target} g`)),
     h('div',{class:'bar t'},h('i',{style:`width:${Math.min(100,ST.protein/target*100)}%`})),
     h('div',{class:'row'},[25,40].map(n=>h('button',{class:'btn ghost',onclick:()=>{ST.protein+=n;save();render(true)}},'+'+n+' G')),
       h('button',{class:'btn ghost',onclick:()=>{tab='fuel';fuelTab='plate';render()}},'PLATE CALC'))),
   h('div',{class:'tools'},h('button',{class:'tile',onclick:tipsSheet},px('bolt',4),'TIPS & TRICKS'),h('button',{class:'tile',onclick:shopSheet},foodIcon('dumbbells',3),'GEAR SHOP'),h('button',{class:'tile',onclick:openLevelMap},px('star',4),'LEVEL MAP')),
   showDonate&&h('div',{class:'box',style:'border-color:var(--a2)'},h('div',{class:'row nowrap'},px('heart',3),h('span',{class:'grow'},'IronBit is free. If it helps you, you can buy the developer a karak.')),
     h('div',{class:'row'},h('button',{class:'btn',onclick:donateModal},'DONATE'),h('button',{class:'btn ghost',onclick:()=>{META.donateHide=today();save();render(true)}},'NOT NOW')))]},
 train:()=>trainScreen(),
 fuel(){const tabs=[['targets','TARGET'],['foods','FOODS'],['recipes','RECIPES'],['plate','PLATE'],['meals','MEALS']];
  return[h('div',{class:'tabs',role:'tablist'},tabs.map(([id,t])=>h('button',{role:'tab','aria-selected':String(fuelTab===id),onclick:()=>{fuelTab=id;render()}},t))),...FUEL[fuelTab]()]},
 map:mapScreen,club:()=>META.clubDemo?clubScreen():clubLocked(),
 me:()=>meScreen(),
 settings:settingsScreen
};
const fmtW=kg=>SET.units==='lb'?Math.round(kg*2.2046)+' lb':Math.round(kg*10)/10+' kg';

/* ---- fuel sub-screens ---- */
const FUEL={
 targets(){const c=calc(),G=GOALS[P.goal.type];
  return[h('div',{class:'box'},h('span',{class:'label'},'DAILY TARGET · '+G[0]),
    h('div',{class:'row spread'},h('div',{class:'row'},px('bolt',4),h('span',{class:'num',style:'font-size:20px'},c.pro+' G')),h('span',{class:'small'},'protein / day')),
    h('span',{class:'small'},`${G[3]} g per kg of body weight · about ${Math.round(c.pro/4)} g per meal`),
    h('div',{class:'macro'},h('div',{},h('span',{class:'label'},'KCAL'),h('span',{class:'num',style:'font-size:11px'},c.kcal)),h('div',{},h('span',{class:'label'},'CARBS'),h('span',{class:'num',style:'font-size:11px'},c.carb+'g')),h('div',{},h('span',{class:'label'},'FAT'),h('span',{class:'num',style:'font-size:11px'},c.fat+'g'))),
    splitBar({p:c.pro,c:c.carb,f:c.fat})),
   h('div',{class:'box'},h('span',{class:'label'},'BASED ON'),h('span',{class:'small'},`${P.sex==='m'?'Male':'Female'}, ${P.age} yrs, ${P.height} cm, ${fmtW(P.weight)}, training ${P.goal.days}×/week`),
     h('button',{class:'btn ghost',onclick:()=>onboard('info',true)},'UPDATE MY STATS')),
   h('p',{class:'note'},'Calories use the Mifflin-St Jeor formula with an activity factor from your training days. Treat them as a starting point and adjust every 2 weeks.')]},
 foods(){let cat='ALL';const grid=h('div',{class:'grid4'});
  const draw=()=>grid.replaceChildren(...FOODS.filter(f=>cat==='ALL'||f.cat===cat).map(f=>h('button',{class:'tile',onclick:()=>foodModal(f.id)},foodIcon(f.id,3),f.n,h('span',{class:'tag'},Math.round(f.p*f.sg/100)+'G P'))));
  const cats=h('div',{class:'seg'},getCats().map(c=>h('button',{'aria-pressed':String(c===cat),onclick:e=>{cat=c;[...cats.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));draw()}},c)));
  draw();return[h('span',{class:'small'},'Tap a food for full nutrition facts. Protein shown per serving.'),cats,grid,h('button',{class:'btn alt',onclick:foodIdeaModal},'+ ADD YOUR OWN FOOD'),adSlot()]},
 plate(){const t=totals(PLATE),c=calc();
  return[h('div',{class:'row spread'},h('h2',{},'PLATE CALCULATOR'),h('span',{class:'tag'},PLATE.length+' ITEMS')),
   h('div',{class:'list'},PLATE.length?PLATE.map(([id,gr],i)=>h('div',{class:'item',style:'flex-wrap:wrap'},foodIcon(id,2),
     h('span',{class:'grow'},h('span',{},FOOD[id].n),h('span',{class:'small'},Math.round(FOOD[id].k*gr/100)+' kcal · '+r1(FOOD[id].p*gr/100)+' g protein')),
     h('div',{class:'row nowrap',style:'gap:6px;width:100%;justify-content:flex-end'},h('span',{class:'label'},'GRAMS'),h('div',{class:'grow'},stepper('pg'+i,null,gr,1,3000,10,v=>{PLATE[i][1]=v;save();clearTimeout(window._pt);window._pt=setTimeout(()=>render(true),450)})),
       h('button',{class:'stp','aria-label':'Remove',onclick:()=>{PLATE.splice(i,1);save();render()}},'✕')))):h('span',{class:'small'},'Your plate is empty. Add foods to see the totals.')),
   h('button',{class:'btn alt',onclick:()=>pickFood(id=>{PLATE.push([id,FOOD[id].sg]);save();render()})},'+ ADD FOOD'),
   PLATE.length&&h('div',{class:'box'},h('span',{class:'label'},'THIS PLATE VS YOUR DAY'),
     h('div',{class:'row spread small'},h('span',{},'Protein'),h('span',{},`${Math.round(t.p)} / ${c.pro} g`)),h('div',{class:'bar t'},h('i',{style:`width:${Math.min(100,t.p/c.pro*100)}%`})),
     h('div',{class:'row spread small'},h('span',{},'Calories'),h('span',{},`${Math.round(t.k)} / ${c.kcal}`)),h('div',{class:'bar'},h('i',{style:`width:${Math.min(100,t.k/c.kcal*100)}%`})),splitBar(t)),
   PLATE.length&&nutri(t,Math.round(t.g)+' g total'),
   PLATE.length&&h('div',{class:'row nowrap'},h('button',{class:'btn grow',onclick:()=>{ST.protein+=Math.round(t.p);save();addXP(5);tab='home';render()}},'EAT IT · LOG '+Math.round(t.p)+'G'),
     h('button',{class:'btn ghost',onclick:()=>{PLATE=[];save();render()}},'CLEAR'))]},
 meals(){const MP=MEALPLANS;;
  const plan=MP[P.goal.type]||MP.fit,all=plan.flat(),t=totals(all),c=calc();
  return[h('span',{class:'small'},`Sample day for ${GOALS[P.goal.type][0].toLowerCase()} · ${Math.round(t.p)} g protein, ${Math.round(t.k)} kcal (target ${c.pro} g, ${c.kcal} kcal)`),
   ...plan.map((meal,i)=>{const mt=totals(meal);return h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},['BREAKFAST','LUNCH','SNACK','DINNER'][i]),h('span',{class:'tag'},Math.round(mt.p)+'G P · '+Math.round(mt.k)+' KCAL')),
     h('div',{class:'list'},meal.map(([id,gr])=>h('button',{class:'item',onclick:()=>foodModal(id)},foodIcon(id,2),h('span',{class:'grow'},h('span',{},FOOD[id].n),h('span',{class:'small'},gr+' g')),h('span',{class:'tag s'},r1(FOOD[id].p*gr/100)+'G')))),
     h('button',{class:'btn ghost',onclick:()=>{PLATE=meal.map(x=>[...x]);save();fuelTab='plate';render()}},'OPEN IN PLATE CALC'))})]}
};

/* ---- gym map ---- */
function mapScreen(){let filter='ALL',sel=null;const city=P.city||'Other',C0=CITIES[city]||CITIES.Other,coast=C0[3],GY=cityGyms(city),r=rng('map'+city);
  const wrap=h('div',{class:'mapwrap'}),list=h('div',{class:'list'}),card=h('div');
  const W=64,H=80,[cv,g]=mk(W,H),hs=(x,y)=>((x*73856093)^(y*19349663))>>>0;
  const rv=[8+Math.floor(r()*10),28+Math.floor(r()*8),46+Math.floor(r()*10)],rh=[24+Math.floor(r()*8),44+Math.floor(r()*8),62+Math.floor(r()*8)];
  const river=!coast&&r()<.7,ph=r()*6,riverX=y=>Math.round(36+Math.sin(y/9+ph)*9);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let col;
    if(coast&&y<coastY(x))col=hs(x,y)%17===0?'#5aa3c4':'#2d6b8f';
    else{col=hs(x,y)%13===0?'#c9b48a':'#dccaa4';
      if((x%7<5)&&(y%6<4)&&hs(Math.floor(x/7),Math.floor(y/6))%3===0)col='#c4ae86';
      if(hs(Math.floor(x/9),Math.floor(y/9))%11===0)col=hs(x,y)%5===0?'#5f9a52':'#7fb069';
      if(rv.includes(x)||rh.includes(y))col='#4a3d85';
      if(river&&Math.abs(x-riverX(y))<=1)col='#2d6b8f'}
    R(g,col,x,y)}
  cv.style.width='100%';cv.setAttribute('role','img');cv.setAttribute('aria-label','Pixel map of '+city+' with gym locations');wrap.append(cv);
  const pct=(x,y)=>`left:${x/W*100}%;top:${y/H*100}%`;
  if(coast)wrap.append(h('span',{class:'maplabel sea',style:pct(3,5)},'SEA'));
  wrap.append(h('span',{class:'maplabel',style:pct(3,H-5)},city.toUpperCase()));
  const ME=landSpot(rng('me'+city),coast);wrap.append(h('span',{class:'youdot',style:pct(ME[0],ME[1]),title:'You are here'}));
  const dist=g=>Math.hypot(g.x-ME[0],g.y-ME[1])*.25;
  const pins=GY.map((gm,i)=>{const b=h('button',{class:'pin',style:pct(gm.x,gm.y),'aria-label':`${gm.n}, ${gm.a}`,onclick:()=>{sel=i;draw()}},px('pin',3));wrap.append(b);return b});
  function draw(){const vis=GY.map((g,i)=>({...g,i,d:dist(g)})).filter(g=>filter==='ALL'||(filter==='MINE'?g.mine:g.t.includes(filter))).sort((a,b)=>a.d-b.d);
    pins.forEach((b,i)=>{b.hidden=!vis.some(v=>v.i===i);b.classList.toggle('on',sel===i);b.firstChild.replaceWith(px(sel===i?'pinOn':'pin',3))});
    list.replaceChildren(...vis.map(g=>h('button',{class:'item',onclick:()=>{sel=g.i;draw()},style:sel===g.i?'border-color:var(--a1)':''},px(sel===g.i?'pinOn':'pin',3),
      h('span',{class:'grow'},h('h3',{},g.n),h('span',{class:'small'},`${g.a} · ${g.d.toFixed(1)} km`)),g.mine?h('span',{class:'tag'},'MINE'):null,h('span',{class:'tag s'},g.p?g.cur+' '+g.p:'ASK'))));
    const s=GY[sel];card.replaceChildren(...(s?[h('div',{class:'box'},h('div',{class:'row spread'},h('h3',{},s.n.toUpperCase()),h('span',{class:'tag'},s.hrs)),
      h('span',{class:'small'},`${s.a} · ${dist(s).toFixed(1)} km from you`),
      h('div',{class:'macro'},[['MONTH',s.p||'ASK'],['3 MONTHS',s.p?Math.round(s.p*2.8):'–'],['YEAR',s.p?Math.round(s.p*10):'–']].map(([l,v])=>h('div',{},h('span',{class:'label'},l),h('span',{class:'num',style:'font-size:11px'},v)))),
      h('span',{class:'label'},'PRICES IN '+s.cur+(s.mine?' · ADDED BY YOU':s.real?' · REAL GYM · CHECK PRICE WITH THE GYM':' · SAMPLE DATA')))]:[]))}
  const chips=h('div',{class:'seg'},['ALL','24H','BUDGET','LADIES','CLASSES','MINE'].map(f=>h('button',{'aria-pressed':String(f===filter),
    onclick:e=>{filter=f;[...chips.children].forEach(c=>c.setAttribute('aria-pressed',String(c===e.currentTarget)));sel=null;draw()}},f)));
  draw();
  return[h('div',{class:'row spread'},h('h2',{},'GYMS IN '+city.toUpperCase()),h('button',{class:'btn ghost',style:'padding:8px',onclick:cityPicker},'CHANGE CITY')),chips,wrap,card,
    h('button',{class:'btn alt',onclick:()=>addGymModal(city,coast)},'+ ADD A GYM YOU KNOW'),list,adSlot(),
    h('p',{class:'note'},'The map and gyms are stored on your phone, so it works offline. Listed gyms and prices are samples until real data is added.')]}
function addGymModal(city,coast){const areas=(CITIES[city]||CITIES.Other)[4];let tags=[],m;
  const f={n:h('input',{id:'gn',maxlength:24,placeholder:'Gym name'}),a:h('select',{id:'ga'},areas.map(a=>h('option',{value:a},a))),p:h('input',{id:'gp',type:'number',inputmode:'numeric',placeholder:'Monthly price'}),hr:h('input',{id:'gh',maxlength:14,placeholder:'e.g. 6AM–11PM'})};
  const tg=h('div',{class:'seg'},['24H','BUDGET','LADIES','CLASSES'].map(t=>h('button',{'aria-pressed':'false',onclick:e=>{tags=tags.includes(t)?tags.filter(x=>x!==t):[...tags,t];e.currentTarget.setAttribute('aria-pressed',String(tags.includes(t)))}},t)));
  const L=(id,t,el)=>h('label',{class:'field',for:id},h('span',{class:'label'},t),el);
  m=modal(h('h2',{},'ADD A GYM'),h('span',{class:'small'},'Saved on your phone. In the online version, gyms you add help everyone in '+city+'.'),
    L('gn','NAME',f.n),L('ga','AREA',f.a),h('div',{class:'row nowrap'},L('gp','MONTHLY PRICE',f.p),L('gh','HOURS',f.hr)),h('span',{class:'label'},'TAGS'),tg,
    h('button',{class:'btn',onclick:()=>{const n=f.n.value.trim();if(!n){toast('ADD A NAME');return}const[x,y]=landSpot(rng(n+Date.now()),coast);
      P.myGyms=P.myGyms||{};(P.myGyms[city]=P.myGyms[city]||[]).push({n,a:f.a.value,x,y,p:+f.p.value||0,hrs:f.hr.value.trim()||'—',t:tags});save();m.remove();addXP(5);render()}},'SAVE GYM'),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CANCEL'))}

/* ---- settings ---- */
function settingsScreen(){
  const tg=(key,label,after)=>h('div',{class:'srow'},h('span',{},label),h('button',{class:'toggle','aria-pressed':String(!!SET[key]),'aria-label':label,onclick:()=>{SET[key]=!SET[key];save();applyTheme();after&&after();render(true)}}));
  const segR=(key,label,opts,after)=>h('div',{class:'srow'},h('span',{},label),h('div',{class:'seg'},opts.map(([v,t])=>h('button',{'aria-pressed':String(SET[key]===v),onclick:()=>{SET[key]=v;save();applyTheme();after&&after();render(true)}},t))));
  let resetArm=false;const resetBtn=h('button',{class:'btn ghost wide',onclick:()=>{if(!resetArm){resetArm=true;resetBtn.textContent='TAP AGAIN TO ERASE EVERYTHING';resetBtn.style.background='var(--a2)';resetBtn.style.color='var(--onA)';return}
    store.clear();location.reload()}},'RESET ALL DATA');
  return[h('div',{class:'row spread'},h('h2',{},'SETTINGS'),h('button',{class:'btn ghost',onclick:()=>{tab='me';render()}},'◀ BACK')),
   h('div',{class:'box'},h('span',{class:'label'},'PROFILE'),
     h('div',{class:'ptiles'},h('button',{class:'tile',onclick:()=>onboard('info',true)},headIcon(P,P.char,2),'MY INFO'),h('button',{class:'tile',onclick:()=>onboard('goal',true)},px('flame',3),'MY GOAL'),h('button',{class:'tile',onclick:()=>onboard('char',true)},px('shirt',3),'LOOK'),h('button',{class:'tile',onclick:()=>onboard('info',true)},px('pin',3),'MY CITY'))),
   h('div',{class:'box'},h('span',{class:'label'},'LOOK'),
     h('div',{class:'field'},h('span',{},'Mode'),h('div',{class:'seg'},[['auto','PHONE'],['time','BY TIME'],['dark','DARK'],['light','LIGHT']].map(([v,t])=>h('button',{'aria-pressed':String(SET.modeTime?v==='time':SET.modeAuto?v==='auto':v===SET.mode),onclick:()=>{SET.modeTime=v==='time';if(v==='auto')SET.modeAuto=true;else if(v!=='time'){SET.modeAuto=false;SET.mode=v}save();applyTheme();refreshModeIcons();render(true)}},t))),h('span',{class:'small'},SET.modeTime?'Light from your wake-up time until 7 pm, dark the rest of the day.':'PHONE follows your phone\'s setting. BY TIME switches with the time of day.')),
     h('details',{class:'xp'},h('summary',{},h('span',{},'Color theme'),h('span',{class:'tag s'},PALS[SET.pal]?PALS[SET.pal].name:'')),
     h('div',{class:'list'},Object.entries(PALS).map(([id,p])=>{const t=p[curMode()],ok=unlocked('pal',id);return h('button',{class:'opt'+(ok?'':' locked'),'aria-pressed':String(SET.pal===id),onclick:()=>{if(!ok){toast('UNLOCKS AT LVL '+lockLvl('pal',id));return}SET.pal=id;SET.accent=null;save();applyTheme();render(true)}},
       h('span',{class:'row nowrap',style:'gap:0'},[t.bg,t.panel2,t.a1,t.a2,t.a3].map(c=>h('i',{style:`width:16px;height:22px;background:${c};display:block`}))),h('span',{class:'grow'},p.name),ok?null:h('span',{class:'tag'},'LVL '+lockLvl('pal',id)))}))),
     h('div',{class:'field'},h('span',{},'Custom accent color'),h('div',{class:'sw'},['#ff6b57','#e84393','#c0392b','#ff9f1c','#f2b84b','#ffd54a','#7fb069','#3fb950','#2e7d32','#3fc1b0','#05d9e8','#2d6b8f','#4a7bd9','#7b6fb0','#8e44ad','#8d6e63','#9aa3b5','#f6f3ec'].map(col=>h('button',{'aria-label':'Accent '+col,'aria-pressed':String(SET.accent===col),style:`background:${col}`,onclick:()=>{SET.accent=col;save();applyTheme();render(true)}}))),
       SET.accent?h('button',{class:'btn ghost',style:'align-self:flex-start;padding:8px',onclick:()=>{SET.accent=null;save();applyTheme();render(true)}},'RESET TO THEME COLOR'):null),
     segR('fz','Text size',[[.9,'S'],[1,'M'],[1.15,'L']]),tg('crt','Retro scanlines')),
   kbSettings(),
   h('div',{class:'box'},h('span',{class:'label'},'FONT'),h('p',{class:'note'},'IronBit looks best with the default pixel font.'),
     h('div',{class:'list'},Object.entries(FONTS).map(([id,[nm,d,b]])=>h('button',{class:'opt','aria-pressed':String(SET.font===id),onclick:()=>{SET.font=id;save();applyTheme();render(true)}},
       h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:5px'},h('span',{style:`font-family:${d},monospace;font-size:${id==='classic'?10:14}px`},nm),h('span',{style:`font-family:${b},monospace;font-size:${id==='classic'?18:15}px;color:var(--dim)`},'Get fit, bit by bit.')),
       id==='classic'?h('span',{class:'tag s'},'RECOMMENDED'):null)))),
   musicBoxSettings(),
   h('div',{class:'box'},h('span',{class:'label'},'SOUND & FEEL'),tg('sfx','Sound effects'),
     h('div',{class:'srow'},h('span',{},'Sound pack'),h('div',{class:'seg'},[['retro','RETRO'],['arcade','ARCADE'],['chip','CHIP'],['legend','LEGEND']].map(([v,t])=>{const ok=unlocked('sfx',v);return h('button',{'aria-pressed':String((SET.sfxPack||'retro')===v),class:ok?null:'locked',onclick:()=>{if(!ok){toast('UNLOCKS AT LVL '+lockLvl('sfx',v));return}SET.sfxPack=v;save();SFX.lvl();render(true)}},ok?t:t+' L'+lockLvl('sfx',v))}))),
     h('div',{class:'srow'},h('label',{for:'vol'},'Volume'),h('input',{id:'vol',type:'range',min:0,max:1,step:.1,value:SET.vol,style:'width:140px',onchange:e=>{SET.vol=+e.target.value;save();SFX.coin()}})),
     tg('timerBeep','Rest timer beep'),h('div',{class:'srow'},h('span',{},'Haptics'),h('div',{class:'seg'},[[0,'OFF'],[1,'LIGHT'],[2,'MED'],[3,'STRONG']].map(([v,t])=>h('button',{'aria-pressed':String(SET.hap===v),onclick:()=>{SET.hap=v;save();haptic('success');render(true)}},t))))),
   h('div',{class:'box'},h('span',{class:'label'},'TRAINING'),segR('rest','Rest timer',[[30,'30S'],[60,'60S'],[90,'90S'],[120,'2M']]),
     h('div',{class:'srow'},h('span',{},'Start countdown (sec)'),h('div',{style:'width:150px'},stepper('cdn',null,SET.countdown??3,0,10,1,v=>{SET.countdown=v;save()}))),
     segR('speed','Coach speed',[[.5,'.5×'],[1,'1×'],[1.5,'1.5×'],[2,'2×']]),segR('units','Weight units',[['kg','KG'],['lb','LB']])),
   h('div',{class:'box'},h('span',{class:'label'},'LANGUAGE'),h('div',{class:'srow'},h('span',{},'App language'),h('div',{class:'seg'},h('button',{'aria-pressed':'true'},'EN'),h('button',{'aria-pressed':'false',onclick:()=>toast('ARABIC COMING SOON')},'عربي')))),
   h('div',{class:'box'},h('span',{class:'label'},'MORE'),
     h('button',{class:'opt',onclick:tipsSheet},px('bolt',3),h('span',{class:'grow'},'Tips & tricks')),
     h('button',{class:'opt',onclick:itemShop},coinIcon(3),h('span',{class:'grow'},'Item shop (coins)')),
     h('button',{class:'opt',onclick:shopSheet},foodIcon('dumbbells',2),h('span',{class:'grow'},'Gear shop')),
     h('button',{class:'opt',onclick:aboutPage},ART.icon_logo?artCanvas(ART.icon_logo,22):px('dumb',3),h('span',{class:'grow'},'About IronBit'),h('span',{class:'tag'},'v'+VERSION)),
     h('button',{class:'opt',onclick:()=>onboard('intro',true)},px('flame',3),h('span',{class:'grow'},'Replay the intro')),
     h('button',{class:'opt',onclick:()=>{tab='home';render();setTimeout(startTour,250)}},px('star',3),h('span',{class:'grow'},'Replay the app tips'))),
   h('div',{class:'box'},h('span',{class:'label'},'MERLIFT THE WIZARD'),h('div',{class:'row nowrap'},show(drawWizard('flex',0),2),h('span',{class:'grow small'},'The most jacked wizard ever seen visits now and then with stats, tips and terrible jokes.')),tg('wizard','Merlift visits',wizardSchedule),tg('wizNotif','Merlift notifications',()=>{if(SET.wizNotif&&window.IronBitNative&&IronBitNative.notifPermission)IronBitNative.notifPermission();wizardSchedule()}),
     null),
   h('div',{class:'box'},h('span',{class:'label'},'YOUR DATA'),h('span',{class:'small'},'Save everything (profile, workouts, notes, coins, settings) to one backup file. Restore it on any phone.'),
     h('div',{class:'row nowrap'},h('button',{class:'btn alt grow',onclick:exportData},'EXPORT BACKUP'),h('button',{class:'btn ghost grow',onclick:importData},'IMPORT BACKUP'))),
   accountBox(),
   META.devShown?h('button',{class:'opt',onclick:devGate},px('lock',3),h('span',{class:'grow'},'Developer options'),h('span',{class:'tag'},'HIDDEN')):null,
   resetBtn,h('button',{class:'small verbtn',style:'text-align:center;background:none;border:none;color:var(--dim);padding:8px',onclick:verTap},'IronBit v'+VERSION+' · prototype · Get fit, bit by bit.')]}

/* ---- dialogs ---- */
const STORE_URL='https://play.google.com/store/apps/details?id=com.ironbit.app';
function rateModal(){let stars=0,m;const row=h('div',{class:'row',style:'justify-content:center;gap:6px'});
  const draw=()=>row.replaceChildren(...[1,2,3,4,5].map(n=>h('button',{class:'icon-btn','aria-label':n+' stars',style:n<=stars?'border-color:var(--a1)':'opacity:.5',onclick:()=>{stars=n;draw()}},px('star',4))));draw();
  m=modal(h('h2',{},'ENJOYING IRONBIT?'),h('p',{},'A quick rating on Google Play helps other people find the app. It takes 10 seconds.'),row,
    h('a',{class:'btn',href:STORE_URL,target:'_blank',rel:'noopener',onclick:()=>{META.rated=true;save();setTimeout(()=>m.remove(),300)}},'RATE ON GOOGLE PLAY'),
    h('button',{class:'btn ghost',onclick:()=>{META.rateNext=META.launches+5;save();m.remove()}},'MAYBE LATER'))}
function donateModal(){let m;m=modal(h('div',{class:'row nowrap'},px('heart',4),h('h2',{},'SUPPORT THE DEVELOPER')),
  h('p',{},'IronBit is free forever, with no ads and no account. If it helped your training, a small tip keeps updates coming.'),
  h('div',{class:'list'},[['karak','A KARAK','5 AED'],['whey','A PROTEIN SHAKE','15 AED'],['chicken','A MEAL PREP','30 AED']].map(([ic,t,a])=>h('button',{class:'item',onclick:()=>{toast('THANK YOU! PAYMENT COMES LATER');m.remove()}},foodIcon(ic,2),h('span',{class:'grow'},t),h('span',{class:'tag s'},a)))),
  h('span',{class:'small'},'Prototype: these buttons don\'t charge anything yet.'),h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))}
