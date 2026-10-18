import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import '../art/fish-art.js';
import '../art/size-check.mjs';
import '../preview/font.js';
const quote=s=>JSON.stringify(s);
let out=`/* Generated from art/fish-art.js and preview/font.js. Do not edit.
 * Artwork: GPL-2.0-or-later; Copyright (C) 2003 Kirk Baucom, most upstream
 * art credited to Joan Stark; expanded biodiversity by Claudio Matsuoka.
 * Original additions: ASCII Genesis. See root CREDITS.md and THIRD-PARTY.txt.
 * Font: Copyright (c) 2012 Adafruit Industries, BSD, preview/FONT-LICENSE.txt.
 */
#pragma once
#include <stdint.h>
typedef struct {const char *rows[10],*masks[10];uint32_t palette[7];int width,height;const char *name;int bottom;int8_t feet[64];} mini_sprite_t;
static const unsigned char mini_font[]={${globalThis.MiniFont.join(',')}};
static const mini_sprite_t mini_sprites[]={\n`;
const bottomNames=new Set(['shore crab','reef lobster','peacock mantis shrimp','violet octopus']);
for(const s of globalThis.AsciiquariumSprites){
 const feet=Array.from({length:Math.max(...s.rows.map(r=>r.length))},(_,col)=>{
  let last=-1;s.rows.forEach((row,r)=>{const ch=row[col];if(!ch||ch===' ')return;
   for(let x=0;x<5;x++)for(let y=0;y<8;y++)if(globalThis.MiniFont[ch.charCodeAt(0)*5+x]&(1<<y))last=Math.max(last,r*8+y);
  });return last;
 });
 out+=`{ {${s.rows.map(quote)}}, {${s.masks.map(quote)}}, {${s.palette.map(c=>'0x'+c.slice(1))}}, ${Math.max(...s.rows.map(r=>r.length))}, ${s.rows.length}, ${quote(s.name)}, ${bottomNames.has(s.name)?1:0}, {${feet}}},\n`;
}
out+='};\n';
out+=`#define MINI_SPRITE_COUNT ${globalThis.AsciiquariumSprites.length}\n`;
out+=`#define MINI_MANTIS_INDEX ${globalThis.AsciiquariumSprites.findIndex(s=>s.name==='peacock mantis shrimp')}\n`;
const target=fileURLToPath(new URL('../firmware/main/assets.h',import.meta.url));
if(process.argv.includes('--check')){if(await fs.readFile(target,'utf8')!==out)throw Error('Generated assets are stale');}
else await fs.writeFile(target,out);
