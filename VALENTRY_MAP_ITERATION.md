# ITERATION TASK — Vale Entry: Map & Enemy Complexity Pass
## Expand the dungeon map, add ladder traversal, and increase skeleton enemy depth

---

## Context — what is already working (do not touch)

The following systems are confirmed working and must not be regressed:

- Knight movement: left/right run with acceleration/deceleration, single jump, physics gravity
- Knight animations: idle, run, jump, attack, hurt — all correctly wired to Phaser animation states
- Attack hitbox and enemy damage detection via Phaser overlap
- HP persistence via `vigil.js` / `localStorage`
- Codex terminal command `access.quest/valentry` → navigates to `valentry.html`
- Victory condition trigger (door/gate + kill count)
- Respawn on HP 0 at 50% HP

**Do not refactor, rewrite, or touch any of the above systems unless a specific collision with new ladder logic requires a targeted, minimal adjustment — in which case, document exactly what changed and why.**

Read the existing `valentry.html` fully before writing a single line of new code. Understand the current scene structure, tilemap layers, physics groups, and animation keys before adding anything. Appending without reading is how you break working systems.

---

## STEP 1 — Inspect the dungeon tileset again before designing the new map

Open and visually examine `assets/tiles/Dungeon Tile Set.png` (or whatever the confirmed dungeon tileset file is in `/assets/tiles/`).

Catalog every distinct tile type present in the sheet. Specifically identify and note the grid coordinates or indices of:
- Ground/floor tiles (solid, walkable)
- Wall tiles (left wall, right wall, corner pieces)
- Ceiling tiles
- **Ladder tiles** — if a ladder tile exists in this sheet, confirm its index and note whether it is one tile tall or designed to stack vertically. If no ladder tile exists, identify the closest alternative (a chain tile, a rope tile, a climbable-surface tile) — this pack is documented to include chains and bars, which are valid ladder replacements visually.
- Platform tiles (if any — shorter blocks usable as elevated platforms separate from full ground)
- Decorative/non-collidable tiles (torch, skull, crate, barrel, broken pillar — any dressing elements)
- Door/gate tiles

Write this catalog out explicitly before proceeding to map design. Do not assume tile indices from memory or prior sessions.

---

## STEP 2 — Inspect the skeleton asset folder

Open and examine all PNGs in `/assets/enemies/skeleton/`. Catalog:
- Every animation state available (idle, walk, attack, hurt, death — confirm which states actually exist as files)
- Frame count per animation (count frames in each sprite sheet)
- Approximate pixel dimensions per frame

This matters because the behavioral archetypes defined below must only use animation states that actually exist in the asset folder. Do not reference an animation state (e.g. a "throw" or "block" state) that isn't present in the files.

---

## STEP 3 — New map design

### Design principles
- The current map is a single flat horizontal corridor. This iteration must introduce **vertical traversal** — multiple elevation levels connected by ladders (or chain/rope equivalents from the tileset).
- The map should feel like a dungeon that someone actually built, not a test level. Use wall tiles, ceiling tiles, and decorative elements (torches, skulls, crates, broken pillars — whatever the tileset provides) to make rooms and corridors feel inhabited.
- Physics must remain meaningful — every platform, ledge, and gap should require a deliberate player decision (jump this gap, climb this ladder, drop down here).
- Keep total map length reasonable for a single arcade run — approximately 2.5–3x the current map width, with vertical height adding the sense of scale rather than just making the horizontal run longer.

### Required structural elements

**Three distinct elevation tiers minimum:**
- Ground level (existing)
- Mid level: reached by ladders from ground, or by jumping from elevated platforms
- Upper level: reached by ladders from mid-level or by precise jumps from mid-level

Not every part of the level needs all three tiers — use them to create interesting routing, not as a rigid grid.

