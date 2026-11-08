/* ================= workout session ================= */
function openWorkout(rid){const r=allR()[rid];if(!r)return;closeFab();loadingScreen(()=>countdown(()=>startSession(rid)),r.name)}
function startSession(rid){const r=allR()[rid];if(!r)return;let idx=0,restT=null;
  const nSets=e=>r.custom?e[1]:setsFor(e[1]),done=r.ex.map(e=>Array(nSets(e)).fill(false)),diff=rDiff(r),speedUp=SET.testFast?20:1;
  const total=r.ex.reduce((a,e)=>a+nSets(e)*(45+SET.rest),0);let left=total,paused=false,pending=0,claimed=false,speed=SET.speed;
  const ov=h('div',{class:'overlay'});APP.append(ov);
  const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const tEl=h('span',{class:'timer','aria-live':'off'},fmt(left)),pEl=h('span',{class:'tag s'},'0 XP ON THE LINE');
  const pauseBtn=h('button',{class:'btn ghost',style:'padding:8px 10px','aria-label':'Pause session'},'❚❚');
  const upd=()=>{tEl.textContent=fmt(left);pEl.textContent=pending+' XP ON THE LINE';const b=ov.querySelector('#sbar');if(b)b.style.width=((total-left)/total*100)+'%';const st=ov.querySelector('#sst');if(st)st.textContent=left>0?fmt(left)+' left':'Done'};
  const tick=setInterval(()=>{if(!ov.isConnected){clearInterval(tick);return}if(!paused&&left>0){left=Math.max(0,left-speedUp);upd();if(left===0){SFX.done();buzz(300);toast('SESSION TIMER DONE!');draw()}}},1000);
  pauseBtn.onclick=()=>{paused=!paused;pauseBtn.textContent=paused?'▶':'❚❚';pauseBtn.setAttribute('aria-label',paused?'Resume session':'Pause session');tEl.style.opacity=paused?.4:1;toast(paused?'SESSION PAUSED':'SESSION RESUMED')};
  const close=()=>{clearInterval(tick);clearInterval(restT);ov.remove();render()};
  const log=ok=>{ST.log.push({d:today(),rid,name:r.name,xp:ok?pending+diff*50:0,done:ok,mins:Math.round((total-left)/60)});save()};
  const quit=()=>{if(claimed||(left===total&&!pending)){close();return}
    if(left>0){let m;m=modal(h('h2',{},'END SESSION EARLY?'),h('p',{},`The session timer isn't finished, so the ${pending} XP you earned won't be saved and this workout won't count on the leaderboard. You can pause instead.`),
      h('button',{class:'btn',onclick:()=>{m.remove();log(false);close()}},'END WITHOUT XP'),h('button',{class:'btn ghost',onclick:()=>m.remove()},'KEEP TRAINING'));return}
    close()};
  const claim=()=>{const bonus=diff*50;claimed=true;ST.workouts++;ST.streak++;log(true);SFX.done();clearInterval(tick);clearInterval(restT);ov.remove();celebrate({mins:Math.max(1,Math.round((total-left)/60)),sets:done.flat().filter(Boolean).length,moves:r.ex.length,muscles:muscleIdsFor(r.ex.map(e=>e[0])),rows:[['SETS COMPLETED',pending],['FINISH BONUS',bonus]].concat(ST.streak>1?[['STREAK ×'+ST.streak,Math.min(50,ST.streak*5)]]:[])})};
  const body=h('main',{class:'anim'});
  ov.append(h('header',{},h('button',{class:'btn ghost',style:'padding:8px 10px',onclick:quit,'aria-label':'End workout'},'✕'),
    h('div',{class:'grow',style:'display:flex;flex-direction:column;gap:5px;min-width:0'},h('span',{class:'logo',style:'font-size:9px'},r.name),pEl),tEl,pauseBtn),body);
  function draw(){const[name,,reps]=r.ex[idx],[ak,muscle,cues]=EX[name],sets=done[idx],pl=multiView(ak,speed,muscle),ed=diffOf(name);
    const playBtn=h('button',{class:'play','aria-label':'Pause animation',onclick:()=>{const on=pl.toggle();playBtn.textContent=on?'❚❚':'▶'}},pl.playing?'❚❚':'▶');
    const speeds=h('div',{class:'seg'},[.5,1,1.5,2].map(s=>h('button',{'aria-pressed':String(s===speed),onclick:e=>{speed=s;pl.setSpeed(s);[...speeds.children].forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},s+'×')));
    const restNum=h('span',{class:'num'},SET.rest),restBar=h('i',{style:'width:0%'});
    function startRest(){clearInterval(restT);let t=SET.rest;restT=setInterval(()=>{if(!restNum.isConnected){clearInterval(restT);return}if(paused)return;t=Math.max(0,t-speedUp);
      restNum.textContent=t;restBar.style.width=((SET.rest-t)/SET.rest*100)+'%';if(t<=0){clearInterval(restT);SFX.beep();buzz(250);toast('REST OVER · GO!')}},1000)}
    body.replaceChildren(
      pl.stage,pl.seg,h('div',{class:'ctrl'},playBtn,h('span',{class:'label'},'SPEED'),speeds),
      h('div',{class:'row spread'},h('h2',{},`${idx+1}/${r.ex.length} · ${name.toUpperCase()}`),h('span',{class:'tag s'},sets.length+' × '+reps)),
      h('span',{class:'label'},'TARGETS: '+muscle+' · '+stars(ed)+' · '+(10*ed)+' XP PER SET'),
      h('div',{class:'box'},h('span',{class:'label'},'FORM CUES'),...cues.map((c,i)=>h('div',{class:'row nowrap',style:'align-items:flex-start'},h('span',{class:'tag'},i+1),h('span',{},c)))),
      h('div',{class:'box',style:'border-color:var(--a3)'},h('span',{class:'label'},'PRO TIP'),h('p',{},exTip(name))),
      h('div',{class:'sets'},sets.map((d,i)=>h('button',{class:'set','aria-pressed':String(d),onclick:()=>{sets[i]=!d;pending+=d?-10*ed:10*ed;if(!d){SFX.coin();haptic('click');startRest()}upd();draw()}},'SET '+(i+1)))),
      h('div',{class:'box'},h('div',{class:'row spread'},h('span',{class:'label'},'REST TIMER'),restNum),h('div',{class:'bar t'},restBar)),
      h('div',{class:'row nowrap'},h('button',{class:'btn ghost',disabled:idx===0,onclick:()=>{idx--;draw()}},'◀ PREV'),h('button',{class:'btn alt grow',disabled:idx===r.ex.length-1,onclick:()=>{idx++;draw()}},'NEXT ▶')),
      musicBox(),
      h('div',{class:'box',style:left===0?'border-color:var(--a1)':''},h('div',{class:'row spread'},h('span',{class:'label'},'SESSION TIMER · '+stars(diff)),h('span',{class:'small',id:'sst'},left>0?fmt(left)+' left':'Done')),
        h('div',{class:'bar'},h('i',{id:'sbar',style:`width:${(total-left)/total*100}%`})),
        left>0?h('span',{class:'small'},`XP is banked when the timer reaches 0, plus a ${diff*50} XP finish bonus. You can pause any time; ending early earns nothing.`)
          :h('button',{class:'btn wide',onclick:claim},`CLAIM ${pending+diff*50} XP ★`)));
    body.scrollTop=0}
  draw()}
