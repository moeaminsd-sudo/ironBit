/* ================= state (on-device only) ================= */
const DEF_SET={mode:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark',pal:'iron',accent:null,fz:1,crt:false,sfx:true,vol:.5,
  timerBeep:true,vib:true,rest:60,speed:1,units:'kg',lang:'en',testFast:false,pro:false,hap:2,countdown:3,modeAuto:true,font:'classic',sfxPack:'retro',unlockAll:false,pkb:true,kbSize:'m',kbSound:true,kbHap:true,kbSkin:'classic',wizard:true,wizNotif:true,events:true,evOff:[],evFx:true,evPreview:null};
let P=store.get('profile',null);
let SET={...DEF_SET,...store.get('settings',{})};{const raw=store.get('settings',{});if(raw.vib===false&&raw.hap===undefined)SET.hap=0}
let ST={xp:0,streak:0,workouts:0,protein:0,pDate:today(),log:[],sched:{},mood:null,...store.get('stats',{})};
if(P){P.city=P.city||'Dubai';P.custom=P.custom||[];P.myGyms=P.myGyms||{}}
let META={launches:0,rated:false,rateNext:3,donateHide:'',...store.get('meta',{})};
let PLATE=store.get('plate',[['chicken',150],['rice',150],['hummus',60]]);
if(ST.pDate!==today()){ST.protein=0;ST.pDate=today()}
META.launches++;
const save=()=>{store.set('profile',P);store.set('settings',SET);store.set('stats',ST);store.set('meta',META);store.set('plate',PLATE)};
