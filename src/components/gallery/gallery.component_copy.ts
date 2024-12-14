import {
  css,
  FASTElement,
  html,
  observable,
  slotted,
} from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import defaultStyle from "./gallery.styles.ts";
import { attr } from "@microsoft/fast-element";

type ImageProps = {
  src: string;
  alt: string;
};

const template = html<LightboxGallery>`
  ${(x) =>
    x.isOpen
      ? html`
          <!-- <style>
            slot[name="source"] {
              display: none;
            }
          </style> -->
          <slot name="source" ${slotted("slottedSource")}></slot>
          <div class="wrapper">
            <div class="splide"></div>
          </div>
        `
      : html`<slot name="source" ${slotted("slottedSource")}></slot>`}
`;

class LightboxGallery extends FASTElement {
  @attr({ attribute: "is-open", mode: "boolean" })
  isOpen: boolean = false;

  @observable
  readonly slottedSource?: HTMLElement[] = [];

  private splide?: _Splide;

  @observable
  imageMetadata?: ImageProps[] = [];

  slottedSourceChanged(_oldSlot: HTMLElement[], newSlot: HTMLElement[]) {
    const ulEl = newSlot.find((el) => el.hasAttribute("data-lightbox"));
    const imgEls = ulEl?.querySelectorAll("img");
    if (!imgEls) return;
    this.imageMetadata = Array.from(imgEls).map((img) => {
      return {
        src: (img as HTMLImageElement).src,
        alt: (img as HTMLImageElement).alt,
      };
    });

    this.initSplide();
  }

  initSplide() {
    if (this.splide) {
      this.splide.destroy();
    }

    const root = this.shadowRoot?.querySelector(".splide");
    const rootEl = root as HTMLElement;
    if (!rootEl) return;

    const mainCarouselTemplate = `
      <div class="splide__track">
        <ul class="splide__list">
          ${this.imageMetadata
            ?.map(
              (data) =>
                `<li class="splide__slide">
                  <img src=${data.src} alt=${data.alt} />
                </li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    this.splide = new _Splide(rootEl, {
      perPage: 1,
      type: "loop",
      autoplay: true,
    });

    const splide = this.splide;

    const thumbnailsCarouselTemplate = `
      <div>
        <ul class="thumbnails">
          ${this.imageMetadata
            ?.map(
              (data) =>
                `<li class="thumbnail">
                  <img src=${data.src} alt=${data.alt} />
                </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
    rootEl.innerHTML = Array.of(
      mainCarouselTemplate,
      thumbnailsCarouselTemplate
    ).join("");

    const thumbnails = this.shadowRoot?.querySelectorAll(".thumbnail");
    let current: Element;
    if (!thumbnails || thumbnails?.length == 0) return;

    for (let i = 0; i < thumbnails.length; i++) {
      initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail: Element, index: number) {
      thumbnail.addEventListener("click", function () {
        splide.go(index);
      });
    }

    splide.on("mounted move", function () {
      const thumbnail = thumbnails[splide.index];

      if (thumbnail) {
        if (current) {
          current.classList.remove("is-active");
        }

        thumbnail.classList.add("is-active");
        current = thumbnail;
      }
    });

    splide.mount();
  }

  handleClick() {
    this.splide?.go("+1");
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }
}

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

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
