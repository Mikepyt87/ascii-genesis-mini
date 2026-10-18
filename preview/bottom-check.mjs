import assert from 'node:assert/strict';
export function checkBottom(api,sprites){
 const {MiniOcean,groundAt,render}=api;let count=0;
 for(let index=0;index<sprites.length;index++){
  const ocean=new MiniOcean(sprites,4848);if(!ocean.isBottom(index))continue;count++;
  ocean.fish=[];ocean.controls=false;ocean.spawn(index,-100,23,index%2?-1:1);
  const f=ocean.fish[0];
  for(let scroll=0;scroll<528;scroll+=11)for(let x=-f.width;x<=320;x+=3){
   const y=ocean.bottomY(index,x,scroll),contacts=[];
   assert.ok(y>=f.y,'Reserved bottom band contains the full drawing');
   for(let col=0;col<ocean.feet[index].length;col++)if(ocean.feet[index][col]>=0){
    const clearance=groundAt(Math.round(x)+col*6+2+scroll)-y-ocean.feet[index][col];
    assert.ok(clearance>=0,'A foot must not be buried in the seabed');contacts.push(clearance);
   }
   assert.ok(contacts.includes(0),'At least one visible foot touches the seabed through the full crossing');
  }
  f.x=80;ocean.scroll=240;ocean.time=100;
  for(const phase of [0,1,3]){
   f.phase=phase;const pixels=new Set();
   render({fillStyle:'',fillRect(x,y,w,h){if(sprites[index].palette.includes(this.fillStyle)&&w===1&&h===1)pixels.add(x+','+y);},save(){},restore(){},beginPath(){},rect(){},clip(){}},ocean,globalThis.MiniFont);
   const top=ocean.bottomY(index,f.x);
   let last=-1;for(const pixel of pixels)last=Math.max(last,Number(pixel.split(',')[1]));
   assert.equal(last,top+Math.max(...ocean.feet[index]),'The actual renderer grounds the visible feet without a swimming bob');
  }
  ocean.toggleParade();const slot=Math.floor(index/2);ocean.parade.elapsed=ocean.parade.starts[slot]+3;
  const shown=ocean.visibleFish().find(f=>f.index===slot*2);assert.ok(shown);assert.equal(shown.y,ocean.paradeY(slot));
 }
 assert.equal(count,8,'Four bottom dwellers in both directions');
 console.log('PASS: crab, lobster, mantis shrimp and octopus; both directions, seabed contact, reserved bands, no bob and grounded parade.');
}
