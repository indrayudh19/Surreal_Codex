const fs = require('fs');

const assets = {
  'dungeon_tiles': 'assets/titles/Dungeon Tile Set/Dungeon Tile Set/Dungeon Tile Set.png',
  'kn_idle': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Idle.png',
  'kn_run': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Run.png',
  'kn_jump': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Jump.png',
  'kn_fall': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Fall.png',
  'kn_attack': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Attack.png',
  'kn_attack2': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Attack2.png',
  'kn_hit': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Hit.png',
  'kn_death': 'assets/knight/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Death.png',
  'sk_idle': 'assets/enemies/Skeleton Sprite Pack/Skeleton/Sprite Sheets/Skeleton Idle.png',
  'sk_walk': 'assets/enemies/Skeleton Sprite Pack/Skeleton/Sprite Sheets/Skeleton Walk.png',
  'sk_attack': 'assets/enemies/Skeleton Sprite Pack/Skeleton/Sprite Sheets/Skeleton Attack.png',
  'sk_hit': 'assets/enemies/Skeleton Sprite Pack/Skeleton/Sprite Sheets/Skeleton Hit.png',
  'sk_dead': 'assets/enemies/Skeleton Sprite Pack/Skeleton/Sprite Sheets/Skeleton Dead.png',
  'gob_attack': 'assets/enemies/Monster_Creatures_Fantasy(Version 1.2)/Monster_Creatures_Fantasy(Version 1.2)/Goblin/Attack2.png'
};

let output = 'const BASE64_ASSETS = {\n';
for (const [key, path] of Object.entries(assets)) {
  const data = fs.readFileSync(path);
  const base64 = data.toString('base64');
  output += `  '${key}': 'data:image/png;base64,${base64}',\n`;
}
output += '};\n';

fs.writeFileSync('base64_assets.js', output);
console.log('Saved to base64_assets.js');
