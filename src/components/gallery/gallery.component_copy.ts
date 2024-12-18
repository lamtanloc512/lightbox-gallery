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
import normalizeStyle from "./normalize.style.ts";
import defaultStyle from "./splide.styles.ts";
import style from "./gallery.styles.ts";

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
  viewport?: HTMLElement;

  @observable
  start = { x: 0, y: 0 };

  @observable
  offset = { x: 0, y: 0 };

  @observable
  scale = 1;

  // Methods
  initialize(): void {
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

  initEventForSlotNodes(): void {
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

  handleZoomOut(): void {
    const currentMainSlideIndex = this.mainSplide?.index;
    if (!this.mainSplideChildren || currentMainSlideIndex === undefined) return;

    const curr = this.mainSplideChildren[currentMainSlideIndex]
      .firstElementChild as HTMLElement;
    if (!curr) return;

    const currentScale = parseFloat(
      curr.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1"
    );
    const newScale = currentScale - 0.5; // Decrease scale by 0.5

    // Apply new scale (min scale 1)
    this.scale = Math.max(newScale, 1);

    curr.style.transform = `scale(${this.scale})`;

    // Reset cursor when back to normal size
    if (this.scale === 1) {
      curr.style.cursor = "default";
    }
  }

  handleZoomIn(): void {
    if (this.autoPlay) this.mainSplide?.Components.Autoplay.pause();
    this.mainSplide?.Components.Drag.disable(true);
    const currentMainSlideIndex = this.mainSplide?.index;
    if (!this.mainSplideChildren || currentMainSlideIndex === undefined) return;

    const curr = this.mainSplideChildren[currentMainSlideIndex]
      .firstElementChild as HTMLElement;
    if (!curr) return;

    this.viewport = curr;

    // Get current scale or default to 1
    const currentScale = parseFloat(
      curr.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1"
    );
    const newScale = currentScale + 0.5;

    // Apply new scale (max scale 3)
    const scale = Math.min(newScale, 3);

    curr.style.transform = `scale(${scale})`;
    curr.style.transition = "transform 0.3s ease";

    // Optional: Add cursor style to indicate draggable when zoomed
    if (scale > 1) {
      curr.style.cursor = "grab";
      this.setupPanningZoom();
    }
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

  private handlePanStart = (ev: MouseEvent): void => {
    ev.preventDefault();
    this.isPanning = true;
    this.start = {
      x: ev.clientX - this.offset.x,
      y: ev.clientY - this.offset.y,
    };
  };

  private handlePanMove = (ev: MouseEvent): void => {
    if (!this.isPanning) return;
    this.isPanning = true;
    this.offset = {
      x: ev.clientX - this.start.x,
      y: ev.clientY - this.start.y,
    };
  };

  private handlePanEnd = (e: MouseEvent): void => {
    this.isPanning = false;
  };

  // Reset function for when changing slides or zooming out
  resetZoom(): void {
    if (!this.mainSplideChildren) return;

    this.isPanning = false;
    this.currentX = 0;
    this.currentY = 0;

    this.mainSplideChildren.forEach((slide) => {
      const img = slide.firstElementChild as HTMLElement;
      if (img) {
        img.style.transform = "translate(0, 0) scale(1)";
        img.style.cursor = "default";
      }
    });

    this.cleanupPanningZoom();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.initialize();
    this.initEventForSlotNodes();
  }

  // Don't forget to add this to your component cleanup
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
              ${ref("viewport")}
              style="transform: translate(${(x) => x.offset.x}px, ${(x) =>
                x.offset.y}px) scale(${(x) => x.scale})"
              ${children({
                property: "mainSplideChildren",
                filter: elements("li"),
              })}
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
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#ffffff"
        >
          <path
            d="M8 11H11M14 11H11M11 11V8M11 11V14"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M17 17L21 21"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <button @click=${(x) => x.handleZoomOut()} title="Zoom Out">
        <?xml version="1.0" encoding="UTF-8"?><svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#ffffff"
        >
          <path
            d="M17 17L21 21"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M8 11L14 11"
            stroke="#ffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <button
        @click=${(x: LightboxGallery) => x.resetZoom()}
        title="Reset Zoom"
      >
        <?xml version="1.0" encoding="UTF-8"?><svg
          width="20"
          height="20"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#ffffffff"
        >
          <path
            d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11"
            stroke="#ffffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
            stroke="#ffffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13"
            stroke="#ffffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21"
            stroke="#ffffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <button @click=${(x) => x.handleAutoPlay()} title="Auto Play">
        ${when(
          (x) => x.autoPlay,
          html`
            <?xml version="1.0" encoding="UTF-8"?><svg
              width="24px"
              height="24px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#ffffff"
            >
              <path
                d="M6 18.4V5.6C6 5.26863 6.26863 5 6.6 5H9.4C9.73137 5 10 5.26863 10 5.6V18.4C10 18.7314 9.73137 19 9.4 19H6.6C6.26863 19 6 18.7314 6 18.4Z"
                stroke="#ffffff"
                stroke-width="1.5"
              ></path>
              <path
                d="M14 18.4V5.6C14 5.26863 14.2686 5 14.6 5H17.4C17.7314 5 18 5.26863 18 5.6V18.4C18 18.7314 17.7314 19 17.4 19H14.6C14.2686 19 14 18.7314 14 18.4Z"
                stroke="#ffffff"
                stroke-width="1.5"
              ></path>
            </svg>
          `
        )}
        ${when(
          (x) => !x.autoPlay,
          html`
            <?xml version="1.0" encoding="UTF-8"?><svg
              width="24px"
              height="24px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#ffffff"
            >
              <path
                d="M6.90588 4.53682C6.50592 4.2998 6 4.58808 6 5.05299V18.947C6 19.4119 6.50592 19.7002 6.90588 19.4632L18.629 12.5162C19.0211 12.2838 19.0211 11.7162 18.629 11.4838L6.90588 4.53682Z"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          `
        )}
      </button>
      <button
        class="btn-close-lightbox"
        @click=${(x) => x.closeLightbox()}
        title="Close"
      >
        <?xml version="1.0" encoding="UTF-8"?><svg
          width="24px"
          height="24px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#ffffff"
        >
          <path
            d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  </div>`
)}`;

const template = html<LightboxGallery>`
  <slot name="sources"></slot>
  ${when(
    (x) => x.isOpen,
    html` <div class="wrapper">
      ${toolbarTemplate} ${splideTemplate} ${thumbnailTemplate}
      ${(x: LightboxGallery) =>
        x.initializeSplide(x.splideRef, x.thumbnailRef, x.currentIndex)}
    </div>`
  )}
`;

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
