/* ================= utilities ================= */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function h(tag,attrs={},...kids){const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{})){
  if(v==null||v===false)continue;if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v)}
  kids.flat(Infinity).forEach(k=>k!=null&&k!==false&&e.append(k.nodeType?k:document.createTextNode(k)));return e}
const store={get(k,d){try{const v=localStorage.getItem('ib2_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('ib2_'+k,JSON.stringify(v))}catch(e){}},clear(){try{Object.keys(localStorage).filter(k=>k.startsWith('ib2_')).forEach(k=>localStorage.removeItem(k))}catch(e){}}};
const dstr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dstr(new Date());
const APP=document.getElementById('app');
function toast(msg){APP.querySelectorAll('.toast').forEach(t=>t.remove());const t=h('div',{class:'toast',role:'status'},msg);APP.append(t);setTimeout(()=>t.remove(),1700)}
function modal(...kids){const m=h('div',{class:'modal',onclick:e=>{if(e.target===m)m.remove()}},h('div',{class:'box',role:'dialog'},...kids));APP.append(m);return m}
function shade(hex,a){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const t=a<0?0:255,p=Math.abs(a);
  r=Math.round(r+(t-r)*p);g=Math.round(g+(t-g)*p);b=Math.round(b+(t-b)*p);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function mix(a,b,p){const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16),c=s=>Math.round((x>>s&255)*(1-p)+(y>>s&255)*p);return '#'+((1<<24)|(c(16)<<16)|(c(8)<<8)|c(0)).toString(16).slice(1)}
function lum(hex){const n=parseInt(hex.slice(1),16);return((n>>16)*.299+(n>>8&255)*.587+(n&255)*.114)/255}
