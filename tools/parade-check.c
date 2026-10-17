#include <assert.h>
#include <stdio.h>
#include "../firmware/main/assets.h"
#include "../firmware/main/parade.h"
int main(void){
    assert(mini_font['_'*5]&0x40);
    for(int i=0;i<MINI_SPRITE_COUNT/2;i++){
        const mini_sprite_t *s=&mini_sprites[i*2];int width=s->width*6,height=s->height*8;
        float start=i*MINI_PARADE_SECONDS,mid=start+MINI_PARADE_SECONDS/2,end=start+MINI_PARADE_SECONDS-.001f;
        assert(mini_parade_index(start)==i);
        assert(mini_parade_x(start,width)+width<MINI_SAFE_X);
        assert(mini_parade_x(mid,width)>=MINI_SAFE_X);
        assert(mini_parade_x(mid,width)+width<=320-MINI_SAFE_X);
        assert(mini_parade_x(end,width)>320-MINI_SAFE_X);
        int y=mini_parade_y(height);assert(y-MINI_BOB>=20&&y+height+MINI_BOB<=MINI_SWIM_BOTTOM);
    }
    assert(mini_parade_index(MINI_PARADE_SECONDS*MINI_SPRITE_COUNT/2)==MINI_SPRITE_COUNT/2);
    puts("PASS: every parade design enters, fits, fully exits, and clears header/seabed; exact duration");
}
