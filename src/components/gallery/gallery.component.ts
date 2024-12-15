import { css, FASTElement, html, ref, when } from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import defaultStyle from "./gallery.styles.ts";
import { observable } from "@microsoft/fast-element";
import { repeat } from "@microsoft/fast-element";
import { isEqual } from "lodash";

const styles = [
  defaultStyle,
  css`
    .wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      flex-direction: column;
    }

    .splide {
      position: relative;
      width: 100%;
      max-width: 90%;
      background: transparent;
      border-radius: 10px;
      overflow: hidden;
      z-index: 2;
    }

    .splide__slide {
      text-align: center;
    }

    .splide__slide img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
    }

    .thumbnails {
      display: flex;
      margin: 1rem auto 0;
      padding: 0;
      justify-content: center;
    }

    .thumbnail {
      width: 100px;
      height: 100px;
      overflow: hidden;
      list-style: none;
      margin: 0 0.2rem;
      cursor: pointer;
      opacity: 0.3;
    }

    .thumbnail img {
      width: 100%;
      height: auto;
    }

    .thumbnail.is-active {
      opacity: 1;
    }

    .thumbnail.is-active {
      border-radius: 8px;
      outline: 2px solid red;
      outline-offset: -2px;
    }

    .splide__pagination {
      visibility: hidden;
    }
  `,
];

type ImgMetadata = {
  src: string;
  alt: string;
};
class LightboxGallery extends FASTElement {
  // Properties
  @observable
  imgArray: ImgMetadata[] = [];
  @observable
  splideRef?: HTMLElement;
  @observable
  thumbnailRef?: HTMLElement;
  @observable
  splideInstance?: _Splide;
  @observable
  currentElement?: Element;

  // Methods
  initImageArray(): void {
    const sourcesSlot = this.shadowRoot?.querySelector(
      'slot[name="sources"]'
    ) as HTMLSlotElement;
    const assignedElements = sourcesSlot?.assignedElements();
    const dataLightboxElement = assignedElements.find((x) =>
      x.hasAttribute("data-lightbox")
    )?.children;
    if (!dataLightboxElement) return;
    this.imgArray = Array.from(dataLightboxElement)
      .filter((el) => el.tagName === "IMG")
      .map((el) => {
        const img = el as HTMLImageElement;
        return { src: img.src, alt: img.alt } as ImgMetadata;
      });
  }

  initializeSplide(splideRef?: HTMLElement, thumbnailRef?: HTMLElement): void {
    if (!splideRef) return;
    this.splideInstance = new _Splide(splideRef, {
      type: "loop",
      perPage: 1,
      focus: "center",
      autoplay: true,
    });

    if (!thumbnailRef) {
      this.splideInstance.mount();
    }

    const thumbnailArray = thumbnailRef?.children
      ? Array.from(thumbnailRef?.children)
      : [];

    thumbnailArray.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        this.splideInstance?.go(index);
      });
    });

    this.splideInstance.on("mounted move", () => {
      if (!this.splideInstance) return;
      const thumbnail = thumbnailArray[this.splideInstance.index];
      if (thumbnail) {
        if (this.currentElement)
          this.currentElement.classList.remove("is-active");
        thumbnail.classList.add("is-active");
        this.currentElement = thumbnail;
      }
    });

    this.splideInstance.mount();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.initImageArray();
    this.initializeSplide(this.splideRef);
  }
}

const splideTemplate = html`
  ${when(
    (x: LightboxGallery) => x.imgArray.length > 0,
    html`
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
    `
  )}
`;

const thumbnailTemplate = html`
  ${when(
    (x: LightboxGallery) => x.imgArray.length > 0,
    html<LightboxGallery>`
      <ul ${ref("thumbnailRef")} class="thumbnails">
        ${repeat(
          (x) => x.imgArray,
          html<ImgMetadata>`
            <li class="thumbnail">
              ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
            </li>
          `
        )}
      </ul>
    `
  )}
`;

const template = html<LightboxGallery>`
  <style>
    slot[name="sources"] {
      display: none;
    }
  </style>
  <slot name="sources"></slot>
  <div class="wrapper">
    ${splideTemplate} ${thumbnailTemplate}
    ${(x: LightboxGallery) => x.initializeSplide(x.splideRef, x.thumbnailRef)}
  </div>
`;

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
