/* ================= pixel drawing ================= */
const OL='#24161f';
function mk(w,hh){const c=document.createElement('canvas');c.width=w;c.height=hh;const g=c.getContext('2d');return[c,g]}
function R(g,c,x,y,w=1,hh=1){if(c===null){g.clearRect(Math.floor(x),Math.floor(y),w,hh);return}g.fillStyle=c;g.fillRect(Math.floor(x),Math.floor(y),w,hh)}
function pts(g,c,l){l.forEach(([x,y])=>R(g,c,x,y))}
function disc(g,c,cx,cy,r){cx=Math.round(cx);cy=Math.round(cy);const n=Math.ceil(r)+1;for(let y=-n;y<=n;y++)for(let x=-n;x<=n;x++)if(x*x+y*y<=r*r+r*.8)R(g,c,cx+x,cy+y)}
function ell(g,c,cx,cy,rx,ry){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx+.6)+y*y/(ry*ry+.6)<=1)R(g,c,cx+x,cy+y)}
function lineW(g,a,b,w,c){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2)+1;for(let i=0;i<=n;i++){const t=i/n;
  R(g,c,Math.round(a[0]+(b[0]-a[0])*t-w/2+.01),Math.round(a[1]+(b[1]-a[1])*t-w/2+.01),w,w)}}
function outline(c,col=OL){const g=c.getContext('2d'),w=c.width,hh=c.height,d=g.getImageData(0,0,w,hh).data;
  const a=(x,y)=>x>=0&&y>=0&&x<w&&y<hh&&d[(y*w+x)*4+3]>40;g.fillStyle=col;
  for(let y=0;y<hh;y++)for(let x=0;x<w;x++)if(!a(x,y)&&(a(x+1,y)||a(x-1,y)||a(x,y+1)||a(x,y-1)))g.fillRect(x,y,1,1);return c}
function show(c,s){c.style.width=c.width*s+'px';c.style.height=c.height*s+'px';c.setAttribute('aria-hidden','true');return c}

/* small UI sprites */
const PAL={h:'#3b2a1a',s:'#e0a372',K:'#1a1433',R:'#ff6b57',W:'#f6e9d0',Y:'#f2b84b',M:'#c97a3a',Q:'#3fc1b0',H:'#c7cde0',G:'#9aa3b5',D:'#5b5873'};
const SPR={
 dumb:["QQ......QQ","QQ......QQ","QQHHHHHHQQ","QQ......QQ","QQ......QQ"],
 leg:["..MMMM..",".MMMMMM.",".MMMMMM.","..MMMMM.","...MMM..","....W...","...W.W..","...W...."],
 pin:["..RRR..",".RRRRR.","RRWWWRR","RRWWWRR",".RRRRR.","..RRR..","...R..."],
 pinOn:["..YYY..",".YYYYY.","YYKKKYY","YYKKKYY",".YYYYY.","..YYY..","...Y..."],
 star:["...Y...","..YYY..","YYYYYYY",".YYYYY.","..YYY..",".YY.YY.","YY...YY"],
 house:["...RR...","..RRRR..",".RRRRRR.","RRRRRRRR",".WWWWWW.",".WW..WW.",".WW..WW."],
 head:[".hhhhh.","hhhhhhh","hsssssh","sKsssKs","sssssss",".ssRss.","..sss.."],
 flame:["...Y...","..YY...","..YRY..",".YRRY..",".YRRRY.","YRRWRRY","YRWWWRY",".YRRRY."],
 gear:["..G.G..",".GGGGG.","GGDDDGG",".GD.DG.","GGDDDGG",".GGGGG.","..G.G.."],
 heart:[".RR.RR.","RRRRRRR","RRWRRRR","RRRRRRR",".RRRRR.","..RRR..","...R..."],
 bolt:["...YY","..YY.",".YYYY","..YY.",".YY..","YY..."],
 cal:["RRRRRRR","WWWWWWW","WKWKWKW","WWWWWWW","WKWKWKW","WWWWWWW"],
 cam:[".DD....","HHHHHHH","HDDDHQH","HDKDHHH","HDDDHHH","HHHHHHH"],
 club:["WWWWWWW","WKWKWKW","WWWWWWW","WW.....","W......"],
 sun:["..Y..","Y.Y.Y",".YYY.","YYYYY",".YYY.","Y.Y.Y","..Y.."],
 moon:[".KKK.","KK...","K....","K....","K....","KK...",".KKK."],
 plus:["..WW..","..WW..","WWWWWW","WWWWWW","..WW..","..WW.."],
 lock:[".GGG.","G...G","GGGGG","GDDDG","GDGDG","GGGGG"],
 note:["..WWW","..W.W","..W.W","WWW.W","WWWWW","WWW.."],
 shirt:["RR.RR","RRRRR",".RRR.",".RRR."],
 hat:[".YYY.","YYYYY","YYYYYYY"],
 crown:["Y.Y.Y","YYYYY","YRYRY","YYYYY"],
 glasses:["HHH.HHH","HQHHHQH","HHH.HHH"],
 earbuds:["WW..WW","WW..WW",".W..W."],
 chain:["Y...Y",".Y.Y.","..Y.."],
 gloves:["DDDD","DDDD","DDDD",".DD."],
 cape:["RRRRR","RRRRR","RRRRR","RR.RR"],
 aura:["Y.Y.Y",".YYY.","YYWYY",".YYY.","Y.Y.Y"]
};
function px(name,s=3){if(ART['icon_'+name])return artCanvas(ART['icon_'+name],18*Math.max(1,Math.round(s*.6)));if(UIC[name]){const[c,g]=mk(18,18);UIC[name](g);outline(c);return show(c,Math.max(1,Math.round(s*.6)))}const rows=SPR[name],hh=rows.length,w=Math.max(...rows.map(r=>r.length));const[c,g]=mk(w,hh);
  rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(PAL[ch])R(g,PAL[ch],i,j)}));return show(c,s)}
