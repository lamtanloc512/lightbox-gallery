import { FASTElement, html, css, observable } from "@microsoft/fast-element";
import { TestService } from "../../service/test.service";

const template = html<TestGallery>`
  <div>
    <h1>Mouse position X: ${(x) => x.testService?.mousePosition().x}</h1>
    <h1>Mouse position Y: ${(x) => x.testService?.mousePosition().y}</h1>
  </div>
`;

const styles = [css``];

export class TestGallery extends FASTElement {
  @TestService testService?: TestService;

  @observable
  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.testService) return;
    this.mousePosition = this.testService.mousePosition();
  }

  disconnectedCallback(): void {
    this.testService?.cleanUp();
  }
}

export const config = {
  name: "test-gallery",
  template,
  styles,
};

TestGallery.define(config);
