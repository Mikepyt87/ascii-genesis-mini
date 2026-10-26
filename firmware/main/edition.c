// SPDX-License-Identifier: GPL-3.0-or-later
#include "edition.h"
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "nvs.h"
#include "cJSON.h"
static edition_t current;
static SemaphoreHandle_t guard;
static bool plain(const char *s,size_t limit){
    if(!s||!s[0]||strlen(s)>limit)return false;
    for(;*s;s++)if((unsigned char)*s<32||(unsigned char)*s>126)return false;
    return true;
}
static bool note_fits(const char *at){
    for(int row=0;row<8&&*at;row++){
        int len=strlen(at);if(len>46){len=46;while(len>0&&at[len]!=' ')len--;if(!len)len=46;}
        at+=len;while(*at==' ')at++;
    }
    return !*at;
}
void edition_init(void){
    guard=xSemaphoreCreateMutex();configASSERT(guard);
    nvs_handle_t h;edition_t loaded={0};size_t size=sizeof(loaded);
    if(nvs_open("gift_edition",NVS_READONLY,&h)==ESP_OK){
        if(nvs_get_blob(h,"profile",&loaded,&size)==ESP_OK&&size==sizeof(loaded)&&
           memchr(loaded.name,0,sizeof(loaded.name))&&memchr(loaded.note,0,sizeof(loaded.note))&&
           plain(loaded.name,12)&&plain(loaded.note,320)&&note_fits(loaded.note)&&loaded.fish>=0&&loaded.fish<3)current=loaded;
        nvs_close(h);
    }
}
void edition_snapshot(edition_t *out){xSemaphoreTake(guard,portMAX_DELAY);*out=current;xSemaphoreGive(guard);}
bool edition_save_json(const char *json){
    cJSON *o=cJSON_ParseWithOpts(json,NULL,true);if(!o)return false;
    const cJSON *name=cJSON_GetObjectItemCaseSensitive(o,"name"),*note=cJSON_GetObjectItemCaseSensitive(o,"dedication"),*fish=cJSON_GetObjectItemCaseSensitive(o,"fish");
    bool okay=cJSON_IsObject(o)&&cJSON_IsString(name)&&cJSON_IsString(note)&&cJSON_IsNumber(fish)&&
        plain(name->valuestring,12)&&plain(note->valuestring,320)&&note_fits(note->valuestring)&&fish->valuedouble==fish->valueint&&fish->valueint>=0&&fish->valueint<3;
    edition_t next={0};
    if(okay){strlcpy(next.name,name->valuestring,sizeof(next.name));strlcpy(next.note,note->valuestring,sizeof(next.note));next.fish=fish->valueint;}
    cJSON_Delete(o);if(!okay)return false;
    nvs_handle_t h;if(nvs_open("gift_edition",NVS_READWRITE,&h)!=ESP_OK)return false;
    esp_err_t err=nvs_set_blob(h,"profile",&next,sizeof(next));if(err==ESP_OK)err=nvs_commit(h);nvs_close(h);
    if(err!=ESP_OK)return false;
    xSemaphoreTake(guard,portMAX_DELAY);current=next;xSemaphoreGive(guard);return true;
}
