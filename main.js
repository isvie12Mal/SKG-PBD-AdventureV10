import * as B from '@babylonjs/core';
import './style.css';

const canvas=document.getElementById('renderCanvas');
const engine=new B.Engine(canvas,true,{antialias:true,stencil:true,preserveDrawingBuffer:false});
engine.setHardwareScalingLevel(Math.min(1.5,Math.max(1,window.devicePixelRatio/1.5)));
const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.58,.81,.98,1);
scene.fogMode=B.Scene.FOGMODE_EXP2;scene.fogDensity=.009;scene.fogColor=new B.Color3(.63,.82,.94);
scene.ambientColor=new B.Color3(.72,.78,.88);
scene.imageProcessingConfiguration.contrast=1.12;scene.imageProcessingConfiguration.exposure=1.1;
const hemi=new B.HemisphericLight('skylight',new B.Vector3(0,1,0),scene);hemi.intensity=1.45;
const sun=new B.DirectionalLight('sun',new B.Vector3(-.45,-1,.55),scene);sun.position=new B.Vector3(-14,27,-18);sun.intensity=1.8;
const shadows=new B.ShadowGenerator(1024,sun);shadows.useBlurExponentialShadowMap=true;shadows.blurKernel=24;shadows.setDarkness(.34);
const shadowCaster=mesh=>{if(mesh && mesh.getClassName && mesh.getClassName()==='Mesh')shadows.addShadowCaster(mesh);return mesh;};
const camera=new B.FreeCamera('camera',new B.Vector3(-5,6,-18),scene);camera.setTarget(new B.Vector3(1,2,0));camera.fov=.76;camera.minZ=.1;camera.maxZ=300;
function mat(name,hex,emissive=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.22,.22,.22);if(emissive)m.emissiveColor=m.diffuseColor.scale(emissive);return m;}
const m={grass:mat('mint grass','#57d477'),ground:mat('earth','#a77056'),stone:mat('warm stone','#f5d3aa'),wood:mat('bark','#85503e'),leaf:mat('leaf','#34b77d'),leaf2:mat('leaf turquoise','#32cbb7'),leaf3:mat('leaf lilac','#a87bdc'),gold:mat('gold','#ffda5b',.35),fox:mat('fox fur','#fa9246'),foxLight:mat('fox cream','#ffe3b6'),foxDark:mat('fox paws','#693b3d'),eyes:mat('eyes','#1b2947'),pink:mat('cheek','#f98c97'),enemy:mat('slime','#8b59d9'),enemyLight:mat('slime highlight','#bca0ff'),shot:mat('magic','#ff8af1',.85),portal:mat('portal','#74fff1',.75),mount:mat('mountains','#779cc7'),mount2:mat('mountains far','#a9bbdf'),cloud:mat('cloud','#fff9ef',.1),flower:mat('flower','#ff8cce'),flower2:mat('flower yellow','#ffdc79'),moss:mat('moss','#329a65'),rock:mat('rock','#94b2c3'),water:mat('water','#46bce3',.15),stem:mat('mushroom stem','#fff0d5'),cap:mat('mushroom cap','#f26672'),butterfly:mat('butterfly','#ffe79d',.25),sparkle:mat('sparkle','#ffffff',.8)};
function box(name,w,h,d,x,y,z,material,parent){const o=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function sphere(name,diam,x,y,z,material,parent,segments=12){const o=B.MeshBuilder.CreateSphere(name,{diameter:diam,segments},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function cyl(name,top,bottom,height,x,y,z,material,parent){const o=B.MeshBuilder.CreateCylinder(name,{diameterTop:top,diameterBottom:bottom,height,tessellation:10},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function cone(name,diam,height,x,y,z,material,parent){return cyl(name,0,diam,height,x,y,z,material,parent);}
const world=new B.TransformNode('world',scene);
box('main island',55,2,8,17,-1.2,0,m.ground,world);box('lush grass',55,.32,8,17,-.08,0,m.grass,world);
// Floating jumping platforms with real collision heights.
const platforms=[{x:7,y:1.25,w:3.6},{x:14,y:2.3,w:3.8},{x:22,y:1.5,w:4},{x:31,y:2.4,w:4.2}];
for(const p of platforms){box('floating soil',p.w,.75,3.6,p.x,p.y-.5,0,m.ground,world);box('platform grass',p.w,.25,3.6,p.x,p.y-.06,0,m.grass,world);for(let k=-1;k<=1;k++)sphere('platform flower',.18,p.x+k*.9,p.y+.1,1.4,k===0?m.flower:m.flower2,world);}
// Decorative distant mountain silhouettes, forests and clouds.
for(let i=0;i<18;i++){const x=-25+i*7;const h=10+(i*17%9);cone('far mountain',10,h,x,h/2-2,28,i%2?m.mount:m.mount2,world);}
for(let i=0;i<28;i++){const x=-18+i*3.2;const z=7+(i%4)*1.5;const h=3+(i%5)*.6;cyl('tree trunk',.55,.8,h,x,h/2,z,m.wood,world);sphere('tree crown',2.9,x,h+.3,z,i%3===0?m.leaf3:i%3===1?m.leaf2:m.leaf,world);sphere('tree crown side',2.3,x-1,h-.2,z,i%3===0?m.leaf3:m.leaf,world);}
for(let i=0;i<12;i++){const x=-12+i*7;const y=12+i%3*2;for(let k=0;k<3;k++)sphere('fluffy cloud',2.6,x+k*1.4,y+(k%2)*.5,38,m.cloud,world);}
for(let i=0;i<75;i++){const x=-9+(i*19%510)/10;const z=-3.6+(i*13%70)/10;sphere('tiny blossom',.12,x,.15,z,i%3===0?m.flower:m.flower2,world);}
// Premium woodland set dressing: stones, mushrooms, ferns, fireflies and layered canopy.
for(let i=0;i<110;i++){
 const x=-8+(i*37%530)/10,z=-3.4+(i*19%70)/10;
 if(i%4===0){const r=sphere('smooth river pebble',.35+(i%3)*.13,x,.12,z,m.rock,world);r.scaling.set(1,.48,.78);}
 else if(i%4===1){const h=.25+(i%3)*.1;cyl('mushroom stalk',.1,.15,h,x,h/2,z,m.stem,world);const cap=sphere('mushroom top',.37,x,h+.04,z,m.cap,world);cap.scaling.y=.45;}
 else{for(let j=0;j<3;j++){const blade=cone('grass blade',.13,.48,x+(j-1)*.14,.28,z,m.moss,world);blade.rotation.z=(j-1)*.36;}}
}
const fireflies=[];
for(let i=0;i<36;i++){const x=-8+(i*31%530)/10,z=-2+(i*7%60)/10;const dot=sphere('floating forest firefly',.1,x,1.1+i%4*.6,z,m.sparkle,world);fireflies.push({dot,x,phase:i*.9});}
const glow=new B.GlowLayer('magical highlights',scene,{blurKernelSize:20});glow.intensity=.38;
// A model built from genuine 3D meshes (not a billboard or flat sprite).
const hero=new B.TransformNode('PLAYER CHARACTER',scene);
const heroBody=new B.TransformNode('character visual',scene);heroBody.parent=hero;
const bodyParts=[];let legs=[],arms=[],tailPart=null,ears=[];
function part(mesh){bodyParts.push(mesh);return mesh;}
const torso=part(sphere('soft character torso',1.18,0,.73,0,m.fox,heroBody));torso.scaling.set(.83,1.05,.65);
const belly=part(sphere('belly',.8,0,.65,-.4,m.foxLight,heroBody));belly.scaling.set(.9,1,.25);
const head=part(sphere('rounded character head',1.12,0,1.48,-.07,m.fox,heroBody));head.scaling.set(1.05,.9,.83);
const muzzle=part(sphere('muzzle',.73,0,1.24,-.52,m.foxLight,heroBody));muzzle.scaling.set(1.05,.55,.5);
const nose=part(sphere('nose',.19,0,1.35,-.76,m.eyes,heroBody));
for(const side of [-1,1]){
 const ear=part(cone('character ear',.55,.83,side*.38,2.12,-.03,m.fox,heroBody));ears.push(ear);
 part(cone('inner ear',.28,.49,side*.38,2.17,-.25,m.pink,heroBody));
 part(sphere('eye',.18,side*.25,1.59,-.65,m.eyes,heroBody));
 part(sphere('eye glint',.055,side*.25-.045,1.65,-.74,m.cloud,heroBody));
 part(sphere('cheek',.16,side*.43,1.27,-.52,m.pink,heroBody));
 const leg=part(sphere('animated paw',.34,side*.36,.19,-.04,m.foxDark,heroBody));legs.push(leg);
 const arm=part(sphere('animated arm',.32,side*.58,.75,-.06,m.fox,heroBody));arms.push(arm);
}
tailPart=part(sphere('animated tail',.93,.73,.76,.38,m.fox,heroBody));tailPart.scaling.set(1.2,.5,.55);tailPart.rotation.z=-.4;
const tailTip=part(sphere('tail tip',.4,1.14,.94,.4,m.foxLight,heroBody));
const characterSkins={fox:{main:'#fa9246',light:'#ffe3b6',dark:'#693b3d',ear:1,tail:1},rabbit:{main:'#e9e9ff',light:'#ffffff',dark:'#ac91ce',ear:1.7,tail:.5},panda:{main:'#f4f5f7',light:'#ffffff',dark:'#333747',ear:.48,tail:.4},cat:{main:'#edb36d',light:'#fff3d7',dark:'#a36a60',ear:.8,tail:1.2}};
let chosenCharacter='fox';
function chooseCharacter(type){
 chosenCharacter=type;const skin=characterSkins[type];
 const main=mat('skin '+type+' main',skin.main),light=mat('skin '+type+' light',skin.light),dark=mat('skin '+type+' dark',skin.dark);
 torso.material=head.material=main;muzzle.material=belly.material=tailTip.material=light;tailPart.material=main;
 arms.forEach(a=>a.material=main);legs.forEach(a=>a.material=dark);
 ears.forEach(e=>{e.material=type==='panda'?dark:main;e.scaling.y=skin.ear;e.position.y=type==='rabbit'?2.32:2.12;});
 tailPart.scaling.x=skin.tail;tailTip.position.x=.73+.41*skin.tail;
 document.querySelectorAll('[data-character]').forEach(b=>b.classList.toggle('selected',b.dataset.character===type));
 document.getElementById('selectedCharacter').textContent={fox:'Fox',rabbit:'Rabbit',panda:'Panda',cat:'Cat'}[type];
}
document.querySelectorAll('[data-character]').forEach(btn=>btn.addEventListener('click',()=>chooseCharacter(btn.dataset.character)));
chooseCharacter('fox');hero.position.set(-6,0,0);

// Six distinct playable 3D stages; all meshes are real Babylon.js geometry.
const LEVELS=[
 {title:'TP1 · Star Forest',task:'Double-jump to collect 6 floating stars!',type:'stars',goal:6,sky:'#8ed6fa'},
 {title:'TP2 · Volcano Escape',task:'Dodge falling fireballs and cross 3 checkpoints!',type:'fire',goal:3,sky:'#e3a0a0'},
 {title:'TP3 · Archer Valley',task:'Shoot 5 floating targets with your magic bow!',type:'archer',goal:5,sky:'#a6d8ed'},
 {title:'TP4 · Monster Arena',task:'Defeat 5 moving slimes with magic shots!',type:'slimes',goal:5,sky:'#b0a1eb'},
 {title:'TP5 · Giant Kingdom',task:'Grab a mushroom and smash 4 giant rocks!',type:'giant',goal:4,sky:'#f7c7a1'},
 {title:'TP6 · Dragon Castle',task:'Defeat the dragon boss and dodge its fire!',type:'dragon',goal:10,sky:'#9c9acb'}
];
const QUESTIONS=[
 [{q:'Choose the adjective: The rabbit is ___.',a:['quick','run','jump'],correct:0},{q:'Which word means very large?',a:['tiny','huge','slowly'],correct:1}],
 [{q:'It is very hot. The weather is ___.',a:['sunny','snowy','windy'],correct:0},{q:'Choose the correct sentence.',a:['The fire is hot.','The fire are hot.','The fire am hot.'],correct:0}],
 [{q:'An archer uses a ___.',a:['spoon','bow','book'],correct:1},{q:'The arrow flies ___.',a:['quickly','blue','happy'],correct:0}],
 [{q:'The monsters ___ running.',a:['is','am','are'],correct:2},{q:'The opposite of strong is ___.',a:['weak','tall','bright'],correct:0}],
 [{q:'The giant is ___ than the mouse.',a:['bigger','biggest','big'],correct:0},{q:'Choose a describing word.',a:['heavy','jump','run'],correct:0}],
 [{q:'The dragon ___ fire.',a:['breathe','breathes','breathing'],correct:1},{q:'Choose the past tense of win.',a:['winned','won','winning'],correct:1}]
];
const ui={stats:document.getElementById('stats'),overlay:document.getElementById('overlay'),toast:document.getElementById('toast'),start:document.getElementById('start')};
const keys={left:false,right:false,jump:false,fire:false};
const objects=[],stars=[],targets=[],slimes=[],rocks=[],shots=[],hazards=[],sparks=[];
let level=0,progress=0,lives=3,score=0,elapsed=0,runTime=0,playing=false,quizOpen=false,quizIndex=0,correctQuiz=0,answered=0,invuln=0,fireCD=0,hazardCD=0,giantUntil=0,vy=0,grounded=true,face=1,prevJump=false,prevFire=false,jumps=0,lastCheckpoint=-6,noticeUntil=0,dragon=null,dragonHP=10,chosen='fox';
let soundOn=true;
const lava=mat('volcano lava','#ff532f',.4),targetMat=mat('target white','#f7e7c0'),bull=mat('bullseye','#f04468'),dragonMat=mat('dragon','#7247b3'),wingMat=mat('dragon wings','#d184f2'),giantMat=mat('giant mushroom','#fc6b99'),castleMat=mat('castle','#7e82aa');
function register(root){objects.push(root);return root;}
function clearStage(){for(const a of [objects,stars,targets,slimes,rocks,shots,hazards,sparks]){for(const o of a){const mesh=o.root||o.mesh||o;if(mesh && !mesh.isDisposed())mesh.dispose(false,false);}a.length=0;}dragon=null;}
function starAt(x,y){const root=register(new B.TransformNode('collectible star',scene));root.position.set(x,y,-.3);sphere('star core',.48,0,0,0,m.gold,root);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const ray=cone('star point',.23,.52,Math.sin(a)*.35,Math.cos(a)*.35,0,m.gold,root);ray.rotation.z=-a;}stars.push({root,got:false,y});}
function enemyAt(x,hp=2){const root=register(new B.TransformNode('moving slime',scene));root.position.set(x,0,0);const body=sphere('slime body',1.15,0,.55,0,m.enemy,root);body.scaling.y=.75;for(const d of [-1,1])sphere('slime eye',.17,d*.25,.65,-.45,m.eyes,root);slimes.push({root,x,hp,phase:x*.6,alive:true});}
function targetAt(x,y){const root=register(new B.TransformNode('archery target',scene));root.position.set(x,y,0);const disc=B.MeshBuilder.CreateCylinder('target board',{diameter:1.55,height:.22,tessellation:24},scene);disc.parent=root;disc.rotation.x=Math.PI/2;disc.material=targetMat;const red=sphere('red bullseye',.63,0,0,-.18,bull,root);red.scaling.z=.18;targets.push({root,alive:true,y,phase:x*.2});}
function rockAt(x){const root=register(new B.TransformNode('breakable rock',scene));root.position.set(x,0,0);const rock=sphere('giant rock',1.6,0,.8,0,m.rock,root);rock.scaling.set(1.05,1,.9);rocks.push({root,alive:true});}
function spark(x,y,material=m.gold){for(let i=0;i<9;i++){const mesh=sphere('impact sparkle',.13,x,y,0,material);sparks.push({mesh,ttl:.42,vx:Math.cos(i*.7)*3,vy:Math.sin(i*.7)*3});}}
function banner(text,time=1.8){ui.toast.textContent=text;ui.toast.classList.add('show');noticeUntil=elapsed+time;}
function hud(){ui.stats.textContent=`🌍 TP${level+1}/6　❤️ ${lives}　⭐ ${score}　🎯 ${progress}/${LEVELS[level].goal}　📚 ${correctQuiz}/2`;document.getElementById('help').textContent=`${LEVELS[level].title} · ${LEVELS[level].task} · A/D Move · Space Jump · X Attack`;}
function stageProps(){
 if(level===1){for(let i=0;i<12;i++){const x=-5+i*4.2;const mesh=box('lava crack',1.3,.08,6,x,.12,0,lava);register(mesh);}for(let i=0;i<5;i++){const coneMesh=cone('volcano',4,5,i*11-12,2,10,lava);register(coneMesh);}}
 if(level===2){for(let i=0;i<5;i++){const root=register(new B.TransformNode('archery banner',scene));root.position.set(4+i*7,0,2);cyl('target pole',.18,.2,3.6,0,1.8,0,m.wood,root);}}
 if(level===3){for(let i=0;i<8;i++){const tower=box('monster arena column',1.2,3.5,1.2,-4+i*6,1.7,3,castleMat);register(tower);}}
 if(level===4){for(let i=0;i<10;i++){const cap=sphere('giant mushroom decoration',1.8,-6+i*5.2,1.4,3,giantMat);cap.scaling.y=.4;register(cap);}}
 if(level===5){for(let i=0;i<7;i++){const tower=box('dragon castle turret',2,5+(i%3),2,-5+i*8,2,4,castleMat);register(tower);}}
}
function setupStage(n){clearStage();level=n;progress=0;elapsed=0;runTime=0;vy=0;grounded=true;jumps=0;giantUntil=0;hazardCD=0;invuln=0;lastCheckpoint=-6;dragonHP=10;hero.position.set(-6,0,0);hero.scaling.setAll(1);hero.setEnabled(true);scene.clearColor=B.Color4.FromColor3(B.Color3.FromHexString(LEVELS[n].sky),1);scene.fogColor=B.Color3.FromHexString(LEVELS[n].sky);stageProps();const gate=register(new B.TransformNode('finish portal',scene));gate.position.set(40.5,0,0);for(let k=0;k<18;k++){const a=k*Math.PI*2/18;sphere('glowing portal gem',.35,Math.cos(a)*1.1,2+Math.sin(a)*1.8,0,k%3===0?m.gold:m.portal,gate);} 
 if(n===0){for(const [x,y] of [[-2,1],[5,2.5],[12,3.6],[20,2.6],[29,3.6],[36,1.2]])starAt(x,y);}
 if(n===2){for(const [x,y] of [[5,2.4],[12,3.4],[20,2.8],[29,3.5],[36,2.3]])targetAt(x,y);}
 if(n===3){for(const x of [4,11,19,27,35])enemyAt(x,2);}
 if(n===4){for(const x of [10,18,27,36])rockAt(x);const root=register(new B.TransformNode('power mushroom',scene));root.position.set(0,0,0);cyl('power mushroom stem',.55,.7,1,0,.55,0,m.stem,root);const cap=sphere('power mushroom cap',1.45,0,1.15,0,giantMat,root);cap.scaling.y=.5;stars.push({root,got:false,power:true,y:1.15});}
 if(n===5){const root=register(new B.TransformNode('DRAGON BOSS',scene));root.position.set(33,2.1,0);const body=sphere('dragon body',3.4,0,0,0,dragonMat,root);body.scaling.set(1.1,.8,.7);sphere('dragon head',1.7,-1.2,.7,-.3,dragonMat,root);for(const s of [-1,1]){const wing=cone('dragon wing',2.5,3.8,s*.95,1.3,.7,wingMat,root);wing.rotation.z=s*.9;}for(let i=0;i<4;i++)cone('dragon horn',.6,1,-1.8+i*.45,1.65,-.2,m.gold,root);dragon={root};}
 quizIndex=0;correctQuiz=0;answered=0;playing=true;quizOpen=false;ui.overlay.classList.remove('show');hud();banner(`🌍 ${LEVELS[n].title} — ${LEVELS[n].task}`,3);
}
function resetSession(){lives=3;score=0;document.getElementById('heroChoice').style.display='none';setupStage(0);}
function hurt(){if(invuln>0||!playing||quizOpen)return;lives--;invuln=1.4;spark(hero.position.x,hero.position.y+1,bull);hero.position.set(lastCheckpoint,0,0);vy=0;hud();banner('💔 Ouch! Try again!');if(lives<=0){playing=false;showOverlay('💔 Game Over','Try again and save the forest!','↻ RETRY ALL',resetSession);}}
function fireShot(){fireCD=.33;const mesh=sphere('3D magic projectile',.36,hero.position.x+face*.8,hero.position.y+1.2,-.3,level===2?m.gold:m.shot);shots.push({mesh,dir:face,ttl:2.3});spark(mesh.position.x,mesh.position.y,m.shot);}
function showOverlay(title,subtitle,buttonText,callback){ui.overlay.classList.add('show');ui.overlay.querySelector('h1').textContent=title;ui.overlay.querySelector('h2').textContent=subtitle;ui.start.textContent=buttonText;ui.start.onclick=callback;document.getElementById('heroChoice').style.display='block';document.getElementById('quizArea').style.display='none';}
function openQuiz(){playing=false;quizOpen=true;ui.overlay.classList.add('show');ui.overlay.querySelector('h1').textContent=`📚 TP${level+1} English Challenge`;ui.overlay.querySelector('h2').textContent=`Question ${quizIndex+1} of 2`;ui.start.style.display='none';document.getElementById('heroChoice').style.display='none';const qa=document.getElementById('quizArea');qa.style.display='block';const q=QUESTIONS[level][quizIndex];qa.innerHTML='';const prompt=document.createElement('p');prompt.className='quizPrompt';prompt.textContent=q.q;qa.append(prompt);for(let i=0;i<q.a.length;i++){const b=document.createElement('button');b.textContent=`${String.fromCharCode(65+i)}. ${q.a[i]}`;b.className='quizOption';b.onclick=()=>answer(i);qa.append(b);}}
function answer(i){const q=QUESTIONS[level][quizIndex];answered++;if(i===q.correct){correctQuiz++;score+=20;banner('✅ Correct! +20');}else banner(`❌ Answer: ${q.a[q.correct]}`,2);quizIndex++;hud();if(quizIndex<2){openQuiz();return;}quizOpen=false;ui.start.style.display='inline-block';document.getElementById('quizArea').style.display='none';if(level===5){playing=false;saveRecord();showOverlay('🏆 Six Worlds Complete!',`Great job! Score ${score} · Quiz ${correctQuiz}/2 on TP6`,'▶ PLAY AGAIN',resetSession);}else{playing=false;showOverlay(`🏅 TP${level+1} Complete!`,`Next: ${LEVELS[level+1].title}`,'▶ NEXT WORLD',()=>setupStage(level+1));}}
function saveRecord(){const record={date:new Date().toISOString(),name:document.getElementById('studentName').value.trim()||'Player',className:document.getElementById('studentClass').value.trim()||'-',character:chosen,score,worldsCompleted:6,note:'Game performance only; teacher confirms official PBD TP.'};try{const all=JSON.parse(localStorage.getItem('skg3d6tpRecords')||'[]');all.push(record);localStorage.setItem('skg3d6tpRecords',JSON.stringify(all.slice(-100)));}catch(e){console.warn('Local save unavailable',e);} }
function surfaceAt(x,oldY,newY){let floor=0;for(const p of platforms){if(Math.abs(x-p.x)<p.w/2+.15&&oldY>=p.y-.15&&newY<=p.y+.16)floor=Math.max(floor,p.y);}return floor;}
function advanceProgress(x,y){progress++;score+=15;lastCheckpoint=Math.max(-6,Math.min(37,x));spark(x,y);hud();banner(`✨ ${progress}/${LEVELS[level].goal} complete!`);}
function update(dt){elapsed+=dt;if(noticeUntil<elapsed)ui.toast.classList.remove('show');for(const f of fireflies){f.dot.position.y=1.2+Math.sin(elapsed*1.5+f.phase)*.35;f.dot.position.x=f.x+Math.cos(elapsed*.7+f.phase)*.3;}for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.ttl-=dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.vy-=8*dt;if(p.ttl<=0){p.mesh.dispose();sparks.splice(i,1);}}for(const s of stars){if(!s.got){s.root.rotation.y+=dt*2;if(!s.power)s.root.position.y=s.y+Math.sin(elapsed*2+s.y)*.12;}}for(const t of targets){if(t.alive){t.root.rotation.y=Math.sin(elapsed+t.phase)*.3;t.root.position.y=t.y+Math.sin(elapsed*1.5+t.phase)*.3;}}for(const e of slimes){if(e.alive)e.root.position.x=e.x+Math.sin(elapsed*1.6+e.phase)*1.1;}
 if(!playing||quizOpen)return;runTime+=dt;invuln=Math.max(0,invuln-dt);fireCD=Math.max(0,fireCD-dt);hazardCD-=dt;const dx=(keys.right?1:0)-(keys.left?1:0);if(dx)face=Math.sign(dx);hero.position.x=B.Scalar.Clamp(hero.position.x+dx*6*dt,-8,42);if(keys.jump&&!prevJump&&(grounded||(level===0&&jumps<2))){vy=level===0?11.4:10.8;grounded=false;jumps++;}prevJump=keys.jump;if(keys.fire&&!prevFire&&fireCD<=0&&level!==4)fireShot();prevFire=keys.fire;
 const oldY=hero.position.y;vy-=24*dt;let newY=oldY+vy*dt;const floor=surfaceAt(hero.position.x,oldY,newY);if(vy<=0&&newY<=floor){newY=floor;vy=0;grounded=true;jumps=0;}else grounded=false;hero.position.y=newY;
 hero.rotation.y=B.Scalar.Lerp(hero.rotation.y,face===1?-.14:Math.PI+.14,Math.min(1,dt*10));heroBody.position.y=grounded&&dx?Math.abs(Math.sin(elapsed*12))*.09:Math.sin(elapsed*2)*.02;for(let i=0;i<2;i++){legs[i].position.y=.19+(grounded&&dx?Math.max(0,Math.sin(elapsed*12+i*Math.PI))*.18:0);arms[i].rotation.z=grounded&&dx?Math.sin(elapsed*12+i*Math.PI)*.45:0;}tailPart.rotation.z=-.4+Math.sin(elapsed*5)*.18;hero.scaling.setAll(level===4&&giantUntil>elapsed?1.8:1);
 if(level===0){for(const s of stars){if(!s.got&&Math.abs(hero.position.x-s.root.position.x)<.85&&Math.abs(hero.position.y+1-s.root.position.y)<1.2){s.got=true;s.root.setEnabled(false);advanceProgress(s.root.position.x,s.root.position.y);}}}
 if(level===1){if(hazardCD<=0){const x=Math.max(-5,Math.min(39,hero.position.x+3+(Math.random()-.5)*8));const mesh=sphere('falling FIREBALL',.9,x,9,-.2,lava);hazards.push({mesh,vy:-6,ttl:2.5});hazardCD=.8;}for(const h of hazards){h.mesh.position.y+=h.vy*dt;h.vy-=6*dt;if(Math.abs(h.mesh.position.x-hero.position.x)<.85&&Math.abs(h.mesh.position.y-(hero.position.y+1))<1.05){h.ttl=0;hurt();}if(h.mesh.position.y<0){h.ttl=0;spark(h.mesh.position.x,.5,lava);}}for(let i=0;i<3;i++){const x=[8,22,36][i];if(hero.position.x>x&&progress===i){advanceProgress(x,1);}}}
 if(level===3){for(const e of slimes){if(e.alive&&Math.abs(hero.position.x-e.root.position.x)<.8&&hero.position.y<1.2)hurt();}}
 if(level===4){const p=stars[0];if(p&&!p.got&&Math.abs(hero.position.x-p.root.position.x)<1.2){p.got=true;p.root.setEnabled(false);giantUntil=elapsed+30;banner('🍄 GIANT MODE! Smash rocks for 30 seconds!',2.5);}for(const r of rocks){if(r.alive&&Math.abs(hero.position.x-r.root.position.x)<1.55){if(giantUntil>elapsed){r.alive=false;r.root.setEnabled(false);advanceProgress(r.root.position.x,1);}else{hero.position.x-=dx*.2;banner('🍄 Find the mushroom first!',1);}}}if(giantUntil>0&&giantUntil<elapsed&&progress<4){giantUntil=0;stars[0].got=false;stars[0].root.setEnabled(true);banner('Power expired! Get the mushroom again!',2);}}
 if(level===5&&dragon){dragon.root.position.y=2.1+Math.sin(elapsed*1.6)*.5;if(hazardCD<=0){const mesh=sphere('dragon FIRE',.9,dragon.root.position.x-1.6,dragon.root.position.y+.5,0,lava);hazards.push({mesh,vx:-7,ttl:6});hazardCD=1.2;}if(Math.abs(hero.position.x-dragon.root.position.x)<2&&hero.position.y<3)hurt();}
 for(const p of shots){p.mesh.position.x+=p.dir*16*dt;p.ttl-=dt;if(level===2){for(const t of targets){if(t.alive&&Math.abs(p.mesh.position.x-t.root.position.x)<.9&&Math.abs(p.mesh.position.y-t.root.position.y)<1){t.alive=false;t.root.setEnabled(false);p.ttl=0;advanceProgress(t.root.position.x,t.root.position.y);break;}}}if(level===3){for(const e of slimes){if(e.alive&&Math.abs(p.mesh.position.x-e.root.position.x)<.8&&Math.abs(p.mesh.position.y-(e.root.position.y+.6))<1){p.ttl=0;e.hp--;spark(e.root.position.x,1);if(e.hp<=0){e.alive=false;e.root.setEnabled(false);advanceProgress(e.root.position.x,1);}else banner('💥 Hit! One more shot!',.7);break;}}}if(level===5&&dragon&&Math.abs(p.mesh.position.x-dragon.root.position.x)<2&&Math.abs(p.mesh.position.y-(dragon.root.position.y+.2))<2){p.ttl=0;dragonHP--;advanceProgress(dragon.root.position.x,dragon.root.position.y);if(dragonHP<=0){dragon.root.setEnabled(false);dragon=null;banner('🐉 Dragon defeated!',2);}}}
 for(let i=shots.length-1;i>=0;i--){if(shots[i].ttl<=0){shots[i].mesh.dispose();shots.splice(i,1);}}
 for(const h of hazards){if(h.vx)h.mesh.position.x+=h.vx*dt;h.ttl-=dt;if(level===5&&Math.abs(h.mesh.position.x-hero.position.x)<.85&&Math.abs(h.mesh.position.y-(hero.position.y+1))<.9){h.ttl=0;hurt();}}for(let i=hazards.length-1;i>=0;i--){if(hazards[i].ttl<=0||hazards[i].mesh.position.x< -10){hazards[i].mesh.dispose();hazards.splice(i,1);}}
 if(progress>=LEVELS[level].goal&&hero.position.x>39){playing=false;openQuiz();}else if(hero.position.x>40){hero.position.x=39.5;banner(`Complete objective: ${progress}/${LEVELS[level].goal}`,1);}
}
engine.runRenderLoop(()=>{const dt=Math.min(engine.getDeltaTime()/1000,.033);update(dt);camera.position.x=B.Scalar.Lerp(camera.position.x,hero.position.x+2,Math.min(1,dt*3.5));camera.position.y=B.Scalar.Lerp(camera.position.y,Math.max(5.7,hero.position.y+5.4),Math.min(1,dt*3));camera.setTarget(new B.Vector3(hero.position.x+1.5,Math.max(1.8,hero.position.y+1.1),0));scene.render();});
window.addEventListener('resize',()=>engine.resize());
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' '].includes(k))e.preventDefault();if(k==='a'||k==='arrowleft')keys.left=true;if(k==='d'||k==='arrowright')keys.right=true;if(k===' '||k==='arrowup'||k==='w')keys.jump=true;if(k==='x'||k==='j')keys.fire=true;});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')keys.left=false;if(k==='d'||k==='arrowright')keys.right=false;if(k===' '||k==='arrowup'||k==='w')keys.jump=false;if(k==='x'||k==='j')keys.fire=false;});
window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
for(const id of ['left','right','jump','fire']){const btn=document.getElementById(id);const release=e=>{e.preventDefault();keys[id]=false;};btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.setPointerCapture(e.pointerId);keys[id]=true;});btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('lostpointercapture',()=>keys[id]=false);}
document.querySelectorAll('[data-character]').forEach(btn=>btn.addEventListener('click',()=>{chosen=btn.dataset.character;}));
ui.start.onclick=resetSession;
document.getElementById('fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{banner('Fullscreen unavailable');}};
document.getElementById('sound').onclick=()=>{soundOn=!soundOn;document.getElementById('sound').textContent=soundOn?'🔊 Sound':'🔇 Muted';};
document.getElementById('export').onclick=()=>{const records=JSON.parse(localStorage.getItem('skg3d6tpRecords')||'[]');const header='date,name,className,character,score,worldsCompleted,note';const csv=[header,...records.map(r=>[r.date,r.name,r.className,r.character,r.score,r.worldsCompleted,r.note].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='SKG_Adventure_3D_Records.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
hud();
