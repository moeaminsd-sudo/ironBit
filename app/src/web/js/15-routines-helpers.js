/* ================= routines: helpers ================= */
const DIFF={'Bench press':3,'Deadlift':3,'Back squat':3,'Overhead press':3,'Barbell row':3,'Romanian deadlift':3,
  'Push-up':1,'Plank':1,'Bodyweight squat':1,'Glute bridge':1,'Crunch':1,'Mountain climber':1,'Calf raise':1};
const diffOf=n=>DIFF[n]||2,stars=n=>'★'.repeat(n)+'☆'.repeat(3-n);
const allR=()=>({...ROUTINES,...Object.fromEntries((P.custom||[]).map(r=>[r.id,r]))});
const rDiff=r=>Math.max(1,Math.round(r.ex.reduce((a,e)=>a+diffOf(e[0]),0)/Math.max(1,r.ex.length)));
function planFor(ds){const s=ST.sched[ds];if(s==='rest')return null;if(s&&allR()[s])return s;return weekPlan()[(new Date(ds+'T12:00').getDay()+6)%7]}
function backRow(view){return h('button',{class:'btn ghost',style:'align-self:flex-start',onclick:()=>{trainView=view;render()}},'◀ BACK')}
function exPreview(n){const[ak,mus,cues]=EX[n],pl=multiView(ak,SET.speed,mus);let m;
  const pb=h('button',{class:'play','aria-label':'Pause',onclick:()=>{const on=pl.toggle();pb.textContent=on?'❚❚':'▶'}},pl.playing?'❚❚':'▶');
  const sp=h('div',{class:'seg'},[.5,1,1.5,2].map(s=>h('button',{'aria-pressed':String(s===SET.speed),onclick:e=>{pl.setSpeed(s);[...sp.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},s+'×')));
  m=modal(h('h2',{},n.toUpperCase()),h('span',{class:'label'},'TARGETS: '+mus+' · '+stars(diffOf(n))),pl.stage,pl.seg,h('div',{class:'ctrl'},pb,sp),
    ...cues.map((c,i)=>h('div',{class:'row nowrap',style:'align-items:flex-start'},h('span',{class:'tag'},i+1),h('span',{},c))),
    h('button',{class:'btn alt',onclick:()=>{m.remove();if(!draft)draft=newDraft();draft.ex.push([n,3,'10']);tab='train';trainView='builder';render();toast('ADDED TO ROUTINE BUILDER')}},'+ ADD TO MY ROUTINE'),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))}
