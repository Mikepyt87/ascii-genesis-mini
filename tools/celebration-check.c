#include <assert.h>
#include <stdio.h>
#include "../firmware/main/celebration.h"
int main(void){
    assert(celebration_kind("balance angelfish")==0);assert(celebration_kind("steadfast marlin")==1);assert(celebration_kind("spark wrasse")==2);assert(celebration_kind("reef fish")==-1);
    for(int kind=0;kind<3;kind++)for(int frame=0;frame<=60;frame++){
        celebration_t e={.active=true,.kind=kind,.x=160,.y=80,.width=120,.height=40,.age=frame*.05f};
        int count=0,sides=0;for(int i=0;i<24;i++){
            int x,y,size;unsigned color;
            if(celebration_point(&e,i,&x,&y,&size,&color)){
                assert(x>=75&&x<=245&&y>=35&&y<=125);
                assert(x<=92||x>=228||y<=52||y>=108);
                if(x<100)sides|=1;
                if(x>220)sides|=2;
                if(y<60)sides|=4;
                if(y>100)sides|=8;
                assert(size==1||size==2);assert(color>0&&color<=0xffffff);count++;
            }
        }
        assert(frame<60?count>=12&&sides==15:count==0);
    }
    puts("PASS: whole-fish stars on all four sides, clear body gap, bounds and three-second lifespan");
}

