import { observable } from "@microsoft/fast-element";
import { DI } from "@microsoft/fast-element/di.js";

export interface TestService {
  hello(): void;
  mousePosition(): { x: number; y: number };
  cleanUp(): void;
}

export class TestServiceImpl implements TestService {
  @observable
  mousePos = { x: 0, y: 0 };

  mousePosChanged(newVal) {}

  constructor() {
    document.addEventListener(
      "pointermove",
      this.onpointerMoveHandler.bind(this)
    );
  }

  private onpointerMoveHandler(ev: PointerEvent) {
    this.mousePos = {
      x: ev.clientX,
      y: ev.clientY,
    };
  }

  hello(): void {
    console.log("Hello");
  }

  mousePosition(): { x: number; y: number } {
    return this.mousePos;
  }

  cleanUp(): void {
    document.removeEventListener("pointermove", this.onpointerMoveHandler);
  }
}

export const TestService = DI.createContext();
