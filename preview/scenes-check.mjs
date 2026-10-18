import assert from 'node:assert/strict';
export function checkScenes(api,sprites){
 const {MiniOcean,render,H,bandsClear}=api,scenes=globalThis.OceanScenes;
 const visited=new Set();let deep=0,shallow=0;
 for(const seed of [1,42,147,4848,0x80000000,0xffffffff]){
  const ocean=new MiniOcean(sprites,seed);
  for(let i=0;i<2400;i++){
   ocean.step(.25);const s=scenes.scene(ocean.time,ocean.sceneSeed);
   if(s.kind)visited.add(s.kind);if(s.surface===0)deep++;if(s.surface===1)shallow++;
   assert.ok(ocean.bubbles.length<=2,'The entire ESP scene shares a two-bubble budget');
   for(const b of ocean.bubbles)assert.ok(b.y>ocean.waterTop(),'Bubbles pop at the current waterline');
   for(const f of ocean.fish)assert.ok(f.y>=ocean.waterTop(),'Ordinary swimmers stay below the surface');
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
