/* ASCII Genesis miniature ocean, GPL-2.0-or-later.
 * Browser design simulation for the 320 x 172 display; not firmware emulation.
 */
(function (root) {
  'use strict';
  const W = 320, H = 172, WATER_TOP = 20, FLOOR = 152;
  const SAFE_X = 12, SAFE_Y = 8, SWIM_TOP = 23;
  const BOB = 2, GAP = 4, SWIM_BOTTOM = 145;
  const SCROLL_SPEED = 3.6;
  const PARADE_SECONDS = 6, PARADE_INTERVAL = 3, PARADE_TOP = 32;
  const groundAt = worldX => FLOOR + Math.round(Math.sin(worldX / 42) * 3);
  const screenX = (worldX, scroll) => Math.round(worldX - scroll);
  const bandsClear = (y, h, otherY, otherH) => y + h + BOB + GAP <= otherY - BOB || otherY + otherH + BOB + GAP <= y - BOB;
  const HABITATS = ['KELP MEADOW', 'ROCKY REEF', 'OPEN SAND', 'CORAL GARDEN', 'SEAGRASS BED', 'WRECK DEPTHS'];
  class MiniOcean {
    constructor(sprites, seed = 147) {
      this.sprites = sprites;
      this.seed = seed >>> 0 || 147;
      this.time = this.random()*270; this.paused = false; this.controls = true;
      this.habitat = Math.floor(this.time/45)%6; this.scroll = this.time*SCROLL_SPEED; this.fish = [];
      this.pendingSpawn = null;
      this.parade = null;
      this.bubbles = []; this.nextBubble = this.time+2;
      for(let slot=0;slot<3;slot++){
        const first=Math.floor(this.random()*(sprites.length/2));
        for(let attempt=0;attempt<sprites.length/2;attempt++){
          const index=((first+attempt)%(sprites.length/2))*2,sprite=sprites[index],height=sprite.rows.length*8;
          const band=Math.floor((SWIM_BOTTOM-SWIM_TOP)/3),room=band-height-2*BOB-GAP;if(room<0)continue;
          const y=SWIM_TOP+slot*band+BOB+Math.floor(this.random()*(room+1));
          const width=Math.max(...sprite.rows.map(r=>r.length))*6;
          const direction=this.random()<.5?-1:1;
          this.spawn(index,SAFE_X+this.random()*(W-2*SAFE_X-width),y,direction);break;
        }
      }
    }
    random() {
      let x = this.seed; x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this.seed = x >>> 0; return this.seed / 4294967296;
    }
    spawn(index, x, y, direction) {
      const sprite = this.sprites[(index & ~1) + (direction < 0 ? 1 : 0)];
      const width = Math.max(...sprite.rows.map(r => r.length)) * 6;
      const height = sprite.rows.length * 8;
      this.fish.push({index: (index & ~1) + (direction < 0 ? 1 : 0), x, y,
        width, height, direction, speed: 9 + this.random() * 9,
        phase: this.random() * Math.PI * 2});
    }
    freeY(height) {
      const candidates = [];
      for (let y = SWIM_TOP; y + height + BOB <= SWIM_BOTTOM; y++) {
        if (this.fish.every(f => bandsClear(y, height, f.y, f.height))) candidates.push(y);
      }
      return candidates.length ? candidates[Math.floor(this.random() * candidates.length)] : null;
    }
    step(dt) {
      if (this.paused) return;
      dt = Math.max(0, Math.min(dt, 0.25));
      if(this.parade){this.parade.elapsed+=dt;if(this.parade.elapsed>=this.parade.duration)this.parade=null;return;}
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
        const y = this.freeY(height);
        if (y !== null) {
          this.spawn(index, direction > 0 ? -width - 2 : W + 2, y, direction);
          this.pendingSpawn = null;
        }
      }
      if (this.time >= this.nextBubble) {
        if (this.bubbles.length < 4) this.bubbles.push({x: 15 + this.random() * 290, y: FLOOR - 2});
        this.nextBubble = this.time + 2 + this.random() * 3;
      }
      for (const b of this.bubbles) b.y -= dt * 5;
      this.bubbles = this.bubbles.filter(b => b.y > WATER_TOP + 3);
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
      if(this.parade){this.parade=null;return;}
      const order=Array.from({length:this.sprites.length/2},(_,i)=>i);
      const starts=[0];
      for(let i=1;i<order.length;i++){
        const height=(this.sprites[order[i-1]*2].rows.length+this.sprites[order[i]*2].rows.length)*8;
        starts[i]=starts[i-1]+(height+4*BOB+GAP<=SWIM_BOTTOM-PARADE_TOP?PARADE_INTERVAL:PARADE_SECONDS);
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
        return [{index,width,height,x:SAFE_X-width-2+phase*(W-2*SAFE_X+width+4),y:slot%2?SWIM_BOTTOM-BOB-height:PARADE_TOP+BOB,phase:0}];
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
    ctx.fillStyle = colors.water; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(SAFE_X, SAFE_Y, W - SAFE_X * 2, H - SAFE_Y * 2); ctx.clip();
    if(ocean.parade){
      text('PARADE '+(ocean.paradeIndex()+1)+'/'+ocean.sprites.length/2,20,8,colors.text);
      for(const f of ocean.visibleFish()){
        const name=ocean.sprites[f.index].name;const slot=ocean.parade.order.indexOf(f.index/2);
        text(name,W-name.length*6-20,slot%2?18:8,colors.muted);
      }
    }else{text('ASCII GENESIS - MINI',20,8,colors.text);const label=HABITATS[ocean.habitat];text(label,W-label.length*6-20,8,colors.muted);}
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
    for (const b of ocean.bubbles) glyph('o', b.x, b.y, colors.muted);
    for (const fish of ocean.visibleFish()) {
      const s = ocean.sprites[fish.index];
      const bob = Math.round(Math.sin((ocean.parade?.elapsed??ocean.time) * 0.55 + fish.phase) * 2);
      for (let row = 0; row < s.rows.length; row++) {
        for (let col = 0; col < s.rows[row].length; col++) {
          const ch = s.rows[row][col]; if (ch === ' ') continue;
          const mask = Number(s.masks[row]?.[col]);
          glyph(ch, fish.x + col * 6, fish.y + row * 8 + bob, s.palette[mask > 0 ? mask - 1 : 0] || colors.text);
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
  root.MiniAquarium = {MiniOcean, render, W, H, HABITATS, groundAt, screenX, bandsClear, SAFE_X, SAFE_Y, SWIM_TOP, SWIM_BOTTOM, SCROLL_SPEED, PARADE_SECONDS, PARADE_INTERVAL, PARADE_TOP};
})(globalThis);
