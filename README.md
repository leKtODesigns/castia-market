# Castia Market (GitHub Pages)

## File layout

This project is now split into multiple files:

- `index.html`
- `assets/css/styles.css`
- `assets/js/app.js`
- `assets/images/items/_placeholder.svg`

## GitHub Pages path rules (important)

When hosting on GitHub Pages (especially a **repo site** like `https://user.github.io/<repo>/`), avoid absolute URLs like:

- `/assets/js/app.js`  ❌ (breaks on repo sites)

Use **relative** paths instead (what this repo uses):

- `./assets/js/app.js` ✅
- `./assets/css/styles.css` ✅

## Card-view item images (optional)

Card view will attempt to load an image from:

### Preferred structure (categorized)

The UI now looks for images in a categorized layout first:

- `assets/images/items/<category>/<slug>.png`
- `assets/images/items/set-gear/<set>/<slug>.png` (only when `setName` exists)

Examples:

- `assets/images/items/set-gear/daydream/daydream-sword.png`
- `assets/images/items/utility/spawner-spinner.png`
- `assets/images/items/resource/mithril-essence.png`

### Legacy structure (still supported)

If the categorized file doesn’t exist, it will fall back to:

`assets/images/items/<slug>.png`

If it doesn't exist, it falls back to:

`assets/images/items/_placeholder.svg`

### How the `<slug>` is generated

From the `price_data.key` (raw key):

- removes tier suffix like `|t3`
- removes trailing skill bracket like ` [smelting]`
- lowercases
- replaces non-alphanumeric with `-`

Example:

- `Manticore Elytra|t2` → `manticore-elytra.png`
- `Christmas Cap [Smelting]` → `christmas-cap.png`

> Misc category items intentionally do not render images.
