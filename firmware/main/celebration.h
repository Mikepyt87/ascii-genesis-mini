// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <math.h>
#include <stdbool.h>
#include <string.h>
typedef struct {bool active;int kind;float x,y,age;} celebration_t;
static inline int celebration_kind(const char *name){const char *names[]={"balance angelfish","steadfast marlin","spark wrasse"};for(int i=0;i<3;i++)if(!strcmp(name,names[i]))return i;return -1;}
static inline bool celebration_point(const celebration_t *e,int i,int *x,int *y,int *size,unsigned *color){
 if(!e->active||e->age<0||e->age>=3||i<0||i>=20)return false;
 float age=e->age,a=i*6.28318530718f/20,spread=8+age*12,dx,dy;
 if(e->kind==0){dx=cosf(a+age*.6f)*spread;dy=sinf(a+age*.6f)*spread*.65f;}
 else if(e->kind==1){float fan=-3.14159265359f+.25f+i*(3.14159265359f-.5f)/19;dx=cosf(fan)*spread;dy=sinf(fan)*spread+age*age*3;}
 else{float spiral=a+age*2;dx=cosf(spiral)*spread*(.45f+.55f*i/19);dy=sinf(spiral)*spread*(.45f+.55f*i/19);}
 if(age>2.55f&&i%2)return false;
 const unsigned colors[3][2]={{0x75d8ca,0xc9fff0},{0xdfb96c,0xfff1b8},{0xb79ae0,0xffc18a}};
 if(e->kind<0||e->kind>2)return false;
 *x=lroundf(e->x+dx);*y=lroundf(e->y+dy);*size=age<2.1f?2:1;*color=colors[e->kind][i%2];return true;
}
