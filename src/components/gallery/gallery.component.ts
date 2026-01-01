/**
 * LightboxGallery - A customizable image lightbox web component
 *
 * @module gallery.component
 * @example
 * ```html
 * <lightbox-gallery>
 *   <div slot="sources" data-lightbox>
 *     <img src="image1.jpg" alt="Image 1" />
 *     <img src="image2.jpg" alt="Image 2" />
 *   </div>
 * </lightbox-gallery>
 * ```
 */

import {
  attr,
  customElement,
  FASTElement,
  observable,
} from "@microsoft/fast-element";
// @ts-types="@types/lodash"
import { isEmpty } from "lodash";

import { galleryTemplate } from "./gallery.template.ts";
import { galleryStyles } from "./gallery.styles.ts";
import { ZoomController, SlideshowController } from "./controllers/index.ts";
import type { ImgMetadata, Position } from "./types.ts";

/**
 * LightboxGallery Web Component
 *
 * A full-featured image lightbox with zoom, pan, autoplay, and thumbnail navigation.
 *
 * @fires lightbox-open - Fired when the lightbox opens
 * @fires lightbox-close - Fired when the lightbox closes
 * @fires slide-change - Fired when the current slide changes
 *
 * @csspart container - The main lightbox container
 * @csspart toolbar - The toolbar with controls
 * @csspart slideshow - The main image slideshow
 * @csspart thumbnail - The thumbnail navigation
 *
 * @slot sources - Container for source images (must have data-lightbox attribute)
 */
@customElement({
  name: "lightbox-gallery",
  template: galleryTemplate,
  styles: galleryStyles,
})
export class LightboxGallery extends FASTElement {
  @attr({ attribute: "is-open", mode: "boolean" })
  isOpen!: boolean;

  @attr({ attribute: "is-vertical", mode: "boolean" })
  isVertical!: boolean;

  @observable
  imgArray!: ImgMetadata[];

  @observable
  splideRef!: HTMLElement;

  @observable
  thumbnailRef!: HTMLElement;

  @observable
  collapseThumbnailVertical!: boolean;

  @observable
  thumbnailRefVertical!: HTMLElement;

  @observable
  thumbnailChildren!: HTMLElement[];

  @observable
  mainSplideChildren!: HTMLElement[];

  @observable
  currentIndex!: number;

  @observable
  currentThumbnail!: HTMLElement;

  @observable
  imageNodes!: Element[];

  @observable
  autoPlay!: boolean;

  @observable
  viewport!: HTMLElement;

  @observable
  offset!: Position;

  @observable
  scale!: number;

  @observable
  slideshowMaxHeight!: number;

  @observable
  isPanning!: boolean;

  @observable
  isZoomming!: boolean;

  private zoomController?: ZoomController;
  private slideshowController?: SlideshowController;

  constructor() {
    super();
    this.isOpen = false;
    this.isVertical = false;
    this.imgArray = [];
    this.collapseThumbnailVertical = false;
    this.thumbnailChildren = [];
    this.mainSplideChildren = [];
    this.currentIndex = 0;
    this.imageNodes = [];
    this.autoPlay = false;
    this.offset = { x: 0, y: 0 };
    this.scale = 1;
    this.slideshowMaxHeight = 0;
    this.isPanning = false;
    this.isZoomming = false;
  }

  // ========================================
  // Lifecycle Hooks
  // ========================================

  /**
   * Called when component is connected to DOM
   */
  override connectedCallback(): void {
    super.connectedCallback();
    this.initializeImages();
    this.initializeClickHandlers();
  }

  /**
   * Called when component is disconnected from DOM
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  // ========================================
  // Initialization Methods
  // ========================================

  /**
   * Extract images from the sources slot
   */
  private initializeImages(): void {
    const sourcesSlot = this.shadowRoot?.querySelector(
      'slot[name="sources"]'
    ) as HTMLSlotElement;

    if (!sourcesSlot) return;

    const assignedElements = sourcesSlot.assignedElements();
    const dataLightboxElement = assignedElements.find((x) =>
      x.hasAttribute("data-lightbox")
    )?.children;

    if (!dataLightboxElement) return;

    this.imageNodes = Array.from(dataLightboxElement).filter((el) => {
      return el.tagName === "IMG" && !isEmpty((el as HTMLImageElement).src);
    });

    this.imgArray = this.imageNodes.map((el) => {
      const img = el as HTMLImageElement;
      return { src: img.src, alt: img.alt } as ImgMetadata;
    });
  }

  /**
   * Setup click handlers on source images
   */
  private initializeClickHandlers(): void {
    if (!this.imageNodes?.length) return;

    this.imageNodes.forEach((element: Element, index: number) => {
      element.addEventListener("click", () => {
        this.openLightbox(index);
      });
    });
  }

