import { css } from "@microsoft/fast-element";

export default css`
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
    box-sizing: border-box;
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
    padding: 0;
  }
  .splide__thumbnail {
    max-width: 100%;
    overflow-x: hidden;
    position: absolute;
    bottom: 0;
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

  .tool-bar-nav {
    height: 45px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .tool-bar-panel {
    position: absolute;
    z-index: 3;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    background: rgba(35, 35, 35, 0.65);
  }

  .tool-bar-panel button {
    margin: 0;
    height: 100%;
    width: 45px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    vertical-align: middle;
    text-align: center;
  }

  .tool-bar-panel button {
  }

  .tool-bar-panel button:hover {
    background-color: #57555578;
  }
  .tool-bar-panel button:active {
    background-color: #97969678;
  }
`;
