/* ================= nav + boot ================= */
const TABS=[['home','HOME','house'],['train','TRAIN','dumb'],['fuel','FUEL','leg'],['plus','','plus'],['club','CLUB','club'],['map','GYMS','pin'],['me','ME','head']];
const nav=document.getElementById('nav');
function render(keep){if(!P)return;renderKeep=!!keep;const y=keep?scr.scrollTop:(SCROLLS[viewKey()]||0);scr.replaceChildren(...SCREENS[tab]().filter(Boolean));renderKeep=false;updXpTop();updCoinTop();pushWidget();if(tab==='home')setTimeout(()=>maybeMerlift(),1800);scr.scrollTop=y;SCROLLS[viewKey()]=scr.scrollTop;if(!keep){scr.classList.remove('anim');void scr.offsetWidth;scr.classList.add('anim')}requestAnimationFrame(fitAll);
  nav.replaceChildren(...TABS.map(([id,label,ic])=>id==='plus'?h('button',{class:'plus','aria-label':'Quick actions','aria-expanded':'false',onclick:fabMenu},px('plus',4)):h('button',{'aria-current':id===tab?'page':'false',onclick:()=>{closeFab();if(id==='train')trainView='main';tab=id;render()}},id==='me'?h('span',{class:'dockface'},headIcon(P,P.char,2,todayMood())):px(ic==='pin'&&ART.icon_gyms?'gyms':ic==='dumb'&&ART.icon_train?'train':ic,3),label)))}
/* Android back button hook: returns true when it handled the press */
window.ibBack=()=>{if(APP.querySelector('.fab')){closeFab();return true}const m=APP.querySelector('.modal');if(m){m.remove();return true}const o=APP.querySelectorAll('.overlay');if(o.length&&P){o[o.length-1].remove();render();return true}
  if(APP.querySelector('.chestfs,.lvfs,.rrfs,.camfs,.tour'))return true;if(P&&tab!=='home'){tab='home';render();return true}const n=Date.now();if(n-backT>2000){backT=n;toast('PRESS BACK AGAIN TO EXIT');return true}return false};
document.getElementById('logoIcon').append(px('dumb',2));
document.getElementById('gear').append(px('gear',3));devHold(document.getElementById('gear'));
document.getElementById('modeBtn').addEventListener('click',()=>{SET.modeTime=false;toggleMode()});
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(SET.modeAuto){applyTheme();refreshModeIcons()}})}catch(e){}
document.getElementById('gear').addEventListener('click',()=>{tab='settings';render()});
applyTheme();refreshModeIcons();save();
if(P){if(!P.dob)P.dob=(new Date().getFullYear()-(P.age||25))+'-01-01';P.age=ageFrom(P.dob)}
const showLog=P&&META.ver!==VERSION;META.ver=VERSION;save();
if(P)P.me=true;loadArt();document.getElementById('xpTop').addEventListener('click',openLevelMap);document.getElementById('coinTop').addEventListener('click',itemShop);
if(!META.since)META.since=today();loadEmbeddedArt();if(P){syncLevelColl();fixHead(P.char,P.sex)}if(P){syncStreak();setTimeout(wizardSchedule,3000)}if(P&&!META.coins07){META.coins07=true;ST.coins=(ST.coins||0)+100;save()}if(P)checkLeague();
if(!P)onboard('intro',false);else{render();const brief=META.brief!==today();if(brief)openBriefing();if(showLog)setTimeout(changelogModal,900);else if(!brief&&!META.rated&&META.launches>=META.rateNext)setTimeout(rateModal,1500)}
