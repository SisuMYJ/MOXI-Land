# Vector Polish Notes

This branch keeps generated PNGs out of the live Phaser scene for now.

- Generated PNGs remain in `public/assets/generated/` as reference files.
- `src/content/visualAssets.ts` does not mark generated scene objects as usable yet.
- Buildings, residents, and farm plots use Phaser vector fallback rendering.
- Gameplay logic is unchanged.

Next pass: clean the image alpha/crop first, then re-enable one asset at a time and tune scale/origin from screenshots.
