# The Engine and the Pitch

Long-form essay: swimming and deep-water running as soccer endurance *conditioners*, not as substitutes for pitch running. First-principles physiology, sourced numbers only. Visual edition: full-bleed hero, D3 figures, print fallback tables.

## View locally

No build step. From this directory:

```bash
python3 -m http.server 8080
```

Then open [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

Or open `index.html` directly in a browser. Charts load [D3 v7 from jsDelivr](https://cdn.jsdelivr.net/npm/d3@7); they need a network connection for that script. Image paths are relative (`img/…`).

## Files

| Path | Role |
| --- | --- |
| `index.html` | Essay, chart slots, fallback tables |
| `styles.css` | Deep navy / chlorinated aqua / turf green |
| `viz.js` | Seven D3 charts (resize with `ResizeObserver`) |
| `img/hero-engine-pitch.png` | Hero still |
| `img/buoyancy-depths.png` | Buoyancy still |

GitHub Pages should serve the repository root (`index.html`).

Every kilometre, bpm, and week-count is from a fetched paper or FIFA/UEFA page. Unverified claims are labelled. Not a session plan for a player in the 8–10 range. Privacy-scrubbed: no family names.
