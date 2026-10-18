import assert from 'node:assert/strict';
export function checkScenes(api,sprites){
 const {MiniOcean,render,H,bandsClear}=api,scenes=globalThis.OceanScenes;
 const visited=new Set();let deep=0,shallow=0,held=0;
 // Hold all initial lanes occupied across a full surface cycle, including crowded Mini bands.
 const crowded=new MiniOcean(sprites,4848),initial=[...crowded.fish];
 for(const f of initial)f.speed=0;
 for(let i=0;i<1200;i++){
  crowded.step(.25);
  assert.deepEqual(crowded.fish,initial,'A full set of lanes cannot lose or replace a fish during a surface transition');
  if(crowded.surfaceY()<crowded.desiredSurfaceY())held++;
 }
 assert.ok(held>0,'The fixture must actually hold back a descending waterline');
 crowded.fish=[];
 assert.equal(crowded.surfaceY(),crowded.desiredSurfaceY(),'The line is free to descend once the blocking swimmers leave');
 for(const seed of [1,42,147,4848,0x80000000,0xffffffff]){
  const ocean=new MiniOcean(sprites,seed);
  for(let i=0;i<2400;i++){
   const survivors=ocean.fish.map(f=>({fish:f,y:f.y,x:f.x+f.direction*f.speed*.25}));
   ocean.step(.25);
   for(const before of survivors)if(before.x<328&&before.x+before.fish.width>-8){
    assert.ok(ocean.fish.includes(before.fish),'A swimming creature survives every waterline transition until it exits');
    assert.equal(before.fish.y,before.y,'The surface cannot teleport a creature into a new lane');
   }const s=scenes.scene(ocean.time,ocean.sceneSeed);
   if(s.kind)visited.add(s.kind);if(s.surface===0)deep++;if(s.surface===1)shallow++;
   assert.ok(ocean.bubbles.length<=2,'The entire ESP scene shares a two-bubble budget');
   for(const b of ocean.bubbles)assert.ok(b.y>ocean.waterTop(),'Bubbles pop at the current waterline');
   for(const f of ocean.fish){assert.ok(ocean.surfaceY()+8<=f.y-2,'Wave ink stays above the entire upward bob');assert.ok(f.y>=ocean.waterTop(),'Ordinary swimmers stay below the surface');}
   for(let a=0;a<ocean.fish.length;a++)for(let b=a+1;b<ocean.fish.length;b++)assert.ok(bandsClear(ocean.fish[a].y,ocean.fish[a].height,ocean.fish[b].y,ocean.fish[b].height));
   if(i%40===0){
    const ctx={fillStyle:'',fillRect(x,y){if(this.fillStyle==='#6f8290'||this.fillStyle==='#687c78')assert.ok(y>=H*2/3,'Landmark ink stays in the bottom third');},save(){},restore(){},beginPath(){},rect(){},clip(){}};
    render(ctx,ocean,globalThis.MiniFont);
   }
  }
  const before=JSON.stringify(ocean);ocean.paused=true;const paused=JSON.stringify(ocean);ocean.step(.2);assert.equal(JSON.stringify(ocean),paused);ocean.paused=false;assert.equal(JSON.stringify(ocean),before);
  ocean.toggleParade();const time=ocean.time,bubbles=JSON.stringify(ocean.bubbles);ocean.step(.1);assert.equal(ocean.time,time);assert.equal(JSON.stringify(ocean.bubbles),bubbles);
 }
 assert.deepEqual([...visited].sort(),['boat','monster','whale']);assert.ok(deep&&shallow);
 console.log('PASS: six ten-minute scene runs, every visitor, deep/shallow transitions, bottom-third landmarks, two-bubble limit, waterline, spacing, pause and parade isolation.');
}
