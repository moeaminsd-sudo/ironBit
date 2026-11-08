/* ================= themes ================= */
const PALS={
 iron:{name:'IRON (DEFAULT)',dark:{bg:'#1d1d21',panel:'#27272d',panel2:'#323239',line:'#46464f',fg:'#f2f0ea',dim:'#a3a1ab',a1:'#f2b84b',a2:'#ff6b57',a3:'#3fc1b0',outer:'#131316'},
   light:{bg:'#f5f2ea',panel:'#fffdf8',panel2:'#ebe6da',line:'#c9c2b1',fg:'#26242a',dim:'#6e6a73',a1:'#b8680a',a2:'#e04e3a',a3:'#16867a',outer:'#e2ddd0'}},
 night:{name:'DUBAI NIGHT',dark:{bg:'#1a1433',panel:'#261d4a',panel2:'#33285f',line:'#4a3d85',fg:'#f6e9d0',dim:'#a79fcf',a1:'#f2b84b',a2:'#ff6b57',a3:'#3fc1b0',outer:'#0f0b20'},
   light:{bg:'#f6e9d0',panel:'#fff8ea',panel2:'#efdcb8',line:'#c9a46a',fg:'#2b1d2e',dim:'#7a6450',a1:'#b8680a',a2:'#e04e3a',a3:'#16867a',outer:'#e3cfa5'}},
 gameboy:{name:'GAME BOY',dark:{bg:'#0f380f',panel:'#1d4a1d',panel2:'#2a5a24',line:'#4f7a28',fg:'#e0f8d0',dim:'#9bbc0f',a1:'#c4f0c2',a2:'#9bbc0f',a3:'#8bac0f',outer:'#081c08'},
   light:{bg:'#e0f8d0',panel:'#cfeab8',panel2:'#b6d898',line:'#4f7a28',fg:'#0f380f',dim:'#306230',a1:'#306230',a2:'#0f380f',a3:'#4f7a28',outer:'#9bbc0f'}},
 neon:{name:'NEON SOUQ',dark:{bg:'#0d0221',panel:'#190535',panel2:'#261447',line:'#541388',fg:'#f4f4ff',dim:'#b8a4e3',a1:'#ffd319',a2:'#ff2a6d',a3:'#05d9e8',outer:'#06010f'},
   light:{bg:'#fff0fb',panel:'#ffffff',panel2:'#f3e1f5',line:'#d29be0',fg:'#2b0b3f',dim:'#7b5a8c',a1:'#a87b00',a2:'#d6115a',a3:'#08808f',outer:'#f0cdea'}},
 nile:{name:'NILE SUNSET',dark:{bg:'#1c1410',panel:'#2a1e17',panel2:'#3a2a1f',line:'#5c4130',fg:'#fbe8d3',dim:'#c9a88a',a1:'#ffb347',a2:'#e2583e',a3:'#5fb49c',outer:'#110b08'},
   light:{bg:'#fbf1e4',panel:'#fffaf3',panel2:'#f2dcc2',line:'#d1a77e',fg:'#3a2418',dim:'#8a6650',a1:'#b5650d',a2:'#c4432b',a3:'#2f8a72',outer:'#ead2b4'}},
 arcade:{name:'ARCADE',dark:{bg:'#0b0b0b',panel:'#151515',panel2:'#222222',line:'#3a3a3a',fg:'#f5f5f5',dim:'#9e9e9e',a1:'#ffe600',a2:'#ff00a8',a3:'#00e5ff',outer:'#000000'},
   light:{bg:'#f4f4f4',panel:'#ffffff',panel2:'#e5e5e5',line:'#bdbdbd',fg:'#111111',dim:'#555555',a1:'#8f7d00',a2:'#c4007f',a3:'#007f99',outer:'#dddddd'}},
 legend:{name:'LEGENDARY GOLD',dark:{bg:'#120d05',panel:'#1f170a',panel2:'#2c2010',line:'#6b5420',fg:'#fff4d6',dim:'#c9b27a',a1:'#ffd54a',a2:'#ff9f1c',a3:'#e8e8e8',outer:'#080502'},
   light:{bg:'#fff8e1',panel:'#fffdf3',panel2:'#f6e7b8',line:'#c9a227',fg:'#2b2005',dim:'#7a6420',a1:'#8a6700',a2:'#c75b00',a3:'#5f6b73',outer:'#ecd88f'}}
};
function applyTheme(){const pal=PALS[SET.pal]&&unlocked('pal',SET.pal)?SET.pal:'iron',mode=curMode();let t={...PALS[pal][mode]};if(SET.accent)t.a2=SET.accent;t=eventPal(t,mode);t.onA=lum(t.a2)>.55?'#1a1433':'#ffffff';
  const r=document.documentElement.style;for(const[k,v]of Object.entries(t))r.setProperty('--'+k,v);r.setProperty('--fz',SET.fz);r.setProperty('color-scheme',mode);
  const F=FONTS[SET.font]||FONTS.classic;r.setProperty('--display',F[1]+',"Courier New",monospace');r.setProperty('--body',F[2]+',"Courier New",monospace');r.setProperty('--dz',F[3]);r.setProperty('--bz',F[4]);
  APP.classList.toggle('crt',!!SET.crt);if(P)eventFX()}
