import {
  css,
  FASTElement,
  html,
  observable,
  slotted,
  ViewTemplate,
} from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import defaultStyle from "./gallery.styles.ts";
import { repeat } from "@microsoft/fast-element";
import { isEqual } from "lodash";

type ImageProps = {
  src: string;
  alt: string;
};

class LightboxGallery extends FASTElement {
  @observable
  slottedSources?: HTMLElement[] = [];

  @observable
  count: number = 0;

  @observable
  private _splide?: _Splide;

  @observable
  _dataSlotted: ImageProps[] = [];

  setAllImageMetadata(): void {
    const ulElement = this.slottedSources?.find((el) => el.tagName === "UL");
    if (!ulElement) return;
    const allImgNodes = ulElement.querySelectorAll("img");
    const imageMetadata =
      allImgNodes.length === 0
        ? []
        : Array.from(allImgNodes).map((x) => {
            return { src: x.src, alt: x.alt };
          });

    this._dataSlotted = [...imageMetadata];
  }

  _splideChanged(_oldValue: _Splide, _newValue: _Splide) {}

  _dataSlottedChanged(_oldValue: ImageProps[], _newValue: ImageProps[]) {
    if (_newValue.length === 0) return;

    const root = this.shadowRoot?.querySelector("[data-lightbox]");
    const el = root as HTMLElement;
    if (!el) return;

    const splide = new _Splide(el, {
      autoplay: true,
      perPage: 1,
    }).mount();
  }

  slottedSourcesChanged(_oldValue: HTMLElement[], _newValue: HTMLElement[]) {
    if (_newValue.length === 0) return;
    const ulElement = this.slottedSources?.find((el) => el.tagName === "UL");
    if (!ulElement) return;
    const allImgNodes = ulElement.querySelectorAll("img");
    const imageMetadata =
      allImgNodes.length === 0
        ? []
        : Array.from(allImgNodes).map((x) => {
            return { src: x.src, alt: x.alt };
          });
    this._dataSlotted = [...imageMetadata];
  }

  createMainCarousel(): ViewTemplate {
    return html`
      <section class="splide" data-lightbox>
        <div class="splide__track">
          <ul class="splide__list">
            ${repeat(
              (x: LightboxGallery) => x._dataSlotted,
              html<ImageProps>`
                <li class="splide__slide">
                  ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
                </li>
              `
            )}
          </ul>
        </div>
      </section>
    `;
  }

  createThumbnailsCarousel(): ViewTemplate {
    return html`
      <section>
        <ul class="thumbnails">
          ${repeat(
            (x: LightboxGallery) => x._dataSlotted,
            html<ImageProps>`
              <li class="thumbnail">
                ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }
}

const template = html<LightboxGallery>`
  <style>
    slot[name="sources"] {
      display: none;
    }
  </style>
  <div class="wrapper">
    <slot name="sources" ${slotted("slottedSources")}></slot>
    ${(x) => x.createMainCarousel()}
  </div>
`;
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
      z-index: 10000;
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
      width: 100%;
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
    .thumbnail.is-active img {
      border-radius: 8px;
      outline: 2px solid red;
      outline-offset: -2px;
    }
    .splide__pagination {
      visibility: hidden;
    }
  `,
];

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
