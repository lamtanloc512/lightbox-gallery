import {
  attr,
  children,
  css,
  elements,
  FASTElement,
  html,
  observable,
  ref,
  repeat,
  when,
} from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import defaultStyle from "./gallery.styles.ts";

const styles = [
  defaultStyle,
  css`
    body::-webkit-scrollbar {
      width: 12px; /* width of the entire scrollbar */
    }
    .wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 94%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      flex-direction: column;
    }

    .splide__slide {
      text-align: center;
    }

    .splide__slide img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    .splide__main {
      padding: 5%;
    }
    .splide__thumbnail {
      max-width: 100%;
      overflow-x: hidden;
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .thumbnails {
      display: flex;
      margin: 1rem auto 0;
      padding: 0;
      justify-content: center;
    }

    .thumbnail {
      overflow: hidden;
      list-style: none;
      margin: 0 0.2rem;
      cursor: pointer;
      opacity: 0.3;
      border-radius: 8px;
      outline: 2px solid white;
      outline-offset: -2px;
      opacity: 0.5;
    }

    .thumbnail img {
      width: 100%;
      height: auto;
    }

    .thumbnail.is-active {
      border-radius: 8px;
      outline: 3px solid red;
      outline-offset: -2px;
      opacity: 1;
    }

    .btn-close-lightbox {
      position: absolute;
      top: 2%;
      right: 2%;
      z-index: 99999;
    }
  `,
];

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
  currentIndex?: number;
  @observable
  currentThumbnail?: HTMLElement;
  @observable
  imageNodes?: Element[] = [];

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

    this.imageNodes = Array.from(dataLightboxElement).filter(
      (el) => el.tagName === "IMG"
    );

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
      arrows: false,
      perPage: 1,
    });

    if (!thumbnailRef) {
      this.mainSplide.mount();
      return;
    }

    this.thumbnailSplide = new _Splide(thumbnailRef, {
      focus: "center",
      fixedWidth: 100,
      fixedHeight: 60,
      wheel: true,
      rewind: false,
      pagination: false,
      isNavigation: true,
      useIndex: true,
      breakpoints: {
        600: {
          fixedWidth: 60,
          fixedHeight: 44,
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
            <ul class="splide__list">
              ${repeat(
                (x) => x.imgArray,
                html<ImgMetadata>`
                  <li class="splide__slide">
                    ${(x) => html`<img src="${x.src}" alt="${x.alt}" />`}
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
              })}}
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

const template = html<LightboxGallery>`
  <slot name="sources"></slot>
  ${when(
    (x) => x.isOpen,
    html` <div class="wrapper">
      <button class="btn-close-lightbox" @click=${(x) => x.closeLightbox()}>
        Close
      </button>
      ${splideTemplate} ${thumbnailTemplate}
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
