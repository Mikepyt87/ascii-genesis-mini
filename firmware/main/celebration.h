// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <math.h>
#include <stdbool.h>
#include <string.h>
typedef struct {bool active;int kind,target;float x,y,width,height,age;} celebration_t;
static inline int celebration_kind(const char *name){const char *names[]={"balance angelfish","steadfast marlin","spark wrasse"};for(int i=0;i<3;i++)if(!strcmp(name,names[i]))return i;return -1;}
static inline bool celebration_point(const celebration_t *e,int i,int *x,int *y,int *size,unsigned *color){
 if(!e->active||e->kind<0||e->kind>2||e->age<0||e->age>=3||i<0||i>=24)return false;
 float age=e->age,gap=14+age*2+3*sinf(i*2.4f+age*(e->kind+1)*2);
 float hw=e->width/2+gap,hh=e->height/2+gap,perimeter=4*(hw+hh),rates[]={.025f,-.02f,.05f};
 float d=fmodf(i/24.0f+age*rates[e->kind]+1,1)*perimeter,dx,dy;
 if(d<2*hw){dx=-hw+d;dy=-hh;}else if((d-=2*hw)<2*hh){dx=hw;dy=-hh+d;}
 else if((d-=2*hh)<2*hw){dx=hw-d;dy=hh;}else{d-=2*hw;dx=-hw;dy=hh-d;}
 float px=fabsf(dx)-(hw-8),py=fabsf(dy)-(hh-8);
 if(px>0&&py>0){float length=sqrtf(px*px+py*py);dx=copysignf(hw-8+px*8/length,dx);dy=copysignf(hh-8+py*8/length,dy);}
 if(age>2.55f&&i%2)return false;
 const unsigned colors[3][2]={{0x75d8ca,0xc9fff0},{0xdfb96c,0xfff1b8},{0xb79ae0,0xffc18a}};
 *x=lroundf(e->x+dx);*y=lroundf(e->y+dy);*size=age<2.1f?2:1;*color=colors[e->kind][(i+(int)(age*4))%2];return true;
}
