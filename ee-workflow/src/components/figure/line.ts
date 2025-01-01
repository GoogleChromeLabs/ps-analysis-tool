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
    stroke?: string,
    hasArrow?: boolean
  ) {
    super(canvasRunner, x, y, undefined, stroke);
    this.endX = endX;
    this.endY = endY;
    this.hasArrow = hasArrow ?? false;
  }

  draw() {
    this.p5?.push();
    this.p5?.stroke(this.stroke);
    this.p5?.line(this.x, this.y, this.endX, this.endY);
    if (this.hasArrow) {
      const angle = <number>(
        this.p5?.atan2(this.y - this.endY, this.x - this.endX)
      );
      this.p5?.translate(this.endX, this.endY);
      this.p5?.rotate(angle - this.p5?.HALF_PI);
      this.p5?.fill(this.stroke);
      this.p5?.beginShape();
      this.p5?.vertex(0, 0);
      this.p5?.vertex(-5, 10);
      this.p5?.vertex(5, 10);
      this.p5?.endShape(this.p5?.CLOSE);
    }
    this.p5?.pop();
  }

  onHover() {
    this.savePreviousColors();
    this.stroke = 'red'; // TODO: Discuss the function
    this.canvasRunner.addFigure(this, true);
  }

  onLeave() {
    if (
      this.fill === this.previousFill &&
      this.stroke === this.previousStroke
    ) {
      return;
    }

    this.reApplyPreviousColors();
    this.canvasRunner.addFigure(this, true);
  }

  onClick() {
    // TODO: Discuss the function
  }

  isHovering(): boolean {
    return false; // TODO: Implement if line hover is needed
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
}
