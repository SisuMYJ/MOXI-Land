# MOXI LAND Art Guide

This guide is the visual standard for future MOXI LAND art work. The current Phaser vector island is a safe prototype, not the final look. Future changes should move toward the reference image: a soft, glowing, detailed fairytale island with cozy buildings, layered nature, and a clear center scene.

## North star

MOXI LAND should feel like a tiny healing fairytale island floating in bright air: warm, soft, rounded, detailed, and alive. The scene should look like a small world where residents live, work, rest, and explore, not like UI buttons placed on a green map.

Keywords:

- dreamy fairytale island
- cozy forest village
- soft painterly light
- rounded shapes
- warm cream, grass green, lake blue, blossom pink, lantern yellow
- layered nature and small decorative details
- no harsh geometry, no flat admin-panel feeling

## Reference image reading

The reference image works because it has:

- A strong center: lake/waterfall/tree area anchors the whole composition.
- Natural terrain: uneven coast, cliffs, slopes, stairs, paths, and platforms.
- Varied trees: pine trees, flower trees, bushes, mushrooms, and flower beds are mixed.
- Buildings with personality: roofs, windows, warm lights, fences, flower pots, and material details.
- Soft atmosphere: clouds, glow, floating sparkles, mist, and warm sunlight.
- Lived-in layout: paths connect places, objects feel placed by daily life rather than arranged as buttons.

## Current prototype role

The current vector version is only a safe development fallback. It should:

- keep gameplay clickable;
- avoid broken generated PNGs;
- show approximate functional zones;
- stay stable enough for feature development.

Do not spend too much time polishing the fallback into final art. Use it as a layout and interaction scaffold.

## Composition standard

The map should have a clear scene hierarchy:

1. Center anchor: Star Lake should become the main visual focus, not a bottom decoration.
2. Upper area: Forest exploration should feel like a higher, deeper forest entrance.
3. Left area: Message board and resident activity should feel public and social.
4. Right area: Farm and resource/production spaces should feel practical and lively.
5. Lower area: Lantern shop and rest area can feel warm, cozy, and slightly magical.

Avoid spreading equal-sized objects evenly across a flat oval. The island should read as a place, not a menu.

## Terrain standard

The final island should avoid a perfect ellipse. Use:

- uneven island edge;
- small protruding ledges;
- soft grass platforms;
- paths between buildings;
- flower clusters and mushrooms as separators;
- water edges, stones, or small cliffs around the lake.

The terrain should create routes and zones. Empty green space should be broken up with paths, shrubs, flowers, stones, and height changes.

## Building standard

Buildings should not look like square blocks. Every building needs a silhouette and mood.

Task cottage:
- central but not huge;
- warm cream/yellow body;
- round roof or soft roofline;
- one glowing window or door;
- small steps/path leading to it.

Message board:
- should feel like a wooden notice board with posts;
- can have paper notes, tiny lanterns, or flowers;
- should not look like a house.

Farm area:
- should be open ground plus small plots/fence/tool details;
- avoid stacking a house and farm plot into one unreadable block;
- add crop rows, watering can, seed bag, or small scarecrow later.

Lantern shop:
- should be warmer and more magical than other buildings;
- use lantern glow, rounded roof, little hanging lights;
- should feel like a shop, not just another square house.

## Nature standard

Trees should create atmosphere and depth, not stand in a uniform row.

Use mixed nature elements:

- tall pine trees for forest depth;
- rounded leafy trees for cozy softness;
- blossom trees for pink/pastel highlights;
- bushes and flower beds to frame buildings;
- mushrooms and stones for detail;
- small shadows to ground objects.

Avoid repeated identical trees at equal spacing. No object should look like a pasted stamp.

## Resident standard

Residents should look like tiny living characters inside the island, not oversized stickers.

Rules:

- keep residents small enough to feel like inhabitants;
- place them near meaningful zones;
- keep name labels subtle;
- avoid labels overlapping buildings or zone titles;
- use soft idle animation, not aggressive movement.

## UI standard

UI should match the cozy storybook world.

Panel style:
- warm cream paper background;
- pale sage border;
- honey/wood buttons;
- soft green text;
- gentle rounded corners;
- subtle shadow, not heavy modal darkness.

Avoid:
- saturated pink close buttons unless softened;
- admin dashboard card feeling;
- overly large labels;
- flat pure white panels;
- harsh black text.

HUD should stay small, floating, and soft. It should not dominate the island.

## Asset pipeline standard

Generated PNGs must not be rendered directly until they pass the asset checklist.

Before enabling any PNG:

- true transparent alpha, no baked checkerboard;
- tightly cropped canvas around the object;
- no text baked into the image;
- bottom-center placement point is clear;
- consistent lighting and perspective;
- scale tested in game with neighboring objects;
- one asset enabled at a time;
- screenshot comparison after each asset.

Never enable a whole folder of generated PNGs at once.

## Code workflow standard

Use small safe changes.

Preferred order:

1. layout only;
2. vector fallback polish;
3. UI palette polish;
4. clean one PNG asset;
5. enable one PNG asset;
6. screenshot review;
7. repeat.

Avoid large mixed PRs that change store logic, daily content, visual assets, and scene layout together.

## Visual QA checklist

Before accepting any visual change, check:

- Does the island look more like a place than a menu?
- Is Star Lake or another center anchor visually clear?
- Do buildings have different personalities?
- Are trees varied and naturally placed?
- Are labels readable but not dominant?
- Are residents visible without feeling like stickers?
- Is there enough warm glow and softness?
- Are there any checkerboard artifacts or oversized image canvases?
- Does the UI feel like it belongs to the same world?
- Would this change still look good next to the reference image?

If the answer is no, keep the change small and revise before adding more features.
