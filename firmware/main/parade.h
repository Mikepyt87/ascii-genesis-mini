// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include "ocean_geometry.h"
#define MINI_PARADE_SECONDS 8.0f
static inline int mini_parade_index(float elapsed) {return (int)(elapsed/MINI_PARADE_SECONDS);}
static inline float mini_parade_x(float elapsed,int width) {
    float phase=fminf(1,fmaxf(0,(fmodf(elapsed,MINI_PARADE_SECONDS)-.25f)/(MINI_PARADE_SECONDS-.5f)));
    return MINI_SAFE_X-width-2+phase*(320-2*MINI_SAFE_X+width+4);
}
static inline int mini_parade_y(int height) {return MINI_SWIM_TOP+(MINI_SWIM_BOTTOM-MINI_BOB-MINI_SWIM_TOP-height)/2;}
