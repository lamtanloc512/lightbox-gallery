import { html, type ViewTemplate } from "@microsoft/fast-element";

export const zoomInButton: ViewTemplate = html`
  <?xml version="1.0" encoding="UTF-8"?>
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
`;

export const zoomOutButton: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
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
  </svg>`;
export const resetZoomButton: ViewTemplate = html`<?xml version="1.0" encoding="UTF-8"?><svg
    width="20px"
    height="20px"
    stroke-width="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#ffffff"
  >
    <path
      d="M6.67742 20.5673C2.53141 18.0212 0.758026 12.7584 2.71678 8.1439C4.87472 3.0601 10.7453 0.68822 15.8291 2.84617C20.9129 5.00412 23.2848 10.8747 21.1269 15.9585C20.2837 17.945 18.8736 19.5174 17.1651 20.5673"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M17 16V20.4C17 20.7314 17.2686 21 17.6 21H22"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M12 22.01L12.01 21.9989"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>`;

export const pauseButton: ViewTemplate = html`<?xml version="1.0" encoding="UTF-8"?><svg
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
  </svg>`;
export const playButton: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
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
  </svg>`;
export const closeButton: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
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
  </svg>`;
export const arrowLeft: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#ffffff"
  >
    <path
      d="M13 6L19 12L13 18"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M5 6L11 12L5 18"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>`;
export const arrowRight: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#ffffff"
  >
    <path
      d="M11 6L5 12L11 18"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M19 6L13 12L19 18"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>`;
export const horizontal: ViewTemplate = html`<?xml version="1.0" encoding="UTF-8"?><svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#ffffff"
  >
    <path
      d="M12 22L12 2"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M19 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z"
      stroke="#ffffff"
      stroke-width="1.5"
    ></path>
  </svg>`;
export const vertical: ViewTemplate = html` <?xml version="1.0" encoding="UTF-8"?><svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#ffffff"
  >
    <path
      d="M22 12L2 12"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M8 19V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z"
      stroke="#ffffff"
      stroke-width="1.5"
    ></path>
  </svg>`;

export const prevSvg: ViewTemplate = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 40 40"
  width="40"
  height="40"
  focusable="false"
>
  <path
    d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
  ></path>
</svg>`;
export const nextSvg: ViewTemplate = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 40 40"
  width="40"
  height="40"
  focusable="false"
>
  <path
    d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
  ></path>
</svg>`;
