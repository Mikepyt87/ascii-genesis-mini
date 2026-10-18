// SPDX-License-Identifier: GPL-3.0-or-later
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include "../firmware/main/parade.h"
int main(void){
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
        int y=mini_parade_y(i,height);assert(y-MINI_BOB>=MINI_PARADE_TOP&&y+height+MINI_BOB<=MINI_SWIM_BOTTOM);
    }
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
