/* ================= club ================= */
let clubTab='feed',lbTab='league',draftImg=null,SCENE=null;
const DEMO_USERS=[['Layla','f','JO',8200],['Omar','m','EG',7400],['Aisha','f','AE',6900],['Ravi','m','IN',6100],['Fatima','f','SD',5200],['Jake','m','GB',4800],['Mei','f','CN',4100],['Yusuf','m','TR',3600],['Grace','f','PH',2900],['Hassan','m','SA',2200]];
function randCharR(r,sex){const pk=a=>a[Math.floor(r()*a.length)];return{skin:pk(SKINS),eye:pk(EYES),hair:sex==='f'?pk(['long','bun','curly','afro']):pk(['short','buzz','curly','afro','bald']),hairC:pk(HAIRC.slice(0,7)),
  beard:sex==='f'?'none':pk(BEARDS),top:pk(['tee','tank','hoodie','compression']),topC:pk(CLOTH),bottom:pk(BOTS),botC:pk(CLOTH),shoeC:pk(CLOTH),
  head:sex==='f'&&r()<.4?'hijab':pk(['none','none','cap','headband']),headC:pk(CLOTH),acc:ACCS.filter(()=>r()<.2),accC:pk(CLOTH)}}
const DU={};function demoUser(i){if(DU[i])return DU[i];const[n,s,c,xp]=DEMO_USERS[i],r=rng('u'+n);return DU[i]={name:n,sex:s,country:c,xp,height:158+Math.floor(r()*30),weight:55+Math.floor(r()*35),char:randCharR(r,s)}}
function headIcon(pr,C,s=2,mood){const f=drawFront(pr,C,mood),d=f.getContext('2d').getImageData(0,0,36,52).data;let top=0;
  outer:for(let y=0;y<52;y++)for(let x=0;x<36;x++)if(d[(y*36+x)*4+3]>40){top=y;break outer}
  const[c,g]=mk(18,18);g.drawImage(f,9,Math.max(0,top),18,18,0,0,18,18);return show(c,s)}
function sceneImg(){if(SCENE)return SCENE;const[c,g]=mk(96,72);R(g,'#33285f',0,0,96,50);R(g,'#4a3d85',0,48,96,2);R(g,'#5b4a63',0,50,96,22);for(let x=0;x<96;x+=8)R(g,'#4b3b52',x,50,1,22);
  R(g,'#f2b84b',10,8,22,16);R(g,'#ffe08a',12,10,18,12);disc(g,'#ff6b57',21,17,4);R(g,'#f2b84b',12,19,18,1);
  R(g,'#26232e',50,18,3,32);R(g,'#26232e',82,18,3,32);R(g,'#c7cde0',44,24,46,2);R(g,'#3fc1b0',45,19,4,12);R(g,'#3fc1b0',85,19,4,12);
  for(let i=0;i<4;i++){R(g,'#3d3a4f',8+i*10,58,3,6);R(g,'#c7cde0',10+i*10,60,6,2);R(g,'#3d3a4f',15+i*10,58,3,6)}
  R(g,'#7b6fb0',58,58,30,4);R(g,'#26232e',60,62,2,6);R(g,'#26232e',84,62,2,6);return SCENE=c.toDataURL()}
function seedClub(){const now=Date.now(),Hr=3600e3;return{posts:[
  {id:'d1',u:0,t:'New squat PR today: 80 kg for 3 clean reps. Slow progress is still progress!',time:now-2*Hr,likes:24,cm:[[1,'Huge! Keep going'],[4,'So inspiring']]},
  {id:'d2',u:1,t:'Morning session done before work. Push day hits different at 6 AM.',time:now-5*Hr,likes:17,cm:[[3,'Respect for the early start']],img:'scene'},
  {id:'d3',u:3,t:'Tried the plate calculator: chicken + rice + hummus gave me 55 g of protein. Lunch sorted.',time:now-20*Hr,likes:31,cm:[]},
  {id:'d4',u:4,t:'First full week without missing a workout. 7-day streak!',time:now-30*Hr,likes:45,cm:[[0,'Well done!'],[2,'Keep that streak alive']]}],
  liked:{},voted:{},ideas:[{id:'i1',type:'food',title:'Shakshuka',desc:'Eggs cooked in tomato sauce. A great high-protein breakfast.',by:2,votes:12},
   {id:'i2',type:'train',title:'Kettlebell workouts',desc:'Add kettlebell swings and goblet holds for home training.',by:5,votes:9}]}}
