/**
 * ZoomController - Handles zoom and pan functionality for the lightbox
 * @module controllers/zoom
 */

import type { Position, ZoomState } from "../types";

export interface ZoomControllerHost {
  viewport?: HTMLElement;
  scale: number;
  offset: Position;
  isPanning: boolean;
  isZoomming: boolean;
}

/**
 * Controller class for managing zoom and pan operations
 */
export class ZoomController {
  private host: ZoomControllerHost;
  private start: Position = { x: 0, y: 0 };

  // Zoom constraints
  private readonly minScale = 0.75;
  private readonly maxScale = 4;
  private readonly zoomStep = 0.25;

  constructor(host: ZoomControllerHost) {
    this.host = host;
  }

  /**
   * Get current zoom state
   */
  getState(): ZoomState {
    return {
      scale: this.host.scale,
      offset: { ...this.host.offset },
      isPanning: this.host.isPanning,
    };
  }

  /**
   * Zoom in by one step
   */
  zoomIn(): void {
    this.host.isZoomming = true;
    const newScale = this.host.scale + this.zoomStep;
    this.host.scale = Math.min(newScale, this.maxScale);

    if (this.host.scale > 1) {
      this.setCursor("grab");
      this.setupPanningListeners();
    }
  }

  /**
   * Zoom out by one step
   */
  zoomOut(): void {
    const newScale = this.host.scale - this.zoomStep;
    this.host.scale = Math.max(newScale, this.minScale);

    if (this.host.scale <= 1) {
      this.setCursor("grab");
    }
  }

  /**
   * Reset zoom and pan to default state
   */
  reset(): void {
    this.host.isPanning = false;
    this.host.isZoomming = false;
    this.host.offset = { x: 0, y: 0 };
    this.host.scale = 1;
    this.setCursor("default");
    this.removePanningListeners();
  }

  /**
   * Check if currently zoomed
   */
  isZoomed(): boolean {
    return this.host.scale !== 1;
  }

  // Private methods

  private setCursor(cursor: string): void {
    if (this.host.viewport) {
      this.host.viewport.style.cursor = cursor;
    }
  }

  private setupPanningListeners(): void {
    if (!this.host.viewport) return;
    this.host.viewport.addEventListener("pointerdown", this.handlePanStart);
    this.host.viewport.addEventListener("pointermove", this.handlePanMove);
    this.host.viewport.addEventListener("pointerup", this.handlePanEnd);
  }

  private removePanningListeners(): void {
    if (!this.host.viewport) return;
    this.host.viewport.removeEventListener("pointerdown", this.handlePanStart);
    this.host.viewport.removeEventListener("pointermove", this.handlePanMove);
    this.host.viewport.removeEventListener("pointerup", this.handlePanEnd);
  }

  private handlePanStart = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.host.isPanning = true;
    this.start = {
      x: ev.clientX - this.host.offset.x,
      y: ev.clientY - this.host.offset.y,
    };

    if (this.host.viewport) {
      this.host.viewport.style.transition = "none";
    }
  };

  private handlePanMove = (ev: PointerEvent): void => {
    if (!this.host.isPanning) return;
    this.host.offset = {
      x: ev.clientX - this.start.x,
      y: ev.clientY - this.start.y,
    };
  };

  private handlePanEnd = (): void => {
    this.host.isPanning = false;
    if (this.host.viewport) {
      this.host.viewport.style.transition =
        "all 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95)";
    }
  };

  /**
   * Cleanup all event listeners
   */
  destroy(): void {
    this.removePanningListeners();
  }
}
