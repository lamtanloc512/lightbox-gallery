/**
 * Lightbox Gallery - Entry Point
 *
 * Importing this module will auto-register the lightbox-gallery custom element.
 *
 * @module lightbox-gallery
 *
 * @example
 * ```typescript
 * // Auto-register component
 * import 'lightbox-gallery';
 * ```
 *
 * @example
 * ```typescript
 * // Import with types
 * import { LightboxGallery, type ImgMetadata } from 'lightbox-gallery';
 * ```
 */

// Re-export everything from gallery component
export * from "./components/gallery";

// Auto-register the component by importing it
import "./components/gallery/gallery.component";
