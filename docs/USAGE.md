# Lightbox Gallery - Usage Guide

A full-featured image lightbox web component built with [FAST Element](https://www.fast.design/).

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [Theming](#theming)
- [Events](#events)
- [API Reference](#api-reference)
- [Examples](#examples)

---

## Installation

### Using npm/deno

```bash
# npm
npm install lightbox-gallery

# deno
deno add npm:lightbox-gallery
```

### Using CDN

```html
<script
  type="module"
  src="https://unpkg.com/lightbox-gallery/dist/main.mjs"
></script>
```

---

## Basic Usage

### HTML Setup

Add images inside a container with `slot="sources"` and `data-lightbox` attribute:

```html
<lightbox-gallery>
  <div slot="sources" data-lightbox>
    <img src="image1.jpg" alt="Description 1" />
    <img src="image2.jpg" alt="Description 2" />
    <img src="image3.jpg" alt="Description 3" />
  </div>
</lightbox-gallery>
```

### JavaScript Import

```typescript
// Auto-register the component
import "lightbox-gallery";

// Or import with types
import { LightboxGallery, type ImgMetadata } from "lightbox-gallery";
```

### Complete Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lightbox Gallery Demo</title>
    <script type="module" src="./main.ts"></script>
    <style>
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 2rem;
      }
      .gallery-grid img {
        width: 100%;
        height: auto;
        cursor: pointer;
        border-radius: 8px;
        transition: transform 0.2s;
      }
      .gallery-grid img:hover {
        transform: scale(1.05);
      }
    </style>
  </head>
  <body>
    <lightbox-gallery>
      <div class="gallery-grid" slot="sources" data-lightbox>
        <img src="https://example.com/image1.jpg" alt="Image 1" />
        <img src="https://example.com/image2.jpg" alt="Image 2" />
        <img src="https://example.com/image3.jpg" alt="Image 3" />
        <img src="https://example.com/image4.jpg" alt="Image 4" />
      </div>
    </lightbox-gallery>
  </body>
</html>
```

---

## Configuration

### Attributes

| Attribute | Type      | Default | Description                  |
| --------- | --------- | ------- | ---------------------------- |
| `is-open` | `boolean` | `false` | Controls lightbox visibility |

### Opening Programmatically

```typescript
const lightbox = document.querySelector("lightbox-gallery") as LightboxGallery;

// Open at first image
lightbox.openLightbox(0);

// Open at specific index
lightbox.openLightbox(2);

// Close
lightbox.closeLightbox();
```

---

## Theming

Customize the lightbox appearance using CSS custom properties:

```css
lightbox-gallery {
  /* Backdrop */
  --lb-backdrop-color: rgba(0, 0, 0, 0.98);

  /* Toolbar */
  --lb-toolbar-bg: #1b1b1b78;
  --lb-toolbar-hover-bg: #3d3d3dda;
  --lb-toolbar-active-bg: #97969678;

  /* Thumbnails */
  --lb-thumbnail-opacity: 0.5;
  --lb-thumbnail-active-opacity: 1;
  --lb-thumbnail-border-radius: 8px;

  /* Navigation Arrows */
  --lb-arrow-bg: #b1b1b178;
  --lb-arrow-hover-bg: #3d3d3dda;
  --lb-arrow-active-bg: #c4c4c478;

  /* Z-Index */
  --lb-z-index: 1000000000;
}
```

### Example: Light Theme

```css
lightbox-gallery.light-theme {
  --lb-backdrop-color: rgba(255, 255, 255, 0.95);
  --lb-toolbar-bg: rgba(0, 0, 0, 0.1);
  --lb-toolbar-hover-bg: rgba(0, 0, 0, 0.2);
}
```

---

## Events

The component emits custom events you can listen to:

```typescript
const lightbox = document.querySelector("lightbox-gallery");

// When lightbox opens
lightbox.addEventListener("lightbox-open", (e: CustomEvent) => {
  console.log("Opened at index:", e.detail.index);
});

// When lightbox closes
lightbox.addEventListener("lightbox-close", () => {
  console.log("Lightbox closed");
});

// When slide changes
lightbox.addEventListener("slide-change", (e: CustomEvent) => {
  console.log("Current slide:", e.detail.currentIndex);
});
```

### Event Types

| Event            | Detail                                            | Description                |
| ---------------- | ------------------------------------------------- | -------------------------- |
| `lightbox-open`  | `{ index: number }`                               | Fired when lightbox opens  |
| `lightbox-close` | `void`                                            | Fired when lightbox closes |
| `slide-change`   | `{ previousIndex: number, currentIndex: number }` | Fired when slide changes   |

---

## API Reference

### LightboxGallery Class

#### Properties

| Property     | Type            | Description              |
| ------------ | --------------- | ------------------------ |
| `isOpen`     | `boolean`       | Whether lightbox is open |
| `isVertical` | `boolean`       | Vertical layout mode     |
| `autoPlay`   | `boolean`       | Autoplay slideshow state |
| `scale`      | `number`        | Current zoom scale       |
| `imgArray`   | `ImgMetadata[]` | Array of images          |

#### Methods

| Method                | Parameters      | Description                |
| --------------------- | --------------- | -------------------------- |
| `openLightbox(index)` | `index: number` | Open at specific index     |
| `closeLightbox()`     | -               | Close the lightbox         |
| `toggleLayout()`      | -               | Toggle horizontal/vertical |
| `handleZoomIn()`      | -               | Zoom in                    |
| `handleZoomOut()`     | -               | Zoom out                   |
| `resetZoom()`         | -               | Reset zoom to 1x           |
| `handleAutoPlay()`    | -               | Toggle autoplay            |

### Types

```typescript
interface ImgMetadata {
  src: string;
  alt: string;
}

interface LightboxGalleryOptions {
  autoPlay?: boolean;
  showThumbnails?: boolean;
  vertical?: boolean;
  interval?: number;
  wheel?: boolean;
}

interface Position {
  x: number;
  y: number;
}
```

---

## Examples

### Grid Gallery

```html
<style>
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
</style>

<lightbox-gallery>
  <div class="photo-grid" slot="sources" data-lightbox>
    <img src="photo1.jpg" alt="Photo 1" />
    <img src="photo2.jpg" alt="Photo 2" />
    <img src="photo3.jpg" alt="Photo 3" />
  </div>
</lightbox-gallery>
```

### Masonry Layout

```html
<style>
  .masonry {
    column-count: 3;
    column-gap: 1rem;
  }
  .masonry img {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>

<lightbox-gallery>
  <div class="masonry" slot="sources" data-lightbox>
    <img src="tall-image.jpg" alt="Tall" />
    <img src="wide-image.jpg" alt="Wide" />
    <img src="square-image.jpg" alt="Square" />
  </div>
</lightbox-gallery>
```

### Open on Button Click

```html
<button id="open-gallery">View Gallery</button>

<lightbox-gallery id="my-gallery">
  <div slot="sources" data-lightbox style="display: none;">
    <img src="hidden1.jpg" alt="Image 1" />
    <img src="hidden2.jpg" alt="Image 2" />
  </div>
</lightbox-gallery>

<script>
  document.getElementById("open-gallery").addEventListener("click", () => {
    document.getElementById("my-gallery").openLightbox(0);
  });
</script>
```

---

## Keyboard Shortcuts

| Key       | Action                |
| --------- | --------------------- |
| `←` / `→` | Previous / Next image |
| `Escape`  | Close lightbox        |
| `+` / `-` | Zoom in / out         |
| `Space`   | Toggle autoplay       |

---

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 12.1+
- Edge 79+

---

## License

MIT License
