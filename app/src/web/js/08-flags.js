/* ================= flags ================= */
const FL={
 AE:['United Arab Emirates','UAE',[['h',['#00732f','#ffffff','#000000']],['r','#ff0000',0,0,4,10]]],
 SA:['Saudi Arabia','KSA',[['r','#006c35',0,0,15,10],['r','#ffffff',4,3,7,1],['r','#ffffff',5,2,2,1],['r','#ffffff',9,2,1,1],['r','#ffffff',3,6,9,1],['r','#ffffff',11,5,1,1]]],
 SD:['Sudan','SDN',[['h',['#d21034','#ffffff','#000000']],['rows','#007229',[1,2,3,4,5,5,4,3,2,1]]]],
 EG:['Egypt','EGY',[['h',['#ce1126','#ffffff','#000000']],['c','#c09300',7,5,1]]],
 IN:['India','IND',[['h',['#ff9933','#ffffff','#138808']],['c','#000080',7,5,1]]],
 PK:['Pakistan','PAK',[['r','#01411c',0,0,15,10],['r','#ffffff',0,0,4,10],['c','#ffffff',9,5,3],['c','#01411c',10,4,3],['r','#ffffff',12,3,1,1]]],
 PH:['Philippines','PHL',[['h',['#0038a8','#ce1126']],['rows','#ffffff',[1,2,3,4,5,5,4,3,2,1]],['r','#fcd116',1,4,2,2]]],
 GB:['United Kingdom','GBR',[['r','#012169',0,0,15,10],['d','#ffffff'],['r','#ffffff',0,3,15,4],['r','#ffffff',5,0,5,10],['r','#c8102e',0,4,15,2],['r','#c8102e',6,0,3,10]]],
 US:['United States','USA',[['h',['#b22234','#ffffff','#b22234','#ffffff','#b22234','#ffffff','#b22234','#ffffff','#b22234','#ffffff']],['r','#3c3b6e',0,0,7,5],['dots','#ffffff',0,0,7,5]]],
 JO:['Jordan','JOR',[['h',['#000000','#ffffff','#007a3d']],['rows','#ce1126',[1,2,3,4,5,5,4,3,2,1]],['r','#ffffff',2,4,1,2]]],
 LB:['Lebanon','LBN',[['h',['#ed1c24','#ed1c24','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ed1c24','#ed1c24']],['r','#00a651',7,3,1,1],['r','#00a651',6,4,3,1],['r','#00a651',5,5,5,1],['r','#00a651',7,6,1,1]]],
 SY:['Syria','SYR',[['h',['#007a3d','#ffffff','#000000']],['c','#ce1126',3,5,1],['c','#ce1126',7,5,1],['c','#ce1126',11,5,1]]],
 KW:['Kuwait','KWT',[['h',['#007a3d','#ffffff','#ce1126']],['rows','#000000',[2,2,3,3,4,4,3,3,2,2]]]],
 QA:['Qatar','QAT',[['r','#8a1538',0,0,15,10],['rows','#ffffff',[5,4,5,4,5,4,5,4,5,4]]]],
 OM:['Oman','OMN',[['h',['#ffffff','#db161b','#008000']],['r','#db161b',0,0,4,10],['r','#ffffff',1,1,2,1]]],
 BH:['Bahrain','BHR',[['r','#ce1126',0,0,15,10],['rows','#ffffff',[5,4,5,4,5,4,5,4,5,4]]]],
 BD:['Bangladesh','BGD',[['r','#006a4e',0,0,15,10],['c','#f42a41',6,5,3]]],
 NP:['Nepal','NPL',[['rows','#dc143c',[9,8,6,4,8,8,7,6,5,10]],['r','#ffffff',2,2,1,1],['r','#ffffff',2,6,2,1]]],
 LK:['Sri Lanka','LKA',[['r','#ffbe29',0,0,15,10],['r','#8d153a',5,1,9,8],['r','#00534e',1,1,2,8],['r','#eb7400',3,1,2,8],['r','#ffbe29',8,4,3,2]]],
 TR:['Türkiye','TUR',[['r','#e30a17',0,0,15,10],['c','#ffffff',5,5,3],['c','#e30a17',6,5,2],['c','#ffffff',10,5,1]]],
 MA:['Morocco','MAR',[['r','#c1272d',0,0,15,10],['c','#006233',7,5,2],['c','#c1272d',7,5,1]]],
 IQ:['Iraq','IRQ',[['h',['#ce1126','#ffffff','#000000']],['r','#007a3d',4,5,7,1],['r','#007a3d',5,4,1,1],['r','#007a3d',9,4,1,1]]],
 YE:['Yemen','YEM',[['h',['#ce1126','#ffffff','#000000']]]],
 SO:['Somalia','SOM',[['r','#4189dd',0,0,15,10],['c','#ffffff',7,5,1]]],
 ET:['Ethiopia','ETH',[['h',['#078930','#fcdd09','#da121a']],['c','#0f47af',7,5,3],['c','#fcdd09',7,5,1]]],
 KE:['Kenya','KEN',[['h',['#000000','#000000','#000000','#ffffff','#bb0000','#bb0000','#ffffff','#006600','#006600','#006600']],['r','#bb0000',6,2,3,6],['r','#000000',7,3,1,4]]],
 NG:['Nigeria','NGA',[['v',['#008751','#ffffff','#008751']]]],
 DE:['Germany','DEU',[['h',['#000000','#dd0000','#ffce00']]]],
 FR:['France','FRA',[['v',['#0055a4','#ffffff','#ef4135']]]],
 IT:['Italy','ITA',[['v',['#009246','#ffffff','#ce2b37']]]],
 RU:['Russia','RUS',[['h',['#ffffff','#0039a6','#d52b1e']]]],
 CN:['China','CHN',[['r','#de2910',0,0,15,10],['c','#ffde00',3,3,1],['r','#ffde00',6,1,1,1],['r','#ffde00',7,2,1,1],['r','#ffde00',7,4,1,1],['r','#ffde00',6,5,1,1]]],
 XX:['Other','---',[['r','#2d6b8f',0,0,15,10],['c','#3fc1b0',5,5,3],['c','#3fc1b0',11,3,2]]]
};
function flag(code,s=2){const[c,g]=mk(17,12);const spec=(FL[code]||FL.XX)[2];g.save();g.translate(1,1);
  for(const op of spec){const[t,c1]=op;
    if(t==='h')for(let y=0;y<10;y++)R(g,c1[Math.floor(y*c1.length/10)],0,y,15,1);
    else if(t==='v')for(let x=0;x<15;x++)R(g,c1[Math.floor(x*c1.length/15)],x,0,1,10);
    else if(t==='r')R(g,c1,op[2],op[3],op[4],op[5]);
    else if(t==='c')disc(g,c1,op[2],op[3],op[4]);
    else if(t==='rows')op[2].forEach((w,y)=>R(g,c1,0,y,w,1));
    else if(t==='d')for(let x=0;x<15;x++){const y=Math.round(x*9/14);R(g,c1,x,y);R(g,c1,x,9-y)}
    else if(t==='u'||t==='u2'||t==='dn'||t==='dn2'){const w=t.endsWith('2')===(t[0]==='u')?4:2;for(let x=0;x<15;x++){const y=t[0]==='u'?Math.round(9-x*9/14):Math.round(x*9/14);R(g,c1,x,y-(w>>1),1,w)}}
    else if(t==='dots')for(let j=1;j<op[5];j+=2)for(let i=1;i<op[4];i+=2)R(g,c1,op[2]+i,op[3]+j)}
  g.restore();outline(c);return show(c,s)}