  /**
   * Initialize Splide slider instances
   * Called after refs are available
   */
  initializeSplide(
    splideRef?: HTMLElement,
    thumbnailRef?: HTMLElement,
    thumbnailRefVertical?: HTMLElement,
    currentIndex?: number
  ): void {
    if (!splideRef) return;

    // Initialize controllers
    this.slideshowController = new SlideshowController({
      arrows: !this.isVertical,
      wheel: true,
      interval: 3000,
      onSlideChange: () => this.resetPanningState(),
    });

    this.slideshowController.initialize(
      splideRef,
      thumbnailRef,
      thumbnailRefVertical,
      currentIndex,
      this.isVertical
    );

    // Calculate max height
    const thumbHeight = this.slideshowController.getThumbnailHeight();
    this.slideshowMaxHeight = globalThis.innerHeight - thumbHeight * 3;

    // Initialize zoom controller
    this.zoomController = new ZoomController(this);
  }

  // ========================================
  // Public Methods
  // ========================================

  /**
   * Open the lightbox at a specific index
   * @param index - The zero-based index of the image to open (default: 0)
   * @example
   * ```ts
   * const gallery = document.querySelector('lightbox-gallery');
   * gallery.openLightbox(2); // Open 3rd image
   * ```
   */
  openLightbox(index: number = 0): void {
    this.isOpen = true;
    this.currentIndex = index;
    this.$emit("lightbox-open", { index });
  }

  /**
   * Close the lightbox
   * @example
   * ```ts
   * gallery.closeLightbox();
   * ```
   */
  closeLightbox(): void {
    this.isOpen = false;
    this.slideshowController?.destroy();
    this.$emit("lightbox-close");
  }

  /**
   * Toggle between horizontal and vertical layout
   */
  toggleLayout = (): void => {
    this.isVertical = !this.isVertical;
  };

  /**
   * Toggle vertical thumbnail sidebar visibility
   */
  handleCollapseThumbnailVertical = (): void => {
    this.collapseThumbnailVertical = !this.collapseThumbnailVertical;
  };

  // ========================================
  // Autoplay Controls
  // ========================================

  /**
   * Toggle autoplay on/off
   */
  handleAutoPlay(): void {
    if (!this.slideshowController) return;

    if (this.slideshowController.isPaused()) {
      this.slideshowController.play();
      this.autoPlay = true;
    } else {
      this.slideshowController.pause();
      this.autoPlay = false;
    }
  }

  // ========================================
  // Zoom Controls
  // ========================================

  /**
   * Zoom in on the current image
   */
  handleZoomIn(): void {
    if (this.autoPlay) {
      this.slideshowController?.pause();
    }
    this.slideshowController?.setDragEnabled(false);

    this.isZoomming = true;
    const newScale = this.scale + 0.25;
    this.scale = Math.min(newScale, 4);

    if (this.viewport) {
      this.viewport.style.cursor = "grab";
    }

    if (this.scale > 1) {
      this.setupPanningZoom();
    }
  }

  /**
   * Zoom out on the current image
   */
  handleZoomOut(): void {
    if (this.autoPlay) {
      this.slideshowController?.pause();
    }
    this.slideshowController?.setDragEnabled(false);

    const newScale = this.scale - 0.25;
    this.scale = Math.max(newScale, 0.75);

    if (this.viewport && this.scale <= 1) {
      this.viewport.style.cursor = "grab";
    }
  }

  /**
   * Reset zoom and pan to default
   */
  resetZoom(): void {
    this.resetPanningState();
    this.cleanupPanningZoom();
  }

  // ========================================
  // Panning (Private)
  // ========================================

  private start: Position = { x: 0, y: 0 };

  private setupPanningZoom(): void {
    if (!this.viewport) return;
    this.viewport.addEventListener("pointerdown", this.handlePanStart);
    this.viewport.addEventListener("pointermove", this.handlePanMove);
    this.viewport.addEventListener("pointerup", this.handlePanEnd);
  }

  private cleanupPanningZoom(): void {
    if (!this.viewport) return;
    this.viewport.removeEventListener("pointerdown", this.handlePanStart);
    this.viewport.removeEventListener("pointermove", this.handlePanMove);
    this.viewport.removeEventListener("pointerup", this.handlePanEnd);
  }

  private resetPanningState(): void {
    this.isPanning = false;
    this.offset = { x: 0, y: 0 };
    this.scale = 1;

    if (this.viewport) {
      this.viewport.style.cursor = "default";
    }

    this.slideshowController?.setDragEnabled(true);
    this.cleanupPanningZoom();
  }

  private handlePanStart = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.isPanning = true;
    this.start = {
      x: ev.clientX - this.offset.x,
      y: ev.clientY - this.offset.y,
    };

    if (this.viewport) {
      this.viewport.style.transition = "none";
    }
  };

  private handlePanMove = (ev: MouseEvent): void => {
    if (!this.isPanning) return;
    this.offset = {
      x: ev.clientX - this.start.x,
      y: ev.clientY - this.start.y,
    };
  };

  private handlePanEnd = (): void => {
    this.isPanning = false;
    if (this.viewport) {
      this.viewport.style.transition =
        "all 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95)";
    }
  };

  // ========================================
  // Cleanup
  // ========================================

  private cleanup(): void {
    this.slideshowController?.destroy();
    this.zoomController?.destroy();
    this.cleanupPanningZoom();
  }
}
