# CLAUDE.md — The Order of the Hollow Moon
## A surreal gothic arcade website

---

## Project brief

Build a fully functional website called **"The Order of the Hollow Moon"** — a surreal, gothic, early-2000s arcade-game-styled experience. Think: a secret knightly order's website circa 2002, built by someone who was obsessed with both Arthurian myth and SNES-era RPGs. The aesthetic is somewhere between a Dark Souls title screen, a forgotten GeoCities shrine, and a Super Nintendo dungeon crawler.

This is not a parody. Play it straight. The surrealism is sincere.

The site consists of a **landing page** (`index.html`) and **artefact location pages** navigated via a 90s-style terminal interface.

---

## Aesthetic direction (non-negotiable)

### Palette — derive every color from this, no exceptions
```css
:root {
  --void:          #050508;   /* near-black with a blue undertone */
  --deep:          #0a0a12;   /* page background */
  --surface:       #0f0f1a;   /* card / panel surfaces */
  --surface-raise: #141420;   /* hover states, elevated elements */
  --border:        #1e1e35;   /* panel borders */
  --border-glow:   #2a2a55;   /* active / focused borders */

  --moon-silver:   #c8cfe8;   /* primary text — cool silver, not white */
  --moon-dim:      #7a82a8;   /* secondary text */
  --moon-ghost:    #3a4060;   /* muted / placeholder text */

  --gold:          #c9a84c;   /* accent: crests, important labels, CTAs */
  --gold-dim:      #7a6230;   /* dim gold for borders, disabled states */
  --crimson:       #8b1a1a;   /* danger, death, warning */
  --crimson-glow:  #c02020;   /* bright crimson for active alerts */

  --arcade-green:  #1aff6e;   /* scanline / HP bars / terminal text */
  --arcade-blue:   #4ab3ff;   /* MP bars / cooldown indicators */

  --glow-moon:  0 0 12px rgba(200, 207, 232, 0.15), 0 0 30px rgba(200, 207, 232, 0.06);
  --glow-gold:  0 0 10px rgba(201, 168, 76, 0.3),  0 0 24px rgba(201, 168, 76, 0.1);
  --glow-green: 0 0 8px  rgba(26, 255, 110, 0.4);
}
```

### Typography
- **Display / headings:** `Cinzel` (Google Fonts) — roman serif, medieval authority. Use with extreme letter-spacing (0.2em–0.4em) and gold color.
- **Body / UI text:** `Share Tech Mono` (Google Fonts) — monospace, terminal feel, keeps the arcade undercurrent.
- **Flavor / lore text:** `IM Fell English` italic (Google Fonts) — old book feel for quotes, incantations, narrative text.
- **Pixel data / stats:** `VT323` (Google Fonts) — for terminal output, stat readouts, dates, coordinates.

Load all four via a single Google Fonts `<link>`.

### Visual signature elements (must appear)
1. **Scanline overlay** — full-viewport CSS pseudo-element, `repeating-linear-gradient` horizontal lines at 3px intervals, 4% opacity. Always on top, `pointer-events: none`.
2. **Moon phase indicator** — static SVG moon glyph. Waxing crescent. Silver glow.
3. **Flickering sigil** — an SVG geometric symbol (triangle inside a circle with rune tick marks) that subtly flickers via CSS animation. Appears on the landing page hero section.
4. **Dithered dividers** — horizontal rules built from repeating `·` or `—` characters in `VT323` font, not CSS `<hr>`.

---

## Site architecture

The site is a **multi-page static site**. Navigation between pages happens exclusively through a **90s-style command-line terminal interface**.

### Pages
| File | Description |
|---|---|
| `index.html` | Landing page + Codex Terminal |
| `resting_place.html` | The Resting Place — artefact location |
| *(future pages)* | Additional artefact locations accessible via terminal commands |

---

## index.html — Landing Page + Codex Terminal

### Structure

#### 1. Pre-loader (3 seconds, then fades out)
- Full viewport, `--void` background.
- Centered text in `Cinzel`: `LOADING FRAGMENT 7 OF 9` in `--moon-ghost`.
- Below it, a pixel progress bar that fills left-to-right over 3 seconds using `--arcade-green`.
- On complete: opacity fade-out over 0.8s, then `display: none`.

