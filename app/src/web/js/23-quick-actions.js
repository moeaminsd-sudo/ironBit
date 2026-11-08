/* ================= quick actions ================= */
function quickStart(){const rid=planFor(today());if(rid){openWorkout(rid);return}const R=allR();let m;
  m=modal(h('h2',{},'START A WORKOUT'),h('span',{class:'small'},'Nothing planned today. Pick a routine:'),
    h('div',{class:'list'},Object.entries(R).map(([id,r])=>h('button',{class:'item',onclick:()=>{m.remove();openWorkout(id)}},px('dumb',3),h('span',{class:'grow'},h('h3',{},r.name),h('span',{class:'small'},r.ex.length+' moves · '+stars(rDiff(r))))))),
    h('button',{class:'btn ghost',onclick:()=>m.remove()},'CLOSE'))}
function fabMenu(){if(APP.querySelector('.fab')){closeFab();return}const f=h('div',{class:'fab',onclick:e=>{if(e.target===f)closeFab()}},
    h('div',{class:'fabbtns'},h('button',{class:'fabb',onclick:()=>{closeFab();pickFood(id=>foodModal(id))}},foodIcon('chicken',3),'LOG FOOD'),
      h('button',{class:'fabb',onclick:()=>{closeFab();quickStart()}},px('dumb',4),'START WORKOUT')));
  APP.append(f);const p=APP.querySelector('nav .plus');if(p){p.classList.add('open');p.setAttribute('aria-expanded','true')}}
function closeFab(){const f=APP.querySelector('.fab');if(f)f.remove();const p=APP.querySelector('nav .plus');if(p){p.classList.remove('open');p.setAttribute('aria-expanded','false')}}
