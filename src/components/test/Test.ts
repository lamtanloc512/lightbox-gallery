import {
  FASTElement,
  html,
  observable,
  ref,
  css,
} from "@microsoft/fast-element";
export class TestGallery extends FASTElement {
  @observable
  viewport?: HTMLElement;
  @observable
  start = { x: 0, y: 0 };
  @observable
  offset = { x: 0, y: 0 };
  @observable
  isPanning: boolean = false;

  panStart = (ev: MouseEvent) => {
    ev.preventDefault();
    this.isPanning = true;
    this.start = {
      x: ev.clientX - this.offset.x,
      y: ev.clientY - this.offset.y,
    };
  };

  panMove = (ev: MouseEvent) => {
    if (!this.isPanning) return;
    this.isPanning = true;
    this.offset = {
      x: ev.clientX - this.start.x,
      y: ev.clientY - this.start.y,
    };
  };

  panEnd = () => {
    this.isPanning = false;
  };

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.viewport) return;
    this.viewport.addEventListener("pointerdown", this.panStart);
    this.viewport.addEventListener("pointermove", this.panMove);
    this.viewport.addEventListener("pointerup", this.panEnd);
  }

  disconnectedCallback(): void {
    if (!this.viewport) return;
    this.viewport.removeEventListener("pointerdown", this.panStart);
    this.viewport.removeEventListener("pointermove", this.panMove);
    this.viewport.removeEventListener("pointerup", this.panEnd);
  }
}

const template = html<TestGallery>`
  <div
    class="container"
    ${ref("viewport")}
    style="transform: translate(${(x) => x.offset.x}px, ${(x) =>
      x.offset.y}px) scale(5)"
  >
    <h1>${(x) => x.offset.x} ${(x) => x.offset.x}</h1>
    <img
      src="https://images.pexels.com/photos/16471876/pexels-photo-16471876/free-photo-of-banh-m-mon-an-ban-cai-gh.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt=""
    />
  </div>
`;

const styles = css`
  .container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    touch-action: none; /* Disable touch scrolling for panning */
  }
  img {
    transition: transform 0.1s ease-out;
    will-change: transform;
    cursor: grab;
  }
`;

TestGallery.define({
  name: "test-gallery",
  template: template,
  styles,
});