let CLUB=store.get('club',null)||seedClub();const saveClub=()=>store.set('club',CLUB);
const ago=t=>{const s=(Date.now()-t)/1000;return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':Math.floor(s/86400)+'d ago'};
function clubScreen(){const tabs=[['feed','FEED'],['board','RANKS'],['ideas','IDEAS']];
  return[h('div',{class:'tabs',role:'tablist'},tabs.map(([id,t])=>h('button',{role:'tab','aria-selected':String(clubTab===id),onclick:()=>{clubTab=id;render()}},t))),...({feed:feedView,board:boardView,ideas:ideasView}[clubTab])()]}
function feedView(){const ta=h('textarea',{id:'pt',maxlength:280,placeholder:'Share a win, a PR or some motivation'}),imgPrev=h('div');
  const drawPrev=()=>imgPrev.replaceChildren(...(draftImg?[h('div',{class:'row nowrap'},h('img',{src:draftImg,alt:'Your pixel photo',style:'width:72px;image-rendering:pixelated;border:2px solid var(--line)'}),h('button',{class:'btn ghost',style:'padding:8px',onclick:()=>{draftImg=null;drawPrev()}},'REMOVE'))]:[]));drawPrev();
  const posts=[...CLUB.posts].sort((a,b)=>b.time-a.time);
  return[h('div',{class:'box'},h('div',{class:'row nowrap'},headIcon(P,P.char,2),h('span',{class:'label grow'},'POST TO THE CLUB')),ta,imgPrev,
     h('div',{class:'row nowrap'},h('button',{class:'btn ghost','aria-label':'Open pixel camera',onclick:()=>pixelCamera(d=>{draftImg=d;drawPrev()})},px('cam',2),' CAMERA'),h('button',{class:'btn grow',onclick:()=>{const t=ta.value.trim();if(!t&&!draftImg){toast('WRITE SOMETHING FIRST');return}
       CLUB.posts.push({id:'p'+Date.now(),me:true,t,img:draftImg,time:Date.now(),likes:0,cm:[]});draftImg=null;saveClub();addXP(5);render()}},'POST'))),
   ...posts.map(postCard),adSlot(),h('p',{class:'note'},'Demo club: the other members and their posts are samples. Real posts sync once the online version is live.')]}
function postCard(p){const u=p.me?P:demoUser(p.u),liked=!!CLUB.liked[p.id],cmBox=h('div',{class:'list',hidden:true});let open=false;
  const cmBtn=h('button',{'aria-label':'Comments','aria-expanded':'false',onclick:()=>{open=!open;cmBox.hidden=!open;cmBtn.setAttribute('aria-expanded',String(open));if(open)drawCm()}},'COMMENTS',h('span',{},p.cm.length));
  const drawCm=()=>{const inp=h('input',{id:'ci'+p.id,placeholder:'Write a comment',maxlength:140,'aria-label':'Comment'});
    cmBox.replaceChildren(...p.cm.map(([who,t])=>{const uu=who==='me'?P:demoUser(who);return h('div',{class:'row nowrap',style:'align-items:flex-start'},headIcon(uu,uu.char,1.5),h('div',{class:'grow'},h('span',{class:'label'},(uu.name||'YOU').toUpperCase()),h('p',{},t)))}),
      h('div',{class:'row nowrap'},inp,h('button',{class:'btn',onclick:()=>{const t=inp.value.trim();if(!t)return;p.cm.push(['me',t]);saveClub();drawCm();cmBtn.lastChild.textContent=p.cm.length}},'SEND')))};
  const dbBtn=h('button',{'aria-pressed':String(liked),'aria-label':'Give a dumbbell',onclick:()=>{const on=!CLUB.liked[p.id];CLUB.liked[p.id]=on;saveClub();dbBtn.setAttribute('aria-pressed',String(on));dbBtn.lastChild.textContent=p.likes+(on?1:0);if(on){SFX.coin();buzz(20)}}},px('dumb',2),h('span',{},p.likes+(liked?1:0)));
  return h('div',{class:'post'},h('div',{class:'row nowrap'},headIcon(u,u.char,2),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('div',{class:'flagline'},h('h3',{},(u.name||'YOU').toUpperCase()),flag(u.country,1)),h('span',{class:'small'},ago(p.time))),
      p.me?h('button',{class:'btn ghost',style:'padding:6px 8px','aria-label':'Delete post',onclick:()=>{CLUB.posts=CLUB.posts.filter(x=>x!==p);saveClub();render(true)}},'✕')
        :h('div',{class:'row nowrap',style:'gap:6px'},followBtn(p.u,true),h('button',{class:'btn ghost',style:'padding:6px 8px','aria-label':'Report post',onclick:()=>toast('REPORTED. THANKS!')},'⚑'))),
    p.t?h('p',{},p.t):null,p.img?h('img',{src:p.img==='scene'?sceneImg():p.img,alt:'Pixel photo'}):null,h('div',{class:'acts'},dbBtn,cmBtn),cmBox)}
