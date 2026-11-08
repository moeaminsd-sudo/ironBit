/* ================= food ================= */
const plate=g=>{ell(g,'#efe9dc',9,12,7,3);ell(g,'#d9d1bf',9,12,5,2)};
const bowl=(g,fill,hi)=>{for(let y=9;y<=14;y++){const w=Math.round(7-(y-9)*.9);R(g,'#ece6d8',9-w,y,w*2,1);R(g,'#c9c0ad',9+w-2,y,2,1)}R(g,'#b8ae99',6,15,6,1);ell(g,'#f6f2e8',9,9,7,2);ell(g,fill,9,9,6,1);if(hi)R(g,hi,6,8,3,1)};
const ICON={
 chicken:g=>{plate(g);ell(g,'#d49a55',8,10,5,2);R(g,'#ecbd80',5,9,4,1);[[5,11],[8,10],[10,11],[11,9]].forEach(p=>R(g,'#8a5226',p[0],p[1],2,1));pts(g,'#4caf50',[[13,8],[14,9]])},
 egg:g=>{ell(g,'#fbf6ea',9,9,5,6);R(g,'#e3d8c2',12,6,1,7);disc(g,'#f2b234',9,10,2);R(g,'#ffd66b',8,9,1,1);R(g,'#ffffff',6,5,1,2)},
 rice:g=>{bowl(g,'#fbfaf3');ell(g,'#fbfaf3',9,7,5,2);pts(g,'#ddd6c3',[[6,8],[9,6],[11,8],[8,9],[12,7],[7,6]]);pts(g,'#3aa35a',[[10,5],[11,5]])},
 khubz:g=>{ell(g,'#d9a960',9,10,8,5);ell(g,'#efcf98',8,9,6,3);pts(g,'#b97f3f',[[5,9],[9,8],[12,11],[7,12],[11,9],[13,10],[4,11]]);R(g,'#f7e2bb',5,7,4,1)},
 hummus:g=>{bowl(g,'#e8cf9a');ell(g,'#c9a96a',9,9,3,1);ell(g,'#e8cf9a',9,9,1,0);pts(g,'#b9c23a',[[9,9],[8,9],[10,9]]);pts(g,'#c94a2a',[[5,9],[12,9],[10,8]]);pts(g,'#f1dfb5',[[6,8],[13,8]])},
 foul:g=>{bowl(g,'#8a5a32');pts(g,'#5f3a1b',[[5,9],[7,8],[10,9],[12,8],[8,9]]);pts(g,'#d8c23a',[[9,8],[6,9]]);pts(g,'#4caf50',[[11,9],[13,9]]);pts(g,'#e04e3a',[[8,8],[11,8]])},
 laban:g=>{R(g,'#a9d3df',5,2,1,14);R(g,'#a9d3df',12,2,1,14);R(g,'#a9d3df',5,15,8,1);R(g,'#f4f6f2',6,5,6,10);R(g,'#dfe9e6',10,5,2,10);R(g,'#ffffff',6,5,1,9);R(g,'#e8f1f3',6,3,6,2)},
 greek:g=>{R(g,'#f3f1ea',4,6,10,9);R(g,'#d6d1c4',11,6,3,9);R(g,'#2f72c4',4,6,10,2);R(g,'#245a9c',11,6,3,2);ell(g,'#ffffff',9,5,5,1);R(g,'#f2b84b',6,10,5,2)},
 dates:g=>{ell(g,'#6b3410',5,10,2,4);ell(g,'#7a3c14',9,8,2,4);ell(g,'#5e2d0c',13,11,2,4);pts(g,'#b06a3a',[[4,8],[8,6],[12,9]]);pts(g,'#3b1a06',[[6,12],[10,10],[14,13]])},
 oats:g=>{bowl(g,'#d9b98a');pts(g,'#bf9a63',[[5,9],[8,8],[12,9],[10,9]]);disc(g,'#f2d46b',7,8,1);disc(g,'#f2d46b',11,8,1);pts(g,'#5a3b8c',[[9,8],[13,9]]);pts(g,'#c0392b',[[5,8]])},
 banana:g=>{for(let t=0;t<=10;t++){const x=3+t,y=Math.round(11-Math.sin(t/10*Math.PI)*5);R(g,'#f5d142',x,y-1,1,3);R(g,'#c9a227',x,y+1,1,1);if(t>1&&t<9)R(g,'#fff1a0',x,y-1,1,1)}R(g,'#5b3a1a',3,10,1,2);R(g,'#7a8a2a',13,9,1,2)},
 salmon:g=>{plate(g);ell(g,'#f48a5c',8,10,5,2);pts(g,'#ffd2bd',[[5,10],[7,9],[9,10],[11,9],[6,11],[10,11]]);R(g,'#e5683a',6,12,5,1);R(g,'#f5d142',13,8,3,2);R(g,'#fff1a0',14,8,1,1)},
 hammour:g=>{plate(g);ell(g,'#e3dccb',8,10,5,2);R(g,'#e3dccb',13,9,1,3);R(g,'#e3dccb',14,8,1,5);[[6,9],[8,10],[10,9]].forEach(p=>R(g,'#8a6a46',p[0],p[1],1,2));R(g,'#2b1d2e',4,9,1,1);R(g,'#f5d142',5,12,3,1)},
 kofta:g=>{plate(g);[7,10].forEach(y=>{R(g,'#d8b98a',2,y+1,14,1);ell(g,'#7a3e22',8,y+1,5,1);pts(g,'#a0582e',[[5,y],[8,y],[11,y]])});pts(g,'#4caf50',[[13,13],[14,12]])},
 lentils:g=>{bowl(g,'#e08a2c','#f2a84a');pts(g,'#b5651d',[[6,9],[10,8],[12,9]]);R(g,'#f5d142',12,6,3,2);R(g,'#fff1a0',13,6,1,1)},
 almonds:g=>{[[4,6],[11,5],[6,12],[12,12]].forEach(([x,y])=>{ell(g,'#b5763d',x,y,2,3);R(g,'#d4955a',x-1,y-1,1,2);R(g,'#8a5226',x+1,y,1,2)})},
 whey:g=>{R(g,'#2b2b3a',5,4,8,12);R(g,'#3fc1b0',5,2,8,2);R(g,'#2c998b',6,1,6,1);R(g,'#ff6b57',5,8,8,3);R(g,'#ffffff',7,9,4,1);R(g,'#4a4a5e',6,5,1,9)},
 shawarma:g=>{lineW(g,[4,13],[12,5],5,'#e6c38c');lineW(g,[4,13],[8,9],5,'#c9cfd8');R(g,'#eef1f5',3,12,2,1);disc(g,'#c98a4b',12,5,2);pts(g,'#4caf50',[[11,3],[14,5]]);pts(g,'#e04e3a',[[13,4],[11,6]]);pts(g,'#f6f2e8',[[12,6]])},
 falafel:g=>{[[5,11],[12,11],[9,6]].forEach(([x,y])=>{disc(g,'#8a5426',x,y,3);R(g,'#b8783a',x-2,y-2,2,1);R(g,'#5e3517',x+1,y+1,1,1)});R(g,'#6aa84f',8,5,2,2)},
 oil:g=>{R(g,'#3d5a12',7,1,4,1);R(g,'#c9d27a',8,2,2,3);R(g,'#b5c43a',5,5,8,10);R(g,'#d8e07a',6,6,1,8);R(g,'#f6f2e8',6,9,6,3);R(g,'#4caf50',8,10,2,1)},
 avocado:g=>{ell(g,'#2f5a1e',9,9,6,7);ell(g,'#c8d96a',9,9,5,6);ell(g,'#e3eba0',8,7,2,2);disc(g,'#8a5426',9,11,2);R(g,'#b8783a',8,10,1,1)},
 sweetpotato:g=>{ell(g,'#9c4a26',8,10,6,3);pts(g,'#7a3519',[[5,10],[9,11],[11,9]]);pts(g,'#b8643a',[[4,9],[7,8]]);ell(g,'#f08a3a',14,10,1,3);R(g,'#f5a35a',14,9,1,1)},
 broccoli:g=>{R(g,'#9cc46a',8,10,3,6);R(g,'#7da34f',10,10,1,6);[[6,7],[9,5],[12,7],[9,8]].forEach(([x,y])=>disc(g,'#3f8a3a',x,y,2));pts(g,'#64b04e',[[5,6],[8,4],[11,6],[8,7],[13,6]])},
 labneh:g=>{bowl(g,'#fbf8ef');disc(g,'#c9b13a',9,9,1);pts(g,'#6b8e23',[[6,9],[11,8],[12,9],[7,8],[13,9]]);pts(g,'#3b2a1a',[[5,9]])},
 pb:g=>{R(g,'#c9402a',4,3,10,3);R(g,'#a83222',4,5,10,1);R(g,'#c99a5c',4,6,10,9);R(g,'#a87a40',11,6,3,9);R(g,'#f6f2e8',5,9,7,3);R(g,'#8a5226',7,10,3,1)},
 karak:g=>{ell(g,'#d9c39a',9,15,6,1);R(g,'#c88a4f',6,6,6,8);R(g,'#e6c49a',6,5,6,1);R(g,'#a86a32',10,6,2,8);R(g,'#f7e8d4',6,6,1,6);R(g,'#f7e8d4',5,4,8,1)},
 custom:g=>{plate(g);for(let y=0;y<=6;y++){const w=Math.round(Math.sqrt(36-(6-y)*(6-y)));R(g,'#c7cde0',9-w,5+y,w*2,1)}R(g,'#eef1f5',6,7,2,2);R(g,'#9aa3b5',8,3,2,2);R(g,'#9aa3b5',12,8,2,3)},
 machboos:g=>{plate(g);ell(g,'#e8a540',8,10,6,3);ell(g,'#f2bb5a',7,9,4,2);ell(g,'#9c5a2a',10,8,3,2);R(g,'#b8743a',9,7,2,1);R(g,'#f6f2e8',13,6,2,2);pts(g,'#3b2a1a',[[5,11],[9,12],[12,11]]);pts(g,'#f6f2e8',[[6,10],[11,11]]);R(g,'#4caf50',4,10,1,1)}
};
function foodIcon(id,s=3){if(ART['food_'+id])return artCanvas(ART['food_'+id],18*s);const[c,g]=mk(18,18);(ICON[id]||ICON[(FOOD[id]||{}).icon]||ICON.custom)(g);outline(c);return show(c,s)}
const FOODS=[
 ['chicken','Grilled chicken breast','PROTEIN',150,'1 fillet',165,31,0,0,0,3.6,1,74],
 ['egg','Whole egg','PROTEIN',50,'1 large egg',143,12.6,.7,0,.4,9.5,3.1,142],
 ['salmon','Salmon, cooked','PROTEIN',150,'1 fillet',206,22,0,0,0,12,2.5,61],
 ['hammour','Grilled hammour','PROTEIN',150,'1 fillet',118,24.8,0,0,0,1.3,.3,53],
 ['kofta','Beef kofta','PROTEIN',100,'2 skewers',250,17,3,.5,1,19,7,400],
 ['whey','Whey protein','PROTEIN',30,'1 scoop',400,80,8,1,5,6,3,300],
 ['greek','Greek yogurt, 0%','DAIRY',170,'1 tub',59,10,3.6,0,3.2,.4,.1,36],
 ['laban','Laban','DAIRY',250,'1 glass',40,3.3,4.8,0,4.8,1,.6,105],
 ['labneh','Labneh','DAIRY',30,'2 tbsp',155,7,4,0,3,12,7.5,400],
 ['rice','White rice, cooked','CARBS',150,'1 cup',130,2.7,28,.4,.1,.3,.1,1],
 ['khubz','Arabic bread (khubz)','CARBS',60,'1 loaf',275,9,55,2.2,1.5,1.2,.2,530],
 ['oats','Rolled oats, dry','CARBS',40,'½ cup',389,16.9,66.3,10.6,1,6.9,1.2,2],
 ['sweetpotato','Sweet potato, baked','CARBS',150,'1 medium',90,2,20.7,3.3,6.5,.2,.1,36],
 ['lentils','Lentils, cooked','CARBS',200,'1 bowl',116,9,20,7.9,1.8,.4,.1,2],
 ['foul','Foul medames','CARBS',200,'1 bowl',110,7.6,19.6,5.4,1.8,.4,.1,240],
 ['banana','Banana','FRUIT & VEG',118,'1 medium',89,1.1,22.8,2.6,12.2,.3,.1,1],
 ['dates','Medjool dates','FRUIT & VEG',24,'1 date',277,1.8,75,6.7,66,.2,0,1],
 ['avocado','Avocado','FRUIT & VEG',100,'½ fruit',160,2,8.5,6.7,.7,14.7,2.1,7],
 ['broccoli','Broccoli, steamed','FRUIT & VEG',100,'1 cup',35,2.4,7.2,3.3,1.4,.4,.1,41],
 ['almonds','Almonds','FATS',28,'1 handful',579,21,21.6,12.5,4.4,49.9,3.8,1],
 ['pb','Peanut butter','FATS',32,'2 tbsp',588,25,20,6,9,50,10,459],
 ['oil','Olive oil','FATS',14,'1 tbsp',884,0,0,0,0,100,13.8,2],
 ['hummus','Hummus','DISHES',60,'¼ cup',166,7.9,14.3,6,.3,9.6,1.4,380],
 ['falafel','Falafel','DISHES',51,'3 pieces',333,13.3,31.8,4.9,1,17.8,2.4,294],
 ['shawarma','Chicken shawarma wrap','DISHES',250,'1 wrap',220,13,20,1.5,2,10,2.5,550],
 ['machboos','Chicken machboos','DISHES',350,'1 plate',170,10,20,1,1,5.5,1.5,380],
 ['karak','Karak chai','DRINKS',200,'1 cup',65,1.6,10,0,10,2,1.2,25]
].map(([id,n,cat,sg,sl,k,p,c,fi,su,f,sa,na])=>({id,n,cat,sg,sl,k,p,c,fi,su,f,sa,na}));
const FOOD=Object.fromEntries(FOODS.map(f=>[f.id,f]));
const MYFOODS=store.get('myfoods',[]);MYFOODS.forEach(f=>{FOODS.push(f);FOOD[f.id]=f});
const getCats=()=>['ALL',...new Set(FOODS.map(f=>f.cat))];
function totals(items){const t={k:0,p:0,c:0,fi:0,su:0,f:0,sa:0,na:0,g:0};items.forEach(([id,gr])=>{const f=FOOD[id];if(!f)return;t.g+=gr;['k','p','c','fi','su','f','sa','na'].forEach(x=>t[x]+=f[x]*gr/100)});return t}
const r1=v=>v<10?Math.round(v*10)/10:Math.round(v);
function nutri(t,serving){const dv=(v,d)=>Math.round(v/d*100)+'%';
  return h('div',{class:'nf'},h('div',{class:'t'},'NUTRITION FACTS'),h('div',{class:'r',style:'border:0'},h('span',{},'Serving'),h('b',{},serving)),
    h('div',{class:'big'},h('span',{},'Calories'),h('b',{},Math.round(t.k))),
    h('div',{class:'r',style:'justify-content:flex-end;font-size:15px'},'% Daily Value'),
    h('div',{class:'r'},h('span',{},'Total fat '+r1(t.f)+'g'),h('b',{},dv(t.f,78))),
    h('div',{class:'r ind'},h('span',{},'Saturated fat '+r1(t.sa)+'g'),h('b',{},dv(t.sa,20))),
    h('div',{class:'r'},h('span',{},'Sodium '+Math.round(t.na)+'mg'),h('b',{},dv(t.na,2300))),
    h('div',{class:'r'},h('span',{},'Total carbs '+r1(t.c)+'g'),h('b',{},dv(t.c,275))),
    h('div',{class:'r ind'},h('span',{},'Fiber '+r1(t.fi)+'g'),h('b',{},dv(t.fi,28))),
    h('div',{class:'r ind'},h('span',{},'Sugars '+r1(t.su)+'g'),h('b',{},'')),
    h('div',{class:'r thick'},h('span',{},'Protein '+r1(t.p)+'g'),h('b',{},dv(t.p,50))),
    h('div',{class:'r',style:'font-size:15px'},'Approximate averages. Recipes and brands vary.'))}
