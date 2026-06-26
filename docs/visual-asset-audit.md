# Visual Asset Audit

This file lists assets under `public/assets/generated/` and marks any that contain baked checkerboard transparency or are reference-only.

Summary:

- cloud-01.png: usable
- cloud-02.png: usable
- dango-rabbit.png: usable
- deer-lamp.png: usable
- farm-plot.png: usable
- foko-fox.png: usable
- forest-gate.png: usable
- lantern-shop.png: usable
- lumo.png: reference-only (small UI sprite)
- message-board.png: usable
- mist-cat.png: usable
- slow-bear.png: usable
- starlight-lake.png: usable
- style-reference.png: reference-only (design guide)
- task-cottage.png: usable
- tree-01.png: usable

Notes:
- Assets marked "usable" were visually checked. None showed a clear baked checkerboard pattern in the visible preview. If any asset contains subtle tiled transparency, regenerate the asset without visible checkerboard.
- `lumo.png` and `style-reference.png` are intended as reference and not used directly by the scene.

Action items:
- If designers find checkerboard artifacts, replace the problematic PNG(s) and update this audit.
