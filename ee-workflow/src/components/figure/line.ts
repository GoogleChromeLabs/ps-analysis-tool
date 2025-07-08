/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Internal dependencies.
 */
import Figure from '.';
import Main from '../../main';

/**
 * Class for creating line figures.
 * Contains the properties and methods that a line should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Line extends Figure {
  /**
   * End x coordinate of the line.
   */
  private endX: number;

  /**
   * End y coordinate of the line.
   */
  private endY: number;

  /**
   * Whether the line has an arrow at the end.
   */
  private hasArrow: boolean;

  constructor(
    canvasRunner: Main,
    x: number,
    y: number,
    endX: number,
    endY: number,
    canvasContainer: HTMLElement,
    id?: string,
    stroke?: string,
    hasArrow?: boolean,
    tags?: string[],
    mouseClicked?: (figure: Figure) => void,
    mouseMoved?: (figure: Figure) => void,
    onLeave?: (figure: Figure) => void
  ) {
    super(
      canvasRunner,
      x,
      y,
      id,
      undefined,
      stroke,
      tags,
      canvasContainer,
      mouseClicked,
      mouseMoved,
      onLeave
    );
    this.endX = endX;
    this.endY = endY;
    this.hasArrow = hasArrow ?? false;
  }

  private drawArrow(size = 5) {
    const angle = <number>(
      this.p5?.atan2(this.y - this.endY, this.x - this.endX)
    );
    this.p5?.translate(this.endX, this.endY);
    this.p5?.rotate(angle - this.p5?.HALF_PI);
    this.p5?.fill(this.stroke);
    this.p5?.stroke(255);
    this.p5?.beginShape();
    this.p5?.vertex(0, 0);
    this.p5?.vertex(-size, size * 2);
    this.p5?.vertex(size, size * 2);
    this.p5?.endShape(this.p5?.CLOSE);
  }

  draw() {
    this.p5?.push();
    this.p5?.stroke(this.stroke);
    this.p5?.line(this.x, this.y, this.endX, this.endY);
    const dist = this.p5?.dist(this.x, this.y, this.endX, this.endY) ?? 0;
    if (this.hasArrow && dist > 10) {
      this.drawArrow();
    }
    this.p5?.pop();

    if (this.runSideEffect) {
      this.sideEffectOnDraw?.(this);
    } else {
      this.runSideEffect = true;
    }
  }

  protected isPointInViewPort(): boolean {
    if (!this.canvasContainer) {
      return false;
    }

    const rect = this.canvasContainer.getBoundingClientRect();
    const scrollTop = this.canvasContainer.scrollTop;
    const scrollLeft = this.canvasContainer.scrollLeft;

    return (
      this.x >= scrollLeft &&
      this.x <= scrollLeft + rect.width &&
      this.y >= scrollTop &&
      this.y <= scrollTop + rect.height &&
      this.endX >= scrollLeft &&
      this.endX <= scrollLeft + rect.width &&
      this.endY >= scrollTop &&
      this.endY <= scrollTop + rect.height
    );
  }

  scroll() {
    if (!this.canvasContainer) {
      return;
    }

    this.canvasContainer.scrollTo({
      top: this.y - window.innerHeight / 2 + Math.abs(this.endY - this.y) / 2,
      left: this.x - window.innerWidth / 2 + Math.abs(this.endX - this.x) / 2,
      behavior: 'smooth',
    });
  }

  getEndX(): number {
    return this.endX;
  }

  setEndX(endX: number) {
    this.endX = endX;
  }

  getEndY(): number {
    return this.endY;
  }

  setEndY(endY: number) {
    this.endY = endY;
  }

  isHovering(): boolean {
    return false; // TODO: Implement if line hover is needed
  }

  remove() {
    const previousStroke = this.stroke;
    this.stroke = this.canvasRunner.getBackgroundColor().toString();

    this.draw();

    this.stroke = previousStroke;
  }

  reDraw(
    x?: number,
    y?: number,
    endX?: number,
    endY?: number,
    stroke?: string
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.endX = endX ?? this.endX;
    this.endY = endY ?? this.endY;
    this.stroke = stroke || this.stroke;
    this.canvasRunner.reDrawAll();
  }

  shift(x?: number, y?: number) {
    this.x += x ?? 0;
    this.y += y ?? 0;
    this.endX += x ?? 0;
    this.endY += y ?? 0;
  }
}
