// edit this file to tune the panorama stops
//
// imgX  0 = left edge, 1 = right edge
// imgY  0 = top, 1 = bottom
// scale zoom from viewport centre (1 = none)
// cta   amber button text (omit to hide)

const SECTIONS = [
  {
    name: "INSPIRATION",
    desc: "explore my photography",
    imgX: 0.22,
    imgY: 0.5,
  },
  {
    name: "PORTFOLIO",
    desc: "analog photography",
    imgX: 0.5,
    imgY: 0.5,
    scale: 1.4,
  },
  {
    name: "ZINES",
    desc: "handmade photo books",
    imgX: 0.72,
    imgY: 0.4,
    scale: 1.8,
  },
  {
    name: "GEAR",
    desc: "cameras, lenses, film",
    imgX: 0.75,
    imgY: 0.7,
    scale: 1.3,
  },
  {
    name: "CONTACT",
    desc: "lets go out and shoot!",
    imgX: 0.975,
    imgY: 0.5,
    scale: 1.8,
  },
];
