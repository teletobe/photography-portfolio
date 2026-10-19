// Which photos appear as "clouds", and where.
// After editing, run `node build-data.js` (Vercel runs it on every deploy).
//
// Folder names are written without their number prefix:
//   media/02 Outdoors/01 Mountains/berg46.jpg  →  "Mountains/berg46.jpg" inside the Outdoors section
// Anything not listed here is picked automatically (the first photo).

module.exports = {
  // ── the 360 room ────────────────────────────────────────────────────────
  // Two sets: desktop, and mobile for screens narrower than 700px or upright
  // (taller than wide, e.g. tablets held upright). Each has
  // one list per section; the first photo is the main one you fly into.
  // Positions are on a fixed-shape canvas (16:9 on desktop, 9:16 on
  // mobile) that scales with the window, so a layout holds at any window size.
  //   x, y   where the centre of the cloud sits, in % of the canvas (50, 50 = middle)
  //   size   how wide it is, in % of the canvas width (portrait photos are
  //          drawn a bit narrower automatically)
  //   depth  how far it floats in front of the others (0–120); gives a bit of
  //          parallax while turning
  // Leave out x / y / size and the cloud is placed automatically. A section
  // missing from mobile gets a squeezed version of its desktop layout.
  // Easiest way to get the numbers: open the page with ?arrange and drag
  // (for mobile, use a narrow window, e.g. Chrome's device toolbar ⌘⇧M).
  room: {
    desktop: {
      Portfolio: [
        { photo: "pf19.jpg", x: 58, y: 71, size: 48 },
        { photo: "pf94.jpg", x: 64, y: 40, size: 30, depth: 60 },
        { photo: "pf6.jpg", x: 37, y: 51, size: 38, depth: 40 },
      ],
      Outdoors: [
        { photo: "Mountains/berg46.jpg", x: 67, y: 33, size: 36 },
        { photo: "Bike/gravel16.jpg", x: 35, y: 39, size: 40, depth: 60 },
        { photo: "Mountains/berg27.jpg", x: 55, y: 65, size: 46, depth: 40 },
      ],
      Events: [
        { photo: "Wedding/wed0.jpg", x: 53, y: 65, size: 50 },
        {
          photo: "Good Times Gravel/gtg13.jpg",
          x: 74,
          y: 42,
          size: 30,
          depth: 60,
        },
        {
          photo: "Good Times Gravel/gtg8.jpg",
          x: 36,
          y: 38,
          size: 34,
          depth: 50,
        },
      ],
      Travel: [
        { photo: "Iceland 2025/ice17.jpg", x: 51, y: 43, size: 44 },
        { photo: "Paris/cover.jpg", x: 73, y: 38, size: 24, depth: 60 },
        {
          photo: "Winter in Wien/cover.jpg",
          x: 33,
          y: 68,
          size: 22,
          depth: 40,
        },
        { photo: "Tenerife/cover.jpg", x: 67, y: 69, size: 21, depth: 80 },
      ],
      "Street & People": [
        { photo: "Street/street6.jpg", x: 60, y: 57, size: 48 },
        {
          photo: "Portraits/portrait15.jpg",
          x: 74,
          y: 35,
          size: 26,
          depth: 60,
        },
        { photo: "Artsy/art14.jpg", x: 38, y: 66, size: 24, depth: 40 },
      ],
    },

    mobile: {
      Portfolio: [
        { photo: "pf19.jpg", x: 58, y: 66, size: 56 },
        { photo: "pf94.jpg", x: 67, y: 42, size: 50, depth: 60 },
        { photo: "pf6.jpg", x: 45, y: 47, size: 49, depth: 40 },
      ],
      Outdoors: [
        { photo: "Mountains/berg46.jpg", x: 57, y: 49, size: 51 },
        { photo: "Mountains/berg27.jpg", x: 46, y: 61, size: 46, depth: 40 },
        { photo: "Bike/gravel16.jpg", x: 30, y: 45, size: 55, depth: 60 },
      ],
      Events: [
        { photo: "Wedding/wed0.jpg", x: 49, y: 50, size: 85 },
        {
          photo: "Good Times Gravel/gtg13.jpg",
          x: 59,
          y: 34,
          size: 51,
          depth: 60,
        },
        {
          photo: "Good Times Gravel/gtg8.jpg",
          x: 41,
          y: 67,
          size: 58,
          depth: 50,
        },
      ],
      Travel: [
        { photo: "Iceland 2025/ice17.jpg", x: 52, y: 48, size: 75 },
        { photo: "Paris/cover.jpg", x: 70, y: 37, size: 41, depth: 60 },
        {
          photo: "Winter in Wien/cover.jpg",
          x: 32,
          y: 64,
          size: 50,
          depth: 40,
        },
        { photo: "Tenerife/cover.jpg", x: 63, y: 63, size: 36, depth: 80 },
      ],
      "Street & People": [
        { photo: "Street/street6.jpg", x: 43, y: 44, size: 82 },
        {
          photo: "Portraits/portrait15.jpg",
          x: 72,
          y: 51,
          size: 44,
          depth: 60,
        },
        { photo: "Artsy/art14.jpg", x: 46, y: 66, size: 41, depth: 40 },
      ],
    },
  },

  // ── inside a section ────────────────────────────────────────────────────
  // The photo that represents each album on a section's overview page.
  albums: {
    "Outdoors/Mountains": "berg46.jpg",
    "Outdoors/Winter": "winter10.jpg",
    "Outdoors/Bike": "gravel4.jpg",
    "Events/Wedding": "wed11.jpg",
    "Events/Good Times Gravel": "gtg17.jpg",
    "Travel/Iceland 2025": "ice17.jpg",
    "Travel/Paris": "cover.jpg",
    "Travel/Winter in Wien": "cover.jpg",
    "Travel/Tenerife": "cover.jpg",
    "Travel/Barcelona": "cover.jpg",
    "Street & People/Street": "street8.jpg",
    "Street & People/Portraits": "portrait15.jpg",
    "Street & People/Artsy": "art14.jpg",
  },
};
