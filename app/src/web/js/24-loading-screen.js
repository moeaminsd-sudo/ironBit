/* ================= loading screen ================= */
const JOKES=['My favorite exercise is a cross between a lunge and a crunch. I call it lunch.','Leg day is like a group chat. Everyone skips it until it gets serious.',
  'I told my trainer I want to get in shape. He said round is a shape. We are starting anyway.','Rest days are save points. Use them, but don\'t live there.',
  'Why don\'t skeletons go to the gym? Their heart isn\'t in it.','Protein shake in one hand, phone in the other. That\'s balance training.',
  'Loading muscles. Please don\'t turn off your motivation.','I lift, therefore I snack.','Warming up the pixels. Your gains are almost ready.',
  'Sweat is just your fat crying. Let it.','The barbell doesn\'t care about your excuses. It doesn\'t care about anything. It\'s a barbell.'];
const QTIPS=['Warm up for 5–10 minutes before heavy sets.','Breathe out on the hard part of each rep.','Leave 1–2 reps in the tank on most sets.','Rest 60–90 seconds for muscle, 2–3 minutes for heavy strength sets.',
  'Sip water between sets.','Wipe down benches after you use them.','Add a little weight or one more rep each week.','Sleep is when muscles actually grow.','Film one set to check your form.',
  'Put your weights back when you\'re done.','Spread protein across your meals.','Beat last week, not other people.'];
function loadingScreen(next,title){const ov=h('div',{class:'overlay loader'});APP.append(ov);let done=false,t=0;const go=()=>{if(done)return;done=true;clearInterval(t);ov.remove();next()};
  const bar=h('i',{style:'width:0%'}),pl=player('idle',0,{}),pct=h('span',{class:'label'},'0%');
  ov.append(h('main',{class:'anim'},h('span',{class:'tag s'},'GET FIT, BIT BY BIT.'),h('h2',{},'LOADING '+title),h('div',{class:'stage',style:'width:44%'},pl.el),
    h('div',{class:'bar'},bar),pct,h('div',{class:'box',style:'text-align:left;width:100%'},h('span',{class:'label'},'JOKE OF THE SET'),h('p',{},pick(JOKES)),h('span',{class:'label'},'QUICK TIP'),h('p',{},pick(QTIPS))),
    h('span',{class:'small'},'Tap anywhere to skip')));
  ov.addEventListener('click',go);let p=0;SFX.tap();t=setInterval(()=>{p=Math.min(100,p+3+Math.random()*6);bar.style.width=p+'%';pct.textContent=Math.round(p)+'%';if(p>=100){clearInterval(t);SFX.coin();setTimeout(go,450)}},150)}
function exTip(n){const m=Object.values(MUSCLES).find(M=>M.ex.includes(n));return m?m.tip:QTIPS[n.length%QTIPS.length]}
