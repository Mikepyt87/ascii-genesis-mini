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
static inline int mini_parade_y(int slot,int height){
    if(mini_sprites[slot*2].bottom)return MINI_SWIM_BOTTOM+4-height;
    bool neighbor=(slot>0&&mini_sprites[(slot-1)*2].bottom)||(slot+1<MINI_PARADE_COUNT&&mini_sprites[(slot+1)*2].bottom);
    return neighbor||slot%2==0?MINI_PARADE_TOP+MINI_BOB:MINI_SWIM_BOTTOM-MINI_BOB-height;
}
static inline int mini_bottom_y(int art,float x,float scroll){
    const mini_sprite_t *s=&mini_sprites[art];int top=10000;
    for(int col=0;col<s->width;col++)if(s->feet[col]>=0){int y=mini_ground_y(roundf(x)+col*6+2+scroll)-s->feet[col];if(y<top)top=y;}
    return top;
}
static inline void mini_parade_init(mini_parade_t *p){
    for(int i=0;i<MINI_PARADE_COUNT;i++)p->order[i]=i;
    p->starts[0]=0;
    for(int i=1;i<MINI_PARADE_COUNT;i++){
        int a=mini_sprites[(i-1)*2].height*8,b=mini_sprites[i*2].height*8;
        bool fits=mini_bands_clear(mini_parade_y(i-1,a),a,mini_parade_y(i,b),b);
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

