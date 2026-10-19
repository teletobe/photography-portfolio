# photography-portfolio

Source for [tobi.cam](https://tobi.cam). Plain HTML/CSS/JS, hosted on Vercel.

The old pixel-art version still lives at `/darkroom`.

## Photos

Photos go in `media/`, one folder per section. Number prefixes set the order and don't show up on the site. A folder with subfolders becomes a set of collections; a folder with only images opens straight into the photos.

`build-data.js` turns the folder structure into `data.js`. It runs on every deploy, and `npm run dev` reruns it whenever `media/` or the config changes. To run it by hand:

```
npm run build
```

## Layout

`clouds.config.js` picks which photos show up in each section and where they sit, separately for desktop and mobile. Anything not listed falls back to defaults.

To place them by hand, run `npm run dev` and open `localhost:3000/?arrange`. Drag, scroll to resize, shift + scroll for depth; changes are written to the config as you go. Use a narrow window for the mobile layout. This only works locally; `tools/` isn't deployed.
