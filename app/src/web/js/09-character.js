/* ================= character ================= */
const SKINS=['#fde0c5','#f1c27d','#e0a372','#c68642','#a0662f','#8d5524','#6b3d1f','#4a2a14'];
const EYES=['#2b1a10','#6b4423','#2e6b3a','#2d6b8f','#6d7380','#a0782a'];
const HAIRC=['#1b1414','#3b2a1a','#6b4423','#a0662f','#d9a441','#e8d9b0','#9aa3b5','#c0392b','#3fc1b0','#8e44ad'];
const CLOTH=['#ff6b57','#f2b84b','#3fc1b0','#2d6b8f','#7b6fb0','#26232e','#f3efe6','#c0392b','#2e7d32','#e84393','#8d6e63','#9aa3b5'];
const HAIRS=['short','buzz','long','bun','curly','afro','bald'],BEARDS=['none','stubble','full'];
const TOPS=['tee','tank','hoodie','compression','kandura','tracksuit','kit','trad','armor'],BOTS=['shorts','joggers','leggings'];
const HEADS=['none','cap','beanie','headband','bandana','ghutra','imma','hijab','crown'],ACCS=['watch','ring','glasses','earbuds','chain','wristband','gloves','cape','aura'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function defChar(sex){return{skin:'#e0a372',eye:'#2b1a10',hair:sex==='f'?'long':'short',hairC:'#1b1414',beard:sex==='f'?'none':'stubble',top:'tee',topC:'#ff6b57',
  bottom:sex==='f'?'leggings':'shorts',botC:'#26232e',shoeC:'#3fc1b0',head:'none',headC:'#f3efe6',acc:['watch'],accC:'#f2b84b'}}
function randChar(sex){return{skin:pick(SKINS),eye:pick(EYES),hair:pick(HAIR_BY_SEX[sex]||HAIRS),hairC:pick(HAIRC),beard:sex==='f'?'none':pick(BEARDS),top:pick(TOPS),topC:pick(CLOTH),
  bottom:pick(BOTS),botC:pick(CLOTH),shoeC:pick(CLOTH),head:pick(HEADS),headC:pick(CLOTH),acc:ACCS.filter(()=>Math.random()<.3),accC:pick(CLOTH)}}
function build(pr){const hg=pr?.height||172,wg=pr?.weight||72,hf=clamp((hg-150)/50,0,1),bmi=wg/((hg/100)**2);return{hf,bmi,b:bmi<20?0:bmi<25.5?1:bmi<30?2:3}}

/* front view, 36x52 */
function drawFront(pr,C0,mood,o={}){
  const C=effChar(pr,C0),[c,g]=mk(36,52),cx=18,{hf,b}=build(pr),tier=o.tier??muscleTier(pr);
  const legLen=10+Math.round(hf*4),torsoLen=11+Math.round(hf*1.4),hw=[4,5,6,7][b]+(tier>=3?1:0),aw=[2,2,3,3][b]+(tier>=2?1:0),lw=[2,3,3,4][b];
  const shoeTop=48,hipY=shoeTop-legLen,shY=hipY-torsoLen,hT=shY-12,ey=hT+5;
  const S=C.skin,S2=shade(S,-.18),S3=shade(S,.15),T=C.topC,T2=shade(T,-.22),T3=shade(T,.18),B=C.botC,B2=shade(B,-.25),SH=C.shoeC,
    H=C.hairC,H2=shade(H,-.3),H3=shade(H,.22),HC=C.headC,HC2=shade(HC,-.2),robe=C.top==='kandura'||C.top==='kurta',kurta=C.top==='kurta',covered=C.head==='ghutra'||C.head==='hijab',has=a=>C.acc.includes(a);
  // back layer
  if(!covered&&C.head!=='beanie'){if(C.hair==='long')R(g,H,cx-6,hT+2,12,13);if(C.hair==='afro')disc(g,H,cx,hT+3,7);if(C.hair==='bun'&&C.head!=='cap')R(g,H,cx-2,hT-3,4,3)}
  if(C.head==='ghutra')R(g,HC,cx-7,hT+2,14,shY-hT+2);
  if(C.head==='hijab')R(g,HC,cx-7,hT+1,14,shY-hT+4);
  if(C.top==='hoodie')R(g,T2,cx-4,shY-2,8,3);
  if(has('cape')){const cl=torsoLen+Math.round(legLen*.7);R(g,'#c0392b',cx-hw-2,shY,hw*2+4,cl);R(g,'#8e2a20',cx+hw,shY+2,2,cl-2)}
  // legs
  if(!o.noLegs){const legs=[cx-1-lw,cx+1];
  if(!robe||kurta)legs.forEach(x=>{
    R(g,B,x,hipY,lw,legLen);R(g,B2,x+lw-1,hipY,1,legLen);
    if(C.bottom==='shorts'){R(g,S,x,hipY+5,lw,legLen-5);R(g,S2,x+lw-1,hipY+5,1,legLen-5)}
    if(C.bottom==='joggers')R(g,B2,x,shoeTop-1,lw,1);
    if(C.bottom==='leggings')R(g,shade(B,.15),x,hipY+2,1,legLen-3)});
  legs.forEach((x,i)=>{const sx=i?x:x-1;R(g,SH,sx,shoeTop,lw+1,1);R(g,'#f3efe6',sx,shoeTop+1,lw+1,1);R(g,shade(SH,.35),sx+(i?1:0),shoeTop,1,1)})}
  // torso
  if(robe){for(let y=shY;y<(kurta?hipY+6:shoeTop);y++){const half=hw+Math.floor((y-shY)/9);R(g,T,cx-half,y,half*2,1);R(g,T2,cx+half-1,y,1,1);R(g,T3,cx-half,y,1,1)}
    R(g,T2,cx,shY+2,1,7);R(g,T3,cx-1,shY+1,1,1)}
  else{R(g,T,cx-hw,shY,hw*2,torsoLen);R(g,T2,cx+hw-1,shY,1,torsoLen);R(g,T3,cx-hw,shY+1,1,torsoLen-3);
    if(C.top==='tank'){R(g,S,cx-2,shY,4,2);R(g,S,cx-hw,shY,2,3);R(g,S,cx+hw-2,shY,2,3);R(g,S2,cx+hw-1,shY,1,3)}else R(g,S2,cx-1,shY,2,1);
    if(C.top==='hoodie'){R(g,T2,cx-hw+2,hipY-6,hw*2-4,3);R(g,'#f3efe6',cx-2,shY+1,1,3);R(g,'#f3efe6',cx+1,shY+1,1,3)}
    if(C.top==='compression'){R(g,T2,cx-1,shY+3,2,1);R(g,T2,cx-hw+1,shY+6,hw*2-2,1);R(g,T3,cx-hw+1,shY+2,2,1)}
    if(C.top==='tee')R(g,T3,cx-3,shY+3,2,1);
    if(C.top==='tracksuit'){R(g,'#f3efe6',cx,shY+1,1,torsoLen-3);R(g,T2,cx-hw+1,hipY-4,hw*2-2,1)}
    if(C.top==='armor'){for(let y=shY+3;y<hipY-2;y+=3)R(g,T2,cx-hw+1,y,hw*2-2,1);R(g,'#f2c14e',cx-1,shY+2,2,2)}
    if(C.kit2){R(g,C.kit2,cx-2,shY,4,1);R(g,C.kit2,cx+1,shY+3,2,3)}
    R(g,B,cx-hw,hipY-2,hw*2,2);R(g,B2,cx-hw,hipY-2,hw*2,1);R(g,B,cx-1,hipY,2,2)}
  g.clearRect(cx-hw,shY,1,1);g.clearRect(cx+hw-1,shY,1,1);
  // arms
  if(!o.noArms){const armLen=torsoLen+1,sl={tee:4,tank:0,hoodie:armLen-2,compression:armLen-2,kandura:armLen-2,kurta:armLen-2,tracksuit:armLen-2,armor:armLen-2}[C.top]||0;
  [cx-hw-aw,cx+hw].forEach((x,i)=>{const y=shY+1;R(g,S,x,y,aw,armLen);R(g,i?S2:S3,x+(i?aw-1:0),y,1,armLen-2);
    if(sl){R(g,T,x,y,aw,sl);R(g,i?T2:T3,x+(i?aw-1:0),y,1,sl)}
    if(C.top==='tracksuit')R(g,'#f3efe6',x+(i?aw-1:0),y,1,armLen-2);if(C.kit2&&sl)R(g,C.kit2,x,y+sl-1,aw,1);
    const hy=y+armLen-2;R(g,has('gloves')?'#2b2b33':S,x,hy,aw,2);
    if(i===0&&has('watch')){R(g,'#1d1d24',x,hy-2,aw,2);R(g,'#3fc1b0',x+(aw>2?1:0),hy-2,1,1)}
    if(i===1&&has('wristband'))R(g,C.accC,x,hy-2,aw,2);
    if(i===1&&has('ring'))R(g,'#f2c14e',x,hy+1,1,1)});
    if(tier>=1&&sl<6){R(g,mix(S,'#ffffff',.3),cx-hw-aw,shY+sl+2,1,3);R(g,mix(S,'#ffffff',.3),cx+hw,shY+sl+2,1,3)}}
  if(C.top==='armor'){R(g,T3,cx-hw-aw-1,shY,aw+2,3);R(g,T3,cx+hw-1,shY,aw+2,3)}
  // neck + head
  R(g,S2,cx-1,shY-2,2,2);
  R(g,S,cx-5,hT,10,10);[[-5,0],[4,0],[-5,9],[4,9],[-5,8],[4,8]].forEach(([x,y])=>g.clearRect(cx+x,hT+y,1,1));
  R(g,S2,cx+4,hT+1,1,7);R(g,S2,cx-3,hT+9,6,1);R(g,S3,cx-4,hT+1,1,3);
  R(g,S,cx-6,hT+4,1,2);R(g,S2,cx+5,hT+4,1,2);
  if(!o.back){R(g,'#ffffff',cx-4,ey,2,2);R(g,C.eye,cx-3,ey,1,2);R(g,shade(C.eye,-.5),cx-3,ey,1,1);
  R(g,'#ffffff',cx+1,ey,2,2);R(g,C.eye,cx+1,ey,1,2);R(g,shade(C.eye,-.5),cx+1,ey,1,1);
  R(g,C.hair==='bald'&&C.beard==='none'?S2:H,cx-4,ey-2,2,1);R(g,C.hair==='bald'&&C.beard==='none'?S2:H,cx+1,ey-2,2,1);
  R(g,S2,cx-1,ey+2,1,1);R(g,shade(S,-.4),cx-1,ey+3,2,1);
  const blush=mix(S,'#ff6b6b',.35);R(g,blush,cx-4,ey+2,1,1);R(g,blush,cx+3,ey+2,1,1);
  if(C.beard==='stubble'){for(let y=ey+2;y<=hT+9;y++)for(let x=cx-4;x<=cx+3;x++)if((x+y)%2===0&&!(y===ey+3&&x>=cx-1&&x<=cx))R(g,shade(S,-.28),x,y)}
  if(C.beard==='full'){R(g,H,cx-5,ey+2,1,2);R(g,H,cx+4,ey+2,1,2);R(g,H,cx-4,ey+3,8,3);R(g,H,cx-3,hT+9,6,1);R(g,H,cx-2,hT+10,4,1);R(g,H,cx-2,ey+2,4,1);R(g,shade(S,-.4),cx-1,ey+3,2,1);R(g,H2,cx+2,ey+4,2,2)}
  if(mood)faceMood(g,mood,cx,ey,S,H);
  if(o.face)faceExpr(g,o.face,cx,ey,S)}
  else if(!covered){const st=C.hair;if(st==='bald'){R(g,S2,cx+2,hT+1,2,8);R(g,S3,cx-3,hT+1,2,2)}else if(st==='buzz'){R(g,H2,cx-5,hT,10,9);R(g,H,cx-4,hT,6,3)}else{R(g,H,cx-5,hT-1,10,11);R(g,H2,cx+2,hT,3,10);R(g,H3,cx-4,hT,2,3);if(st==='bun')R(g,H,cx-2,hT-3,4,3);if(st==='curly'||st==='afro')for(let x=cx-5;x<cx+5;x+=2)R(g,H,x,hT-2,1,1)}}
  else R(g,HC,cx-5,hT-1,10,11);
  // hair front
  if(!covered&&!o.back){const st=C.hair;
    if(st==='short'||st==='long'||st==='bun'){R(g,H,cx-4,hT-1,8,1);R(g,H,cx-5,hT,10,2);R(g,H,cx-5,hT+2,1,3);R(g,H,cx+4,hT+2,1,3);R(g,H,cx-4,hT+2,3,1);R(g,H3,cx-3,hT,3,1);R(g,H2,cx+2,hT+1,2,1);
      if(st==='long'){R(g,H,cx-6,hT+1,1,11);R(g,H,cx+5,hT+1,1,11);R(g,H2,cx+5,hT+5,1,7)}}
    if(st==='buzz'){R(g,H2,cx-5,hT,10,1);R(g,H2,cx-5,hT+1,1,2);R(g,H2,cx+4,hT+1,1,2);R(g,H,cx-3,hT,4,1)}
    if(st==='curly'||st==='afro'){R(g,H,cx-5,hT-1,10,3);for(let x=cx-5;x<cx+5;x+=2)R(g,H,x,hT-2,1,1);R(g,H,cx-6,hT,1,4);R(g,H,cx+5,hT,1,4);pts(g,H3,[[cx-3,hT-1],[cx,hT],[cx+2,hT-1]]);pts(g,H2,[[cx-4,hT+1],[cx+3,hT+1],[cx+1,hT+2]])}
    if(st==='bald')R(g,S3,cx-2,hT+1,3,1)}
  // headwear
  if(C.head==='cap'){R(g,HC,cx-5,hT-2,10,4);R(g,HC2,cx+1,hT+1,6,1);R(g,shade(HC,.25),cx-3,hT-1,2,1);R(g,HC2,cx-1,hT-2,1,1)}
  if(C.head==='beanie'){R(g,HC,cx-5,hT-2,10,5);R(g,HC2,cx-5,hT+2,10,1);R(g,'#f3efe6',cx-1,hT-3,2,1);for(let x=cx-4;x<cx+5;x+=2)R(g,HC2,x,hT-1,1,3)}
  if(C.head==='headband'){R(g,HC,cx-5,hT+2,10,1);R(g,HC,cx-6,hT+2,1,2);R(g,HC2,cx+4,hT+2,1,1)}
  if(C.head==='ghutra'){R(g,HC,cx-6,hT-1,12,4);R(g,HC,cx-6,hT+3,1,8);R(g,HC,cx+5,hT+3,1,8);R(g,HC2,cx+5,hT+3,1,8);R(g,'#1a1a1a',cx-5,hT-1,10,1);R(g,'#1a1a1a',cx-5,hT+1,10,1)}
  if(C.head==='hijab'){R(g,HC,cx-6,hT-1,12,3);R(g,HC,cx-6,hT+2,2,8);R(g,HC,cx+4,hT+2,2,8);R(g,HC2,cx+5,hT+2,1,8);R(g,HC,cx-5,hT+9,10,2);R(g,HC,cx-4,shY-2,8,3);R(g,shade(HC,.2),cx-4,hT,3,1)}
  if(C.head==='bandana'){R(g,HC,cx-5,hT-1,10,3);pts(g,'#f3efe6',[[cx-3,hT],[cx,hT-1],[cx+2,hT+1],[cx-1,hT+1]]);R(g,HC,cx+5,hT+1,2,1);R(g,HC,cx+6,hT+2,1,2)}
  if(C.head==='imma'){R(g,'#f6f3ec',cx-6,hT-3,12,5);for(let x=cx-6;x<cx+6;x+=3)R(g,'#d9d2c3',x,hT-2,2,1);R(g,'#d9d2c3',cx-6,hT,12,1)}
  if(C.head==='crown'){R(g,'#f2c14e',cx-4,hT-3,8,2);pts(g,'#f2c14e',[[cx-4,hT-4],[cx-1,hT-5],[cx,hT-5],[cx+3,hT-4]]);R(g,'#c0392b',cx-1,hT-3,2,1);R(g,'#ffe08a',cx-3,hT-3,1,1)}
  // face accessories
  if(has('glasses')&&!o.back){R(g,'#1d1d24',cx-5,ey-1,4,1);R(g,'#1d1d24',cx,ey-1,4,1);R(g,'#1d1d24',cx-5,ey,1,2);R(g,'#1d1d24',cx-1,ey,1,1);R(g,'#1d1d24',cx+3,ey,1,2);R(g,'#1d1d24',cx-5,ey+2,4,1);R(g,'#1d1d24',cx,ey+2,4,1)}
  if(has('earbuds')&&!covered){R(g,'#ffffff',cx-6,hT+5,1,1);R(g,'#ffffff',cx+5,hT+5,1,1)}
  if(has('chain')&&!o.back)pts(g,'#f2c14e',[[cx-2,shY],[cx-1,shY+1],[cx,shY+1],[cx+1,shY]]);
  c.dims={cx,hw,aw,lw,shY,hipY,shoeTop,legLen,torsoLen,hT,shorts:C.bottom==='shorts'};
  outline(c);return has('aura')?outline(c,'#f2c14e'):c}

/* side view, 52x52, posed */
function drawSide(pr,C0,pose,A){
  const C=effChar(pr,C0),[c,g]=mk(52,52),{hf,b}=build(pr),k=.9+hf*.2;
  const Lt=12*k,Lth=9.5*k,Lsh=9*k,Lua=6.5*k,Lfa=6.5*k,tw=[5,6,7,8][b],lw=[3,3,4,5][b],aw=[2,3,3,3][b];
  const dv=a=>{const r=a*Math.PI/180;return[Math.sin(r),Math.cos(r)]},add=(p,a,l)=>{const v=dv(a);return[p[0]+v[0]*l,p[1]+v[1]*l]};
  const hip=[0,0],sh=add(hip,pose.torso,Lt),nA=pose.neck??pose.torso,hd=add(sh,nA,5.5);
  const kn=add(hip,pose.thigh,Lth),an=add(kn,pose.shin,Lsh),th2=pose.thigh2??pose.thigh,sn2=pose.shin2??pose.shin,kn2=add(hip,th2,Lth),an2=add(kn2,sn2,Lsh);
  const el=add(sh,pose.uarm,Lua),ha=add(el,pose.farm,Lfa),el2=add(sh,pose.uarm2??pose.uarm,Lua),ha2=add(el2,pose.farm2??pose.farm,Lfa);
  const lift=pose.lift||0,G=48;let ox,oy;
  const ay=A.ay||'feet',ax=A.ax||'feet';
  if(ay==='feet')oy=G-1-Math.max(an[1],an2[1])-lift;else if(ay==='lowest')oy=G-1-Math.max(an[1],an2[1],ha[1]+.5,ha2[1]+.5);else oy=A.hy;
  ox=ax==='feet'?A.fx-an[0]:ax==='hand'?A.fx-ha[0]:A.hx;
  const T=p=>[Math.round(p[0]+ox),Math.round(p[1]+oy)];
  const Hp=T(hip),Sh=T(sh),Hd=T(hd),Kn=T(kn),An=T(an),Kn2=T(kn2),An2=T(an2),El=T(el),Ha=T(ha),El2=T(el2),Ha2=T(ha2);
  const toe=a=>T(add(a===1?an:an2,(a===1?pose.shin:sn2)+90-lift*14,3));
  const seg=(a,b2,w,col)=>{lineW(g,a,b2,w+2,OL);lineW(g,a,b2,w,col)};
  const S=C.skin,T1=C.topC,B1=C.botC,SH=C.shoeC,robe=C.top==='kandura'||C.top==='kurta',robeFull=C.top==='kandura',has=x=>C.acc.includes(x),dk=x=>shade(x,-.25);
  const longSl=['hoodie','compression','kandura','kurta','tracksuit','armor'].includes(C.top),longLeg=C.bottom!=='shorts'||robeFull;
  const u=dv(nA),f=dv(nA-90);
  // scenery
  if(A.mat)R(g,'#2c998b',3,G,46,2);
  const bodyLow=Math.max(Hp[1],Sh[1])+Math.ceil(tw/2)+1;
  if(A.bench==='flat'){const x0=Math.min(Hp[0],Sh[0])-4,x1=Math.max(Hp[0],Sh[0])+4;R(g,OL,x0-1,bodyLow-1,x1-x0+2,4);R(g,'#7b6fb0',x0,bodyLow,x1-x0,2);R(g,OL,x0+1,bodyLow+3,2,G-bodyLow-2);R(g,OL,x1-3,bodyLow+3,2,G-bodyLow-2)}
  if(A.bench==='incline'){const bo=dv(pose.torso+90),o=Math.ceil(tw/2)+1,p1=[Hp[0]+bo[0]*o,Hp[1]+bo[1]*o],p2=[Sh[0]+bo[0]*o,Sh[1]+bo[1]*o];
    seg(p1.map(Math.round),p2.map(Math.round),2,'#7b6fb0');R(g,OL,Hp[0]-4,bodyLow-1,9,3);R(g,'#7b6fb0',Hp[0]-3,bodyLow,7,1);R(g,OL,Hp[0]-1,bodyLow+2,2,G-bodyLow-1)}
  if(A.seat){R(g,OL,Hp[0]-5,bodyLow-1,11,3);R(g,'#7b6fb0',Hp[0]-4,bodyLow,9,1);R(g,OL,Hp[0]-1,bodyLow+2,2,G-bodyLow-1)}
  if(A.prop==='cableTop'){R(g,'#9aa3b5',Ha[0],2,1,Ha[1]-2);disc(g,OL,Ha[0],2,1.5);R(g,'#c7cde0',Ha[0],2,1,1);R(g,OL,Ha[0]-2,Ha[1]-1,5,2)}
  if(A.prop==='cableFront'){R(g,'#9aa3b5',Ha[0],Ha[1],51-Ha[0],1);R(g,OL,49,Ha[1]-2,3,5)}
  if(!A.mat&&!A.bench)R(g,'rgba(0,0,0,.22)',An[0]-7,G,16,1);
  // far limbs
  const leg=(Kx,Ax,tw2,far,n)=>{const bc=far?dk(B1):B1,lc=longLeg?(robeFull?(far?dk(T1):T1):bc):(far?dk(S):S);
    seg(Hp,Kx,lw,robe?(far?dk(T1):T1):bc);seg(Kx,Ax,lw,lc);if(!longLeg)seg(Kx,[Kx[0]+(Hp[0]-Kx[0])*.3|0,Kx[1]+(Hp[1]-Kx[1])*.3|0],lw,bc);
    const tp=toe(n);seg(Ax,tp,2,far?dk(SH):SH)};
  const arm=(Ex,Hx,far)=>{const sk=far?dk(S):S,tc=far?dk(T1):T1;seg(Sh,Ex,aw,longSl?tc:(C.top==='tee'?tc:sk));seg(Ex,Hx,aw,longSl?tc:sk);
    if(C.top==='tee')seg(Ex,[Math.round((Sh[0]+Ex[0])/2),Math.round((Sh[1]+Ex[1])/2)],aw,sk);
    disc(g,OL,Hx[0],Hx[1],1.6);disc(g,has('gloves')?'#2b2b33':sk,Hx[0],Hx[1],1)};
  const off=([x,y])=>[x-1,y];
  if(has('cape'))seg([Math.round(Sh[0]-f[0]*1.5),Math.round(Sh[1]-f[1]*1.5)],[Math.round((Hp[0]+Kn[0])/2-f[0]*3),Math.round((Hp[1]+Kn[1])/2-f[1]*3)],4,'#c0392b');
  arm(off(El2),off(Ha2),true);
  leg(off(Kn2),off(An2),lw,true,2);
  // drapes behind torso
  if(C.head==='ghutra')seg([Math.round(Hd[0]-f[0]*2.5),Math.round(Hd[1]-f[1]*2.5)],[Math.round(Hd[0]-f[0]*2.5-u[0]*8),Math.round(Hd[1]-f[1]*2.5-u[1]*8)],4,C.headC);
  if(C.head==='hijab')seg([Math.round(Hd[0]-f[0]),Math.round(Hd[1]-f[1])],[Math.round(Sh[0]-f[0]*2),Math.round(Sh[1]-f[1]*2)],6,C.headC);
  if(C.hair==='long'&&!['ghutra','hijab'].includes(C.head))seg([Math.round(Hd[0]-f[0]*2),Math.round(Hd[1]-f[1]*2)],[Math.round(Hd[0]-f[0]*2-u[0]*7),Math.round(Hd[1]-f[1]*2-u[1]*7)],3,C.hairC);
  // torso
  seg(Hp,Sh,tw,T1);
  if(!robe){const w2=T(add(hip,pose.torso,2.5));lineW(g,Hp,w2,tw,B1)}
  lineW(g,[Sh[0]-Math.round(f[0]*1),Sh[1]-Math.round(f[1]*1)],[Hp[0]-Math.round(f[0]*1),Hp[1]-Math.round(f[1]*1)],1,dk(robe?T1:T1));
  if(has('chain'))R(g,'#f2c14e',Math.round(Sh[0]+f[0]*1.5),Math.round(Sh[1]+f[1]*1.5));
  // head
  const hx=Hd[0],hy=Hd[1],covered=['ghutra','hijab'].includes(C.head);
  if(C.hair==='afro'&&!covered)disc(g,C.hairC,hx-f[0]*1+u[0]*1,hy-f[1]*1+u[1]*1,6);
  disc(g,OL,hx,hy,5);
  const nose=[Math.round(hx+f[0]*4.6-u[0]*.3),Math.round(hy+f[1]*4.6-u[1]*.3)];R(g,OL,nose[0]+Math.round(f[0]),nose[1]+Math.round(f[1]));
  for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){if(x*x+y*y>16+3.2)continue;const su=x*u[0]+y*u[1],sf=x*f[0]+y*f[1];let col=S;
    if(sf<-1.5&&su<1)col=shade(S,-.08);
    if(!covered&&C.head!=='beanie'){const st=C.hair;
      if((st==='short'||st==='bun'||st==='long')&&(su>=1.5||(sf<=-2&&su>=-1.5)))col=C.hairC;
      if(st==='long'&&sf<=-1.5)col=C.hairC;
      if(st==='buzz'&&(su>=2.5||(sf<=-3&&su>=0)))col=shade(C.hairC,-.2);
      if((st==='curly'||st==='afro')&&(su>=1||(sf<=-1.5&&su>=-2)))col=((x+y)%3===0)?shade(C.hairC,.2):C.hairC}
    if(C.beard==='full'&&sf>=-.5&&su<=-1.2)col=C.hairC;
    if(C.beard==='stubble'&&sf>=-.5&&su<=-1.2&&(x+y)%2===0)col=shade(S,-.28);
    if(C.head==='cap'&&su>=1.5)col=C.headC;
    if(C.head==='beanie'&&su>=1)col=(su<2)?shade(C.headC,-.2):C.headC;
    if(C.head==='headband'&&su>=1.2&&su<2.4)col=C.headC;
    if(C.head==='ghutra'&&(su>=.8||sf<=-.8))col=(su>=2.2&&su<3.2&&sf<=1.5)?'#1a1a1a':C.headC;
    if(C.head==='hijab'&&sf<=1.6)col=C.headC;
    if(C.head==='bandana'&&su>=1.2)col=((x*3+y)%4===0)?'#f3efe6':C.headC;
    if(C.head==='imma'&&(su>=.6||(sf<=-1.5&&su>=-1)))col=((x+y)%3===0)?'#d9d2c3':'#f6f3ec';
    R(g,col,hx+x,hy+y)}
  R(g,S,nose[0],nose[1]);
  if(C.hair==='bun'&&!covered)disc(g,C.hairC,hx+u[0]*4-f[0]*2,hy+u[1]*4-f[1]*2,1.5);
  if(C.head==='cap')for(let i=3;i<=5;i++)R(g,shade(C.headC,-.25),Math.round(hx+u[0]*1.6+f[0]*i),Math.round(hy+u[1]*1.6+f[1]*i));
  if(C.head==='crown')for(let k2=-2;k2<=2;k2++){const bx=Math.round(hx+u[0]*4.5+f[0]*k2),by=Math.round(hy+u[1]*4.5+f[1]*k2);R(g,'#f2c14e',bx,by);if(k2%2===0)R(g,'#f2c14e',Math.round(bx+u[0]),Math.round(by+u[1]))}
  const e=[Math.round(hx+f[0]*2.2+u[0]*.4),Math.round(hy+f[1]*2.2+u[1]*.4)];
  R(g,'#ffffff',e[0]-Math.round(f[0]),e[1]-Math.round(f[1]));R(g,C.eye,e[0],e[1]);
  if(!covered||C.head==='ghutra')R(g,C.hair==='bald'?shade(S,-.3):C.hairC,Math.round(e[0]+u[0]*1.4),Math.round(e[1]+u[1]*1.4));
  R(g,shade(S,-.4),Math.round(hx+f[0]*2.8-u[0]*2.2),Math.round(hy+f[1]*2.8-u[1]*2.2));
  if(!covered)R(g,shade(S,-.25),Math.round(hx-f[0]*.6),Math.round(hy-f[1]*.6));
  if(has('glasses')){R(g,'#1d1d24',e[0],e[1]);R(g,'#1d1d24',e[0]+Math.round(f[0]),e[1]+Math.round(f[1]));lineW(g,e,[Math.round(hx-f[0]*.8),Math.round(hy-f[1]*.8)],1,'#1d1d24')}
  if(has('earbuds')&&!covered)R(g,'#ffffff',Math.round(hx-f[0]*.6),Math.round(hy-f[1]*.6));
  // props in front of torso
  if(A.prop==='barBack'){const p=[Math.round(Sh[0]-f[0]*2.5+u[0]*.5),Math.round(Sh[1]-f[1]*2.5+u[1]*.5)];disc(g,OL,p[0],p[1],4);disc(g,'#3d3a4f',p[0],p[1],3);disc(g,'#5b5873',p[0],p[1],1);R(g,'#c7cde0',p[0],p[1])}
  if(A.prop==='bar'){disc(g,OL,Ha[0],Ha[1],5);disc(g,'#3d3a4f',Ha[0],Ha[1],4);disc(g,'#5b5873',Ha[0],Ha[1],2);R(g,'#c7cde0',Ha[0],Ha[1])}
  if(A.prop==='sled'){const pp=dv(pose.shin+90);seg([Math.round(An[0]+pp[0]*5),Math.round(An[1]+pp[1]*5)],[Math.round(An[0]-pp[0]*6),Math.round(An[1]-pp[1]*6)],2,'#5b5873')}
  // near limbs
  leg(Kn,An,lw,false,1);
  arm(El,Ha,false);
  if(A.prop==='db'){disc(g,OL,Ha[0],Ha[1],3);disc(g,'#3d3a4f',Ha[0],Ha[1],2);R(g,'#9aa3b5',Ha[0],Ha[1]);}
  const wr=[Math.round(Ha[0]-(Ha[0]-El[0])*.3),Math.round(Ha[1]-(Ha[1]-El[1])*.3)];
  if(has('watch')){R(g,'#1d1d24',wr[0],wr[1],2,2);R(g,'#3fc1b0',wr[0],wr[1])}
  if(has('wristband'))R(g,C.accC,wr[0],wr[1],2,2);
  if(has('ring'))R(g,'#f2c14e',Ha[0],Ha[1]);
  return has('aura')?outline(c,'#f2c14e'):c}
