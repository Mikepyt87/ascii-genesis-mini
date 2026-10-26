// SPDX-License-Identifier: GPL-3.0-or-later
#pragma once
#include <stdbool.h>
typedef struct {char name[13],note[321];int fish;} edition_t;
void edition_init(void);
void edition_snapshot(edition_t *out);
bool edition_save_json(const char *json);
