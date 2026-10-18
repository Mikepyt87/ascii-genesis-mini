// SPDX-License-Identifier: GPL-3.0-or-later
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include "../firmware/main/parade.h"
int main(void){
    // The native waterline must stop above even a fractional swimmer lane.
    assert(mini_surface_limit(64,25.9f)==13);
    assert(mini_surface_limit(-12,25.9f)==-12);
    assert(mini_surface_limit(64,100)==64);
    for(int y=23;y<MINI_SWIM_BOTTOM;y++)for(int water=-12;water<=64;water++)
        assert(mini_surface_limit(water,y)+8<=y-MINI_BOB);
    mini_parade_t p;mini_parade_init(&p);
    assert(MINI_PARADE_SECONDS==6);assert(MINI_PARADE_INTERVAL==3);
    assert(p.duration>=87&&p.duration<224);
    for(int i=0;i<MINI_PARADE_COUNT;i++){
        assert(p.order[i]==i);const mini_sprite_t *s=&mini_sprites[i*2];int width=s->width*6,height=s->height*8;
        assert(s->name&&s->name[0]);assert(mini_parade_name_x(s->name)>=20+12*6+8);
        assert(mini_parade_name_y(i)>=MINI_SAFE_Y);
        assert(mini_parade_name_y(i)+MINI_PARADE_NAME_HEIGHT<=MINI_PARADE_TOP);
        float start=p.starts[i],end=start+MINI_PARADE_SECONDS-.001f;
        assert(mini_parade_index(&p,start)==i);
        assert(mini_parade_x(&p,start,i,width)+width<MINI_SAFE_X);
        assert(mini_parade_x(&p,start+3,i,width)>=MINI_SAFE_X);
        assert(mini_parade_x(&p,start+3,i,width)+width<=320-MINI_SAFE_X);
        assert(mini_parade_x(&p,end,i,width)>320-MINI_SAFE_X);
        int y=mini_parade_y(i,height);assert(y-MINI_BOB>=MINI_PARADE_TOP&&(s->bottom||y+height+MINI_BOB<=MINI_SWIM_BOTTOM));
    }
    int bottom_count=0;
    for(int art=0;art<MINI_SPRITE_COUNT;art++)if(mini_sprites[art].bottom){
        bottom_count++;const mini_sprite_t *s=&mini_sprites[art];
        for(int x=-s->width*6;x<=320;x+=3)for(int scroll=0;scroll<528;scroll+=11){
            int y=mini_bottom_y(art,x,scroll),contacts=0;
            assert(y>=MINI_SWIM_BOTTOM+4-s->height*8);
            for(int col=0;col<s->width;col++)if(s->feet[col]>=0){int ground=mini_ground_y(x+col*6+2+scroll);
                assert(y+s->feet[col]<=ground);if(y+s->feet[col]==ground)contacts++;
            }
            assert(contacts>0);
        }
    }
    assert(bottom_count==8);
    int pair_frames=0;
    for(float t=0;t<p.duration;t+=.05f){
        int count=0,slots[2]={0};
        for(int i=0;i<MINI_PARADE_COUNT;i++)if(mini_parade_visible(&p,t,i)){assert(count<2);slots[count++]=i;}
        assert(count>=1&&count<=2);
        if(count==2){int a=slots[0],b=slots[1],ha=mini_sprites[p.order[a]*2].height*8,hb=mini_sprites[p.order[b]*2].height*8;
            assert(mini_bands_clear(mini_parade_y(a,ha),ha,mini_parade_y(b,hb),hb));pair_frames++;}
    }
    assert(pair_frames>0);
    for(int i=0;i<MINI_PARADE_COUNT;i++)assert(!mini_parade_visible(&p,p.duration,i));
    printf("PASS: ordered named parade, %.0f seconds, faster crossings, up to two safe bands, complete arrivals and exits\n",p.duration);
}
