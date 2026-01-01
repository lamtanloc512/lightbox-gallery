/**
 * Lightbox Gallery Component
 *
 * A full-featured image lightbox web component built with FAST Element.
 *
 * @module components/gallery
 *
 * @example
 * ```typescript
 * // Import and auto-register component
 * import 'lightbox-gallery';
 *
 * // Or import specific parts
 * import { LightboxGallery } from 'lightbox-gallery';
 * import type { ImgMetadata, LightboxGalleryOptions } from 'lightbox-gallery';
 * ```
 *
 * @example
 * ```html
 * <lightbox-gallery>
 *   <div slot="sources" data-lightbox>
 *     <img src="image1.jpg" alt="Description 1" />
 *     <img src="image2.jpg" alt="Description 2" />
 *   </div>
 * </lightbox-gallery>
 * ```
 */

// Main component
export { LightboxGallery } from "./gallery.component";

// Styles (for custom styling/theming)
export { galleryStyles } from "./gallery.styles";

// Templates (for advanced customization)
export {
  galleryTemplate,
  splideTemplate,
  thumbnailTemplate,
  thumbnailTemplateVertical,
  toolbarTemplate,
} from "./gallery.template";

// Types
export type {
  ImgMetadata,
  LightboxGalleryOptions,
  LightboxGalleryEventMap,
  LightboxOpenEventDetail,
  SlideChangeEventDetail,
  Position,
  ZoomState,
} from "./types";

// Controllers (for advanced usage)
export {
  ZoomController,
  SlideshowController,
  type ZoomControllerHost,
  type SlideshowControllerOptions,
} from "./controllers";
