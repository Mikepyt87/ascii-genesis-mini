/* Original ASCII Genesis whole-fish celebrations. GPL-3.0-or-later. */
(function(root){
 const names=['balance angelfish','steadfast marlin','spark wrasse'];
 const colors=[['#75d8ca','#c9fff0'],['#dfb96c','#fff1b8'],['#b79ae0','#ffc18a']];
 function points(kind,age,x,y,scale=1,w=120,h=40){
   if(kind<0||kind>2||age<0||age>=3)return [];
   const out=[];
   for(let i=0;i<24;i++){
     const gap=(14+age*2+3*Math.sin(i*2.4+age*(kind+1)*2))*scale;
     const hw=w/2+gap,hh=h/2+gap,perimeter=4*(hw+hh);
     let d=((i/24+age*[.025,-.02,.05][kind]+1)%1)*perimeter,dx,dy;
     if(d<2*hw){dx=-hw+d;dy=-hh;}else if((d-=2*hw)<2*hh){dx=hw;dy=-hh+d;}
     else if((d-=2*hh)<2*hw){dx=hw-d;dy=hh;}else{d-=2*hw;dx=-hw;dy=hh-d;}
     const r=8*scale,px=Math.abs(dx)-(hw-r),py=Math.abs(dy)-(hh-r);
     if(px>0&&py>0){const length=Math.hypot(px,py);dx=Math.sign(dx)*(hw-r+px*r/length);dy=Math.sign(dy)*(hh-r+py*r/length);}
     if(age>2.55&&i%2)continue;
     out.push({x:Math.round(x+dx),y:Math.round(y+dy),color:colors[kind][(i+Math.floor(age*4))%2],size:age<2.1?2:1});
   }return out;
 }
 class Tracker {
   constructor(){this.seen=new WeakSet();this.ids=new Set();this.effects=[];}
   step(items,dt,width,height){
     this.effects=this.effects.flatMap(e=>{const f=items.find(f=>f.key===e.key);return f&&e.age+dt<3?[{...e,age:e.age+dt,x:f.x+f.w/2,y:f.y+f.h/2,w:f.w,h:f.h}]:[];});
     for(const item of items){
       const kind=names.indexOf(item.name),{x,y,w,h,key}=item;
       // Wait for the full drawing, so this reads as a surrounding celebration.
       if(kind<0||x<24||x+w>width-24)continue;
       const set=typeof key==='object'?this.seen:this.ids;if(set.has(key))continue;set.add(key);
       this.effects.push({kind,key,age:0,x:x+w/2,y:y+h/2,w,h});
     }this.effects=this.effects.slice(-3);
   }
   pixels(width,height,blocked,scale=1){return this.effects.flatMap(e=>points(e.kind,e.age,e.x,e.y,scale,e.w,e.h)).filter(p=>p.x>=13&&p.x+4<width-12&&p.y>=23&&p.y+4<height-34&&!blocked.some(b=>p.x+4>=b.x-4&&p.x-2<=b.x+b.w+4&&p.y+4>=b.y-4&&p.y-2<=b.y+b.h+4));}
 }
 root.GenesisCelebrations={names,points,Tracker};
})(globalThis);

/* ASCII Genesis miniature ocean, GPL-2.0-or-later.
 * Browser design simulation for the 320 x 172 display; not firmware emulation.
 */
