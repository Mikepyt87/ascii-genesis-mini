// SPDX-License-Identifier: GPL-3.0-or-later
// Scene illustrations use the actual preview renderer, not hand-drawn mockups.
import fs from 'node:fs';
import '../art/fish-art.js';
import '../preview/font.js';
import '../preview/ocean-scenes.js';
import '../preview/ocean.js';
const {MiniOcean,render}=globalThis.MiniAquarium,scenes=globalThis.OceanScenes;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
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

for(const kind of ['boat','whale','monster','ruins']){
 const ocean=new MiniOcean(globalThis.AsciiquariumSprites,4848);
 let time=0;
 if(kind!=='ruins')for(;time<600;time+=.02){const s=scenes.scene(time,4848);if(s.kind===kind&&s.progress>.5&&s.progress<.51)break;}
 else for(;time<600;time+=.1)if(scenes.scene(time,4848).surface===0)break;
 if(time>=600)throw Error('Scene not found');
 ocean.time=time;ocean.step(.01);ocean.controls=false;
 let slot=0;if(kind==='ruins')while(scenes.landmark(slot,4848).kind!=='ruins')slot++;
 ocean.scroll=scenes.landmark(slot,4848).worldX-25;
 const r=recorder();render(r.ctx,ocean,globalThis.MiniFont);
 const name=kind==='ruins'?'ruins':'surface-'+kind,title='ASCII Genesis Mini '+kind+' scene';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+320*2+'" height="'+344+'" viewBox="0 0 320 172" role="img" aria-label="'+escape(title)+'" shape-rendering="crispEdges"><title>'+escape(title)+'</title><!-- Actual browser renderer; software preview, not a board photograph. Credits: ../../CREDITS.md; font: ../../preview/FONT-LICENSE.txt -->'+r.finish()+'</svg>\n';
 const dest=new URL('../docs/images/'+name+'.svg',import.meta.url);
 if(process.argv.includes('--check')){if(fs.readFileSync(dest,'utf8')!==svg)throw Error('Stale scene illustration: '+name);}
 else{fs.mkdirSync(new URL('../docs/images/',import.meta.url),{recursive:true});fs.writeFileSync(dest,svg);}
}
console.log('PASS: four Mini scene illustrations match the renderer.');