#### 2. Header
- Sticky. Background: `--void` with a bottom border in `--border`.
- Left side only: the sigil SVG (24px), then site title `THE ORDER OF THE HOLLOW MOON` in `Cinzel` 13px, `--gold`, letter-spacing 0.3em.
- **No navigation links on the right.** Header is left-aligned only.

#### 3. Hero section
- Full viewport height. Background: `--deep`.
- Large centered flickering sigil SVG (160px × 160px). The sigil: an outer circle, an inner equilateral triangle, and 8 radial tick marks at the circle edge like a compass rose. All strokes `--moon-silver` at 1px. Animation: `opacity` oscillates between 0.4 and 1.0 on a 4-second ease-in-out loop, plus a very subtle `filter: brightness()` flicker on a separate 0.3s step-end loop.
- Below the sigil, the headline: `WHERE THE MOON FORGETS ITS NAME` in `Cinzel`, 52px on desktop / 28px mobile, `--moon-silver`, letter-spacing 0.25em.
- **No subtitle text.**
- Below that, a single centered button: `[ ENTER THE CODEX ]` — border `--gold`, text `--gold`, hover: background `rgba(201,168,76,0.08)`, `--glow-gold` box-shadow.
- **No "VIEW CURRENT PATROL" button.** No scroll hint. No dithered divider.

#### 4. Footer
- Background `--void`, top border `--border`.
- Left: sigil SVG (16px) + `THE ORDER OF THE HOLLOW MOON` in `Cinzel` 10px `--moon-ghost`.
- Center: `EST. MCMXCIX · REGION: UNDISCLOSED · MOON CYCLE: WANING` in `VT323` 14px `--moon-ghost`.
- Right: `[ NO HOTLINKING ] [ BEST VIEWED IN THE DARK ] [ DO NOT STEAL MY MOON ]` in `Share Tech Mono` 9px `--moon-ghost`.
- Hit counter: `VISITORS SINCE THE SECOND ANOMALY:` followed by `004,891` in `VT323` 22px `--arcade-green`.

#### 5. Codex Terminal (full-screen overlay)
- Hidden by default. Opens when user clicks `[ ENTER THE CODEX ]`.
- **Full-screen black terminal interface** styled after 90s command-line systems.
- Top bar: title `HOLLOW_MOON_CODEX v2.7.1 — NODE 7` and `[X]` close button.
- CRT scanline overlay and vignette effect via `::before` and `::after` pseudo-elements.
- **Boot sequence**: On first open, the terminal plays a line-by-line boot sequence:
  ```
  HOLLOW_MOON_CODEX v2.7.1
  ═══════════════════════════════════════
  INITIALISING SYSTEM...
  [OK] MEMORY BANKS: 7 OF 9 FRAGMENTS LOADED
  [OK] TEMPORAL INTEGRITY: UNSTABLE (ACCEPTABLE)
  [OK] MOON PHASE SYNC: WANING CRESCENT — SIGNAL NOMINAL
  [OK] CARTOGRAPHIC INDEX: 4 ARTEFACTS CATALOGUED
  [!!] ANOMALY REGISTER: 3 EVENTS THIS CYCLE
  [OK] NODE 7 CONNECTION: LATENCY ∞ms
  SYSTEM READY.
  ═══════════════════════════════════════
  Type "help" for available commands.
  ```
- After boot, an input row appears with prompt: `hollow_moon@codex:~$`
- Green text on black background (`--arcade-green` on `#000000`).
- Close via `[X]` button or `ESC` key.

### Terminal commands

| Command | Action |
|---|---|
| `help` | Lists all available commands |
| `status` | Shows system and anomaly status report |
| `access.artefact/resting_place` | Navigates to `resting_place.html` |
| `access.artefact/list` | Lists all artefact locations with access status |
| `access.artefact/mirror_hall` | ACCESS DENIED (locked) |
| `access.artefact/the_seventh_tuesday` | ACCESS DENIED (locked) |
| `access.artefact/compass_room` | ACCESS DENIED (locked) |
| `whoami` | Displays operator info (UNKNOWN, GUEST clearance) |
| `clear` | Clears terminal output |
| `exit` | Closes the terminal |
| *(any other input)* | `COMMAND NOT RECOGNISED` error in crimson |

