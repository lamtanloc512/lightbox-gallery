import {
  attr,
  children,
  elements,
  FASTElement,
  html,
  observable,
  ref,
  repeat,
  when,
} from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import { isEmpty } from "lodash";
import style from "./gallery.styles.ts";
import normalizeStyle from "./normalize.style.ts";
import defaultStyle from "./splide.styles.ts";
import {
  closeButton,
  pauseButton,
  playButton,
  resetZoomButton,
  zoomInButton,
  zoomOutButton,
} from "./toolbar.icons.ts";

const styles = [normalizeStyle, defaultStyle, style];

type ImgMetadata = {
  src: string;
  alt: string;
};
class LightboxGallery extends FASTElement {
  // Properties
  @attr({ attribute: "is-open", mode: "boolean" })
  isOpen: boolean = false;

  @observable
  imgArray: ImgMetadata[] = [];

  @observable
  splideRef?: HTMLElement;

  @observable
  mainSplide?: _Splide;

  @observable
  thumbnailRef?: HTMLElement;

  @observable
  thumbnailSplide?: _Splide;

  @observable
  thumbnailChildren?: HTMLElement[] = [];

  @observable
  mainSplideChildren?: HTMLElement[] = [];

  @observable
  currentIndex?: number;

  @observable
  currentThumbnail?: HTMLElement;

  @observable
  imageNodes?: Element[] = [];

  @observable
  currentX = 0;

  @observable
  currentY = 0;

  @observable
  autoPlay: boolean = false;

  @observable
  currPanZoomEl?: HTMLElement;

  @observable
  mouseX?: number;

  @observable
  mouseY?: number;

  @observable
  isPanning = false;

  @observable
  isZoomming = false;

  @observable
  viewport?: HTMLElement;

  @observable
  start = { x: 0, y: 0 };

  @observable
  offset = { x: 0, y: 0 };

  @observable
  scale = 1;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initialize();
    this.initEventForSlotNodes();
  }

  // Methods
  private initialize(): void {
    const sourcesSlot = this.shadowRoot?.querySelector(
      'slot[name="sources"]'
    ) as HTMLSlotElement;
    const assignedElements = sourcesSlot?.assignedElements();
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

  private initEventForSlotNodes(): void {
    if (this.imageNodes?.length === 0) return;

    this.imageNodes?.forEach((element: Element, index: number) => {
      element.addEventListener("click", () => {
        this.isOpen = true;
        this.currentIndex = index;
      });
    });
  }

  initializeSplide(
    splideRef?: HTMLElement,
    thumbnailRef?: HTMLElement,
    currentIndex?: number
  ): void {
    if (!splideRef) return;
    this.mainSplide = new _Splide(splideRef, {
      type: "fade",
      rewind: true,
      wheel: true,
      pagination: false,
      perPage: 1,
      interval: 3000,
    });
    this.mainSplide?.on("moved", this.resetPanningState.bind(this));

    if (!thumbnailRef) {
      this.mainSplide.mount();
      return;
    }

    this.thumbnailSplide = new _Splide(thumbnailRef, {
      focus: "center",
      fixedWidth: 100,
      fixedHeight: 80,
      wheel: true,
      rewind: false,
      pagination: false,
      isNavigation: true,
      useIndex: true,
      gap: 5,
      breakpoints: {
        900: {
          fixedWidth: 120,
          fixedHeight: 100,
        },
        600: {
          fixedWidth: 70,
          fixedHeight: 60,
        },
      },
    });

    this.mainSplide.sync(this.thumbnailSplide).mount();
    this.thumbnailSplide.mount();

    if (!currentIndex) return;
    this.mainSplide.go(currentIndex);
    requestAnimationFrame(() => {
      this.thumbnailSplide?.Components.Controller.setIndex(currentIndex);
      this.thumbnailSplide?.Components.Move.jump(currentIndex);
    });
  }

  closeLightbox(): void {
    this.isOpen = false;
    this.mainSplide?.destroy();
    this.thumbnailSplide?.destroy();
  }

  handleAutoPlay(): void {
    const isPause = this.mainSplide?.Components.Autoplay.isPaused();
    if (isPause) {
      this.mainSplide?.Components.Autoplay.play();
      this.autoPlay = true;
    } else {
      this.mainSplide?.Components.Autoplay.pause();
      this.autoPlay = false;
    }
  }

  handleZoomIn(): void {
    this.isZoomming = true;
    if (this.autoPlay) this.mainSplide?.Components.Autoplay.pause();
    this.mainSplide?.Components.Drag.disable(true);
    if (!this.viewport) return;
    const curr = this.viewport;
    curr.style.cursor = "grab";
    const newScale = this.scale + 0.25;
    this.scale = Math.min(newScale, 4);
    if (this.scale > 1) {
      curr.style.cursor = "grab";
      this.setupPanningZoom();
    }
  }

  handleZoomOut(): void {
    if (this.autoPlay) this.mainSplide?.Components.Autoplay.pause();
    this.mainSplide?.Components.Drag.disable(true);
    if (!this.viewport) return;
    const curr = this.viewport;
    const newScale = this.scale - 0.25;
    this.scale = Math.max(newScale, 0.75);

    if (this.scale <= 1) {
      curr.style.cursor = "grab";
      this.setupPanningZoom();
    }

    // if (this.scale === 1) {
    //   curr.style.cursor = "default";
    //   this.resetZoom();
    // }
  }

  resetZoom(): void {
    this.resetPanningState();
    this.cleanupPanningZoom();
  }

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

  private resetPanningState() {
    if (!this.viewport) return;
    this.isPanning = false;
    this.viewport.style.cursor = "default";
    this.offset = { x: 0, y: 0 };
    this.scale = 1;
    this.mainSplide?.Components.Drag.disable(false);
    this.cleanupPanningZoom();
  }

  private handlePanStart = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.isPanning = true;
    this.start = {
      x: ev.clientX - this.offset.x,
      y: ev.clientY - this.offset.y,
    };

    if (!this.viewport) return;
    this.viewport.style.transition = "none";
  };

  private handlePanMove = (ev: MouseEvent): void => {
    if (!this.isPanning) return;
    this.isPanning = true;
    this.offset = {
      x: ev.clientX - this.start.x,
      y: ev.clientY - this.start.y,
    };
  };

  private handlePanEnd = (): void => {
    this.isPanning = false;
    if (!this.viewport) return;
    this.viewport.style.transition =
      "all 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95)";
  };

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }
}

