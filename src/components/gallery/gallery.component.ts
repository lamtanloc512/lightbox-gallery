import { css, FASTElement, html } from "@microsoft/fast-element";
import { Splide as _Splide } from "@splidejs/splide";
import defaultStyle from "./gallery.styles.ts";
import { slotted } from "@microsoft/fast-element";
import { observable } from "@microsoft/fast-element";

const template = html`
  <div class="wrapper">
    <section id="main-carousel" class="splide" aria-label="My Awesome Gallery">
      <div class="splide__track">
        <slot name="sources"></slot>
      </div>
    </section>
    <section>
      <ul id="thumbnails" class="thumbnails">
        <li class="thumbnail">
          <img
            src="https://cdn-cm.freepik.com/resources/6d2ef100-2ba9-4a4c-9750-f714eb8e5d99.jpg?token=exp=1734079945~hmac=1d9c69783e3617c0c404879013fc37fdb8838349c132aaf3d4e312bcbcc9b662"
            alt=""
          />
        </li>
        <li class="thumbnail">
          <img
            src="https://cdn-cm.freepik.com/resources/86feed89-28ce-4135-8a41-65e7bde2532f.jpg?token=exp=1734079973~hmac=a9e0e07660cd34a28ccf2fd18d834a3b5335358f1b7ce694e04a9c6263539e56"
            alt=""
          />
        </li>
        <li class="thumbnail">
          <img
            src="https://cdn-cm.freepik.com/resources/821a5f45-ea60-4066-937e-867cf3c240e2.jpg?token=exp=1734080710~hmac=e97b79c500d12fc817c4d7e5547aa41e46552899993b30df45763b99f36cd8f6"
            alt=""
          />
        </li>
      </ul>
    </section>
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

class LightboxGallery extends FASTElement {
  @observable
  slottedSources?: HTMLElement[] = [];

  override connectedCallback() {
    super.connectedCallback();
    const root = this.shadowRoot?.querySelector("#main-carousel");
    const el = root as HTMLElement;
    if (!el) return;

    const splide = new _Splide(el, {
      autoplay: true,
    });

    console.log(splide);

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
}

LightboxGallery.define({
  name: "lightbox-gallery",
  template,
  styles,
});
