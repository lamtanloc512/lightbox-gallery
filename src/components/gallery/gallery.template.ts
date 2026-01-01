/**
 * Templates for Lightbox Gallery component
 * @module gallery.template
 */

import {
  html,
  ref,
  repeat,
  when,
  children,
  elements,
} from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { LightboxGallery } from "./gallery.component.ts";
import type { ImgMetadata } from "./types.ts";
import {
  arrowLeft,
  arrowRight,
  closeButton,
  horizontal,
  nextSvg,
  pauseButton,
  playButton,
  prevSvg,
  resetZoomButton,
  vertical,
  zoomInButton,
  zoomOutButton,
} from "./toolbar.icons.ts";

/**
 * Template for the main slideshow
 */
export const splideTemplate: ViewTemplate<LightboxGallery> = html<LightboxGallery>`
  ${when(
    (x) => x.imgArray.length > 0,
    html`
      <div ${ref("splideRef")} class="splide">
        <div class="splide__arrows">
          ${when(
            (x) => !x.isVertical,
            html` <button class="splide__arrow splide__arrow--prev">
                ${prevSvg}
              </button>
              <button class="splide__arrow splide__arrow--next">
                ${nextSvg}
              </button>`
          )}
        </div>
        <div class="splide__track">
          <ul
            class="splide__list"
            ${children({
              property: "mainSplideChildren",
              filter: elements("li"),
            })}
            ${ref("viewport")}
            style="
              transform: translate(${(x) => x.offset.x}px, ${(x) =>
              x.offset.y}px) scale(${(x) => x.scale});
              max-height: ${(x) => x.slideshowMaxHeight}px"
          >
            ${repeat(
              (x) => x.imgArray,
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
    `
  )}
`;

/**
 * Template for horizontal thumbnail navigation
 */
export const thumbnailTemplate: ViewTemplate<LightboxGallery> = html<LightboxGallery>`
  ${when(
    (x) => x.imgArray.length > 0,
    html<LightboxGallery>`
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
                <li class="splide__slide lb--thumbnail--item">
                  ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    `
  )}
`;

/**
 * Template for vertical thumbnail navigation
 */
export const thumbnailTemplateVertical: ViewTemplate<LightboxGallery> = html<LightboxGallery>`
  ${when(
    (x) => x.imgArray.length > 0,
    html<LightboxGallery>`
      <div ${ref("thumbnailRefVertical")} class="splide">
        <div class="splide__arrows">
          ${when(
            (x) => x.isVertical,
            html` <button class="splide__arrow splide__arrow--prev">
                ${prevSvg}
              </button>
              <button class="splide__arrow splide__arrow--next">
                ${nextSvg}
              </button>`
          )}
        </div>
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
                <li class="splide__slide lb--thumbnail--item">
                  ${(x) => html`<img src=${x.src} alt=${x.alt} />`}
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    `
  )}
`;

/**
 * Template for the toolbar with controls
 */
export const toolbarTemplate: ViewTemplate<LightboxGallery> = html<LightboxGallery>` ${when(
  (x) => x.imgArray.length > 0,
  html`
    ${(x) =>
      x.isVertical
        ? html`<button
            @click=${(x: LightboxGallery) =>
              x.handleCollapseThumbnailVertical()}
            title="Toggle Sidebar"
            aria-label="Toggle sidebar visibility"
          >
            ${(x) => (x.collapseThumbnailVertical ? arrowRight : arrowLeft)}
          </button>`
        : ""}
    <button
      @click=${(x) => x.handleZoomIn()}
      title="Zoom In"
      aria-label="Zoom in"
    >
      ${zoomInButton}
    </button>
    <button
      @click=${(x) => x.handleZoomOut()}
      title="Zoom Out"
      aria-label="Zoom out"
    >
      ${zoomOutButton}
    </button>
    <button
      @click=${(x) => x.resetZoom()}
      title="Reset Zoom"
      aria-label="Reset zoom to default"
    >
      ${resetZoomButton}
    </button>
    <button
      @click=${(x) => x.handleAutoPlay()}
      title="Auto Play"
      aria-label="${(x) => (x.autoPlay ? "Pause slideshow" : "Play slideshow")}"
    >
      ${when((x) => x.autoPlay, html` ${pauseButton} `, html` ${playButton} `)}
    </button>
    <button
      @click=${(x) => x.toggleLayout()}
      title="Toggle Layout"
      aria-label="Toggle between horizontal and vertical layout"
    >
      ${when((x) => x.isVertical, html` ${horizontal} `, html` ${vertical} `)}
    </button>
    <button
      class="btn-close-lightbox"
      @click=${(x) => x.closeLightbox()}
      title="Close"
      aria-label="Close lightbox"
    >
      ${closeButton}
    </button>
  `
)}`;

/**
 * Main template for the LightboxGallery component
 */
export const galleryTemplate: ViewTemplate<LightboxGallery> = html<LightboxGallery>`
  <template>
    <div class="lb--sources">
      <slot name="sources"></slot>
    </div>
    ${when(
      (x) => x.isOpen,
      html<LightboxGallery>`
        <div
          class="lb--container"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox gallery"
        >
          <div
            class="lb--toolbar"
            role="toolbar"
            aria-label="Lightbox controls"
          >
            ${toolbarTemplate}
          </div>
          <div class="lb--slideshow">${splideTemplate}</div>
          <div
            class="lb--thumbnail--vertical"
            style="display: ${(x) => (x.isVertical ? "flex" : "none")}; ${(x) =>
              x.collapseThumbnailVertical ? "width: 0" : ""}"
            aria-hidden="${(x) => !x.isVertical}"
          >
            ${thumbnailTemplateVertical}
          </div>
          <div
            class="lb--thumbnail"
            style="display: ${(x) => (!x.isVertical ? "flex" : "none")}"
            aria-hidden="${(x) => x.isVertical}"
          >
            ${thumbnailTemplate}
          </div>
          ${(x: LightboxGallery) =>
            x.initializeSplide(
              x.splideRef,
              x.thumbnailRef,
              x.thumbnailRefVertical,
              x.currentIndex
            )}
        </div>
      `
    )}
  </template>
`;