const weekKey=d=>{const t=new Date(d);t.setDate(t.getDate()-(t.getDay()+6)%7);return dstr(t)};
function ideasView(){const sc=i=>i.votes+(CLUB.voted[i.id]?1:0),ideas=[...CLUB.ideas].sort((a,b)=>sc(b)-sc(a));
  return[h('h2',{},'SUGGEST AN IDEA'),h('div',{class:'row nowrap'},h('button',{class:'btn alt grow',onclick:foodIdeaModal},'+ A FOOD'),h('button',{class:'btn grow',onclick:trainIdeaModal},'+ A TRAINING IDEA')),
   h('span',{class:'small'},'Foods you add appear in your food list right away. Vote for the ideas you like with dumbbells.'),
   h('div',{class:'list'},ideas.map(i=>{const v=!!CLUB.voted[i.id],by=i.by==='me'?(P.name||'You'):demoUser(i.by).name;
     const b=h('button',{'aria-pressed':String(v),'aria-label':'Vote with a dumbbell',onclick:()=>{CLUB.voted[i.id]=!v;saveClub();render(true)}},px('dumb',2),h('span',{},sc(i)));
     return h('div',{class:'post'},h('div',{class:'row spread nowrap'},h('h3',{},i.title.toUpperCase()),h('span',{class:'tag'+(i.type==='food'?' s':'')},i.type==='food'?'FOOD':'TRAINING')),
       i.desc?h('p',{},i.desc):null,h('div',{class:'acts'},b,h('span',{class:'small'},'by '+by)))}))]}
