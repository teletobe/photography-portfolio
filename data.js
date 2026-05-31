/* ===========================================
   data.js — Zine definitions for the exhibition.
   Each zine has a title, subtitle, cover image,
   and a list of photos for the reader.
   =========================================== */

const ZINES = [
  {
    id: "portfolio",
    title: "Portfolio",
    subtitle: "selected works, till 2024",
    cover: "img/zines/portfolio/pf1.jpg",
    photos: Array.from({ length: 96 }, (_, i) => ({
      src: `img/zines/portfolio/pf${i + 1}.jpg`,
    })),
  },
  {
    id: "portrait",
    title: "Portraits",
    subtitle: "people & faces",
    cover: "img/zines/portrait/portrait1.jpg",
    photos: Array.from({ length: 28 }, (_, i) => ({
      src: `img/zines/portrait/portrait${i + 1}.jpg`,
    })),
  },
  {
    id: "artsy",
    title: "Artsy",
    subtitle: "experimental stuff",
    cover: "img/zines/artsy/art1.jpg",
    photos: Array.from({ length: 17 }, (_, i) => ({
      src: `img/zines/artsy/art${i + 1}.jpg`,
    })),
  },
  {
    id: "berg",
    title: "Berg",
    subtitle: "hikes, 2019–2025",
    cover: "img/zines/berg/berg22.jpg",
    photos: Array.from({ length: 95 }, (_, i) => ({
      src: `img/zines/berg/berg${i + 1}.jpg`,
    })),
  },
  {
    id: "japan",
    title: "Japan",
    subtitle: "trip to japan in, 2024",
    cover: "img/zines/japan/japan22.jpg",
    photos: Array.from({ length: 53 }, (_, i) => ({
      src: `img/zines/japan/japan${i + 1}.jpg`,
    })),
  },
  {
    id: "street",
    title: "Street",
    subtitle: "streety stuff",
    cover: "img/zines/street/street5.jpg",
    photos: Array.from({ length: 22 }, (_, i) => ({
      src: `img/zines/street/street${i + 1}.jpg`,
    })),
  },
  {
    id: "balkan",
    title: "Balkan Roadtrip",
    subtitle: "autumn 2025",
    cover: "img/zines/balkan/balkan1.jpg",
    photos: Array.from({ length: 40 }, (_, i) => ({
      src: `img/zines/balkan/balkan${i + 1}.jpg`,
    })),
  },
  {
    id: "barcelona",
    title: "Barcelona Citytrip",
    subtitle: "february 2026",
    cover: "img/zines/barcelona/barcelona14.jpg",
    photos: Array.from({ length: 27 }, (_, i) => ({
      src: `img/zines/barcelona/barcelona${i + 1}.jpg`,
    })),
  },
  {
    id: "iceland",
    title: "Iceland 2025",
    subtitle: "short visit in march",
    cover: "img/zines/iceland2025/ice10.jpg",
    photos: Array.from({ length: 21 }, (_, i) => ({
      src: `img/zines/iceland2025/ice${i + 1}.jpg`,
    })),
  },
  {
    id: "nyc",
    title: "USA 2025",
    subtitle: "NYC + new england visiting stella",
    cover: "img/zines/nyc/nyc23.jpg",
    photos: Array.from({ length: 54 }, (_, i) => ({
      src: `img/zines/nyc/nyc${i + 1}.jpg`,
    })),
  },
  {
    id: "paris",
    title: "Paris",
    subtitle: "visiting hannah",
    cover: "img/zines/paris/paris28.jpg",
    photos: Array.from({ length: 49 }, (_, i) => ({
      src: `img/zines/paris/paris${i + 1}.jpg`,
    })),
  },
  {
    id: "tdf",
    title: "Tour de France",
    subtitle: "minitrip ins jura",
    cover: "img/zines/tdf/tdf19.jpg",
    photos: Array.from({ length: 19 }, (_, i) => ({
      src: `img/zines/tdf/tdf${i + 1}.jpg`,
    })),
  },
  {
    id: "tenerife",
    title: "Tenerife 2026",
    subtitle: "sonne tanken im winter",
    cover: "img/zines/tenerife/tenerife9.jpg",
    photos: Array.from({ length: 25 }, (_, i) => ({
      src: `img/zines/tenerife/tenerife${i + 1}.jpg`,
    })),
  },
  {
    id: "winterwien",
    title: "White Vienna",
    subtitle: "Wintereinbruch in Wien, Feber 2026",
    cover: "img/zines/winterinwien/winterwien32.jpg",
    photos: Array.from({ length: 33 }, (_, i) => ({
      src: `img/zines/winterinwien/winterwien${i + 1}.jpg`,
    })),
  },
];
