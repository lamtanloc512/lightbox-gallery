import { css } from "@microsoft/fast-element";

export default css`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000000000;
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .lb--container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.98);
    display: flex;
    flex-wrap: wrap;
  }

  .lb--slideshow {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .lb--slideshow .splide__track {
    overflow: visible;
  }

  .lb--slideshow .splide__slide {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
  }
  .lb--slideshow .splide__slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .lb--thumbnail {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    padding: 1rem 0;
    margin: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lb--thumbnail--vertical {
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    padding: 1rem 0;
    margin: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lb--thumbnail .splide__slide img,
  .lb--thumbnail--vertical .splide__slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .lb--thumbnail .lb--thumbnail--item,
  .lb--thumbnail--vertical .lb--thumbnail--item {
    overflow: hidden;
    list-style: none;
    cursor: pointer;
    opacity: 0.3;
    border-radius: 8px;
    outline: 2px solid white;
    outline-offset: -2px;
    transition: ease 0.2s;
    opacity: 0.5;
  }
  .lb--thumbnail .lb--thumbnail--item.is-active,
  .lb--thumbnail--vertical .lb--thumbnail--item.is-active {
    opacity: 1;
  }
  .lb--toolbar {
    display: flex;
    justify-content: end;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000000000;
  }
  .lb--sidebar--toggle {
    display: flex;
    justify-content: end;
    position: fixed;
    top: 45px;
    right: 0;
    z-index: 1000000000;
  }

  .lb--toolbar button,
  .lb--sidebar--toggle button {
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    vertical-align: middle;
    text-align: center;
    background-color: #1b1b1b78;
  }

  .lb--toolbar button:hover,
  .lb--sidebar--toggle button:hover {
    background-color: #3d3d3dda;
  }
  .lb--toolbar button:active,
  .lb--sidebar--toggle button:active {
    background-color: #97969678;
  }

  .lb--slideshow .splide__arrow {
    width: 40px;
    height: 40px;
    background-color: #b1b1b178;
  }
  .lb--slideshow .splide__arrow:hover {
    background-color: #3d3d3dda;
  }
  .lb--slideshow .splide__arrow:active {
    background-color: #c4c4c478;
  }

  .lb--thumbnail--vertical .splide__arrow {
    width: 40px;
    height: 40px;
    background-color: #b1b1b178;
  }
  .lb--thumbnail--vertical .splide__arrow:hover {
    background-color: #3d3d3dda;
  }
  .lb--thumbnail--vertical .splide__arrow:active {
    background-color: #c4c4c478;
  }
`;
