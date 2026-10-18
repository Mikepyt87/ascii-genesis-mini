// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include "ocean_geometry.h"
#include "assets.h"
#include <string.h>
#define MINI_PARADE_SECONDS 6.0f
#define MINI_PARADE_INTERVAL 3.0f
#define MINI_PARADE_TOP 32
#define MINI_PARADE_NAME_ADVANCE 9
#define MINI_PARADE_NAME_HEIGHT 12
#define MINI_PARADE_COUNT (MINI_SPRITE_COUNT/2)
static inline int mini_parade_name_x(const char *name){return 300-(int)strlen(name)*MINI_PARADE_NAME_ADVANCE;}
static inline int mini_parade_name_y(int slot){return 8+(slot%2)*MINI_PARADE_NAME_HEIGHT;}

typedef struct {int order[MINI_PARADE_COUNT];float starts[MINI_PARADE_COUNT],duration;} mini_parade_t;
static inline void mini_parade_init(mini_parade_t *p){
    for(int i=0;i<MINI_PARADE_COUNT;i++)p->order[i]=i;
    p->starts[0]=0;
    for(int i=1;i<MINI_PARADE_COUNT;i++){
        int height=(mini_sprites[p->order[i-1]*2].height+mini_sprites[p->order[i]*2].height)*8;
        bool fits=height+4*MINI_BOB+MINI_GAP<=MINI_SWIM_BOTTOM-MINI_PARADE_TOP;
        p->starts[i]=p->starts[i-1]+(fits?MINI_PARADE_INTERVAL:MINI_PARADE_SECONDS);
    }
    p->duration=p->starts[MINI_PARADE_COUNT-1]+MINI_PARADE_SECONDS;
}
static inline int mini_parade_index(const mini_parade_t *p,float elapsed){int i=0;while(i+1<MINI_PARADE_COUNT&&p->starts[i+1]<=elapsed)i++;return i;}
static inline bool mini_parade_visible(const mini_parade_t *p,float elapsed,int slot){float age=elapsed-p->starts[slot];return age>=0&&age<MINI_PARADE_SECONDS;}
static inline float mini_parade_x(const mini_parade_t *p,float elapsed,int slot,int width){
    float phase=fminf(1,fmaxf(0,(elapsed-p->starts[slot]-.25f)/(MINI_PARADE_SECONDS-.5f)));
    return MINI_SAFE_X-width-2+phase*(320-2*MINI_SAFE_X+width+4);
}
static inline int mini_parade_y(int slot,int height){return slot%2?MINI_SWIM_BOTTOM-MINI_BOB-height:MINI_PARADE_TOP+MINI_BOB;}
