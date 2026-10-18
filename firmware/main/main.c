// SPDX-License-Identifier: GPL-3.0-or-later
#include <math.h>
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_app_desc.h"
#include "esp_heap_caps.h"
#include "esp_ota_ops.h"
#include "esp_psram.h"
#include "esp_random.h"
#include "esp_task_wdt.h"
#include "esp_timer.h"
#include "nvs_flash.h"
#include "board.h"
#include "network.h"
#include "assets.h"
#include "ocean_geometry.h"
#include "parade.h"
#include "ocean_scenes.h"
static uint16_t *fb;
static float time_s,controls_until=8;
static bool paused;
static bool parade_active;
static float parade_elapsed;
static mini_parade_t parade_plan;
static int screen; // 0 ocean, 1 settings, 2 phone setup
typedef struct {int art,dir;float x,y,speed,phase;bool active;} swimmer_t;
static swimmer_t fish[3];
static int pending_art=-1,pending_dir;
static uint32_t scene_seed;
static float bubble_x[2],bubble_y[2],next_bubble;
static bool bubble_active[2];
static int scene_water_top(void);
static int scene_surface_y(void);
static int scene_arrival_top(void);
static uint16_t rgb(unsigned c){return ((c>>8)&0xf800)|((c>>5)&0x07e0)|((c>>3)&31);}
static void pixel(int x,int y,uint16_t c){if(mini_content_pixel(x,y))fb[y*320+x]=c;}
static void rect(int x,int y,int w,int h,uint16_t c){for(int j=y;j<y+h;j++)for(int i=x;i<x+w;i++)pixel(i,j,c);}
static void glyph(char ch,int x,int y,uint16_t c){unsigned n=(unsigned char)ch;if(n<32||n>126)return;for(int col=0;col<5;col++)for(int row=0;row<8;row++)if(mini_font[n*5+col]&(1<<row))pixel(x+col,y+row,c);}
static void text(const char *s,int x,int y,uint16_t c){for(int i=0;s[i]&&x+i*6<320;i++)glyph(s[i],x+i*6,y,c);}
static void text_large(const char *s,int x,int y,uint16_t c){
    for(int i=0;s[i]&&x+i*12<320;i++){unsigned n=(unsigned char)s[i];if(n<32||n>126)continue;
        for(int col=0;col<5;col++)for(int row=0;row<8;row++)if(mini_font[n*5+col]&(1<<row))rect(x+i*12+col*2,y+row*2,2,2,c);}
}
// Nearest-neighbor 3:2 bitmap scaling keeps the two labels above the swimmers.
static void text_parade(const char *s,int x,int y,uint16_t c){
    for(int i=0;s[i];i++){unsigned n=(unsigned char)s[i];if(n<32||n>126)continue;
        for(int col=0;col<8;col++)for(int row=0;row<MINI_PARADE_NAME_HEIGHT;row++)
            if(mini_font[n*5+col*2/3]&(1<<(row*2/3)))pixel(x+i*MINI_PARADE_NAME_ADVANCE+col,y+row,c);}
}
static float rnd(void){return (float)(esp_random()&65535)/65536.0f;}
static void spawn(int slot,int index,int dir,float x,float y){fish[slot]=(swimmer_t){.art=(index&~1)+(dir<0),.dir=dir,.x=x,.y=y,.speed=9+rnd()*9,.phase=rnd()*6.28f,.active=true};}
static int free_y(int height);
static void new_world(void){
    scene_seed=esp_random();time_s=rnd()*270;pending_art=-1;parade_active=false;parade_elapsed=0;memset(fish,0,sizeof(fish));
    for(int slot=0;slot<3;slot++){
        int first=esp_random()%(MINI_SPRITE_COUNT/2),band=(MINI_SWIM_BOTTOM-MINI_SWIM_TOP)/3;
        for(int attempt=0;attempt<MINI_SPRITE_COUNT/2;attempt++){
            int art=((first+attempt)%(MINI_SPRITE_COUNT/2))*2,height=mini_sprites[art].height*8;
            int room=band-height-2*MINI_BOB-MINI_GAP,y=room>=0?MINI_SWIM_TOP+slot*band+MINI_BOB+(int)(rnd()*(room+1)):-1;
            if(y>=0){int dir=rnd()<.5f?-1:1;float width=mini_sprites[art].width*6;spawn(slot,art,dir,MINI_SAFE_X+rnd()*(320-2*MINI_SAFE_X-width),y);break;}
        }
    }
    memset(bubble_active,0,sizeof(bubble_active));next_bubble=time_s+5+rnd()*5;paused=false;
}
static void toggle_parade(void){parade_active=!parade_active;parade_elapsed=0;if(parade_active)mini_parade_init(&parade_plan);}
static int free_y(int height){
    int chosen=-1,count=0;
    for(int y=(int)fmaxf(scene_water_top(),scene_arrival_top());mini_band_fits(y,height);y++){
        bool clear=true;
        for(int i=0;i<3;i++)if(fish[i].active&&!mini_bands_clear(y,height,fish[i].y,mini_sprites[fish[i].art].height*8)){clear=false;break;}
        if(clear&&esp_random()%(++count)==0)chosen=y;
    }
    return chosen;
}
static void simulate(float dt){
    if(paused)return;
    if(parade_active){parade_elapsed+=dt;if(parade_elapsed>=parade_plan.duration)parade_active=false;return;}
    time_s+=dt;
    for(int i=0;i<3;i++){
        swimmer_t *f=&fish[i];if(!f->active)continue;f->x+=f->dir*f->speed*dt;const mini_sprite_t *s=&mini_sprites[f->art];
        if(f->x>328||f->x+s->width*6<-8)f->active=false;
    }
    for(int i=0;i<3;i++)if(!fish[i].active){
        if(pending_art<0){pending_art=(esp_random()%(MINI_SPRITE_COUNT/2))*2;pending_dir=rnd()<.5f?-1:1;}
        const mini_sprite_t *a=&mini_sprites[pending_art];int y=free_y(a->height*8);
        if(y>=0){spawn(i,pending_art,pending_dir,pending_dir>0?-a->width*6-2:322,y);pending_art=-1;}
        break;
    }
    if(time_s>=next_bubble){
        for(int b=0;b<2;b++)if(!bubble_active[b]){
            int emitter=esp_random()%3;swimmer_t *f=&fish[emitter];
            if(f->active){const mini_sprite_t *a=&mini_sprites[f->art];bubble_x[b]=f->x+(f->dir>0?a->width*6:0);bubble_y[b]=f->y+a->height*3;}
            else{bubble_x[b]=30+rnd()*260;bubble_y[b]=mini_ground_y(bubble_x[b]+time_s*MINI_SCROLL_SPEED)-12;}
            bubble_active[b]=bubble_x[b]>12&&bubble_x[b]<308;break;
        }
        next_bubble=time_s+7+rnd()*5;
    }
    for(int i=0;i<2;i++)if(bubble_active[i]){bubble_y[i]-=dt*7;bubble_x[i]-=dt*.7f;if(bubble_y[i]<scene_water_top()||bubble_x[i]<12)bubble_active[i]=false;}
}
static void draw_swimmer(int art,float x,float y,float clock,float phase){
    const mini_sprite_t *s=&mini_sprites[art];int bob=lroundf(sinf(clock*.55f+phase)*2);
    for(int r=0;r<s->height;r++)for(int col=0;s->rows[r][col];col++){
        char ch=s->rows[r][col];if(ch==' ')continue;
        int m=col<(int)strlen(s->masks[r])?s->masks[r][col]-'1':0;if(m<0||m>6)m=0;
        int py=lroundf(y)+r*8+bob;if(py>=20)glyph(ch,lroundf(x)+col*6,py,rgb(s->palette[m]));
    }
}

