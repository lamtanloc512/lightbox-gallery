/**
 * SlideshowController - Manages Splide instances for main slider and thumbnails
 * @module controllers/slideshow
 */

import { Splide, Options } from "@splidejs/splide";
import type { ThumbnailSplideOptions } from "../types.ts";

export interface SlideshowControllerOptions {
  /** Enable arrows navigation */
  arrows?: boolean;
  /** Enable mouse wheel navigation */
  wheel?: boolean;
  /** Autoplay interval in milliseconds */
  interval?: number;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
}

/**
 * Controller for managing Splide slideshow instances
 */
export class SlideshowController {
  private mainSplide: Splide | null = null;
  private thumbnailSplide: Splide | null = null;
  private thumbnailSplideVertical: Splide | null = null;
  private options: SlideshowControllerOptions;

  constructor(options: SlideshowControllerOptions = {}) {
    this.options = {
      arrows: true,
      wheel: true,
      interval: 3000,
      ...options,
    };
  }

  /**
   * Initialize the main and thumbnail sliders
   */
  initialize(
    mainElement: HTMLElement,
    thumbnailElement?: HTMLElement,
    thumbnailVerticalElement?: HTMLElement,
    initialIndex?: number,
    isVertical: boolean = false
  ): void {
    // Initialize main splide
    this.mainSplide = new Splide(mainElement, {
      type: "fade",
      rewind: true,
      arrows: isVertical ? false : this.options.arrows,
      wheel: this.options.wheel,
      pagination: false,
      perPage: 1,
      interval: this.options.interval,
    });

    // If no thumbnails, just mount main slider
    if (!thumbnailElement || !thumbnailVerticalElement) {
      this.mainSplide.mount();
      return;
    }

    // Thumbnail options (horizontal)
    const thumbOptions: Options = this.getThumbnailOptions();

    // Thumbnail options (vertical)
    const thumbOptionsVertical: Options = {
      ...thumbOptions,
      direction: "ttb",
      height: "90vh",
      arrows: true,
    };

    this.thumbnailSplide = new Splide(thumbnailElement, thumbOptions);
    this.thumbnailSplideVertical = new Splide(
      thumbnailVerticalElement,
      thumbOptionsVertical
    );

    // Sync all sliders and mount
    this.mainSplide
      .sync(this.thumbnailSplide)
      .sync(this.thumbnailSplideVertical)
      .mount();

    this.thumbnailSplide.mount();
    this.thumbnailSplideVertical.mount();

    // Go to initial index if provided
    if (initialIndex !== undefined && initialIndex > 0) {
      this.goTo(initialIndex);
    }

    // Setup event callbacks
    if (this.options.onSlideChange) {
      this.mainSplide.on("moved", this.options.onSlideChange);
    }
  }

  /**
   * Get default thumbnail slider options
   */
  private getThumbnailOptions(): Options {
    return {
      focus: "center",
      fixedHeight: 90,
      autoWidth: true,
      arrows: false,
      wheel: true,
      rewind: false,
      pagination: false,
      isNavigation: true,
      gap: 5,
      breakpoints: {
        1100: { fixedHeight: 90 },
        800: { fixedHeight: 80 },
        450: { fixedHeight: 70 },
      },
    };
  }

  /**
   * Navigate to a specific slide
   */
  goTo(index: number): void {
    if (!this.mainSplide) return;

    this.mainSplide.go(index);

    // Sync thumbnails
    requestAnimationFrame(() => {
      this.thumbnailSplide?.Components.Controller.setIndex(index);
      this.thumbnailSplide?.Components.Move.jump(index);
      this.thumbnailSplideVertical?.Components.Controller.setIndex(index);
      this.thumbnailSplideVertical?.Components.Move.jump(index);
    });
  }

  /**
   * Get the current slide index
   */
  getCurrentIndex(): number {
    return this.mainSplide?.index ?? 0;
  }

  /**
   * Get the thumbnail fixed height for layout calculations
   */
  getThumbnailHeight(): number {
    return (this.thumbnailSplide?.options.fixedHeight as number) ?? 90;
  }

  /**
   * Start autoplay
   */
  play(): void {
    this.mainSplide?.Components.Autoplay.play();
  }

  /**
   * Pause autoplay
   */
  pause(): void {
    this.mainSplide?.Components.Autoplay.pause();
  }

  /**
   * Check if autoplay is currently paused
   */
  isPaused(): boolean {
    return this.mainSplide?.Components.Autoplay.isPaused() ?? true;
  }

  /**
   * Enable or disable drag functionality
   */
  setDragEnabled(enabled: boolean): void {
    this.mainSplide?.Components.Drag.disable(!enabled);
  }

  /**
   * Add event listener for slide changes
   */
  onMoved(callback: () => void): void {
    this.mainSplide?.on("moved", callback);
  }

  /**
   * Destroy all splide instances
   */
  destroy(): void {
    this.mainSplide?.destroy();
    this.thumbnailSplide?.destroy();
    this.thumbnailSplideVertical?.destroy();
    this.mainSplide = null;
    this.thumbnailSplide = null;
    this.thumbnailSplideVertical = null;
  }
}
