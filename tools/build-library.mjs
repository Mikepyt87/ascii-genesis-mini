// SPDX-License-Identifier: GPL-3.0-or-later
// Rebuild the Mini catalog and SVG illustrations from the actual preview renderer.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import '../art/fish-art.js';
import '../preview/font.js';
import '../preview/ocean-scenes.js';
import '../preview/ocean.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {MiniOcean,render}=globalThis.MiniAquarium;
const sprites=globalThis.AsciiquariumSprites;
const descriptions=[
  'A broad body with a swept upper fin, forked tail, and small eye near the nose.',
  'A compact reef-fish outline with pointed fins and a round eye. Its short silhouette leaves plenty of open water around it.',
  'Dense colon markings fill a long body, surrounded by layered slash fins and a forked tail.',
  'A three-line fish with a little outlined body and a crossed tail. It is one of the smallest drawings in the collection.',
  'A low, rounded body with short fins and a small forked tail.',
  'A broad diamond-shaped silhouette with tall fins above and below the body.',
  'A small angular fish made from a few sloping lines. The pointed outline contrasts with the rounder reef fish.',
  'A compact, box-shaped body with a blunt face and small fins.',
  'An ornate fish with curled fin details and a larger outline than the tiny reef drawings.',
  'A long, roomy ocean-fish drawing with an extended body and prominent fins.',
  'A narrow, pointed silhouette that suggests a fast cruising fish.',
  'A round golden puffer with little spikes above and below its body. Warm fins frame the pale eye.',
  'A pale bannerfish with vertical markings and a tall trailing fin. It uses eight character rows, making it one of the taller designs.',
  'A silver-blue hunter-shaped fish with a long pointed bill. In the Mini it cruises like the other designs; it does not hunt.',
  'A copper-colored eel with an elongated, gently bent body. It is a regular swimmer here rather than an eel peeking from scenery.',
  'A violet ray with broad wings, a narrow tail, and a small eye. Its drawing glides sideways using the shared swimming motion.',
  'A blue-green fish with a light-like stalk above its head and a pale eye. The lure is part of the static artwork.',
  'A rose-colored squid with a pointed mantle and tentacles trailing behind. Its whole drawing moves together.',
  'A violet octopus with two eyes and curling arms below a rounded head. In this edition it shares the regular swimming lanes.',
  'A green turtle with a patterned shell, four flippers, and a small head. The shell markings use the artwork color masks.',
  'A pale jellyfish with a rounded bell and trailing tentacles. The Mini moves the complete drawing sideways with a gentle bob; it has no separate pulse animation.',
  'A small shore crab with claws and low legs. The Mini uses a swimming lane for this drawing rather than making its feet follow the floor.',
  'A reef lobster with an extended body, legs, and claws. Like the crab, it joins the regular lanes and the parade.',
  'A shark silhouette with a high dorsal fin, pointed nose, and forked tail. It is decorative here and never eats other fish.',
  'A broad whale drawing with flippers and a long back. It uses the same lane-spacing rules as the smaller designs.',
  'A yellow submarine with a raised periscope and hull details. It is the collection’s decorative vehicle, not an animal.',
  'A copper-toned lionfish with pale stripes and spread-out spines. The fins are drawn into the sprite rather than animated separately.',
  'A peacock mantis shrimp with raised eyes, a green body, blue legs, and orange striking clubs. In the Mini it swims through a clear lane; it does not punch, hunt, or dig a burrow.'
];
if(descriptions.length*2!==sprites.length)throw Error('Add a catalog description for each design');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Canvas-compatible rectangle/clip recorder: render() supplies every ocean pixel.
function recorder(){
  let parts=[],stack=[],pending='',group=false;
  const flush=()=>{if(pending){parts.push(`<path fill="${ctx.fillStyle}" d="${pending}"/>`);pending='';}};
  let color='';
  const ctx={get fillStyle(){return color;},set fillStyle(v){flush();color=v;},
    fillRect(x,y,w,h){pending+=`M${x} ${y}h${w}v${h}h-${w}z`;},
    save(){flush();parts.push('<g>');stack.push(group);group=false;},
    restore(){flush();if(group)parts.push('</svg>');parts.push('</g>');group=stack.pop();},
    beginPath(){},rect(x,y,w,h){this.bounds=[x,y,w,h];},
    clip(){flush();const [x,y,w,h]=this.bounds;parts.push(`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" overflow="hidden">`);group=true;}
  };
  return {ctx,finish(){flush();if(stack.length)throw Error('Unbalanced renderer');return parts.join('');}};
}
function documentSvg(width,height,body,title){return `<svg xmlns="http://www.w3.org/2000/svg" width="${width*2}" height="${height*2}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)}" shape-rendering="crispEdges"><title>${escape(title)}</title><!-- Generated from Mini renderer/art; credits: ../../CREDITS.md; font: ../../preview/FONT-LICENSE.txt -->${body}</svg>\n`;}
const files=new Map();
for(const [name,setup] of [
  ['ocean',o=>{o.controls=false;}],
  ['controls',()=>{}],
  ['parade',o=>{o.toggleParade();o.parade.elapsed=o.parade.starts[27]+3;}],
  ['coral',o=>{o.time=135;o.scroll=135*3.6;o.habitat=3;o.controls=false;}]
]){const ocean=new MiniOcean(sprites),r=recorder();setup(ocean);render(r.ctx,ocean,globalThis.MiniFont);files.set(`docs/images/${name}.svg`,documentSvg(320,172,r.finish(),`ASCII Genesis - Mini ${name} preview`));}
let lineup='<rect width="960" height="840" fill="#020c14"/>';
for(let i=0;i<sprites.length;i+=2){const s=sprites[i],x=(i/2%4)*240,y=Math.floor(i/8)*120;
  lineup+=`<text x="${x+12}" y="${y+18}" fill="#bde9e6" font-family="monospace" font-size="12">${i/2+1}. ${escape(s.name)}</text>`;
  const r=recorder();for(let row=0;row<s.rows.length;row++)for(let col=0;col<s.rows[row].length;col++){
    const code=s.rows[row].charCodeAt(col),mask=Number(s.masks[row]?.[col]);r.ctx.fillStyle=s.palette[mask>0?mask-1:0]||'#bde9e6';
    for(let c=0;c<5;c++)for(let bit=0;bit<8;bit++)if(globalThis.MiniFont[code*5+c]&(1<<bit))r.ctx.fillRect(x+12+col*6+c,y+30+row*8+bit,1,1);
  }lineup+=r.finish();
}
files.set('docs/images/collection.svg',documentSvg(960,840,lineup,'All 28 Mini creature and vehicle designs'));
let library=`# Mini Ocean Library

The complete artwork and behavior reference for **ASCII Genesis - Mini**, the 320 × 172 ESP32 ocean. This page describes the Mini’s implementation. The [Raspberry Pi library](https://github.com/Mikepyt87/ascii-genesis/blob/main/docs/OCEAN-LIBRARY.md) describes a different program.

There are **28 creature and vehicle designs**, with a left-facing and right-facing drawing for each: **56 sprites**. The yellow submarine is included in that total. Every drawing below comes directly from the bundled artwork, including its spaces, color masks, and dimensions.

![All 28 Mini designs](images/collection.svg)

## Find a design

| Parade number | Design | Drawing size, right-facing | Artwork origin |
| --- | --- | --- | --- |
`;
const slug=s=>s.replaceAll(' ','-');
for(let i=0;i<sprites.length;i+=2){const s=sprites[i];library+=`| ${i/2+1} | [${s.name}](#${slug(s.name)}) | ${Math.max(...s.rows.map(r=>r.length))} × ${s.rows.length} characters | ${s.original?'ASCII Genesis original':'Adapted Asciiquarium'} |\n`;}
library+=`
## Shared swimming behavior

- Normal swimming uses **9–18 screen pixels per second**, three times the v0.1.6 range. Each arrival receives its own speed and left/right direction. A point would cross the 320-pixel screen in roughly 18–36 seconds; a complete drawing takes longer to enter and leave.
- The seabed and rooted plants travel together at **3.6 pixels per second**. Faster fish do not change camera speed, habitat timing, bubble speed, or the Pi edition.
- There are at most **three normal swimmers**. Each occupies a separate vertical band that allows for the whole drawing, a two-pixel bob, and a four-pixel gap. A new arrival waits if its full height will not fit.
- New arrivals begin beyond an edge and are removed only after leaving the screen. Edge clipping during entry or departure is expected. Important content is inset from the physical screen’s rounded corners.
- The colored character drawings are static. The renderer translates each drawing and adds a small vertical bob; it does not animate individual fins, claws, legs, or tentacles.
- All designs use these rules, including the crab, lobster, octopus, and mantis shrimp. The Mini has no hunting, food web, schools, diver visits, local-clock lighting, or AI narration.

## Creature parade

Parade keeps the table’s original order, facing right, with **up to two designs at a time** in separate bands. Each crosses in six seconds; the next enters after three seconds when both drawings fit. Tall neighbors take turns so nothing overlaps. The full lineup lasts **105 seconds (1 minute 45 seconds)**. Creature names appear at the top right, on separate lines matching their bands. The normal swimming speed does not control parade speed.

The normal world is held in place, including its random state, then resumes when the parade finishes or you tap Return. Pause freezes the parade too. New World cancels it and starts a fresh ocean. See [Controls](CONTROLS.md) for button behavior.

## Habitats and scenery

The habitat label changes every **45 seconds of running ocean time**, cycling through six labels in 4 minutes 30 seconds. Pausing freezes that clock; a parade holds it in place. These are simple decorative variations, not six separate ecosystems.

| Habitat | What the Mini draws |
| --- | --- |
| Kelp meadow | The shared rolling seabed and swaying plants |
| Rocky reef | The shared scenery plus small rock outlines |
| Open sand | The shared seabed and plants; no separate sand ecosystem |
| Coral garden | The shared scenery with pink branching marks on plants |
| Seagrass bed | The shared seabed and plants; no separate grass simulation |
| Wreck depths | The shared scenery plus rock outlines; no shipwreck sprite or visiting eel |

Ground is made from underscore, dot, and colon characters along a shallow wave. Plants have two to four character rows, sway above their fixed roots, and travel with the same camera as the ground. Bubbles rise through the scene, with at most four present. The habitat label does not restrict which designs can arrive.

## Creature drawings

The sizes below are **columns × rows of characters**. The bitmap cell is 6 × 8 pixels; a glyph itself is up to five pixels wide. Colors are the actual palette values used by the renderer, not a claim about the real animal’s biology.
`;
for(let i=0;i<sprites.length;i+=2){const right=sprites[i],left=sprites[i+1];
  library+=`\n### ${right.name}\n\n${descriptions[i/2]}\n\n- **Parade position:** ${i/2+1} of ${sprites.length/2}.\n- **Drawing size:** right ${Math.max(...right.rows.map(r=>r.length))} × ${right.rows.length}; left ${Math.max(...left.rows.map(r=>r.length))} × ${left.rows.length} characters.\n- **Palette:** ${[...new Set(right.palette)].map(c=>'`'+c+'`').join(', ')}.\n- **Origin:** ${right.original?'Original ASCII Genesis drawing in [original-fish.mjs](../art/original-fish.mjs)':'Adapted Asciiquarium artwork; see [credits](../CREDITS.md)'}.\n- **Motion:** [Shared swimming behavior](#shared-swimming-behavior); no individual hunting or feeding rules.\n\nFacing right:\n\n\`\`\`text\n${right.rows.join('\n')}\n\`\`\`\n\nFacing left:\n\n\`\`\`text\n${left.rows.join('\n')}\n\`\`\`\n`;
}
library+=`\n## Sources and maintenance\n\nEleven designs adapt Asciiquarium and seventeen are original ASCII Genesis additions. Preserve the upstream authors’ credits and the [artwork license](../art/LICENSE.txt). See [CREDITS.md](../CREDITS.md) and [THIRD-PARTY.md](../THIRD-PARTY.md).\n\nThe artwork source is in [art/](../art/); the browser renderer is [ocean.js](../preview/ocean.js), and the device renderer is [main.c](../firmware/main/main.c). This library and its SVG illustrations are generated by [build-library.mjs](../tools/build-library.mjs). Change descriptions there, then run \`node tools/build-library.mjs\`. CI checks for stale catalog material. SVG illustrations use the actual preview renderer and bitmap font, with the [Adafruit font notice](../preview/FONT-LICENSE.txt). They are software previews, not photographs or radio/touch emulation.\n`;
files.set('docs/OCEAN-LIBRARY.md',library);
for(const [file,contents] of files){const destination=path.join(root,file);if(process.argv.includes('--check')){if(!fs.existsSync(destination)||fs.readFileSync(destination,'utf8')!==contents)throw Error(`Stale library material: ${file}`);}else{fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,contents);}}
console.log(`PASS: ${sprites.length/2} catalog entries, both directions, and ${files.size-1} renderer illustrations ${process.argv.includes('--check')?'match their sources':'generated'}`);