static int scene_desired_y(void){ocean_scene_t s=scene_at(time_s,scene_seed);return lroundf(-12+76*s.surface);}
static int scene_surface_y(void){
    int water=scene_desired_y();
    for(int i=0;i<3;i++)if(fish[i].active)water=mini_surface_limit(water,fish[i].y);
    return water;
}
static int scene_arrival_top(void){return (int)fmaxf(MINI_SWIM_TOP,scene_desired_y()+12);}
static int scene_water_top(void){return (int)fmaxf(MINI_SWIM_TOP,scene_surface_y()+12);}
static void scene_rows(const char *const *rows,int count,int x,int y,uint16_t color){for(int i=0;i<count;i++)text(rows[i],x,y+i*8,color);}
static void draw_scene_landmarks(float scroll){
    for(int slot=(int)floorf((scroll-300)/900)-1;slot*900<scroll+320;slot++){
        uint32_t h=scene_hash(slot,scene_seed);float wx=slot*900+160+h%240;int x=mini_screen_x(wx,scroll);
        if(x>320||x+78<0)continue;
        const char *const *rows=h%2?scene_castleSmall:scene_ruinsSmall;int count=h%2?4:3;
        int ground=mini_ground_y(wx);for(int dx=6;dx<=78;dx+=6){int y=mini_ground_y(wx+dx);if(y<ground)ground=y;}
        if(ground-count*8-2<(MINI_SWIM_BOTTOM+27)*2/3)continue;
        scene_rows(rows,count,x,ground-count*8-2,rgb(h%2?0x6f8290:0x687c78));
    }
}
static void draw_scene_surface(void){
    ocean_scene_t s=scene_at(time_s,scene_seed);int water=scene_surface_y();
    if(water<20)return;
    rect(12,20,296,water-12,rgb(0x081723));
    for(int x=12;x<308;x+=6)glyph(sinf(time_s*1.2f+x*.06f)>0?'~':'_',x,water,rgb(0x508d9f));
    if(s.kind<0||water<52)return;
    int width=s.kind==0?72:s.kind==1?84:(int)strlen(scene_monster[2])*6;
    int x=lroundf(-width+s.progress*(320+width));
    if(s.kind==0)scene_rows(scene_boat,4,x,water-24,rgb(0xc8b68f));
    else if(s.kind==1){
        float lift=scene_smooth(s.progress*6)*scene_smooth((1-s.progress)*6);
        int y=water-8+(int)((1-lift)*32);scene_rows(scene_whale,4,x,y,rgb(0x82a9bb));
        float p=fmodf(s.progress*30,11);if(lift>.95f&&p>=3&&p<6.2f){int frame=(int)((p-3)/.8f);if(frame>3)frame=3;scene_rows(scene_spout[frame],3,x+12,y-24,rgb(0xa3d8e5));}
    }else scene_rows((int)(s.progress*30/.6f)%2?scene_monsterAlt:scene_monster,5,x,water-32,rgb(0x8fb68b));
}

