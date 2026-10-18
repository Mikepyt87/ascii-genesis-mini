import assert from 'node:assert/strict';
export function checkParade(api,sprites){
 const {MiniOcean,bandsClear,SWIM_TOP,SWIM_BOTTOM}=api;
 const starts=new Set();
 for(let seed=1;seed<=40;seed++){
  const ocean=new MiniOcean(sprites,seed);
  assert.equal(ocean.fish.length,3);
  starts.add(JSON.stringify({fish:ocean.fish,time:ocean.time}));
  const saved=JSON.stringify({fish:ocean.fish,time:ocean.time,scroll:ocean.scroll,bubbles:ocean.bubbles,seed:ocean.seed,pending:ocean.pendingSpawn});
  ocean.toggleParade();const firstOrder=ocean.parade.order.join(','),duration=ocean.parade.duration;
  assert.deepEqual(ocean.parade.order,Array.from({length:28},(_,i)=>i));assert.ok(duration>=87&&duration<224);
  const seen=new Set(),exited=new Set();let pairFrames=0;
  for(let frame=0;frame<Math.round(duration*20);frame++){
   assert.ok(ocean.parade);
   const visible=ocean.visibleFish();assert.ok(visible.length>=1&&visible.length<=2);
   for(const f of visible){
    assert.ok(f.y-2>=SWIM_TOP&&f.y+f.height+2<=SWIM_BOTTOM);
    if(f.x>=12&&f.x+f.width<=308)seen.add(f.index/2);
    if(f.x>308)exited.add(f.index/2);
   }
   if(visible.length===2){const [a,b]=visible;assert.ok(bandsClear(a.y,a.height,b.y,b.height));if(a.x+a.width>12&&a.x<308&&b.x+b.width>12&&b.x<308)pairFrames++;}
   ocean.step(.05);
  }
  if(ocean.parade)ocean.step(.001);
  assert.equal(ocean.parade,null);assert.equal(seen.size,28);assert.equal(exited.size,28);assert.ok(pairFrames>0);
  assert.equal(JSON.stringify({fish:ocean.fish,time:ocean.time,scroll:ocean.scroll,bubbles:ocean.bubbles,seed:ocean.seed,pending:ocean.pendingSpawn}),saved);
  ocean.toggleParade();assert.equal(ocean.parade.order.join(','),firstOrder,'Parade keeps the original collection order');
  ocean.paused=true;const frozen=JSON.stringify(ocean);ocean.step(.2);assert.equal(JSON.stringify(ocean),frozen);ocean.paused=false;
  ocean.toggleParade();assert.equal(ocean.parade,null);
 }
 assert.equal(starts.size,40);
 console.log('PASS: 40 randomized starts and ordered parades; each shows all 28 once, at most two, faster crossings, safe bands, full exits, pause, and preserved ocean.');
}