---

## resting_place.html — The Resting Place

An artefact location page. Reached via `access.artefact/resting_place` terminal command.

### Structure

#### 1. Page transition overlay
- Full-screen black overlay with terminal-style text:
  ```
  RESOLVING COORDINATES...
  TEMPORAL ANCHOR: STABLE
  ARRIVING AT: THE RESTING PLACE
  ```
- Fades out after 1.8 seconds.

#### 2. Header
- Same as index.html header but with a `[ ← RETURN TO CODEX ]` button on the right side.

#### 3. Location header
- Classification line: `ARTEFACT LOCATION · CLASS II · SECTOR 7-NORTH` in `VT323`.
- Title: `THE RESTING PLACE` in `Cinzel`, large.
- Coordinates: `COORDINATES: 51°28'38"N ∞°∞'∞"W · DEPTH: VARIABLE · DISCOVERED: MCMXCIX`.

#### 4. Moon visual
- Centered waning crescent moon SVG with breathing opacity animation.

#### 5. Content sections
- **Field Report**: Lore text describing the Resting Place in surreal Gothic tone.
- **Environmental Readings**: 2×2 stat grid (Ambient Temperature, Temporal Stability, Anomaly Frequency, Empty Chairs Detected).
- **Memorial Register**: 4 knight entries with statuses (RESTING/RETURNED/LOST), names, titles, epitaphs, and dates.
- **Ambient Observation**: Closing poetic text about the empty chair.

#### 6. Footer
- Simplified footer with location reference.

---

## Removed features

The following features from the original design have been **intentionally removed**:
- Header navigation links (CODEX, KNIGHTS, THE VOID, RELICS, GUESTBOOK)
- Hero subtitle text
- "VIEW CURRENT PATROL" button
- Scroll hint and dithered divider below hero buttons
- Codex dispatches section
- Knight Roster / Profile section
- Commune with the Void terminal section
- Relics catalogue section
- Guestbook section

All navigation now happens through the **Codex Terminal** command interface.

---

## Animations & interactions

| Element | Animation |
|---|---|
| Pre-loader bar | CSS `width` keyframe 0→100% over 3s, linear |
| Sigil (hero) | `opacity` 0.4↔1.0, 4s ease-in-out infinite + `brightness` flicker 0.3s step-end infinite |
| Terminal boot | Lines appear sequentially with staggered delays |
| Terminal output | Lines written one at a time with 60ms delay between lines |
| Button hover | `box-shadow` + `background` transition 0.2s |
| Scanlines | Static overlay, no animation |
| Moon SVG (resting place) | `opacity` 0.4↔0.7, 6s ease-in-out infinite |
| Page transition | Opacity fade-out over 1.2s |

Use `@media (prefers-reduced-motion: reduce)` to disable all keyframe animations (keep transitions ≤0.1s).

---

## Technical constraints

- **No frameworks.** No React, Vue, jQuery, Bootstrap. Vanilla HTML/CSS/JS only.
- **No npm, no build step.** Open any `.html` file in a browser and it works.
- **Fonts:** Load via one `<link>` tag: `Cinzel`, `Share Tech Mono`, `IM Fell English`, `VT323` from Google Fonts.
- **Responsive:** Works at 375px (mobile) and 1280px (desktop). Use CSS Grid and `clamp()` for fluid type.
- **No images.** All visuals are SVG or CSS. No `<img>` tags.
- **Sharp corners everywhere.** `border-radius: 0` is the global default.
- **Scrollbar styling:** Custom scrollbar. Track: `--void`. Thumb: `--border-glow`. Width 6px.
- **Embedded styles/scripts.** Each HTML page is self-contained with embedded `<style>` and `<script>` tags.

---

## File structure

```
Website/
├── CLAUDE.md          ← This file (project spec)
├── index.html         ← Landing page + Codex Terminal
└── resting_place.html ← The Resting Place (artefact location)
```

---

## Adding new artefact pages

To add a new accessible location:
1. Create a new `.html` file following the `resting_place.html` pattern.
2. Add a terminal command entry in `index.html`'s `commands` object.
3. Remove it from the `lockedArtefacts` array if it was previously locked.
4. Update the `access.artefact/list` command output.