**Ladders / climbable elements:**
Implement real ladder climbing mechanics using the confirmed ladder or chain tile from the tileset:
- Ladders are placed as a separate tilemap layer (non-solid collision layer, overlap-only detection)
- When the knight overlaps a ladder tile and the player presses Up/W, enter climb state: gravity disabled, vertical velocity driven by input (Up = ascend, Down = descend, or simply Up = climb up and no input = hold position)
- When the player presses jump while on a ladder, exit climb state and apply normal jump physics
- Knight must play an appropriate animation during climbing — if a dedicated climb animation exists in the asset folder use it; if not, use the idle animation at reduced playback rate (0.5x) rather than playing a visually wrong animation like the attack cycle
- Ladder exit at the top: when the knight reaches the top of a ladder tile stack and no more ladder tiles exist above, automatically transition back to normal ground movement
- Ladder entry: the knight can only enter a ladder from directly in front of it (standing on the ground tile adjacent and pressing Up), not by falling through one from above — enforce this with an overlap check that only activates climb state when the knight's vertical velocity is zero or near-zero (i.e. not mid-fall)

**Gaps and jump challenges:**
Minimum 4 gaps in the level requiring a jump to cross. At least one gap should be positioned such that falling into it costs the knight meaningful HP (not instant death — consistent with the existing respawn design, but a fall should hurt, e.g. 20 HP damage on landing in a pit, implemented as a kill zone trigger at the bottom of the level that applies damage and teleports the knight back to the nearest safe ground tile).

**Rooms and corridors:**
Use wall and ceiling tiles to define at least 2 enclosed or semi-enclosed room spaces. A room doesn't need to be fully sealed — an entrance gap and a low ceiling is enough to create the feeling of a distinct space. Place skeleton spawns preferentially inside or just outside these rooms so combat happens in constrained space rather than open air.

**Decorative dressing:**
Distribute decorative tiles (torches, skulls, crates, broken columns — whatever the tileset catalog from Step 1 confirms is available) throughout the level. These should be on a separate non-collidable visual layer, not the physics collision layer. Density should feel lived-in but not cluttered — roughly every 3–5 tiles of wall or floor should have at least one decorative element nearby.

**Door/gate placement:**
The victory door remains at the far end of the level. If the new map has vertical structure, place the door at the top of the final climb (upper tier), not at ground level — reaching it should feel earned through full traversal of the map, not just a horizontal dash.

---

## STEP 4 — Skeleton enemy archetypes

Use only the skeleton sprites in `/assets/enemies/skeleton/`. No other enemy type. Differentiate enemy behavior through AI parameters, not art — same sprite, meaningfully different encounter feel.

Implement exactly three skeleton archetypes. Spawn a mix of all three across the level:

### Archetype A — The Patrol Skeleton (existing behavior, tuned)
- Patrols a fixed range as currently implemented
- Patrol range: medium (~200px either side of spawn)
- Walk speed: moderate
- Attack range: melee only, attacks when knight enters ~60px
- HP: 40
- Damage dealt: 10 per hit
- Spawn count in new map: 3

### Archetype B — The Sentry Skeleton
- Does not patrol. Stands completely still (plays idle animation) until the knight enters an aggro range (~250px)
- On aggro: immediately starts moving toward the knight at a faster-than-patrol walk speed, does not return to origin — once aggroed, it pursues until death
- Attack range: melee, ~60px, attacks faster than Archetype A (shorter attack cooldown, ~600ms vs ~900ms)
- HP: 30 (less HP, more aggressive)
- Damage dealt: 12 per hit
- Spawn count: 2, placed in room/corridor chokepoints where the surprise aggro matters
- Visual distinction from Archetype A: none needed at the sprite level — the behavioral difference (standing still then suddenly moving) is the tell

### Archetype C — The Heavy Skeleton
- Patrols a short range (~100px either side of spawn) very slowly
- Takes noticeably more hits to kill — HP: 70
- Hits the knight harder: 18 damage per hit
- Has a brief windup before attacking (play hurt/react animation frame as a visual telegraph for ~400ms before the damage actually registers) so the player has a readable dodge window
- Moves too slowly to chase effectively — mostly a terrain-control enemy, placed to guard ladders or gate doorways
- Spawn count: 2

**Total required enemy count:** 7 skeletons minimum across the full map (3 + 2 + 2). Victory condition: all 7 defeated before the door becomes interactive. Update the kill counter HUD accordingly.

**Enemy placement rules:**
- Never place an enemy directly on the starting platform within the first screen width — give the player one uncontested moment to orient
- Sentries (Archetype B) must be placed in positions where the player is likely to approach from a fixed direction (end of a corridor, top of a ladder), so the aggro behavior creates a meaningful surprise
- Heavy Skeletons (Archetype C) should guard chokepoints: ladder bases, narrow platforms, doorway tiles

