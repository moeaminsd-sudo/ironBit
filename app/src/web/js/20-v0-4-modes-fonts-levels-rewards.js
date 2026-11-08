/* ================= v0.4: modes, fonts, levels, rewards ================= */
const FONTS={classic:['CLASSIC PIXEL','"Press Start 2P"','"VT323"',1,1],blocky:['BLOCKY','Silkscreen','"VT323"',1.25,1],soft:['SOFT PIXEL','"Pixelify Sans"','"Pixelify Sans"',1.45,.82],
  dot:['DOT MATRIX','"DotGothic16"','"DotGothic16"',1.35,.8],jersey:['JERSEY','"Jersey 10"','"Jersey 10"',1.9,1.05],normal:['NORMAL','system-ui,-apple-system,"Segoe UI",Roboto,sans-serif','system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',1.4,.8]};
function curMode(){if(SET.modeTime)return timeMode();return SET.modeAuto?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):SET.mode}
function toggleMode(){SET.modeAuto=false;SET.mode=curMode()==='dark'?'light':'dark';save();applyTheme();refreshModeIcons()}
function refreshModeIcons(){document.querySelectorAll('.modeT').forEach(b=>{b.replaceChildren(px(curMode()==='dark'?'sun':'moon',3));b.setAttribute('aria-label',curMode()==='dark'?'Switch to light mode':'Switch to dark mode')})}
function modeToggle(){return h('button',{class:'icon-btn modeT','aria-label':curMode()==='dark'?'Switch to light mode':'Switch to dark mode',onclick:toggleMode},px(curMode()==='dark'?'sun':'moon',2))}
function xpAt(L){return 50*L*(L-1)}
function lvl(){let L=1;while(ST.xp>=xpAt(L+1)&&L<120)L++;return L}
function lvlProg(){const L=lvl(),a=xpAt(L),b=xpAt(L+1);return{L,cur:ST.xp-a,need:b-a,pct:Math.min(100,(ST.xp-a)/(b-a)*100)}}
const RANK_AT=[[1,'ROOKIE'],[3,'IRON ROOKIE'],[5,'BRAWLER'],[8,'IRON KNIGHT'],[12,'GLADIATOR'],[18,'TITAN'],[25,'LEGEND'],[30,'IRON GOD'],[40,'DEMIGOD'],[50,'OLYMPIAN'],[65,'COLOSSUS'],[80,'IMMORTAL'],[100,'ETERNAL'],[120,'MERLIFT\'S EQUAL']];
function rank(){const L=lvl();return RANK_AT.filter(r=>r[0]<=L).pop()[1]}
const UNLOCK={top:{tracksuit:3,kit:5,trad:8,armor:15},head:{bandana:4,crown:30},acc:{cape:18,aura:20},pal:{arcade:7,legend:10},sfx:{arcade:2,chip:12,legend:25}};
function lockLvl(k,id){return(UNLOCK[k]||{})[id]||0}
function unlocked(k,id){return SET.unlockAll||lvl()>=lockLvl(k,id)||owns(k,id)}
const REWARDS=[[2,'sfx','arcade','ARCADE SOUND PACK'],[3,'top','tracksuit','TRACKSUIT'],[4,'head','bandana','BANDANA'],[5,'top','kit','NATIONAL KIT'],[7,'pal','arcade','ARCADE THEME'],
  [8,'top','trad','TRADITIONAL OUTFIT'],[10,'pal','legend','LEGENDARY GOLD THEME'],[12,'sfx','chip','CHIPTUNE SOUND PACK'],[15,'top','armor','KNIGHT ARMOR'],[18,'acc','cape','HERO CAPE'],
  [20,'acc','aura','GOLDEN AURA'],[25,'sfx','legend','LEGENDARY SOUND PACK'],[30,'head','crown','IRON CROWN']];
