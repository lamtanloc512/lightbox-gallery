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

### Usage

```html
<!-- Import the component -->
<script
  type="module"
  src="./node_modules/lightbox-gallery/dist/main.mjs"
></script>

<!-- Use it in your HTML -->
<lightbox-gallery>
  <div slot="sources" data-lightbox>
    <img src="image1.jpg" alt="Description 1" />
    <img src="image2.jpg" alt="Description 2" />
    <img src="image3.jpg" alt="Description 3" />
  </div>
</lightbox-gallery>
```

### TypeScript

```typescript
import { LightboxGallery, type ImgMetadata } from "lightbox-gallery";

// Get reference to the component
const gallery = document.querySelector("lightbox-gallery") as LightboxGallery;

// Open programmatically
gallery.openLightbox(0);

// Listen to events
gallery.addEventListener("lightbox-open", (e) => {
  console.log("Opened at index:", e.detail.index);
});
```

## 🎨 Theming

Customize with CSS custom properties:

```css
lightbox-gallery {
  --lb-backdrop-color: rgba(0, 0, 0, 0.98);
  --lb-toolbar-bg: #1b1b1b78;
  --lb-thumbnail-border-radius: 8px;
}
```

## 📖 Documentation

See the [full documentation](./docs/USAGE.md) for:

- Complete API reference
- Event handling
- Advanced customization
- More examples

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

## 📁 Project Structure

```
lightbox-gallery/
├── src/
│   ├── components/
│   │   └── gallery/
│   │       ├── gallery.component.ts   # Main component
│   │       ├── gallery.template.ts    # HTML templates
│   │       ├── gallery.styles.ts      # CSS styles
│   │       ├── types.ts               # TypeScript types
│   │       └── controllers/           # Logic controllers
│   │           ├── zoom.controller.ts
│   │           └── slideshow.controller.ts
│   ├── service/                       # DI services
│   └── main.ts                        # Entry point
├── examples/                          # Example components
├── docs/                              # Documentation
└── dist/                              # Built files
```

## 📄 License

MIT License

## 🙏 Credits

- [FAST Element](https://www.fast.design/) - Web component library
- [Splide.js](https://splidejs.com/) - Lightweight slider library
- [Iconoir](https://iconoir.com/) - Icons
