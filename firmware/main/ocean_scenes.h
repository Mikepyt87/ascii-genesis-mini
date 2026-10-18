// SPDX-License-Identifier: GPL-3.0-or-later
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
static const char *scene_castle[]={"  []     []","  ||  ^  ||"," /__\\/ \\/__\\"," |  | []|  |"," |[]|   |[]|","_|__|_n_|__|_"};
static const char *scene_castleSmall[]={" []  ^  []"," || / \\ ||"," |[]|n|[]|","_|__|_|__|_"};
static const char *scene_ruins[]={" []       _"," ||   [] | |","/  \\__||_|_|","|_n_|____n__|"};
static const char *scene_ruinsSmall[]={" []    _"," || []| |","_|n_||n_|_"};
static const char *scene_boat[]={"      |","     /|\\","    /_|_\\"," \\________/"};
static const char *scene_whale[]={"      __..__","  ___/      \\","~\\__    o   _)","    \\_______/"};
static const char *scene_monster[]={"                                ____","          __                   / o  \\","        /    \\       _       /  ____ >"," _     |  __  |    /   \\     |  |","| \\____|  ||  |___|     |____|  |"};
static const char *scene_monsterAlt[]={"                                ____","                       __      / o  \\","          _          /    \\  /  ____ >","  _     /   \\      |  __  |  |  |"," | \\___|     |_____|  ||  |__|  |"};
static const char *scene_spout[][3]={{"      :","",""},{"     . .","     -:-","      :"},{"    .   .","   .- : -.","      :"},{"   .     .","  ;       ;",""}};