function foodIdeaModal(){let m;const F=(id,t,attrs)=>h('label',{class:'field',for:id},h('span',{class:'label'},t),h('input',{id,...attrs}));
  const num={type:'number',inputmode:'decimal',min:0};
  m=modal(h('h2',{},'ADD A FOOD'),h('span',{class:'small'},'Enter values for one serving, from the package or a trusted source.'),
    F('fn','NAME',{maxlength:28,placeholder:'e.g. Shakshuka'}),h('div',{class:'row nowrap'},F('fs','SERVING (G)',{...num,value:100}),F('fl','SERVING NAME',{maxlength:14,placeholder:'1 bowl'})),
    h('div',{class:'row nowrap'},F('fk','KCAL',num),F('fp','PROTEIN G',num)),h('div',{class:'row nowrap'},F('fc','CARBS G',num),F('ff','FAT G',num)),
    h('button',{class:'btn',onclick:()=>{const v=id=>+document.getElementById(id).value||0,n=document.getElementById('fn').value.trim(),sg=Math.max(1,v('fs'));if(!n){toast('ADD A NAME');return}
      const k=x=>Math.round(x/sg*1000)/10,f={id:'my'+Date.now(),n,cat:'MINE',sg,sl:document.getElementById('fl').value.trim()||'1 serving',k:k(v('fk')),p:k(v('fp')),c:k(v('fc')),fi:0,su:0,f:k(v('ff')),sa:0,na:0,icon:'custom'};
      MYFOODS.push(f);FOODS.push(f);FOOD[f.id]=f;store.set('myfoods',MYFOODS);CLUB.ideas.push({id:'i'+Date.now(),type:'food',title:n,desc:`${v('fp')} g protein, ${v('fk')} kcal per ${f.sl}`,by:'me',votes:0});saveClub();m.remove();addXP(5);render(true)}},'SAVE FOOD'),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CANCEL'))}
function trainIdeaModal(){let m;const t=h('input',{id:'tt',maxlength:30,placeholder:'e.g. Kettlebell swings'}),d=h('textarea',{id:'td',maxlength:240,placeholder:'Describe the exercise or routine idea'});
  m=modal(h('h2',{},'TRAINING IDEA'),h('label',{class:'field',for:'tt'},h('span',{class:'label'},'TITLE'),t),h('label',{class:'field',for:'td'},h('span',{class:'label'},'DETAILS'),d),
    h('button',{class:'btn',onclick:()=>{const tt=t.value.trim();if(!tt){toast('ADD A TITLE');return}CLUB.ideas.push({id:'i'+Date.now(),type:'train',title:tt,desc:d.value.trim(),by:'me',votes:0});saveClub();m.remove();addXP(5);render(true)}},'SHARE IDEA'),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CANCEL'))}

/* ---- pixel camera ---- */
const CAM_PALS={PIXEL:['#1a1433','#5b4a63','#a79fcf','#f6e9d0','#ff6b57','#f2b84b','#3fc1b0','#2d6b8f','#7b6fb0','#c97a3a','#e0a372','#7fb069','#c0392b','#26232e','#9aa3b5','#ffffff'],
  GAMEBOY:['#0f380f','#306230','#8bac0f','#9bbc0f'],MONO:['#111111','#555555','#aaaaaa','#f0f0f0'],SUNSET:['#1a1433','#4a3d85','#c0392b','#ff6b57','#f2b84b','#ffe08a','#f6e9d0']};
function quantize(g,w,hh,pal){const d=g.getImageData(0,0,w,hh),a=d.data,PP=pal.map(c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]),bay=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  for(let i=0;i<a.length;i+=4){const p=i/4,x=p%w,y=(p/w)|0,o=(bay[(y%4)*4+x%4]/16-.5)*44;let best=0,bd=1e12;
    for(let k=0;k<PP.length;k++){const dr=a[i]+o-PP[k][0],dg=a[i+1]+o-PP[k][1],db=a[i+2]+o-PP[k][2],dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=k}}
    a[i]=PP[best][0];a[i+1]=PP[best][1];a[i+2]=PP[best][2];a[i+3]=255}
  g.putImageData(d,0,0)}

/* ---- pro + ads ---- */
function proModal(reason){let m;m=modal(h('div',{class:'row nowrap'},px('star',4),h('h2',{},'IRONBIT PRO')),reason?h('p',{class:'note'},reason):null,
  h('div',{class:'list'},[['No ads','Train without banners'],['Unlimited routines','Build as many as you want'],['Pro themes','Extra color palettes'],['Deep stats','Strength and body charts'],['Cloud backup','Keep data across phones'],['Pro badge','Stand out on the leaderboard']].map(([a,b])=>h('div',{class:'srow'},h('span',{},a),h('span',{class:'small'},b)))),
  h('button',{class:'btn',onclick:()=>{toast('PURCHASES COME WITH THE STORE VERSION');m.remove()}},'GO PRO · PRICE TBD'),h('span',{class:'small'},'Prototype: no payment happens. You can preview Pro from Settings.'),
  h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))}
function adSlot(){return SET.pro?null:h('div',{class:'ad'},h('span',{class:'label'},'AD · SPONSORED SPACE'),h('button',{class:'btn ghost',style:'padding:6px 8px',onclick:()=>proModal()},'REMOVE ADS'))}
