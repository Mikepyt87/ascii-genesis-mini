import assert from 'node:assert/strict';
import '../art/fish-art.js';import './font.js';import './ocean-scenes.js';import './ocean.js';
const {Tracker,names,points}=globalThis.GenesisCelebrations;
const {MiniOcean,W,H}=globalThis.MiniAquarium;
for(let kind=0;kind<3;kind++)for(const right of [true,false]){
 const tracker=new Tracker(),key={},item={key,name:names[kind],x:right?-130:330,y:70,w:120,h:40,right};
 tracker.step([item],.1,W,H);assert.equal(tracker.effects.length,0,'No effect while off screen');
 item.x=right?-100:290;tracker.step([item],.1,W,H);assert.equal(tracker.effects.length,1,'Trigger on actual entry');
 for(let i=0;i<40;i++)tracker.step([item],.1,W,H);assert.equal(tracker.effects.length,0,'Expire once, do not replay');
 item.key={};tracker.step([item],.1,W,H);assert.equal(tracker.effects.length,1,'New crossing may celebrate');
 for(const p of tracker.pixels(W,H,[item]))assert.ok(p.y>=22&&p.y+3<H-34,'Keep headers and buttons clear');
 assert.equal(points(kind,3,40,70).length,0);
}
const sprites=AsciiquariumSprites,o=new MiniOcean(sprites,147);o.fish=[];
o.spawn(sprites.findIndex(s=>s.name===names[0]),-70,70,1);o.step(.1);assert.equal(o.celebrations.effects.length,1);
o.paused=true;const frozen=JSON.stringify(o.celebrations);o.step(.2);assert.equal(JSON.stringify(o.celebrations),frozen);o.paused=false;
const saved=o.celebrations;o.toggleParade();o.step(.1);o.toggleParade();assert.equal(o.celebrations,saved,'Parade preserves normal crossing identity');
if(o.personalize){o.personalize({name:'Example',dedication:'Thank you for everything.',fish:2});assert.equal(o.sprites[o.fish[0].index].name,names[2]);assert.throws(()=>o.personalize({name:'Too long a recipient',dedication:'x',fish:0}));assert.throws(()=>o.personalize({name:'Example',dedication:'x',fish:4}));}
console.log('PASS: three effects, both edges, entry timing, one per crossing, expiry, safe bounds, pause, parade return and personal preview.');

