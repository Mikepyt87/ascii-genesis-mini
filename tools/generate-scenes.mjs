// SPDX-License-Identifier: GPL-3.0-or-later
import fs from 'node:fs';
import '../preview/ocean-scenes.js';
const {art}=globalThis.OceanScenes;
const header=`// SPDX-License-Identifier: GPL-3.0-or-later
// Scenery and adapted Asciiquarium monster shared with preview/ocean-scenes.js.
#pragma once
#include <stdint.h>
typedef struct {float surface,progress;int kind;} ocean_scene_t;
static uint32_t scene_hash(int n,uint32_t seed){uint32_t v=((uint32_t)n+8192u)*1664525u^seed;v^=v>>16;return v;}
static float scene_smooth(float x){x=fmaxf(0,fminf(1,x));return x*x*(3-2*x);}
static ocean_scene_t scene_at(float time,uint32_t seed){
    int period=240+scene_hash(0,seed)%61;float t=time+scene_hash(1,seed)%period;
    float phase=fmodf(t,period);int cycle=(int)floorf(t/period),order=scene_hash(cycle,seed)%3;
    ocean_scene_t s={.surface=scene_smooth(phase/12)*scene_smooth((120-phase)/12),.progress=0,.kind=-1};
    const int starts[]={12,46,82};
    for(int i=0;i<3;i++)if(phase>=starts[i]&&phase<starts[i]+30){s.kind=(i+order)%3;s.progress=(phase-starts[i])/30;break;}
    return s;
}
${Object.entries(art).filter(([n])=>n!=='spout').map(([n,rows])=>`static const char *scene_${n}[]={${rows.map(JSON.stringify).join(',')}};`).join('\n')}
static const char *scene_spout[][3]={${art.spout.map(rows=>'{'+Array.from({length:3},(_,i)=>JSON.stringify(rows[i]||'')).join(',')+'}').join(',')}};
`;
const destination=new URL('../firmware/main/ocean_scenes.h',import.meta.url);
if(process.argv.includes('--check')){if(fs.readFileSync(destination,'utf8')!==header)throw Error('Run node tools/generate-scenes.mjs');}
else fs.writeFileSync(destination,header);
