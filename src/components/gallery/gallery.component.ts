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
  autoPlay: boolean = false;

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

  handleScroll(): void {}

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
    if (this.autoPlay) this.mainSplide?.Components.Autoplay.pause();
  }
  handleZoomIn(): void {
    if (this.autoPlay) this.mainSplide?.Components.Autoplay.pause();
    this.mainSplide?.Components.Drag.disable(true);
    const currentMainSlideIndex = this.mainSplide?.index;
    if (!this.mainSplideChildren || !currentMainSlideIndex) return;
    const curr = this.shadowRoot?.querySelector(".splide__main") as HTMLElement;
    console.log(curr);
    if (!curr) return;

    // Get current scale or default to 1
    const currentScale = parseFloat(
      curr.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1"
    );
    const newScale = currentScale + 0.5; // Increase scale by 0.5, adjust this value as needed

    // Apply new scale (max scale 3)
    const scale = Math.min(newScale, 3);

    curr.style.transform = `scale(${scale})`;
    curr.style.transition = "transform 0.3s ease";
    curr.style.transformOrigin = "center center";

    // Optional: Add cursor style to indicate draggable when zoomed
    if (scale > 1) {
      curr.style.cursor = "move";
      curr.setAttribute("draggable", "true");
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.initialize();
    this.initEventForSlotNodes();
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
      <button @click=${(x) => x.handleZoomIn()}>
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
      <button @click=${(x) => x.handleZoomOut()}>
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
      <button @click=${(x) => x.handleAutoPlay()}>
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
      <button class="btn-close-lightbox" @click=${(x) => x.closeLightbox()}>
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
