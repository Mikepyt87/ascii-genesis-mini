#include <assert.h>
#include <stdio.h>
#include "../firmware/main/celebration.h"
int main(void){
    assert(celebration_kind("balance angelfish")==0);
    assert(celebration_kind("steadfast marlin")==1);
    assert(celebration_kind("spark wrasse")==2);
    assert(celebration_kind("reef fish")==-1);
    for(int kind=0;kind<3;kind++)for(int frame=0;frame<=60;frame++){
        celebration_t e={.active=true,.kind=kind,.x=44,.y=70,.age=frame*.05f};
        int count=0;for(int i=0;i<20;i++){
            int x,y,size;unsigned color;
            if(celebration_point(&e,i,&x,&y,&size,&color)){
                assert(x>=-1&&x<=89&&y>=25&&y<=115);
                assert(size==1||size==2);assert(color>0&&color<=0xffffff);count++;
            }
        }
        assert(frame<60?count>=10:count==0);
    }
    puts("PASS: three native entrance effects, bounded particles, lifespan and size");
}
