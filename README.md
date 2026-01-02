# Lightbox Gallery

A modern, customizable image lightbox web component built with [FAST Element](https://www.fast.design/) and [Splide.js](https://splidejs.com/).

![Lightbox Gallery Demo](./public/demo.gif)

## ✨ Features

- 🖼️ **Full-screen lightbox** with smooth animations
- 🔍 **Zoom & Pan** - Zoom in/out and pan around images
- ▶️ **Autoplay slideshow** with configurable interval
- 📐 **Horizontal/Vertical layouts** - Toggle between layouts
- 🎨 **Themeable** - CSS custom properties for easy styling
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 📦 **Zero config** - Works out of the box
- 🌐 **Framework agnostic** - Works with any framework or vanilla JS

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install lightbox-gallery

# Using deno
deno add npm:lightbox-gallery
```

### Using CDN

Import the pre-built ESM bundle directly in your HTML:

```html
<script
  type="module"
  src="https://unpkg.com/@ethandev512/lightbox-gallery/dist/lightbox-gallery.js"
></script>
```

> **Note:** The CDN build includes all dependencies bundled. Just import and use!

**2. Add markup**

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

**3. Open programmatically**

```typescript
const gallery = document.querySelector("lightbox-gallery") as LightboxGallery;

// Open at specific index
gallery.openLightbox(0);
```

## ⚙️ Configuration

### Attributes

| Attribute | Type      | Default | Description                  |
| --------- | --------- | ------- | ---------------------------- |
| `is-open` | `boolean` | `false` | Controls lightbox visibility |

### Properties (API)

Get a reference to the element to access these properties:

| Property     | Type            | Description              |
| ------------ | --------------- | ------------------------ |
| `isOpen`     | `boolean`       | Whether lightbox is open |
| `isVertical` | `boolean`       | Vertical layout mode     |
| `autoPlay`   | `boolean`       | Autoplay slideshow state |
| `scale`      | `number`        | Current zoom scale       |
| `imgArray`   | `ImgMetadata[]` | Array of images          |

### Methods

| Method                | Parameters      | Description                |
| --------------------- | --------------- | -------------------------- |
| `openLightbox(index)` | `index: number` | Open at specific index     |
| `closeLightbox()`     | -               | Close the lightbox         |
| `toggleLayout()`      | -               | Toggle horizontal/vertical |
| `handleZoomIn()`      | -               | Zoom in                    |
| `handleZoomOut()`     | -               | Zoom out                   |
| `resetZoom()`         | -               | Reset zoom to 1x           |
| `handleAutoPlay()`    | -               | Toggle autoplay            |

## 🎨 Theming

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

## 📡 Events

The component emits custom events you can listen to:

```typescript
const lightbox = document.querySelector("lightbox-gallery");

// When lightbox opens
lightbox.addEventListener("lightbox-open", (e: CustomEvent) => {
  console.log("Opened at index:", e.detail.index);
});

// When slide changes
lightbox.addEventListener("slide-change", (e: CustomEvent) => {
  console.log("Current slide:", e.detail.currentIndex);
});
```

| Event            | Detail                                            | Description                   |
| ---------------- | ------------------------------------------------- | ----------------------------- |
| `lightbox-open`  | `{ index: number }`                               | Fired when lightbox opens     |
| `lightbox-close` | `void`                                            | Fired when lightbox closes    |
| `slide-change`   | `{ previousIndex: number, currentIndex: number }` | Fired when slide changes      |
| `zoom-change`    | `{ scale: number }`                               | Fired when zoom level changes |

## ⌨️ Keyboard Shortcuts

| Key       | Action                |
| --------- | --------------------- |
| `←` / `→` | Previous / Next image |
| `Escape`  | Close lightbox        |
| `+` / `-` | Zoom in / out         |
| `Space`   | Toggle autoplay       |

## 🛠️ Development

Requires [Deno](https://deno.land/) v2.0.0 or later.

```bash
# Start dev server
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview
```

## 📄 License

MIT License

## 🙏 Credits

- [FAST Element](https://www.fast.design/) - Web component library
- [Splide.js](https://splidejs.com/) - Lightweight slider library
- [Iconoir](https://iconoir.com/) - Icons
