# SKG PBD Adventure V9 — Six Worlds True 3D

Babylon.js + Vite. **All six levels have different playable mechanics**.

## Deploy Vercel
1. Extract ZIP. Upload all extracted files (not the ZIP) to a NEW GitHub repository.
2. Import repository at vercel.com/new. Framework: Vite. Build: `npm run build`. Output: `dist`. Root: `./`.
3. Do not upload an older index.html or main.js. Both files belong in the repository root.

## Play
A/D or arrows = move, Space = jump, X/J = shoot; touchscreen buttons also work.
TP1 double-jump and collect stars. TP2 dodge falling fire and cross checkpoints. TP3 shoot targets. TP4 defeat moving slimes. TP5 collect growth mushroom and smash rocks. TP6 shoot dragon and dodge fire. Reach the far-right portal area after finishing the goal, then answer two English questions.

## Records
Records are stored locally in this browser (localStorage). CSV export available. No Google Sheets integration in this build. In-game TP level is NOT an official PBD mastery assessment. A teacher must validate official TP.

## Notes
Characters are built from 3D meshes. The four skins share a mesh silhouette, not unique professional 3D models. Browser performance depends on GPU.
