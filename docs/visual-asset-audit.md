# Visual Asset Audit

Generated files in `public/assets/generated/` were reviewed before wiring them into the Phaser island scene.

## Blocked assets

The following PNGs should **not** be rendered in-game yet because they contain a baked checkerboard transparency preview and/or excessive transparent padding. They need to be regenerated or cleaned so the alpha channel is truly transparent.

- `cloud-01.png`
- `cloud-02.png`
- `dango-rabbit.png`
- `deer-lamp.png`
- `farm-plot.png`
- `foko-fox.png`
- `forest-gate.png`
- `lantern-shop.png`
- `lumo.png`
- `message-board.png`
- `mist-cat.png`
- `slow-bear.png`
- `starlight-lake.png`
- `task-cottage.png`
- `tree-01.png`

## Reference-only assets

- `style-reference.png` — useful for style direction, but not an in-game object.

## Regeneration notes

When regenerating or exporting replacements, use:

- true transparent PNG alpha, not a checkerboard preview baked into pixels;
- tightly cropped bounds around the object;
- consistent warm forest-fairytale lighting;
- bottom-center object alignment so Phaser can place depth by y-position;
- no text baked into object images, because labels are rendered by the game.
