/* ================= cities + gyms (sample data) ================= */
function rng(seed){let a=typeof seed==='string'?[...seed].reduce((x,c)=>Math.imul(x^c.charCodeAt(0),16777619),2166136261)>>>0:seed>>>0;
  return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const CITIES={
 'Dubai':['AE','AED',300,1,['Al Quoz','Al Barsha','Marina','Downtown','Deira','Jumeirah','Business Bay']],
 'Abu Dhabi':['AE','AED',280,1,['Al Reem','Khalifa City','Corniche','Al Raha','Mussafah','Yas']],
 'Sharjah':['AE','AED',200,1,['Al Majaz','Al Nahda','Muwaileh','Al Khan','Al Taawun']],
 'Riyadh':['SA','SAR',250,0,['Olaya','Al Malqa','Al Nakheel','Al Yasmin','Al Sulimaniyah']],
 'Jeddah':['SA','SAR',230,1,['Al Rawdah','Al Hamra','Obhur','Al Safa','Al Zahra']],
 'Doha':['QA','QAR',300,1,['West Bay','The Pearl','Al Sadd','Lusail','Al Waab']],
 'Kuwait City':['KW','KWD',25,1,['Salmiya','Hawalli','Sharq','Jabriya','Mishref']],
 'Muscat':['OM','OMR',25,1,['Al Khuwair','Qurum','Bausher','Al Mawaleh','Ruwi']],
 'Manama':['BH','BHD',25,1,['Seef','Juffair','Adliya','Hoora','Sanabis']],
 'Cairo':['EG','EGP',1000,0,['Maadi','Zamalek','Heliopolis','Nasr City','New Cairo','Dokki']],
 'Khartoum':['SD','SDG',20000,0,['Riyadh','Amarat','Bahri','Omdurman','Arkaweet']],
 'Amman':['JO','JOD',30,0,['Abdoun','Sweifieh','Khalda','Jabal Amman','Tla Al Ali']],
 'Istanbul':['TR','TRY',1500,1,['Kadıköy','Beşiktaş','Şişli','Üsküdar','Ataşehir']],
 'London':['GB','GBP',40,0,['Camden','Shoreditch','Clapham','Canary Wharf','Brixton','Islington']],
 'New York':['US','USD',60,1,['Midtown','Brooklyn','Harlem','Queens','Chelsea','SoHo']],
 'Mumbai':['IN','INR',2000,1,['Bandra','Andheri','Powai','Colaba','Juhu']],
 'Karachi':['PK','PKR',5000,1,['Clifton','DHA','Gulshan','PECHS','Saddar']],
 'Manila':['PH','PHP',1500,1,['Makati','BGC','Ortigas','Quezon City','Pasig']],
 'Other':['XX','USD',40,0,['Downtown','North side','South side','East side','West side']]
};
const GYM_TYPES=[['24-hour gym',['24H'],.6,'24/7'],['Budget gym',['BUDGET'],.4,'6AM–12AM'],['Fitness club',[],1,'6AM–11PM'],['Premium club',[],1.6,'5AM–11PM'],
 ['Ladies-only studio',['LADIES'],1.1,'7AM–10PM'],['CrossFit box',['CLASSES'],1.8,'6AM–9PM'],['Boxing gym',['CLASSES'],1.3,'7AM–10PM']];
const coastY=x=>Math.round(30-x*.35);
function landSpot(r,coast){for(let i=0;i<200;i++){const x=4+Math.floor(r()*56),y=8+Math.floor(r()*66);if(!coast||y>coastY(x)+3)return[x,y]}return[32,60]}
function cityGyms(city){const[,cur,base,coast,areas]=CITIES[city]||CITIES.Other,r=rng('gyms'+city),step=base>500?100:5;
  const list=areas.map((a,i)=>{const t=GYM_TYPES[(i*3+Math.floor(r()*3))%GYM_TYPES.length],[x,y]=landSpot(r,coast);
    return{n:t[0],a,x,y,p:Math.max(step,Math.round(base*t[2]*(.85+r()*.3)/step)*step),hrs:t[3],t:t[1],cur}});
  ((P.myGyms||{})[city]||[]).forEach(g=>list.push({...g,cur,mine:true}));return list}
