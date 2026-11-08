/* ================= gear shop ================= */
const AFF_TAG=''; /* set your Amazon Associates tag here, e.g. 'yourtag-21' */
const AMZ={AE:'ae',SA:'sa',EG:'eg',GB:'co.uk',US:'com',IN:'in',TR:'com.tr',DE:'de',FR:'fr',IT:'it'};
const amzTld=()=>AMZ[(CITIES[P.city]||CITIES.Other)[0]]||'com';
const amzUrl=q=>`https://www.amazon.${amzTld()}/s?k=${encodeURIComponent(q)}${AFF_TAG?'&tag='+encodeURIComponent(AFF_TAG):''}`;
const SHOP={'PROTEIN':[['whey','Whey protein','whey protein powder','Look for 20–25 g of protein per scoop and a third-party tested label.'],['tubG','Plant protein','vegan protein powder','A good pick if dairy upsets your stomach.'],['bar','Protein bars','protein bars','Handy snack. Check the sugar, some bars are candy in disguise.']],
  'CREATINE':[['tub','Creatine monohydrate','creatine monohydrate powder','Plain monohydrate is the most researched form. Unflavored mixes into anything.'],['shaker','Shaker bottle','protein shaker bottle','A mesh ball or grid stops lumps.']],
  'RECOVERY':[['bottle','Electrolytes','electrolyte powder','Useful on hot days and long sweaty sessions.'],['roller','Foam roller','foam roller','Medium density is a good start.']],
  'EQUIPMENT':[['dumbbells','Adjustable dumbbells','adjustable dumbbells','Save space at home. Check the max weight per hand.'],['bands','Resistance bands','resistance bands set','Get a set with several strengths.'],['kettlebell','Kettlebell','kettlebell','Start around 8–12 kg for swings.'],
   ['mat','Exercise mat','exercise mat','Thicker mats are kinder to knees.'],['rope','Jump rope','jump rope','Speed ropes are great for cardio.'],['pullbar','Pull-up bar','doorway pull-up bar','Measure your door frame first.'],
   ['belt','Lifting belt','weightlifting belt','Only needed for heavy squats and deadlifts.'],['wraps','Wrist wraps','wrist wraps','Support for heavy pressing.'],['gloves2','Gym gloves','gym gloves','Protects hands from calluses.']]};
function ringE(g,c,cx,cy,rx,ry){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const v=x*x/(rx*rx+.6)+y*y/(ry*ry+.6);if(v<=1&&v>=.42)R(g,c,cx+x,cy+y)}}
Object.assign(ICON,{
 tub:g=>{R(g,'#f3efe6',4,5,10,10);R(g,'#d6d1c4',11,5,3,10);R(g,'#2d6b8f',4,3,10,3);R(g,'#245a9c',11,3,3,3);R(g,'#3fc1b0',5,9,8,3)},
 tubG:g=>{R(g,'#7fb069',4,5,10,10);R(g,'#5f9a52',11,5,3,10);R(g,'#2e7d32',4,3,10,3);R(g,'#f6e9d0',5,9,8,3)},
 bar:g=>{lineW(g,[3,12],[14,6],4,'#8a5426');lineW(g,[3,12],[8,9],4,'#f2b84b');pts(g,'#5e3517',[[11,7],[13,6]])},
 bottle:g=>{R(g,'#3fc1b0',6,2,6,2);R(g,'#c7cde0',7,4,4,2);R(g,'#ff6b57',5,6,8,10);R(g,'#ffb3a7',6,7,1,8);R(g,'#f6e9d0',6,10,6,2)},
 shaker:g=>{R(g,'#26232e',5,2,8,3);R(g,'#c7cde0',5,5,8,11);R(g,'#eef1f5',6,6,1,9);R(g,'#f6e9d0',6,10,6,5)},
 roller:g=>{ell(g,'#3fc1b0',9,9,7,4);ell(g,'#2c998b',3,9,2,4);pts(g,'#7fe0d2',[[6,7],[9,6],[12,7],[8,10],[11,11]])},
 dumbbells:g=>{R(g,'#3d3a4f',2,5,3,9);R(g,'#3d3a4f',13,5,3,9);R(g,'#5b5873',5,6,2,7);R(g,'#5b5873',11,6,2,7);R(g,'#c7cde0',7,9,4,1)},
 bands:g=>{ringE(g,'#ff6b57',6,9,4,6);ringE(g,'#3fc1b0',11,9,4,6)},
 kettlebell:g=>{ringE(g,'#3d3a4f',9,5,4,3);disc(g,'#3d3a4f',9,11,5);R(g,'#5b5873',6,9,2,3)},
 mat:g=>{R(g,'#7b6fb0',4,6,12,8);ell(g,'#a79fcf',4,10,2,4);R(g,'#5b4a63',7,6,1,8)},
 rope:g=>{R(g,'#ff6b57',2,3,2,5);R(g,'#ff6b57',14,3,2,5);for(let t=0;t<=12;t++)R(g,'#26232e',3+t,8+Math.round(Math.sin(t/12*Math.PI)*7),1,1)},
 pullbar:g=>{R(g,'#c7cde0',1,7,16,2);R(g,'#26232e',1,5,2,6);R(g,'#26232e',15,5,2,6);R(g,'#3d3a4f',5,7,2,2);R(g,'#3d3a4f',11,7,2,2)},
 belt:g=>{R(g,'#8d6e63',1,7,16,5);R(g,'#6d4f45',1,7,16,1);R(g,'#c7cde0',7,6,4,7);R(g,'#8d6e63',8,8,2,3)},
 wraps:g=>{ringE(g,'#3fc1b0',9,9,6,4);R(g,'#f6e9d0',12,12,4,2)},
 gloves2:g=>{R(g,'#26232e',5,4,8,9);pts(g,'#3d3a4f',[[6,3],[8,3],[10,3],[12,3]]);R(g,'#ff6b57',5,11,8,2);R(g,'#3d3a4f',4,8,1,3)}});
function shopSheet(){let cat='PROTEIN';sheet('GEAR SHOP',redraw=>[
  h('p',{class:'note'},'As an Amazon Associate, IronBit earns from qualifying purchases. Links open Amazon in your browser at no extra cost to you.'),
  h('span',{class:'small'},'Store for '+(P.city||'your city')+': amazon.'+amzTld()),
  h('div',{class:'seg'},Object.keys(SHOP).map(c=>h('button',{'aria-pressed':String(c===cat),onclick:()=>{cat=c;redraw()}},c))),
  h('div',{class:'list'},SHOP[cat].map(([ic,n,q,tip])=>h('div',{class:'post'},h('div',{class:'row nowrap'},foodIcon(ic,3),h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:4px'},h('h3',{},n.toUpperCase()),h('span',{class:'small'},tip))),
    h('a',{class:'btn alt',href:amzUrl(q),target:'_blank',rel:'noopener sponsored'},'VIEW ON AMAZON')))),
  h('p',{class:'note'},'Supplements add to a good diet; they don\'t replace it. Check with a doctor first if you have a health condition.'),adSlot()])}
