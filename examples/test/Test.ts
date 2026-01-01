/**
 * Test Component Example
 *
 * This component demonstrates DI injection and FAST Element patterns.
 * Not included in production bundle.
 *
 * @example
 * ```typescript
 * // Import DI first, then component
 * import '../src/di';
 * import './test/Test';
 * ```
 */

import {
  FASTElement,
  html,
  css,
  observable,
  customElement,
} from "@microsoft/fast-element";
import { TestService } from "../src/service/test.service";

const template = html<TestGallery>`
  <div>
    <h1>Mouse position X: ${(x) => x.testService?.mousePosition().x}</h1>
    <h1>Mouse position Y: ${(x) => x.testService?.mousePosition().y}</h1>
  </div>
`;

const styles = css`
  :host {
    display: block;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  h1 {
    font-size: 1.25rem;
    color: #333;
  }
`;

/**
 * Test Gallery Component
 * Demonstrates DI and observable patterns
 */
@customElement({
  name: "test-gallery",
  template,
  styles: [styles],
})
export class TestGallery extends FASTElement {
  @TestService testService?: TestService;

  @observable
  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.testService) return;
    this.mousePosition = this.testService.mousePosition();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.testService?.cleanUp();
  }
}