(function (root) {
  'use strict';
  const scenes=root.OceanScenes;
  const W = 320, H = 172, WATER_TOP = 20, FLOOR = 152;
  const SAFE_X = 12, SAFE_Y = 8, SWIM_TOP = 23;
  const BOB = 2, GAP = 4, SWIM_BOTTOM = 145;
  const SCROLL_SPEED = 3.6;
  const bottomNames=new Set(['shore crab','reef lobster','peacock mantis shrimp','violet octopus']);
  const bottomReserve=height=>FLOOR-3-height;
  const feetFor=s=>Array.from({length:Math.max(...s.rows.map(r=>r.length))},(_,col)=>{
    let last=-1;s.rows.forEach((row,r)=>{const ch=row[col];if(!ch||ch===' ')return;
      for(let x=0;x<5;x++)for(let y=0;y<8;y++)if(root.MiniFont[ch.charCodeAt(0)*5+x]&(1<<y))last=Math.max(last,r*8+y);
    });return last;
  });
  const PARADE_SECONDS = 6, PARADE_INTERVAL = 3, PARADE_TOP = 32;
  const PARADE_NAME_ADVANCE = 9, PARADE_NAME_HEIGHT = 12;
  const groundAt = worldX => FLOOR + Math.round(Math.sin(worldX / 42) * 3);
  const screenX = (worldX, scroll) => Math.round(worldX - scroll);
  const bandsClear = (y, h, otherY, otherH) => y + h + BOB + GAP <= otherY - BOB || otherY + otherH + BOB + GAP <= y - BOB;
  const HABITATS = ['KELP MEADOW', 'ROCKY REEF', 'OPEN SAND', 'CORAL GARDEN', 'SEAGRASS BED', 'WRECK DEPTHS'];
  class MiniOcean {
    constructor(sprites, seed = 147) {
      this.sprites = sprites;this.feet=sprites.map(feetFor);
      this.seed = seed >>> 0 || 147; this.sceneSeed=this.seed;
      this.time = this.random()*270; this.paused = false; this.controls = true;
      this.habitat = Math.floor(this.time/45)%6; this.scroll = this.time*SCROLL_SPEED; this.fish = [];
      this.pendingSpawn = null;
      this.parade = null; this.celebrations=new root.GenesisCelebrations.Tracker();
      this.bubbles = []; this.nextBubble = this.time+2;
      for(let slot=0;slot<3;slot++){
        const first=Math.floor(this.random()*(sprites.length/2));
        for(let attempt=0;attempt<sprites.length/2;attempt++){
          const index=((first+attempt)%(sprites.length/2))*2,sprite=sprites[index],height=sprite.rows.length*8;
          if(this.isBottom(index)&&slot<2)continue;
          const band=Math.floor((SWIM_BOTTOM-SWIM_TOP)/3),room=band-height-2*BOB-GAP;if(room<0&&!this.isBottom(index))continue;
          const y=this.isBottom(index)?bottomReserve(height):SWIM_TOP+slot*band+BOB+Math.floor(this.random()*(room+1));
          if(!this.fish.every(f=>bandsClear(y,height,f.y,f.height)))continue;
          const width=Math.max(...sprite.rows.map(r=>r.length))*6;
          const direction=this.random()<.5?-1:1;
          this.spawn(index,SAFE_X+this.random()*(W-2*SAFE_X-width),y,direction);break;
        }
      }
    }
    personalize(profile){
      if(!profile||typeof profile.name!=='string'||!profile.name.length||profile.name.length>12||typeof profile.dedication!=='string'||!profile.dedication.length||profile.dedication.length>320||!Number.isInteger(profile.fish)||profile.fish<0||profile.fish>2||!/^[ -~]+$/.test(profile.name+profile.dedication))throw Error('Invalid private edition profile');
      this.edition={...profile};this.fish=[];this.pendingSpawn=null;this.celebrations=new root.GenesisCelebrations.Tracker();
      const index=this.sprites.findIndex(s=>s.name===root.GenesisCelebrations.names[profile.fish]);
      this.spawn(index,40,25,1);
    }
    isBottom(index){return bottomNames.has(this.sprites[index].name);}
    bottomY(index,x,scroll=this.scroll){return Math.min(...this.feet[index].flatMap((foot,col)=>foot<0?[]:[groundAt(Math.round(x)+col*6+2+scroll)-foot]));}
    paradeY(slot){const index=slot*2,height=this.sprites[index].rows.length*8;
      if(this.isBottom(index))return bottomReserve(height);
      const neighbor=[slot-1,slot+1].some(n=>n>=0&&n<this.sprites.length/2&&this.isBottom(n*2));
      return neighbor||slot%2===0?PARADE_TOP+BOB:SWIM_BOTTOM-BOB-height;
    }
    random() {
      let x = this.seed; x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this.seed = x >>> 0; return this.seed / 4294967296;
    }
    spawn(index, x, y, direction) {
      const sprite = this.sprites[(index & ~1) + (direction < 0 ? 1 : 0)];
      const width = Math.max(...sprite.rows.map(r => r.length)) * 6;
      const height = sprite.rows.length * 8;
      this.fish.push({index: (index & ~1) + (direction < 0 ? 1 : 0), x, y:this.isBottom(index)?bottomReserve(height):y,
        width, height, direction, speed: 9 + this.random() * 9,
        phase: this.random() * Math.PI * 2});
    }
    freeY(height,index=-1) {
      if(index>=0&&this.isBottom(index)){const y=bottomReserve(height);return y>=this.arrivalTop()&&this.fish.every(f=>bandsClear(y,height,f.y,f.height))?y:null;}
      const candidates = [];
      for (let y = Math.max(this.waterTop(), this.arrivalTop()); y + height + BOB <= SWIM_BOTTOM; y++) {
        if (this.fish.every(f => bandsClear(y, height, f.y, f.height))) candidates.push(y);
      }
      return candidates.length ? candidates[Math.floor(this.random() * candidates.length)] : null;
    }
    desiredSurfaceY(){return Math.round(-12+76*scenes.scene(this.time,this.sceneSeed).surface);}
    arrivalTop(){return Math.max(SWIM_TOP,this.desiredSurfaceY()+12);}
    surfaceY(){
      // Existing swimmers keep their lanes; reserve the desired depth for newcomers.
      let water=this.desiredSurfaceY();
      for(const f of this.fish)water=Math.min(water,Math.floor(f.y)-12);
      return water;
    }
    waterTop(){return Math.max(SWIM_TOP,this.surfaceY()+12);}
    celebrationItems(){return this.visibleFish().map(f=>({key:this.parade?'parade-'+f.index:f,name:this.sprites[f.index].name,x:f.x,y:f.y,w:f.width,h:f.height,right:this.parade?true:f.direction>0}));}
    advanceCelebrations(dt){this.celebrations.step(this.celebrationItems(),dt,W,H);}
    step(dt) {
      if (this.paused) return;
      dt = Math.max(0, Math.min(dt, 0.25));
      if(this.parade){this.parade.elapsed+=dt;this.advanceCelebrations(dt);if(this.parade.elapsed>=this.parade.duration){this.parade=null;this.celebrations=this.normalCelebrations;}return;}
      this.time += dt; this.scroll = this.time * SCROLL_SPEED;
      this.habitat = Math.floor(this.time / 45) % HABITATS.length;
      for (const f of this.fish) f.x += f.direction * f.speed * dt;
      this.fish = this.fish.filter(f => f.x < W + 8 && f.x + f.width > -8);
      if (this.fish.length < 3) {
        if (!this.pendingSpawn) this.pendingSpawn = {index: Math.floor(this.random() * (this.sprites.length / 2)) * 2, direction: this.random() < 0.5 ? -1 : 1};
        const {index, direction} = this.pendingSpawn;
        const sprite = this.sprites[index];
        const width = Math.max(...sprite.rows.map(r => r.length)) * 6;
        const height = sprite.rows.length * 8;
        const y = this.freeY(height,index);
        if (y !== null) {
          this.spawn(index, direction > 0 ? -width - 2 : W + 2, y, direction);
          this.pendingSpawn = null;
        }
      }
      if (this.time >= this.nextBubble) {
        if (this.bubbles.length < 2){
          const f=this.fish[Math.floor(this.random()*this.fish.length)];
          const x=f?f.x+(f.direction>0?f.width:0):30+this.random()*260;
          if(x>SAFE_X&&x<W-SAFE_X)this.bubbles.push({x,y:f?f.y+f.height*.375:FLOOR-12});
        }
        this.nextBubble = this.time + 7 + this.random() * 5;
      }
      for (const b of this.bubbles) {b.y -= dt * 7;b.x-=dt*.7;}
      this.bubbles = this.bubbles.filter(b => b.y > this.waterTop() && b.x>SAFE_X);
      this.advanceCelebrations(dt);
      if (this.time > 8) this.controls = false;
    }
    action(x, y) {
      if (this.controls && y >= 140) {
        if (x < 86) this.paused = !this.paused;
        else if (x < 160) return 'reset';
        else if (x < 234) {this.toggleParade();return 'parade';}
        else return 'settings';
      }
      this.controls = true;
      return 'show';
    }
    toggleParade(){
      if(this.parade){this.parade=null;this.celebrations=this.normalCelebrations;return;}
      this.normalCelebrations=this.celebrations;this.celebrations=new root.GenesisCelebrations.Tracker();
      const order=Array.from({length:this.sprites.length/2},(_,i)=>i);
      const starts=[0];
      for(let i=1;i<order.length;i++){
        const a=this.sprites[(i-1)*2].rows.length*8,b=this.sprites[i*2].rows.length*8;
        starts[i]=starts[i-1]+(bandsClear(this.paradeY(i-1),a,this.paradeY(i),b)?PARADE_INTERVAL:PARADE_SECONDS);
      }
      this.parade={elapsed:0,order,starts,duration:starts.at(-1)+PARADE_SECONDS};
    }
    paradeIndex(){let i=0;while(i+1<this.parade.order.length&&this.parade.starts[i+1]<=this.parade.elapsed)i++;return i;}
    visibleFish(){
      if(!this.parade)return this.fish;
      const {elapsed,order,starts}=this.parade;
      return order.flatMap((design,slot)=>{
        const age=elapsed-starts[slot];if(age<0||age>=PARADE_SECONDS)return [];
        const index=design*2,sprite=this.sprites[index],width=Math.max(...sprite.rows.map(r=>r.length))*6,height=sprite.rows.length*8;
        const phase=Math.max(0,Math.min(1,(age-.25)/(PARADE_SECONDS-.5)));
        return [{index,width,height,x:SAFE_X-width-2+phase*(W-2*SAFE_X+width+4),y:this.paradeY(slot),phase:0}];
      });
    }
  }

  function render(ctx, ocean, font) {
    const colors = {water: '#020c14', text: '#bde9e6', muted: '#54858d', green: '#56ab91', sand: '#80715a'};
    function glyph(char, x, y, color) {
      const code = char.charCodeAt(0);
      if (code < 32 || code > 126) return;
      ctx.fillStyle = color;
      for (let col = 0; col < 5; col++) {
        const bits = font[code * 5 + col];
        for (let row = 0; row < 8; row++) if (bits & (1 << row)) ctx.fillRect(Math.round(x) + col, Math.round(y) + row, 1, 1);
      }
    }
    function text(s, x, y, color) { for (let i = 0; i < s.length; i++) glyph(s[i], x + i * 6, y, color); }
    function paradeText(s,x,y){
      ctx.fillStyle=colors.text;
      for(let i=0;i<s.length;i++)for(let col=0;col<8;col++)for(let row=0;row<PARADE_NAME_HEIGHT;row++)
        if(font[s.charCodeAt(i)*5+Math.floor(col*2/3)]&(1<<Math.floor(row*2/3)))ctx.fillRect(x+i*PARADE_NAME_ADVANCE+col,y+row,1,1);
    }
    ctx.fillStyle = colors.water; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(SAFE_X, SAFE_Y, W - SAFE_X * 2, H - SAFE_Y * 2); ctx.clip();
    if(ocean.parade){
      text('PARADE '+(ocean.paradeIndex()+1)+'/'+ocean.sprites.length/2,20,8,colors.text);
      for(const f of ocean.visibleFish()){
        const name=ocean.sprites[f.index].name;const slot=ocean.parade.order.indexOf(f.index/2);
        paradeText(name,W-name.length*PARADE_NAME_ADVANCE-20,8+(slot%2)*PARADE_NAME_HEIGHT);
      }
    }else{text(ocean.edition?ocean.edition.name+' EDITION':'ASCII GENESIS - MINI',20,8,colors.text);const label=HABITATS[ocean.habitat];text(label,W-label.length*6-20,8,colors.muted);}
    ctx.save(); ctx.beginPath(); ctx.rect(0, WATER_TOP, W, H - WATER_TOP); ctx.clip();
    for (let i = Math.floor(ocean.scroll / 6) - 1; i * 6 < ocean.scroll + W + 6; i++) {
      const worldX = i * 6, x = screenX(worldX, ocean.scroll), ground = groundAt(worldX);
      glyph(i % 4 === 0 ? ':' : '.', x, ground + 1, colors.sand);
      glyph('_', x, ground - 6, colors.sand);
    }
    for (let plant = Math.floor((ocean.scroll - 22) / 57) - 1; plant * 57 + 22 < ocean.scroll + W + 12; plant++) {
      const worldX = plant * 57 + 22;
      const x = screenX(worldX, ocean.scroll), ground = groundAt(worldX);
      const height = 2 + ((plant % 3 + 3) % 3);
      for (let row = 0; row < height; row++) {
        const sway = row === 0 ? 0 : Math.round(Math.sin(ocean.time * 0.7 + row + plant) * 2 * row / (height - 1));
        glyph(row === 0 ? '|' : row % 2 ? ')' : '(', x + sway, ground - row * 8 - 6, colors.green);
        if (ocean.habitat === 3 && row === 1) text('\\|/', x - 6, ground - 14, '#cd8d99');
      }
    }
    if (ocean.habitat === 1 || ocean.habitat === 5) {
      for (let rock = Math.floor((ocean.scroll - 82) / 233) - 1; rock * 233 + 82 < ocean.scroll + W; rock++) {
        const worldX = rock * 233 + 82;
        text('/__\\', screenX(worldX, ocean.scroll), groundAt(worldX) - 6, colors.muted);
      }
    }
    if(!ocean.parade){
      for(let slot=Math.floor((ocean.scroll-300)/900)-1;slot*900<ocean.scroll+W;slot++){
        const l=scenes.landmark(slot,ocean.sceneSeed),rows=scenes.art[l.kind+'Small'],x=screenX(l.worldX,ocean.scroll);
        if(x+78<0||x>W)continue;
        const floor=Math.min(...Array.from({length:14},(_,i)=>groundAt(l.worldX+i*6)));
        if(floor-rows.length*8-2<H*2/3)continue;
        rows.forEach((row,i)=>text(row,x,floor-rows.length*8-2+i*8,l.kind==='castle'?'#6f8290':'#687c78'));
      }
      const scene=scenes.scene(ocean.time,ocean.sceneSeed),water=ocean.surfaceY();
      if(water>=20){
        ctx.fillStyle='#081723';ctx.fillRect(12,20,296,water-12);
        for(let x=12;x<308;x+=6)glyph(Math.sin(ocean.time*1.2+x*.06)>0?'~':'_',x,water,'#508d9f');
        if(scene.kind&&water>=52){
          const rows=scenes.art[scene.kind==='monster'&&Math.floor(scene.progress*30/.6)%2?'monsterAlt':scene.kind],width=Math.max(...rows.map(r=>r.length))*6;
          const x=Math.round(-width+scene.progress*(W+width));
          const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
          const lift=smooth(scene.progress*6)*smooth((1-scene.progress)*6);
          const y=scene.kind==='boat'?water-24:scene.kind==='whale'?water-8+Math.floor((1-lift)*32):water-32;
          rows.forEach((row,i)=>text(row,x,y+i*8,scene.kind==='boat'?'#c8b68f':scene.kind==='whale'?'#82a9bb':'#8fb68b'));
          const p=scene.progress*30%11;
          if(scene.kind==='whale'&&lift>.95&&p>=3&&p<6.2)scenes.art.spout[Math.min(3,Math.floor((p-3)/.8))].forEach((row,i)=>text(row,x+12,y-24+i*8,'#a3d8e5'));
        }
      }
      for(const b of ocean.bubbles)glyph(b.y<ocean.waterTop()+20?'.':'o',b.x,b.y,colors.muted);
    }
    for(const p of ocean.celebrations.pixels(W,H,ocean.celebrationItems())){ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);if(p.size===2){ctx.fillRect(p.x-1,p.y+1,4,1);ctx.fillRect(p.x+1,p.y-1,1,4);}}
    for (const fish of ocean.visibleFish()) {
      const s = ocean.sprites[fish.index];
      const bottom=ocean.isBottom(fish.index),bob=bottom?0:Math.round(Math.sin((ocean.parade?.elapsed??ocean.time) * 0.55 + fish.phase) * 2);
      const y=bottom?ocean.bottomY(fish.index,fish.x):fish.y;
      for (let row = 0; row < s.rows.length; row++) {
        for (let col = 0; col < s.rows[row].length; col++) {
          const ch = s.rows[row][col]; if (ch === ' ') continue;
          const mask = Number(s.masks[row]?.[col]);
          glyph(ch, fish.x + col * 6, y + row * 8 + bob, s.palette[mask > 0 ? mask - 1 : 0] || colors.text);
        }
      }
    }
    ctx.restore();
    if (ocean.controls) {
      ctx.fillStyle = '#102631'; ctx.fillRect(0, 140, 320, 32);
      const pause = ocean.paused ? 'RESUME' : 'PAUSE';
      text(pause, 34, 153, colors.text);
      text('NEW WORLD', 96, 153, colors.text);
      text(ocean.parade?'RETURN':'PARADE', 179, 153, colors.text);
      text('SETTINGS', 247, 153, colors.text);
    }
    ctx.restore();
  }
  root.MiniAquarium = {MiniOcean, render, W, H, HABITATS, groundAt, screenX, bandsClear, SAFE_X, SAFE_Y, SWIM_TOP, SWIM_BOTTOM, SCROLL_SPEED, PARADE_SECONDS, PARADE_INTERVAL, PARADE_TOP, PARADE_NAME_ADVANCE, PARADE_NAME_HEIGHT};
})(globalThis);