const nextReward=()=>REWARDS.find(r=>r[0]>lvl());
const LABELS={kit:'NATIONAL KIT',trad:'TRADITIONAL',imma:'TURBAN',armor:'KNIGHT ARMOR',aura:'GOLD AURA'};
const headOk=(hd,sex)=>!(sex==='m'&&hd==='hijab')&&!(sex==='f'&&(hd==='ghutra'||hd==='imma'));
function fixHead(C,sex){if(!headOk(C.head,sex))C.head='none';if(sex==='f'&&C.top==='kandura')C.top='tee';return C}
function sanitizeChar(C,sex){fixHead(C,sex);if(!unlocked('top',C.top))C.top='tee';if(!unlocked('head',C.head))C.head='none';C.acc=C.acc.filter(a=>unlocked('acc',a));return C}
function flagCols(code){const cols=[];(FL[code]||FL.XX)[2].forEach(op=>{if(op[0]==='h'||op[0]==='v')cols.push(...op[1]);else if(typeof op[1]==='string')cols.push(op[1])});const u=[...new Set(cols)];return u.length>1?u:['#2d6b8f','#ffffff']}
const GULF={m:['kandura','#f6f3ec','ghutra'],f:['kandura','#26232e','hijab']},LEVANT={m:['kandura','#f3efe6','ghutra'],f:['kandura','#c0392b','hijab']},SOUTHASIA={m:['kurta','#f2b84b',null],f:['kurta','#e84393',null]};
const TRAD={SD:{m:['kandura','#f6f3ec','imma'],f:['kandura','#e84393','hijab']},EG:{m:['kandura','#5b7fa6',null],f:['kandura','#7b6fb0','hijab']},
  AE:GULF,SA:GULF,QA:GULF,KW:GULF,BH:GULF,OM:{m:['kandura','#f6f3ec','imma'],f:['kandura','#2d6b8f','hijab']},JO:LEVANT,SY:LEVANT,LB:LEVANT,IQ:LEVANT,YE:{m:['kandura','#f3efe6','imma'],f:['kandura','#26232e','hijab']},
  IN:SOUTHASIA,PK:{m:['kurta','#f3efe6',null],f:['kurta','#3fc1b0',null]},BD:SOUTHASIA,NP:SOUTHASIA,LK:SOUTHASIA,SO:{m:['kandura','#f3efe6',null],f:['kandura','#2d6b8f','hijab']},
  PH:{m:['compression','#f3efe6',null],f:['compression','#f6e9d0',null]},MA:{m:['kandura','#8d6e63',null],f:['kandura','#e84393','hijab']}};
function effChar(pr,C){if(C.top!=='kit'&&C.top!=='trad')return C;const o={...C},cc=(pr&&pr.country)||'XX',sex=(pr&&pr.sex)||'m';
  if(C.top==='trad'&&TRAD[cc]){const[t,col,hd]=TRAD[cc][sex];o.top=t;o.topC=col;if(hd&&C.head==='none'){o.head=hd;o.headC=hd==='hijab'?shade(col,-.15):'#f6f3ec'}return o}
  const fc=flagCols(cc);o.top='tee';o.topC=C.top==='trad'?'#f2c14e':fc[0];o.kit2=fc.find(x=>x!==o.topC)||'#ffffff';return o}
function rewardIcon(r){const[,k,id]=r;if(k==='kb')return kbIcon(2,id);if(k==='pal'){const t=PALS[id].dark;return h('span',{class:'row nowrap',style:'gap:0;flex:none'},[t.bg,t.a1,t.a2,t.a3].map(c=>h('i',{style:`width:6px;height:14px;display:block;background:${c}`})))}
  return px(k==='top'?'shirt':k==='head'?(id==='crown'?'crown':'hat'):k==='acc'?id:'note',2)}
function gainXP(n){if(!n)return;const b=lvl();ST.xp+=n;save();updXpTop();SFX.coin();buzz(25);toast('+'+n+' XP');const a=lvl();if(a>b)setTimeout(()=>levelUp(a),600)}
function xpRules(){return h('div',{class:'box'},h('span',{class:'label'},'HOW XP WORKS'),
  ...[['dumb','Finish a set: 10, 20 or 30 XP, depending on how hard the exercise is'],['flame','XP is banked when the session timer reaches 0, plus a 50–150 XP finish bonus'],['bolt','Pause whenever you need. Ending early banks nothing'],
    ['star','Level up to unlock outfits, themes and sound packs'],['club','Only finished sessions count on the leaderboard'],['heart','Small bonuses for logging food, your mood and posts']].map(([i,t])=>h('div',{class:'row nowrap',style:'align-items:flex-start'},px(i,2),h('span',{},t))))}
