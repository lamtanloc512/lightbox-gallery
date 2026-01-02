/**
 * Styles for LightboxGallery component
 * @module gallery.styles
 */

import { css, type ElementStyles } from "@microsoft/fast-element";
import defaultStyle from "./splide.styles.ts";

/**
 * CSS Custom Properties for theming:
 *
 * --lb-backdrop-color: Background color of the lightbox overlay
 * --lb-toolbar-bg: Toolbar button background color
 * --lb-toolbar-hover-bg: Toolbar button hover background
 * --lb-toolbar-active-bg: Toolbar button active/pressed background
 * --lb-thumbnail-opacity: Opacity of inactive thumbnails
 * --lb-thumbnail-active-opacity: Opacity of active thumbnail
 * --lb-thumbnail-border-radius: Border radius of thumbnails
 * --lb-arrow-bg: Arrow button background color
 * --lb-arrow-hover-bg: Arrow button hover background
 * --lb-z-index: Z-index of the lightbox overlay
 */
const componentStyles: ElementStyles = css`
  :host {
    /* CSS Custom Properties with defaults */
    --lb-backdrop-color: rgba(0, 0, 0, 0.6);
    --lb-toolbar-bg: #1b1b1b78;
    --lb-toolbar-hover-bg: #3d3d3dda;
    --lb-toolbar-active-bg: #97969678;
    --lb-thumbnail-opacity: 0.5;
    --lb-thumbnail-active-opacity: 1;
    --lb-thumbnail-border-radius: 8px;
    --lb-arrow-bg: #b1b1b178;
    --lb-arrow-hover-bg: #3d3d3dda;
    --lb-arrow-active-bg: #c4c4c478;
    --lb-z-index: 1000000000;
  }

  :host([is-open]) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: var(--lb-z-index);
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Main Container */
  .lb--container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    box-sizing: border-box;
    background-color: var(--lb-backdrop-color);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-wrap: wrap;
  }

  /* Slideshow */
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

  /* Thumbnail - Horizontal */
  .lb--thumbnail {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    padding: 1rem 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Thumbnail - Vertical */
  .lb--thumbnail--vertical {
    position: fixed;
    right: 0;
    bottom: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    padding: 1rem 0;
    margin: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Thumbnail Images */
  .lb--thumbnail .splide__slide img,
  .lb--thumbnail--vertical .splide__slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Thumbnail Items */
  .lb--thumbnail .lb--thumbnail--item,
  .lb--thumbnail--vertical .lb--thumbnail--item {
    overflow: hidden;
    list-style: none;
    cursor: pointer;
    opacity: var(--lb-thumbnail-opacity);
    border-radius: var(--lb-thumbnail-border-radius);
    outline: 2px solid white;
    outline-offset: -2px;
    transition: opacity 0.2s ease;
    aspect-ratio: 1 / 1;
  }

  .lb--thumbnail .lb--thumbnail--item.is-active,
  .lb--thumbnail--vertical .lb--thumbnail--item.is-active {
    opacity: var(--lb-thumbnail-active-opacity);
  }

  /* Toolbar */
  .lb--toolbar {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    right: 0;
    z-index: var(--lb-z-index);
  }

  .lb--sidebar--toggle {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 45px;
    right: 0;
    z-index: var(--lb-z-index);
  }

  /* Toolbar & Sidebar Buttons */
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
    background-color: var(--lb-toolbar-bg);
    transition: background-color 0.15s ease;
  }

  .lb--toolbar button:hover,
  .lb--sidebar--toggle button:hover {
    background-color: var(--lb-toolbar-hover-bg);
  }

  .lb--toolbar button:active,
  .lb--sidebar--toggle button:active {
    background-color: var(--lb-toolbar-active-bg);
  }

  .lb--toolbar button:focus-visible,
  .lb--sidebar--toggle button:focus-visible {
    outline: 2px solid white;
    outline-offset: -2px;
  }

  /* Slideshow Arrows */
  .lb--slideshow .splide__arrow {
    width: 40px;
    height: 40px;
    background-color: var(--lb-arrow-bg);
    transition: background-color 0.15s ease;
  }

  .lb--slideshow .splide__arrow:hover {
    background-color: var(--lb-arrow-hover-bg);
  }

  .lb--slideshow .splide__arrow:active {
    background-color: var(--lb-arrow-active-bg);
  }

  /* Vertical Thumbnail Arrows */
  .lb--thumbnail--vertical .splide__arrow {
    width: 40px;
    height: 40px;
    background-color: var(--lb-arrow-bg);
    transition: background-color 0.15s ease;
  }

  .lb--thumbnail--vertical .splide__arrow:hover {
    background-color: var(--lb-arrow-hover-bg);
  }

  .lb--thumbnail--vertical .splide__arrow:active {
    background-color: var(--lb-arrow-active-bg);
  }
`;

/**
 * Combined styles for the gallery component
 */
export const galleryStyles = [defaultStyle, componentStyles];

// Default export for backward compatibility
export default componentStyles;