function splitBar(t){const pk=t.p*4,ck=t.c*4,fk=t.f*9,s=pk+ck+fk||1;
  return h('div',{},h('div',{class:'split'},h('i',{style:`width:${pk/s*100}%;background:var(--a2)`}),h('i',{style:`width:${ck/s*100}%;background:var(--a1)`}),h('i',{style:`width:${fk/s*100}%;background:var(--a3)`})),
    h('div',{class:'row spread small',style:'margin-top:4px'},h('span',{},`P ${Math.round(pk/s*100)}%`),h('span',{},`C ${Math.round(ck/s*100)}%`),h('span',{},`F ${Math.round(fk/s*100)}%`)))}
function badges(f){const b=[];if(f.p*4/f.k>=.3)b.push(['HIGH PROTEIN','']);if(f.fi>=5)b.push(['HIGH FIBER','']);if(f.f<3)b.push(['LOW FAT','s']);if(f.su>=15)b.push(['HIGH SUGAR','c']);if(f.na>=400)b.push(['HIGH SODIUM','c']);
  return h('div',{class:'row',style:'gap:6px'},b.map(([t,c])=>h('span',{class:'tag '+c},t)))}
function foodModal(id){const f=FOOD[id];let gr=f.sg;const body=h('div',{class:'list'});let m;
  const draw=()=>{const t=totals([[id,gr]]);body.replaceChildren(
    h('div',{class:'row nowrap'},foodIcon(id,5),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:6px'},h('h2',{},f.n.toUpperCase()),h('span',{class:'label'},f.cat),badges(f))),
    h('div',{class:'row nowrap'},h('div',{class:'grow'},stepper('fgr','AMOUNT (G)',gr,1,2000,5,v=>{gr=v;clearTimeout(window._fg);window._fg=setTimeout(draw,450)})),
      h('div',{class:'seg',style:'align-self:flex-end'},[.5,1,2].map(x=>h('button',{'aria-pressed':String(gr===Math.round(f.sg*x)),onclick:()=>{gr=Math.round(f.sg*x);draw()}},x+'×')))),
    h('span',{class:'small'},`1 serving = ${f.sl} (${f.sg} g)`),
    nutri(t,gr+' g'),splitBar(t),
    h('div',{class:'row nowrap'},h('button',{class:'btn alt grow',onclick:()=>{PLATE.push([id,gr]);save();m.remove();toast('ADDED TO PLATE')}},'+ PLATE'),
      h('button',{class:'btn grow',onclick:()=>{ST.protein+=Math.round(t.p);save();m.remove();addXP(2);render()}},'LOG '+Math.round(t.p)+'G PROTEIN')),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))};
  draw();m=modal(body)}
function pickFood(onPick){let q='',cat='ALL',m;const grid=h('div',{class:'grid4'}),inp=h('input',{id:'fq',type:'search',placeholder:'Search foods',oninput:e=>{q=e.target.value.toLowerCase();draw()}});
  const cats=h('div',{class:'seg'},getCats().map(c=>h('button',{'aria-pressed':String(c===cat),onclick:e=>{cat=c;[...cats.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));draw()}},c)));
  function draw(){grid.replaceChildren(...FOODS.filter(f=>(cat==='ALL'||f.cat===cat)&&f.n.toLowerCase().includes(q)).map(f=>h('button',{class:'tile',onclick:()=>{m.remove();onPick(f.id)}},foodIcon(f.id,3),f.n)))}
  draw();m=modal(h('h2',{},'PICK A FOOD'),inp,cats,grid,h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))}
