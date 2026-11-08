/* ================= training data ================= */
const EX={
 'Bench press':['bench','Chest',['Feet planted, shoulder blades squeezed','Lower the bar to mid-chest','Press up and slightly back']],
 'Overhead press':['ohp','Shoulders',['Brace your core and squeeze glutes','Bar travels straight up','Push your head through at the top']],
 'Incline DB press':['inclinedb','Upper chest',['Set the bench to 30–45°','Elbows about 45° from your body','Press until arms are straight']],
 'Lateral raise':['lateral','Side delts',['Slight bend in the elbows','Raise to shoulder height','Lower slowly over 2–3 seconds']],
 'Triceps pushdown':['pushdown','Triceps',['Pin elbows to your sides','Push down until arms lock','Control the bar on the way up']],
 'Deadlift':['deadlift','Back & legs',['Bar over the middle of your foot','Flat back, chest up','Push the floor away']],
 'Lat pulldown':['pulldown','Lats',['Grip just wider than shoulders','Pull the bar to your upper chest','Lead with your elbows']],
 'Barbell row':['row','Mid back',['Hinge to about 45°','Pull to your lower ribs','Keep your back flat']],
 'Face pull':['facepull','Rear delts',['Rope at face height','Pull toward your ears, elbows high','Squeeze the back of your shoulders']],
 'Biceps curl':['curl','Biceps',['Keep elbows still','Squeeze hard at the top','Lower under control']],
 'Back squat':['squat','Quads & glutes',['Bar on your upper back','Knees track over toes','Sit down until thighs are level']],
 'Romanian deadlift':['rdl','Hamstrings',['Soft knees','Push your hips back','Stop when you feel the hamstring stretch']],
 'Leg press':['legpress','Quads',['Feet shoulder-width on the plate','Lower until knees reach about 90°','Don\'t lock knees hard at the top']],
 'Walking lunge':['lunge','Legs',['Take a long step forward','Back knee nearly touches the floor','Drive up through the front heel']],
 'Calf raise':['calf','Calves',['Full stretch at the bottom','Pause at the top','Slow and controlled']],
 'Goblet squat':['goblet','Quads & glutes',['Hold the dumbbell at your chest','Elbows inside your knees','Chest stays up']],
 'Push-up':['pushup','Chest',['Hands under your shoulders','Body in one straight line','Chest close to the floor']],
 'Seated row':['seatedrow','Back',['Sit tall, slight knee bend','Pull the handle to your belly','Squeeze shoulder blades together']],
 'Plank':['plank','Core',['Elbows under shoulders','Squeeze glutes and abs','Breathe slowly and hold']],
 'Bodyweight squat':['bwsquat','Legs',['Feet shoulder-width','Arms forward for balance','Stand tall at the top']],
 'Glute bridge':['bridge','Glutes',['Feet flat, knees bent','Drive hips up through heels','Squeeze at the top for 1 second']],
 'Mountain climber':['climber','Core & cardio',['Start in a high plank','Drive knees to chest one at a time','Keep hips low']]
};
Object.assign(EX,{'Crunch':['crunch','Abs',['Knees bent, feet flat','Curl your shoulders off the floor','Breathe out at the top']],
 'Farmer carry':['farmer','Grip & traps',['Heavy dumbbells at your sides','Stand tall, shoulders back','Walk with short, steady steps']],
 'Russian twist':['twist','Obliques',['Lean back slightly, chest up','Rotate from your ribs','Touch the weight to each side']]});
const ROUTINES={
 push:{name:'PUSH DAY',ex:[['Bench press',4,'8'],['Overhead press',3,'10'],['Incline DB press',3,'10'],['Lateral raise',3,'15'],['Triceps pushdown',3,'12']]},
 pull:{name:'PULL DAY',ex:[['Deadlift',3,'5'],['Lat pulldown',4,'10'],['Barbell row',3,'8'],['Face pull',3,'15'],['Biceps curl',3,'12']]},
 legs:{name:'LEG DAY',ex:[['Back squat',4,'6'],['Romanian deadlift',3,'10'],['Leg press',3,'12'],['Walking lunge',3,'20'],['Calf raise',4,'15']]},
 upper:{name:'UPPER BODY',ex:[['Bench press',4,'8'],['Barbell row',4,'8'],['Overhead press',3,'10'],['Lat pulldown',3,'10'],['Biceps curl',2,'12'],['Triceps pushdown',2,'12']]},
 lower:{name:'LOWER BODY',ex:[['Back squat',4,'6'],['Romanian deadlift',3,'10'],['Leg press',3,'12'],['Walking lunge',2,'20'],['Calf raise',3,'15']]},
 full:{name:'FULL BODY',ex:[['Goblet squat',3,'10'],['Push-up',3,'10'],['Seated row',3,'12'],['Glute bridge',3,'12'],['Plank',3,'40s']]},
 home:{name:'NO-GYM HOME',ex:[['Bodyweight squat',4,'20'],['Push-up',4,'12'],['Glute bridge',3,'15'],['Mountain climber',3,'30s'],['Plank',3,'40s']]}
};
const GOALS={lose:['LOSE FAT','Burn fat, keep muscle',-450,2.2],muscle:['BUILD MUSCLE','Get bigger and fuller',300,2.0],
  strength:['GET STRONGER','Lift heavier weights',150,2.0],fit:['STAY FIT','Feel good, stay healthy',0,1.6],endurance:['ENDURANCE','Last longer, move better',100,1.7]};
const DAYS=['MON','TUE','WED','THU','FRI','SAT','SUN'];
function weekPlan(){const go=P.goal,n=go.days;
  const slots={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,4,5],6:[0,1,2,3,4,5]}[n];
  let seq=go.equip==='none'?Array(n).fill('home'):go.equip==='db'?['full','home','full','home','full','home'].slice(0,n):
    n<=3?Array(n).fill('full'):n===4?['upper','lower','upper','lower']:n===5?['push','pull','legs','upper','lower']:['push','pull','legs','push','pull','legs'];
  const w=Array(7).fill(null);if(!(P.custom||[]).some(r=>r.gen))slots.forEach((d,i)=>w[d]=seq[i]);(P.custom||[]).forEach(r=>r.days.forEach(d=>w[d]=r.id));return w}
const setsFor=s=>clamp(s+({beginner:-1,intermediate:0,advanced:1}[P.goal.level]||0),2,6);
const todayIdx=()=>(new Date().getDay()+6)%7;
function calc(pr){const p=pr||P,G=GOALS[p.goal.type];const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='m'?5:-161);
  const tdee=bmr*(1.3+p.goal.days*.06),kcal=Math.round((tdee+G[2])/10)*10,pro=Math.round(p.weight*G[3]),fat=Math.round(kcal*.27/9),carb=Math.max(0,Math.round((kcal-pro*4-fat*9)/4));
  return{kcal,pro,fat,carb}}
function addXP(n){gainXP(n)}