---

## STEP 5 — Physics and collision layer structure

The tilemap must use at minimum **three separate layers**:

1. **Background layer** — decorative tiles only, no collision, rendered behind everything
2. **Collision layer** — ground, platforms, walls, ceilings — this is what Phaser's Arcade Physics collides against. Set `setCollisionByExclusion([-1])` or equivalent on this layer only
3. **Ladder layer** — ladder/chain/rope tiles, overlap-only (no solid collision), used for climb-state detection. This must NOT be a collision layer — if it is, the knight will be blocked by ladder tiles rather than entering them

Camera and world bounds must be updated to match the new, larger map dimensions. If the map grows vertically, update the camera's world bounds accordingly so the camera follows the knight vertically as well as horizontally.

**Pit/fall damage:**
Add a thin invisible physics body or zone at the y-position below the lowest ground level. When the knight overlaps this zone: apply 20 HP damage (write to vigil immediately), play the hurt animation, and set the knight's position to the nearest safe spawn point above (predefine 3–4 safe respawn positions distributed across the map for this purpose). This is not a death/game-over trigger — consistent with existing forgiving-failure design.

---

## STEP 6 — HUD updates

The existing HUD shows HP bar and enemy counter. Update it:

- Enemy counter label changes from `ENEMIES REMAINING` to `SKELETONS REMAINING` (minor, but keeps lore consistency)
- Add a second line below the counter: the current map zone/area name, displayed in `VT323` as a flavor label (e.g. `ZONE: THE HOLLOW DESCENT`, `ZONE: THE UPPER CRYPTS`) — this updates as the knight moves into different vertical tiers. Use a simple threshold check on the knight's current Y position to determine the zone name. This costs almost nothing to implement and significantly improves the sense that the map has meaningful distinct areas
- Control hint strip: add `↑ CLIMB` to the existing control hint display, since ladder mechanics are new

---

## What to build, in order

1. Run Step 1 (tileset catalog) and Step 2 (skeleton animation catalog) — write findings summary.
2. Design the new tilemap layout on paper/comment before implementing — define the grid coordinates of major structural elements (ground level extent, platform positions, ladder column positions, room boundaries, enemy spawn points, door position). Document this in a comment block at the top of the Phaser scene's `create()` method.
3. Implement the new Tilemap with all three layers (background, collision, ladder). Load it and verify layer collision setup before adding any gameplay code.
4. Update world and camera bounds.
5. Implement ladder climb mechanics — test independently before adding enemies. Confirm: entering ladder from ground, ascending, descending, exiting at top, jumping off mid-climb.
6. Add pit damage zone.
7. Implement the three skeleton archetypes as distinct Phaser enemy classes or factory functions (not copy-pasted duplicated code — use a factory pattern or class extension so the shared behavior [hurt, death animation, damage dealing] lives in one place and only the parameters differ).
8. Place all 7 enemies at their defined spawn positions.
9. Update kill counter to 7, update victory condition.
10. Update HUD zone display.
11. Playtest full critical path: spawn → navigate first tier → climb ladder → navigate mid tier → fight Sentry skeleton → climb second ladder → fight Heavy skeleton guarding top → reach door → victory. Also test fall damage and confirm vigil HP writes correctly on pit fall.

---

## Failure modes to explicitly avoid

- **Do not define ladder collision as a solid layer.** This is the single most common Phaser ladder implementation mistake and results in the knight being blocked by ladder tiles instead of climbing them. Ladder tiles must be overlap/trigger only.
- **Do not copy-paste enemy code three times.** Use a factory function or class pattern. Three separate copy-paste enemy implementations will diverge immediately under any future modification.
- **Do not resize the canvas without updating world bounds and camera bounds.** If the map grows and the camera bounds don't, the camera will stop following at the old boundary and the player will move off-screen.
- **Do not break vigil.js HP persistence.** Every HP change (enemy hit, pit fall, respawn) must write to vigil immediately, not just at victory/defeat. A page refresh mid-level should restore the correct HP, not reset to 100.
- **Do not remove the existing working knight physics/animation code.** If ladder climb state requires temporarily disabling gravity, use `knight.body.setGravityY(-scene.physics.world.gravity.y)` (local override) rather than modifying the world gravity, so normal gravity resumes cleanly when climb state exits.