function xpHelp(){let m;m=modal(xpRules(),h('button',{class:'btn',onclick:()=>{m.remove();openLevelMap()}},'SEE LEVEL MAP'),h('button',{class:'btn ghost',onclick:()=>m.remove()},'GOT IT'))}
function sheet(title,build){const ov=h('div',{class:'overlay'}),body=h('main',{class:'anim'});APP.append(ov);const close=()=>ov.remove();
  ov.append(h('header',{},h('button',{class:'btn ghost',style:'padding:8px 10px','aria-label':'Back',onclick:close},'◀'),h('span',{class:'logo grow',style:'font-size:10px'},title),modeToggle()),body);
  const redraw=()=>body.replaceChildren(...build(redraw,close).flat().filter(Boolean));redraw();return ov}
function openLevelMap(){sheet('LEVEL MAP',()=>{const L=lvl(),N=120,H=N*64+40,wrap=h('div',{class:'lmap',style:`height:${H}px`}),NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox',`0 0 100 ${H}`);svg.setAttribute('preserveAspectRatio','none');const pos=i=>({x:50+Math.sin(i*.8)*30,y:H-30-(i-1)*64});
  const line=(from,to,col,dash)=>{const pl=document.createElementNS(NS,'polyline'),pp=[];for(let i=from;i<=to;i++){const p=pos(i);pp.push(p.x+','+p.y)}pl.setAttribute('points',pp.join(' '));pl.style.fill='none';pl.style.stroke=col;pl.setAttribute('stroke-width','6');pl.setAttribute('vector-effect','non-scaling-stroke');if(dash)pl.setAttribute('stroke-dasharray','6 6');svg.append(pl)};
  line(1,N,'var(--line)',true);if(L>1)line(1,Math.min(L,N),'var(--a3)',false);wrap.append(svg);
  for(let i=1;i<=N;i++){const p=pos(i),rw=REWARDS.find(r=>r[0]===i),st=i<L?'done':i===L?'cur':'todo';
    wrap.append(h('div',{class:'lnode '+st,style:`left:${p.x}%;top:${p.y}px`,'aria-label':'Level '+i+(st==='cur'?', you are here':'')},i===L?headIcon(P,P.char,2,todayMood()):h('span',{},i)));
    if(!rw&&COLL_AT[i]){const c=CBYID[COLL_AT[i]],got=ownsC(c.id);wrap.append(h('div',{class:'lrew'+(i<=L?' got':''),style:`top:${p.y}px;${p.x>50?'right:'+(100-p.x+9)+'%':'left:'+(p.x+9)+'%'};border-color:${RARITY[c.r][1]}`},collIcon(c,1,!got&&i>L),h('span',{class:'label',style:`color:${RARITY[c.r][1]}`},(i<=L?'':'LVL '+i+' · ')+(got||i<=L?c.n:RARITY[c.r][0]+' RELIC'))))}
    if(!rw&&i%5===0){const ck=i%10===0?'vault':'crate';wrap.append(h('div',{class:'lrew'+(i<=L?' got':''),style:`top:${p.y}px;${p.x>50?'right:'+(100-p.x+9)+'%':'left:'+(p.x+9)+'%'}`},show(chestCanvas(ck,i<=L),1),h('span',{class:'label'},(i<=L?'':'LVL '+i+' · ')+CHEST_INFO[ck][0])))}
    if(rw)wrap.append(h('div',{class:'lrew'+(i<=L?' got':''),style:`top:${p.y}px;${p.x>50?'right:'+(100-p.x+9)+'%':'left:'+(p.x+9)+'%'}`},rewardIcon(rw),h('span',{class:'label'},(i<=L?'':'LVL '+i+' · ')+rw[3])))}
  setTimeout(()=>{const cur=wrap.querySelector('.lnode.cur');cur&&cur.scrollIntoView({block:'center'})},80);
  const pr=lvlProg(),nr=nextReward();
  return[h('div',{class:'box'},h('div',{class:'row spread'},h('h3',{},'LVL '+pr.L+' · '+rank()),h('span',{class:'small'},pr.cur+' / '+pr.need+' XP')),h('div',{class:'bar'},h('i',{style:`width:${pr.pct}%`})),
    nr?h('span',{class:'small'},`Next: ${nr[3].toLowerCase()} at LVL ${nr[0]}`):null),wrap]})}