static void draw_ocean(bool controls){
    const uint16_t pale=rgb(0xbde9e6),muted=rgb(0x54858d),sand=rgb(0x80715a);
    for(int i=0;i<320*172;i++)fb[i]=rgb(0x020c14);
    static const char *habitats[]={"KELP MEADOW","ROCKY REEF","OPEN SAND","CORAL GARDEN","SEAGRASS BED","WRECK DEPTHS"};
    if(parade_active){
        char counter[24];snprintf(counter,sizeof(counter),"PARADE %d/%d",mini_parade_index(&parade_plan,parade_elapsed)+1,MINI_PARADE_COUNT);text(counter,20,8,pale);
        for(int slot=0;slot<MINI_PARADE_COUNT;slot++)if(mini_parade_visible(&parade_plan,parade_elapsed,slot)){
            const char *name=mini_sprites[parade_plan.order[slot]*2].name;text_parade(name,mini_parade_name_x(name),mini_parade_name_y(slot),pale);
        }
    }else{text("ASCII GENESIS - MINI",20,8,pale);const char *habitat=habitats[((int)(time_s/45))%6];text(habitat,300-strlen(habitat)*6,8,muted);}
    float scroll=time_s*MINI_SCROLL_SPEED;
    for(int i=(int)floorf(scroll/6)-1;i*6<scroll+326;i++){float world_x=i*6;int x=mini_screen_x(world_x,scroll),ground=mini_ground_y(world_x);glyph(i%4==0?':':'.',x,ground+1,sand);glyph('_',x,ground-6,sand);}
    for(int p=(int)floorf((scroll-22)/57)-1;p*57+22<scroll+332;p++){
        float world_x=p*57+22;int x=mini_screen_x(world_x,scroll),ground=mini_ground_y(world_x),height=2+((p%3+3)%3);
        for(int row=0;row<height;row++){int sway=row==0?0:lroundf(sinf(time_s*.7f+row+p)*2*row/(height-1));glyph(row==0?'|':row%2?')':'(',x+sway,ground-row*8-6,rgb(0x56ab91));
            if(((int)(time_s/45))%6==3&&row==1)text("\\|/",x-6,ground-14,rgb(0xcd8d99));}
    }
    if(((int)(time_s/45))%6==1||((int)(time_s/45))%6==5)for(int rock=(int)floorf((scroll-82)/233)-1;rock*233+82<scroll+320;rock++){float world_x=rock*233+82;text("/__\\",mini_screen_x(world_x,scroll),mini_ground_y(world_x)-6,muted);}
    if(!parade_active){draw_scene_landmarks(scroll);draw_scene_surface();
        for(int i=0;i<2;i++)if(bubble_active[i])glyph(bubble_y[i]<scene_water_top()+20?'.':'o',bubble_x[i],bubble_y[i],muted);
    }
    if(parade_active){for(int slot=0;slot<MINI_PARADE_COUNT;slot++)if(mini_parade_visible(&parade_plan,parade_elapsed,slot)){int art=parade_plan.order[slot]*2;const mini_sprite_t *s=&mini_sprites[art];draw_swimmer(art,mini_parade_x(&parade_plan,parade_elapsed,slot,s->width*6),mini_parade_y(slot,s->height*8),parade_elapsed,0);}}
    else for(int i=0;i<3;i++){swimmer_t *f=&fish[i];if(f->active)draw_swimmer(f->art,f->x,f->y,time_s,f->phase);}
    if(controls){rect(0,140,320,32,rgb(0x102631));text(paused?"RESUME":"PAUSE",34,153,pale);text("NEW WORLD",96,153,pale);text(parade_active?"RETURN":"PARADE",179,153,pale);text("SETTINGS",247,153,pale);}
}
static void draw_settings(net_status_t *n){
    const uint16_t c=rgb(0xbde9e6),m=rgb(0x73c9ff);char line[54];
    for(int i=0;i<320*172;i++)fb[i]=rgb(0x020c14);
    if(screen==2){text("CONNECT WITH YOUR PHONE",20,8,c);if(n->setup){text("Join this Wi-Fi network:",20,24,c);text_large(n->ap_name,20,40,m);text("Password:",20,64,c);text_large(n->ap_password,20,78,m);text("Open http://192.168.4.1",20,108,c);text("Setup closes after 10 minutes",20,124,c);}else text(n->message,20,44,c);}
    else {text("SETTINGS",20,8,c);snprintf(line,sizeof(line),"v%s  %s",esp_app_get_description()->version,n->online?"Wi-Fi online":"Offline");text(line,20,22,m);text(n->message,20,38,c);
      rect(0,58,320,32,rgb(0x102631));text("SET UP WI-FI WITH PHONE",20,70,c);
      rect(0,98,320,32,rgb(0x102631));
      if(n->busy){snprintf(line,sizeof(line),"PLEASE WAIT  %d%%",n->progress);text(line,20,110,c);}
      else if(n->available){snprintf(line,sizeof(line),"INSTALL v%s & RESTART",n->version);text(line,20,110,c);}
      else text("CHECK FOR UPDATES",20,110,c);
    }
    rect(0,140,320,32,rgb(0x102631));text("BACK TO OCEAN",118,153,c);
}
void app_main(void){
    esp_err_t err=nvs_flash_init();if(err==ESP_ERR_NVS_NO_FREE_PAGES||err==ESP_ERR_NVS_NEW_VERSION_FOUND){ESP_ERROR_CHECK(nvs_flash_erase());err=nvs_flash_init();}ESP_ERROR_CHECK(err);
    fb=heap_caps_malloc(320*172*2,MALLOC_CAP_SPIRAM);assert(fb&&esp_psram_is_initialized());
    board_init();network_start();new_world();
    ESP_ERROR_CHECK(esp_task_wdt_add(NULL));
    int64_t start=esp_timer_get_time(),last=start,last_press=0;bool held=false,validated=false;
    while(true){int64_t now=esp_timer_get_time();float dt=fminf((now-last)/1000000.0f,.1f);last=now;simulate(dt);float uptime=(now-start)/1000000.0f;
        net_status_t n;network_status(&n);int x,y;bool pressed=board_touch(&x,&y);
        if(pressed&&!held&&now-last_press>350000){last_press=now;
            if(screen){if(y>=140){if(n.setup)network_command(NET_CLOSE_SETUP);screen=0;}else if(!n.busy&&screen==1){if(y>=58&&y<90){network_command(NET_SETUP);screen=2;}else if(y>=98&&y<130)network_command(n.available?NET_INSTALL:NET_CHECK);}}
            else if((uptime<controls_until||paused)&&y>=140){if(x<86)paused=!paused;else if(x<160)new_world();else if(x<234)toggle_parade();else screen=1;}
            controls_until=uptime+8;
        }
        held=pressed;
        if(screen)draw_settings(&n);else draw_ocean(uptime<controls_until||paused);
        board_frame(fb);ESP_ERROR_CHECK(esp_task_wdt_reset());
        // A new image is accepted only after display transfers, touch probe, PSRAM and the running loop succeed.
        if(!validated&&uptime>=30){esp_ota_img_states_t state;const esp_partition_t *p=esp_ota_get_running_partition();if(esp_ota_get_state_partition(p,&state)==ESP_OK&&state==ESP_OTA_IMG_PENDING_VERIFY)ESP_ERROR_CHECK(esp_ota_mark_app_valid_cancel_rollback());validated=true;}
        vTaskDelay(pdMS_TO_TICKS(80));
    }
}
