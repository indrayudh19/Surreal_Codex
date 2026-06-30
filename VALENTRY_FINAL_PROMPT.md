# BUILD TASK — Vale Entry: The Knight's Descent (Final Implementation)
## A 2D arcade platformer with real sprite assets, accessed via Codex command `access.quest/valentry`

---

## Status: assets are already acquired — do not search for or download anything

All required art assets have already been sourced and placed in `/assets/`. Your job is implementation only: inspect what's there, wire it into a working Phaser game, and integrate it with the existing site. Do not attempt to fetch, generate, or substitute any additional assets unless something is genuinely missing after inspection (see Step 1).

---

## STEP 1 — Inspect the asset folder before writing any game code

Run this first, in order, before touching `valentry.html`:

1. List the full contents of `/assets/knight/`, `/assets/enemies/goblin/`, `/assets/enemies/skeleton/`, and `/assets/tiles/`.
2. For each PNG found, open it (use the `view` tool — these are images, view them visually, don't just read file sizes) and note: approximate pixel dimensions, whether it's a single sprite or a multi-frame horizontal/vertical sprite sheet, and how many frames it appears to contain.
3. Specifically for `/assets/tiles/Dungeon Tile Set.png` (or equivalent dungeon tileset file): visually confirm the tile grid size. This pack is known to ship as a single flat PNG without embedded grid metadata — you must determine the cell size (most likely 16×16) by visual inspection before writing any tilemap slicing code. Count tile boundaries in the image directly. Do not assume a grid size without confirming it against the actual image.
4. For the knight sprite sheets specifically: note that this asset pack (Fantasy Knight by aamatniekss) has a known quirk where some animation frames are not perfectly centered in their canvas — frames may include extra padding on one side, particularly for the attack animation. When you set up Phaser sprite origins, check each animation visually after first implementation; if the knight visibly shifts position when an animation changes (e.g. jitering sideways when switching from idle to attack), adjust the sprite's origin point per-animation rather than assuming uniform centering across all states.
5. Confirm which color/outline variant of the knight is present (only one should be in the folder — if you find multiple variants mixed together, ask before proceeding rather than guessing which to use).
6. Write a short summary of what you found — exact filenames, frame counts, tile dimensions — before proceeding to Step 2. This summary prevents wasted work from misreading a sprite sheet's layout.

If any expected asset is missing or a PNG fails to open, stop and report this rather than substituting a placeholder shape — the entire point of this build is real pixel art, not procedural fallbacks.

---

## STEP 2 — Tech stack

- **Engine: Phaser 3**, loaded via CDN, no build step:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
  ```
- **Why Phaser:** this game needs real gravity, jump arcs, sprite-sheet frame animation, and tile collision — Phaser's Arcade Physics system handles all of this natively. Do not hand-roll physics or collision detection in raw canvas.
- **Single page:** `valentry.html`, Phaser canvas mounted inside it, embedded `<style>` for the HTML chrome around the canvas (HUD, borders, page background).
- **Shared state:** `vigil.js` — reuse if it already exists in the project from earlier work; create it now using the schema in Step 6 if it doesn't exist yet.
- **No additional asset downloads.** Everything needed is already in `/assets/`.

---

## STEP 3 — Game design

### Genre and feel
A real side-scrolling arcade combat platformer. The knight moves through a single dungeon level, fights a sequence of enemies, and reaches a final door to win. This is closer to a classic side-scrolling beat-em-up/platformer hybrid (think early Castlevania stage structure) than an open-ended exploration game — linear, combat-focused, arcade-paced.

### Controls
- **Move left/right:** Arrow keys or A/D. Use acceleration/deceleration (not instant velocity snap) so movement has weight — this is a knight in armor, not a sprinter.
- **Jump:** Spacebar or Up arrow. Single jump only, governed by Phaser Arcade Physics gravity. Tune the jump velocity so the arc feels deliberate and controlled, not floaty or twitchy.
- **Attack:** A dedicated key (`Z` or `J` — pick one and document it on-screen in the HUD). Triggers an attack animation frame sequence and opens a short-lived hitbox in front of the knight (whichever direction it's currently facing). Use Phaser's overlap detection for the hitbox against enemy sprites — pixel-perfect collision is unnecessary here.
- **Attack cooldown:** the attack animation must finish (or a short ~400ms cooldown applies) before another attack registers. This stops button-mash spam and makes each swing read as a deliberate action, which matters more for "arcade feel" than raw responsiveness.
- Display the control scheme in a small always-visible HUD strip (e.g. `← → MOVE   SPACE JUMP   Z ATTACK`) in `VT323` font, so the game is playable without external instructions.

### Level layout
- Build the level using the dungeon tileset, with the confirmed grid size from Step 1.
- Single horizontal level: solid ground throughout most of the path, with at least 2–3 elevation changes or gaps requiring a jump to keep traversal from feeling flat.
- Use the tileset's stone wall, brick, and decorative tiles (chains, bars, crates — whatever the pack includes per your Step 1 inventory) to dress the level so it reads as a dungeon corridor, not a bare platform test.
- Place a door/gate tile or sprite from the tileset at the far end of the level as the win condition target — if the dungeon pack includes a door sprite, use it; if not, use the most "gate-like" tile available (e.g. a barred/grated tile) rather than fabricating a new graphic.
- Camera follows the knight horizontally (`this.cameras.main.startFollow(knight)`), level scrolls as the knight advances.

### Enemy spawning and combat
- Both enemy types (goblin and skeleton) appear in this level — use both for visual variety rather than repeating one type.
- **A few enemies must be defeated to win** — implement this as a fixed enemy count for the level (target: 4–5 total enemies spread across the path, mixing both types) rather than infinitely spawning enemies. An arcade level with a clear, finite challenge reads better than an endless gauntlet.
- Each enemy has a patrol behavior: moves back and forth within a short fixed range near its spawn point, flips direction at the range boundary. No pathfinding needed.
- When the knight's attack hitbox overlaps an enemy during the attack animation, the enemy takes damage, flashes or plays its hurt animation, and on HP reaching 0, plays its death animation then is removed.
- When an enemy's hitbox touches the knight (and the knight is not actively attacking that enemy), the knight takes damage and is knocked back slightly. Brief invulnerability window (~500ms) after taking a hit so the knight doesn't take repeated damage in a single collision.
- Track defeated-enemy count. Display remaining enemy count in the HUD (e.g. `ENEMIES REMAINING: 3`).
- The door/gate at the level's end should remain closed or simply non-functional until all required enemies are defeated — either lock it programmatically (overlap check does nothing until the kill count is met) or, if simpler to implement reliably, allow reaching it but require the enemy count to hit zero before the victory sequence triggers.

### HP/MP and defeat handling
- Reuse the existing site's HP bar styling (from the Knight Profile section built earlier) as an HTML/CSS overlay on top of the Phaser canvas — do not rebuild this as in-canvas Phaser UI.
- HP persists via `vigil.js` (see Step 6) — read on level load, write on every change.
- If HP reaches 0: do not hard-fail. Respawn the knight at the level start with HP restored to 50%. Enemies already defeated stay defeated — don't reset progress on death, only position and HP. This keeps the game fair rather than punishing.

### Victory condition
Reaching the door/gate after all enemies are defeated triggers:
1. Pause the Phaser scene.
2. Show a full-screen victory overlay matching the site's existing visual language: `Cinzel` headline (e.g. `THE GATE REMEMBERS YOU`), gold glow, consistent with prior victory-state work on this site.
3. Write `the_vale_compass` into `vigil.inventory` (check for duplicates — don't grant it twice on replay).
4. Add `valentry_descent` to `vigil.questsCompleted`.
5. Set `vigil.valentry.completed = true`.
6. Show a `[ RETURN TO THE CODEX ]` button that navigates back to the Codex terminal page.
7. If the player has already completed this quest (`vigil.valentry.completed === true` on load), still allow replaying the level in full, but skip granting duplicate inventory/quest entries — only log the replay in `vigil.valentry.encounterLog`.

---

## STEP 4 — Visual integration with the rest of the site

- Let the sprite art render as-is — pixel art at its native style. Do not attempt to recolor or filter the knight/enemy/tile sprites to match the site's green/gold palette; this tends to look broken rather than stylish.
- Apply `image-rendering: pixelated;` to the canvas element so sprites stay crisp when scaled, rather than blurring.
- The **frame around the canvas** carries the site's identity: page background `--void`, a bordered frame around the canvas in `--gold` or `--border-accent` (whichever is the established accent on this site), all HUD text in `VT323`/`Share Tech Mono`.
- Reuse the site's existing scanline overlay CSS (`body::after`) on this page too, for visual continuity.
- The page should not look like a separate embedded app — frame it as another "room" of the same site.

---

## STEP 5 — Codex integration

Locate the existing terminal command handler in the Codex page (wherever other `access.*` commands are parsed) and add this command, matching the existing terminal's print/typewriter style exactly — do not introduce a different reveal animation:

```javascript
if (command.trim().toLowerCase() === 'access.quest/valentry') {
  printToTerminal('> ACCESSING VALE ENTRY PROTOCOL...');
  printToTerminal('> THE GROUND BENEATH THE CODEX BEGINS TO SOFTEN.');
  setTimeout(() => { window.location.href = 'valentry.html'; }, 1200);
  return;
}
```

If the terminal's actual print function has a different name or signature than `printToTerminal`, adapt to match what's already in the codebase rather than introducing a parallel system.

---

## STEP 6 — Shared persistence (`vigil.js`)

Check whether `vigil.js` already exists in the project root from earlier work on this site. If it does, use it as-is and do not modify its schema. If it does not exist, create it now:

```javascript
const VIGIL_KEY = 'hollowMoonVigil';

function getVigil() {
  const raw = localStorage.getItem(VIGIL_KEY);
  if (!raw) {
    const fresh = {
      knightName: 'Unnamed Knight',
      hp: 100, maxHp: 100,
      mp: 50, maxMp: 50,
      inventory: [],
      codexFragments: [],
      questsCompleted: [],
      valentry: { started: false, completed: false, encounterLog: [] },
      lastVisit: new Date().toISOString()
    };
    localStorage.setItem(VIGIL_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(raw);
}

function saveVigil(vigil) {
  vigil.lastVisit = new Date().toISOString();
  localStorage.setItem(VIGIL_KEY, JSON.stringify(vigil));
}
```

Every HP change, inventory update, and quest-completion event during gameplay must read via `getVigil()` and write via `saveVigil(vigil)` — no other storage mechanism.

### Resumability
If `vigil.valentry.started === true` and `vigil.valentry.completed === false` on page load, this is a returning mid-run player — for this arcade-style level (unlike a persistent exploration map), it's acceptable to simply restart the level fresh from the beginning rather than reconstruct exact enemy/position state, since arcade levels are short and meant to be replayed. Just preserve HP from vigil rather than always resetting to full, so a previous session's damage still matters. Set `started = true` on first entry to the level.

---

## What to build, in order

1. Inspect all assets per Step 1 and write the findings summary. Do not skip this.
2. Set up `valentry.html`: head, Phaser CDN script, canvas mount, site CSS variables and scanline overlay for visual continuity, HUD HTML structure (HP bar, enemy counter, control hints).
3. Create or confirm `vigil.js`.
4. Load and test each sprite sheet in a minimal Phaser preload/create cycle — confirm frame width/height assumptions are correct before building full animations. If frame slicing looks wrong when first rendered (stretched, cut off, wrong frame showing), stop and recheck dimensions rather than proceeding with broken animations.
5. Build the knight: idle/run/jump/attack/hurt animation states wired to Phaser's animation system, keyboard-controlled, with Arcade Physics gravity and tilemap collision. Verify visually that the sprite doesn't jitter or shift between animation states (per the centering note in Step 1) — fix sprite origin per-animation if it does.
6. Build the level tilemap from the dungeon tileset using the confirmed grid size — ground, walls, at least one jump gap, decorative dungeon elements, door/gate at the end.
7. Add camera follow.
8. Add both enemy types (goblin, skeleton) with patrol behavior, hurt/death animations, and combat overlap logic against the knight's attack hitbox and the knight's own hurtbox.
9. Implement the fixed enemy count win condition — track defeats, gate the door behind clearing all enemies.
10. Wire HP to the existing CSS HP bar component and to `vigil.js`.
11. Implement defeat/respawn handling (HP 0 → respawn at 50% HP, defeated enemies stay defeated).
12. Implement the victory overlay and `vigil` writes.
13. Wire the Codex terminal command.
14. Full playtest: enter from Codex → move/jump/attack → defeat each enemy type → take damage → die once and confirm respawn behavior → defeat remaining enemies → reach the gate → confirm victory overlay and inventory write → return to Codex → re-enter the quest and confirm replay works without duplicate inventory grants.

Do not leave any animation state, enemy type, or game mechanic stubbed or partially implemented. If something from this spec turns out to be impossible given the actual asset contents discovered in Step 1, report exactly what's missing and what you propose instead, rather than silently shipping a degraded version.
