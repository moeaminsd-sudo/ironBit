/* ================= mood ================= */
const MOODS={great:['ENERGIZED','Great day to push a little harder.',['Do your planned workout, maybe add one extra set','Go for a new best, with good form','Share your win in the club'],'train'],
  good:['GOOD','Solid. Stick to the plan.',['Do your planned workout','Hit your protein target today','Drink water through the day'],'train'],
  okay:['OKAY','Showing up is what counts.',['Warm up for 5–10 minutes, then decide how hard to go','A shorter session still counts','Put on a playlist you love'],'train'],
  tired:['TIRED','Listen to your body today.',['Try a lighter session like No-Gym Home','Aim for 7–9 hours of sleep tonight','Drink water and eat a proper meal'],'home'],
  sore:['SORE','Some soreness is normal after training.',['Train a different muscle group today','A light walk and stretching help recovery','Protein and sleep help muscles repair'],'mobility','Sharp or joint pain is different from soreness. Rest it and get it checked if it doesn\'t go away.'],
  stressed:['STRESSED','Moving can help clear your head.',['A 20-minute session can lift your mood','Try slow breathing: in for 4, hold for 4, out for 4','A short walk outside helps too'],'home']};
function todayMood(){return ST.mood&&ST.mood.d===today()?ST.mood.m:null}
function moodFace(m,s=3){const[c,g]=mk(11,11),K='#3b2a1a';disc(g,'#f2b84b',5,5,4.5);R(g,'#ffd66b',3,2,2,1);
  if(m==='tired'){R(g,K,3,5,2,1);R(g,K,6,5,2,1)}else{R(g,K,3,4,1,2);R(g,K,7,4,1,2)}
  if(m==='great'){R(g,K,3,7,5,1);R(g,'#ffffff',4,7,3,1);R(g,K,2,6,1,1);R(g,K,8,6,1,1);R(g,K,4,8,3,1)}
  else if(m==='good'){R(g,K,4,8,3,1);R(g,K,3,7,1,1);R(g,K,7,7,1,1)}
  else if(m==='okay')R(g,K,4,7,3,1);
  else if(m==='tired'){R(g,K,4,8,3,1);R(g,'#a79fcf',8,1,2,1);R(g,'#a79fcf',9,2,1,1);R(g,'#a79fcf',8,3,2,1)}
  else{pts(g,K,[[3,8],[4,7],[5,8],[6,7],[7,8]]);if(m==='sore')R(g,'#7fd3ff',9,3,1,2);else{R(g,K,2,3,2,1);R(g,K,7,3,2,1)}}
  return show(outline(c),s)}
function faceMood(g,m,cx,ey,S,H){const M=shade(S,-.45);if(m==='okay'||!m)return;R(g,S,cx-1,ey+3,2,1);
  if(m==='great'){R(g,M,cx-2,ey+3,4,1);R(g,'#ffffff',cx-1,ey+3,2,1);R(g,M,cx-3,ey+2,1,1);R(g,M,cx+2,ey+2,1,1)}
  else if(m==='good'){R(g,M,cx-1,ey+3,2,1);R(g,M,cx-2,ey+2,1,1);R(g,M,cx+1,ey+2,1,1)}
  else if(m==='tired'){R(g,shade(S,-.2),cx-4,ey,2,1);R(g,shade(S,-.2),cx+1,ey,2,1);R(g,M,cx-1,ey+3,2,1);R(g,shade(S,-.12),cx-4,ey+2,2,1);R(g,shade(S,-.12),cx+1,ey+2,2,1)}
  else{pts(g,M,[[cx-2,ey+3],[cx-1,ey+4],[cx,ey+3],[cx+1,ey+4]]);if(m==='sore'){R(g,'#7fd3ff',cx+5,ey-4,1,2);R(g,'#7fd3ff',cx+6,ey-3,1,2)}else{R(g,H,cx-3,ey-1,1,1);R(g,H,cx+1,ey-1,1,1)}}}
function moodAction(a){if(a==='train')quickStart();else if(a==='home')openWorkout('home');else{tab='train';trainView='muscles';render()}}
function moodBox(){const m=todayMood(),M=m&&MOODS[m];
  return h('div',{class:'box'},h('span',{class:'label'},'HOW DO YOU FEEL TODAY?'),
    h('div',{class:'moods'},Object.entries(MOODS).map(([k,[t]])=>h('button',{class:'mood','aria-pressed':String(m===k),'aria-label':t,onclick:()=>{const first=!m;ST.mood={d:today(),m:k};save();if(first)gainXP(2);render(true)}},moodFace(k,3)))),
    ...(M?[h('div',{class:'row nowrap'},moodFace(m,3),h('h2',{},M[0])),h('h3',{},M[1]),h('div',{class:'list'},M[2].map(t=>h('div',{class:'row nowrap',style:'align-items:flex-start'},px('star',2),h('span',{},t)))),M[4]?h('p',{class:'note'},M[4]):null,
      h('button',{class:'btn alt',onclick:()=>moodAction(M[3])},M[3]==='train'?'▶ START TODAY\'S WORKOUT':M[3]==='home'?'▶ START A LIGHT SESSION':'▶ PICK A DIFFERENT MUSCLE')]
      :[h('span',{class:'small'},'Pick a face. Your profile picture changes with your mood, and IronBit suggests what to do today.')]))}
