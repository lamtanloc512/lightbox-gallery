/**
 * Type definitions for Lightbox Gallery component
 * @module types
 */

/**
 * Metadata for an image in the gallery
 */
export interface ImgMetadata {
  /** Source URL of the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
}

/**
 * Configuration options for the lightbox gallery
 */
export interface LightboxGalleryOptions {
  /** Enable auto-play slideshow */
  autoPlay?: boolean;
  /** Show thumbnail navigation */
  showThumbnails?: boolean;
  /** Use vertical layout (thumbnails on right side) */
  vertical?: boolean;
  /** Autoplay interval in milliseconds */
  interval?: number;
  /** Enable mouse wheel navigation */
  wheel?: boolean;
}

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Zoom/Pan state for the current slide
 */
export interface ZoomState {
  scale: number;
  offset: Position;
  isPanning: boolean;
}

/**
 * Event detail for lightbox open event
 */
export interface LightboxOpenEventDetail {
  /** Index of the opened slide */
  index: number;
}

/**
 * Event detail for slide change event
 */
export interface SlideChangeEventDetail {
  /** Previous slide index */
  previousIndex: number;
  /** New slide index */
  currentIndex: number;
}

/**
 * Custom events emitted by the lightbox gallery
 */
export interface LightboxGalleryEventMap {
  "lightbox-open": CustomEvent<LightboxOpenEventDetail>;
  "lightbox-close": CustomEvent<void>;
  "slide-change": CustomEvent<SlideChangeEventDetail>;
  "zoom-change": CustomEvent<{ scale: number }>;
}

/**
 * Splide options for main gallery
 */
export interface MainSplideOptions {
  type: "fade" | "slide" | "loop";
  rewind: boolean;
  arrows: boolean;
  wheel: boolean;
  pagination: boolean;
  perPage: number;
  interval: number;
}

/**
 * Splide options for thumbnail slider
 */
export interface ThumbnailSplideOptions {
  focus: "center" | number;
  fixedHeight: number;
  autoWidth: boolean;
  arrows: boolean;
  wheel: boolean;
  rewind: boolean;
  pagination: boolean;
  isNavigation: boolean;
  gap: number;
  direction?: "ltr" | "rtl" | "ttb";
  height?: string;
}