const splideTemplate = html`
  ${when(
    (x: LightboxGallery) => x.imgArray.length > 0,
    html`
      <div class="splide__main">
        <div ${ref("splideRef")} class="splide">
          <div class="splide__track">
            <ul
              class="splide__list"
              ${children({
                property: "mainSplideChildren",
                filter: elements("li"),
              })}
              ${ref("viewport")}
              style="transform: translate(${(x) => x.offset.x}px, ${(x) =>
                x.offset.y}px) scale(${(x) => x.scale})"
            >
              ${repeat(
                (x: LightboxGallery) => x.imgArray,
                html<ImgMetadata>`
                  ${(x, c) =>
                    html` <li class="splide__slide">
                      <img src=${x.src} alt=${x.alt} data-index=${c.index} />
                    </li>`}
                `,
                { positioning: true }
              )}
            </ul>
          </div>
        </div>
      </div>
    `
  )}
`;

const thumbnailTemplate = html`
  ${when(
    (x: LightboxGallery) => x.imgArray.length > 0,
    html<LightboxGallery>`
      <div class="splide__thumbnail">
        <div ${ref("thumbnailRef")} class="splide">
          <div class="splide__track">
            <ul
              class="splide__list"
              ${children({
                property: "thumbnailChildren",
                filter: elements("li"),
              })}
            >
              ${repeat(
                (x) => x.imgArray,
                html<ImgMetadata>`
                  <li class="splide__slide thumbnail">
                    ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
                  </li>
                `
              )}
            </ul>
          </div>
        </div>
      </div>
    `
  )}
`;

const toolbarTemplate = html<LightboxGallery>` ${when(
  (x: LightboxGallery) => x.imgArray.length > 0,
  html`<div class="tool-bar-nav">
    <div class="tool-bar-panel">
      <button @click=${(x) => x.handleZoomIn()} title="Zoom In">
        ${zoomInButton}
      </button>
      <button @click=${(x) => x.handleZoomOut()} title="Zoom Out">
        ${zoomOutButton}
      </button>
      <button
        @click=${(x: LightboxGallery) => x.resetZoom()}
        title="Reset Zoom"
      >
        ${resetZoomButton}
      </button>
      <button @click=${(x) => x.handleAutoPlay()} title="Auto Play">
        ${when(
          (x) => x.autoPlay,
          html` ${pauseButton} `,
          html` ${playButton} `
        )}
      </button>
      <button
        class="btn-close-lightbox"
        @click=${(x) => x.closeLightbox()}
        title="Close"
      >
        ${closeButton}
      </button>
    </div>
  </div>`
)}`;

const template = html<LightboxGallery>`
  <template>
    <slot name="sources"></slot>
    ${when(
      (x) => x.isOpen,
      html` <div class="wrapper">
        ${toolbarTemplate} ${splideTemplate} ${thumbnailTemplate}
        ${(x: LightboxGallery) =>
          x.initializeSplide(x.splideRef, x.thumbnailRef, x.currentIndex)}
      </div>`
    )}
  </template>
`;

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
