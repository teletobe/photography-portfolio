# Tobi's Photography Portfolio

This is my photography portfolio built with Next.js. It features a masonry image grid with a lightbox viewer, split across multiple gallery categories.

## Features

- **Portfolio** — main gallery showcasing a curated selection of photos
- **Other** — dropdown with additional category galleries:
  - b-roll
  - concept
  - street
  - people
- Masonry grid layout with switchable 2 or 3 column view
- Lightbox with zoom and thumbnail strip (via LightGallery)
- Progressive image loading — initial images load first, rest load in the background

## Project Structure

```
app/
  app/
    page.tsx              # Main page, wires everything together
    components/
      Header.tsx          # Top nav bar with column switcher
      TabNavigation.tsx   # Tab list with "Other" dropdown
      ImageGallery.tsx    # Reusable masonry grid + lightbox
      WelcomeOverlay.tsx  # Fade-in welcome screen on first load
    hooks/
      useImages.ts        # Custom hooks for loading each image category
  public/
    pics/                 # All photo assets organised by category
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Other Commands

```bash
npm run build   # Build for production
npm run start   # Serve the production build
npm run lint    # Run ESLint
```

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/) — accessible tab components
- [LightGallery](https://www.lightgalleryjs.com/) — lightbox with zoom and thumbnails
- [react-masonry-css](https://github.com/paulcollett/react-masonry-css) — masonry grid layout
