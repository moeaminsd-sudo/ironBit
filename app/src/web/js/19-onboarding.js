/* ================= onboarding ================= */
function onboard(start,edit,ctab0){
  const ov=h('div',{class:'overlay'});APP.append(ov);
  const D=P?JSON.parse(JSON.stringify(P)):{name:'',dob:(new Date().getFullYear()-25)+'-01-01',age:25,sex:'m',height:172,weight:72,country:'AE',city:'Dubai',custom:[],myGyms:{},goal:{type:'muscle',level:'beginner',days:3,mins:60,equip:'gym',target:null},char:defChar('m')};
  const steps=['intro','info','hello','goal','char','done'];let step=start,slide=0,slideDir='';
  const skipAll=()=>{D.incomplete=!D.name.trim();if(D.incomplete)D.name='Player';haptic('click');finish()};
  const finish=()=>{D.me=true;if(!META.coins07){META.coins07=true;ST.coins=(ST.coins||0)+100}if(!edit)META.brief=today();if(edit&&step==='info'&&D.name.trim()&&D.name!=='Player')D.incomplete=false;P=D;save();ov.remove();render();if(!edit){toast('WELCOME, '+(P.name||'PLAYER').toUpperCase()+'!');if(!META.tour)setTimeout(startTour,900)}};
  const next=()=>{if(edit){if(step==='intro'){ov.remove();return}finish();return}const i=steps.indexOf(step);if(i===steps.length-1)finish();else{step=steps[i+1];draw()}};
  const back=()=>{if(edit){ov.remove();return}const i=steps.indexOf(step);if(i>1){step=steps[i-1];draw()}};
  const shell=(title,body,cta,ok=true,skip=false)=>{const i=steps.indexOf(step),pm=ov.querySelector('main'),same=ov._step===step,keepY=same&&pm?pm.scrollTop:0;ov._step=step;ov.replaceChildren(
    h('header',{},(edit||i>1)?h('button',{class:'btn ghost',style:'padding:8px 10px',onclick:back,'aria-label':edit?'Close':'Back'},edit?'✕':'◀'):px('dumb',2),h('span',{class:'logo grow',style:'font-size:10px'},title),!edit?h('span',{class:'chip'},`STEP ${i}/4`):null,modeToggle()),
    h('main',{class:same?'':'anim'},...body),
    h('div',{style:'padding:12px 14px;display:flex;gap:10px;background:var(--panel);border-top:4px solid var(--line)'},(!edit&&skip)?h('button',{class:'btn ghost',onclick:skipAll},'SKIP FOR NOW'):null,h('button',{class:'btn wide grow',id:'cta',disabled:!ok,onclick:next},cta)));if(keepY){const nm=ov.querySelector('main');nm.scrollTop=keepY}};
  const st=k=>h('div',{class:'stage',style:'width:62%;align-self:center'},player(k,0,{getChar:()=>D.char,getProf:()=>D}).el);
  const SLIDES=[
    ()=>[frontFig(FP.idle,()=>D,()=>D.char,{wink:true}),h('h1',{},'WELCOME TO IRONBIT'),h('span',{class:'tag s',style:'align-self:flex-start'},'GET FIT, BIT BY BIT.'),h('p',{},'Your pocket gym coach. Training, food and progress, all in pixel art. The core app works without internet.')],
    ()=>[frontFig(FP.squat,()=>D,()=>D.char),h('h1',{},'TRAIN SMART'),h('p',{},'Plans built around your goal, and a pixel coach that looks like you and shows every move.')],
    ()=>[h('div',{style:'align-self:center'},show(drawBody('front','chest',false),3)),h('h1',{},'KNOW YOUR MUSCLES'),h('p',{},'Tap any muscle on the map to learn what it does and which exercises train it. Then build your own routine.')],
    ()=>[h('div',{class:'row nowrap',style:'justify-content:center;gap:8px;padding:12px 0'},foodIcon('chicken',4),h('span',{class:'num'},'+'),foodIcon('rice',4),h('span',{class:'num'},'='),h('div',{style:'display:flex;flex-direction:column;align-items:center;gap:6px'},px('bolt',5),h('span',{class:'tag s'},'51G PROTEIN'))),
      h('h1',{},'PLATE CALCULATOR'),h('p',{},'Add foods together, like chicken and rice, and see exactly how much protein, carbs, fat and calories you get. Every food has full nutrition facts.')],
    ()=>[h('div',{class:'row',style:'justify-content:center;gap:16px;padding:20px 0'},px('pin',6),px('pinOn',6),px('pin',6)),h('h1',{},'FIND A GYM'),h('p',{},'A map of gyms in your city with prices and opening hours. Add the gyms you know.')],
    ()=>[h('div',{class:'row',style:'justify-content:center;gap:10px;padding:20px 0'},px('dumb',6),px('star',6),px('club',6)),h('h1',{},'LEVEL UP TOGETHER'),h('p',{},'Finish your session timer to earn XP, climb the leaderboard and cheer others on with dumbbells.')]];
  function draw(){
    if(step==='intro'){const last=slide===SLIDES.length-1,skip=()=>{edit?ov.remove():(step='info',draw())};
      ov.replaceChildren(h('header',{},px('dumb',2),h('span',{class:'logo grow'},'IRONBIT'),modeToggle(),h('button',{class:'btn ghost',style:'padding:8px 10px',onclick:skip},'SKIP')),
        swipeMain(h('main',{class:'anim'+(slideDir?' sl'+slideDir:''),style:'justify-content:center;gap:16px'},...SLIDES[slide]()),d=>{if(d>0&&slide<SLIDES.length-1){slide++;slideDir='r';draw()}else if(d<0&&slide>0){slide--;slideDir='l';draw()}else if(d>0&&last)skip()}),
        h('div',{style:'padding:12px 14px;display:flex;flex-direction:column;gap:12px;background:var(--panel);border-top:4px solid var(--line)'},
          h('div',{class:'dots'},SLIDES.map((_,i)=>h('i',{class:i===slide?'on':''}))),
          h('div',{class:'row nowrap'},slide>0?h('button',{class:'btn ghost',onclick:()=>{slide--;slideDir='l';draw()},'aria-label':'Previous'},'◀'):null,
            h('button',{class:'btn grow',onclick:()=>{if(last)skip();else{slide++;slideDir='r';draw()}}},last?(edit?'DONE':'LET\'S GO'):'NEXT ▶'))));return}
    if(step==='info'){const okName=()=>D.name.trim().length>0,lb=SET.units==='lb';
      if(!D.dob)D.dob=(new Date().getFullYear()-(D.age||25))+'-01-01';
      const ageTag=h('span',{class:'tag s'},'AGE '+ageFrom(D.dob));
      const setDob=v=>{D.dob=v;D.age=ageFrom(v);dobIn.value=fmtDob(v);ageTag.textContent='AGE '+D.age};
      const dobIn=h('input',{id:'dob',inputmode:'numeric',placeholder:'DD/MM/YYYY',value:fmtDob(D.dob),'aria-label':'Birthday, day month year',onchange:e=>{const v=parseDob(e.target.value);if(v)setDob(v);else{toast('USE DD/MM/YYYY');e.target.value=fmtDob(D.dob)}}});
      shell(edit?'MY INFO':'ABOUT YOU',[h('h2',{},'TELL US ABOUT YOU'),h('span',{class:'small'},'No sign-up. This stays on your phone and shapes your plan, character and gym map. You can skip and finish it later.'),
        h('label',{class:'field',for:'nm'},h('span',{class:'label'},'NAME'),h('input',{id:'nm',maxlength:14,value:D.name==='Player'?'':D.name,placeholder:'Your name',autocomplete:'given-name',oninput:e=>{D.name=e.target.value;const c=ov.querySelector('#cta');if(c)c.disabled=!okName()}})),
        h('div',{class:'field'},h('div',{class:'row spread nowrap'},h('span',{class:'label'},'BIRTHDAY'),ageTag),h('div',{class:'stepper'},dobIn,h('button',{class:'stp','aria-label':'Open calendar',onclick:()=>datePicker(D.dob,setDob)},px('cal',3)))),
        h('div',{class:'field'},h('span',{class:'label'},'SEX'),h('div',{class:'seg big'},[['m','MALE'],['f','FEMALE']].map(([v,t])=>h('button',{'aria-pressed':String(D.sex===v),
          onclick:()=>{if(D.sex!==v){D.sex=v;if(!edit)D.char=defChar(v);fixHead(D.char,v)}draw()}},t)))),
        stepper('ht','HEIGHT (CM)',D.height,120,230,1,v=>D.height=v),
        stepper('wt','WEIGHT ('+SET.units.toUpperCase()+')',lb?Math.round(D.weight*2.2046):D.weight,lb?66:30,lb?550:250,lb?1:.5,v=>D.weight=lb?Math.round(v/2.2046*10)/10:v),
        countryField(D.country,c=>{D.country=c;if((CITIES[D.city]||CITIES.Other)[0]!==c){const cs=Object.keys(CITIES).filter(k=>CITIES[k][0]===c);if(cs.length){D.city=cs[0];const cf=ov.querySelector('#cityf');if(cf)cf.replaceChildren(cityField(D))}}if(D.day)D.day.wk=defWeekend(c)}),
        h('p',{class:'note'},'Heads up: some outfits you unlock as you level up are traditional clothes and kits from your country.'),
        h('div',{id:'cityf'},cityField(D))],edit?'SAVE':'NEXT ▶',okName()||edit,true);return}
    if(step==='hello'){ov.replaceChildren(h('header',{},px('dumb',2),h('span',{class:'logo grow',style:'font-size:10px'},'YOUR PLAN'),h('span',{class:'chip'},'STEP 2/4'),modeToggle()),
        h('main',{class:'anim',style:'justify-content:center;gap:18px'},frontFig(SCN.wave,()=>D,()=>D.char,{wink:true}),h('h1',{},'LET\'S PERSONALIZE YOUR GOALS TOGETHER'),
          h('p',{},`Nice to meet you, ${D.name.trim()||'champ'}. Answer a few quick questions and IronBit builds your weekly plan, your protein target and your XP path.`)),
        h('div',{style:'padding:12px 14px;display:flex;gap:10px;background:var(--panel);border-top:4px solid var(--line)'},h('button',{class:'btn ghost',onclick:back,'aria-label':'Back'},'◀'),h('button',{class:'btn grow',onclick:next},'LET\'S DO IT ▶')));return}
    if(step==='goal'){const G=D.goal,seg=(key,opts)=>h('div',{class:'seg'},opts.map(([v,t])=>h('button',{'aria-pressed':String(G[key]===v),onclick:()=>{G[key]=v;draw()}},t)));
      shell(edit?'MY GOAL':'YOUR GOAL',[h('h2',{},'WHAT\'S YOUR MAIN GOAL?'),
        h('div',{class:'list'},Object.entries(GOALS).map(([k,[t,d]])=>h('button',{class:'opt','aria-pressed':String(G.type===k),onclick:()=>{G.type=k;draw()}},
          px({lose:'flame',muscle:'dumb',strength:'bolt',fit:'heart',endurance:'star'}[k],3),h('span',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('h3',{},t),h('span',{class:'small'},d))))),
        h('span',{class:'label'},'EXPERIENCE'),seg('level',[['beginner','NEW'],['intermediate','SOME'],['advanced','A LOT']]),
        h('span',{class:'label'},'DAYS PER WEEK'),seg('days',[[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']]),
        h('span',{class:'label'},'SESSION LENGTH'),seg('mins',[[30,'30M'],[45,'45M'],[60,'60M'],[90,'90M']]),
        h('span',{class:'label'},'WHERE YOU TRAIN'),seg('equip',[['gym','FULL GYM'],['db','DUMBBELLS'],['none','NO EQUIPMENT']]),
        h('label',{class:'field',for:'tw'},h('span',{class:'label'},'TARGET WEIGHT '+SET.units.toUpperCase()+' (OPTIONAL)'),h('input',{id:'tw',type:'number',inputmode:'numeric',placeholder:'e.g. '+(SET.units==='lb'?Math.round(D.weight*2.2):Math.round(D.weight)),
          value:G.target?(SET.units==='lb'?Math.round(G.target*2.2046):G.target):'',onchange:e=>{const v=+e.target.value;G.target=v?(SET.units==='lb'?Math.round(v/2.2046*10)/10:v):null}})),h('div',{class:'box'},h('span',{class:'label'},'YOUR DAY · YOUR AVATAR FOLLOWS IT'),timeField('I WAKE UP AT',(D.day=D.day||{...DAYDEF}).wake,v=>{D.day.wake=v;draw()},'sun'),timeField('I GO TO SLEEP AT',D.day.sleep,v=>{D.day.sleep=v;draw()},'moon')),
        (()=>{const dd=D.day;if(!dd.job)dd.job=dd.work===false?'none':'office';if(!dd.wk)dd.wk=defWeekend(D.country);const jb=JOBS.find(j=>j[0]===dd.job)||JOBS[0];
          return[pickField('WHAT DO YOU DO?',dd.job,{icon:px({office:'note',student:'star',remote:'house',shop:'leg',health:'heart',field:'pin',none:'sun'}[dd.job],2),text:jb[1]},()=>pickList('WHAT DO YOU DO?',JOBS.map(([id,n])=>({id,label:n})),dd.job,v=>{dd.job=v;dd.work=v!=='none';draw()})),
            h('div',{class:'field'},h('span',{class:'label'},'YOUR WEEKEND'),h('div',{class:'seg'},DAYS.map((dn,i)=>h('button',{'aria-pressed':String(dd.wk.includes(i)),onclick:()=>{dd.wk=dd.wk.includes(i)?dd.wk.filter(x=>x!==i):[...dd.wk,i].sort();draw()}},dn))))]})(),
        D.day.job!=='none'?h('div',{class:'box'},h('span',{class:'label'},D.day.job==='student'?'CLASS HOURS':'WORK HOURS'),timeField(D.day.job==='student'?'CLASSES START':'WORK STARTS',D.day.ws,v=>{D.day.ws=v;draw()},'note'),timeField(D.day.job==='student'?'CLASSES END':'WORK ENDS',D.day.we,v=>{D.day.we=v;draw()},'note')):null],edit?'SAVE':'NEXT ▶',true,true);return}
    if(step==='char')charStep();if(step==='done')doneStep()}
  let ctab=ctab0||'body';
  function charStep(){const C=D.char;
    const front=h('div',{class:'stage fr'},show(drawFront(D,C),4)),side=h('div',{class:'stage sd'},player('curl',0,{getChar:()=>D.char,getProf:()=>D}).el);
    const redraw=()=>{front.replaceChildren(show(drawFront(D,C),4))};
    const sw=(key,cols)=>h('div',{class:'sw'},cols.map(c=>h('button',{'aria-label':c,'aria-pressed':String(C[key]===c),style:`background:${c}`,onclick:e=>{C[key]=c;[...e.currentTarget.parentNode.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));redraw()}})));
    const ch=(key,opts)=>h('div',{class:'seg'},opts.map(o=>{const lk=key==='top'||key==='head'?key:null,ok=!lk||unlocked(lk,o);return h('button',{'aria-pressed':String(C[key]===o),class:ok?null:'locked',onclick:e=>{if(!ok){toast('UNLOCKS AT LVL '+lockLvl(lk,o));return}C[key]=o;[...e.currentTarget.parentNode.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));redraw()}},(ok?'':'L'+lockLvl(lk,o)+' · ')+(LABELS[o]||o.toUpperCase()))}));
    const accs=h('div',{class:'seg'},ACCS.map(a=>{const ok=unlocked('acc',a);return h('button',{'aria-pressed':String(C.acc.includes(a)),class:ok?null:'locked',onclick:e=>{if(!ok){toast('UNLOCKS AT LVL '+lockLvl('acc',a));return}C.acc=C.acc.includes(a)?C.acc.filter(x=>x!==a):[...C.acc,a];e.currentTarget.setAttribute('aria-pressed',String(C.acc.includes(a)));redraw()}},(ok?'':'L'+lockLvl('acc',a)+' · ')+(LABELS[a]||a.toUpperCase()))}));
    const bd=build(D);
    const panes={body:()=>[h('span',{class:'label'},'SKIN TONE'),sw('skin',SKINS),h('span',{class:'label'},'EYE COLOR'),sw('eye',EYES),
        h('p',{class:'note'},`Body shape follows your stats: ${D.height} cm, ${fmtW(D.weight)}, ${['slim','average','solid','heavy'][bd.b]} build. Update your weight later and your character changes too.`)],
      hair:()=>[h('span',{class:'label'},'HAIR STYLE'),ch('hair',HAIRS),h('span',{class:'label'},'HAIR COLOR'),sw('hairC',HAIRC),h('span',{class:'label'},'BEARD'),ch('beard',BEARDS)],
      outfit:()=>[h('span',{class:'label'},'TOP'),ch('top',TOPS.filter(x=>topOk(x,D.sex))),sw('topC',CLOTH),h('span',{class:'label'},'BOTTOMS'),ch('bottom',BOTS),sw('botC',CLOTH),h('span',{class:'label'},'SHOES'),sw('shoeC',CLOTH)],
      gear:()=>[h('span',{class:'label'},'HEADWEAR'),ch('head',HEADS.filter(x=>headOk(x,D.sex))),sw('headC',CLOTH),h('span',{class:'label'},'ACCESSORIES'),accs,h('span',{class:'label'},'WRISTBAND COLOR'),sw('accC',CLOTH)]};
    shell(edit?'MY CHARACTER':'YOUR CHARACTER',[
      h('div',{class:'pv2'},front,side),
      h('div',{class:'row nowrap'},h('button',{class:'btn ghost grow',onclick:()=>{D.char=sanitizeChar(randChar(D.sex),D.sex);charStep()}},'RANDOM'),h('button',{class:'btn ghost grow',onclick:()=>{D.char=defChar(D.sex);charStep()}},'RESET')),
      h('div',{class:'tabs',role:'tablist'},[['body','BODY'],['hair','HAIR'],['outfit','OUTFIT'],['gear','GEAR']].map(([k,t])=>h('button',{role:'tab','aria-selected':String(ctab===k),onclick:()=>{ctab=k;charStep()}},t))),
      ...panes[ctab]()],edit?'SAVE':'ALMOST DONE ▶',true,true)}
  function doneStep(){const keep=P;P=D;const c=calc(),w=weekPlan(),R=allR(),nr=REWARDS[0];P=keep;
    ov.replaceChildren(h('header',{},px('star',3),h('span',{class:'logo grow',style:'font-size:10px'},'ALL SET'),modeToggle()),
      h('main',{class:'anim',style:'gap:14px'},h('div',{class:'pv2'},h('div',{class:'stage fr'},show(drawFront(D,D.char,'great'),4)),h('div',{class:'stage sd'},player('curl',0,{getChar:()=>D.char,getProf:()=>D}).el)),
        h('h1',{},`YOU'RE ALL SET, ${(D.name.trim()||'CHAMP').toUpperCase()}!`),
        h('div',{class:'macro'},h('div',{},h('span',{class:'label'},'TRAINING'),h('span',{class:'num',style:'font-size:11px'},D.goal.days+'×/WK')),h('div',{},h('span',{class:'label'},'PROTEIN'),h('span',{class:'num',style:'font-size:11px'},c.pro+'G')),h('div',{},h('span',{class:'label'},'KCAL'),h('span',{class:'num',style:'font-size:11px'},c.kcal))),
        h('div',{class:'week'},w.map((r,i)=>h('div',{class:r?'on':''},DAYS[i].slice(0,2),r?px('dumb',2):h('span',{},'·'),r?R[r].name.split(' ')[0].slice(0,5):'REST'))),
        xpRules(),h('p',{class:'note'},`Your first reward unlocks at LVL ${nr[0]}: ${nr[3].toLowerCase()}.`)),
      h('div',{style:'padding:12px 14px;display:flex;gap:10px;background:var(--panel);border-top:4px solid var(--line)'},h('button',{class:'btn ghost',onclick:()=>{step='char';draw()},'aria-label':'Back'},'◀'),h('button',{class:'btn grow',onclick:finish},'ENTER IRONBIT ▶')))}
  draw()}
