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
 * Class for creating a circle figure.
 * Contains the properties and methods that a circle should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Circle extends Figure {
  /**
   * Diameter of the circle.
   */
  diameter: number;

  constructor(
    canvasRunner: Main,
    x: number,
    y: number,
    diameter: number,
    fill?: string,
    stroke?: string
  ) {
    super(canvasRunner, x, y, fill, stroke);
    this.diameter = diameter;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.stroke(this.stroke);
    this.p5?.circle(this.x, this.y, this.diameter);
    this.p5?.pop();
  }

  onHover() {
    this.savePreviousColors();
    this.fill = 'red'; // TODO: Discuss the function
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
    if (this.p5?.mouseX === undefined || this.p5?.mouseY === undefined) {
      return false;
    }

    return (
      this.p5?.dist(this.x, this.y, this.p5.mouseX, this.p5.mouseY) <
      this.diameter / 2
    );
  }

  remove() {
    this.p5?.push();
    this.p5?.fill(this.canvasRunner.backgroundColor);
    this.p5?.stroke(this.canvasRunner.backgroundColor);
    this.p5?.circle(this.x, this.y, this.diameter + 1);
    this.p5?.pop();
  }

  reDraw(
    x?: number,
    y?: number,
    diameter?: number,
    fill?: string,
    stroke?: string
  ) {
    this.remove();
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.diameter = diameter ?? this.diameter;
    this.fill = fill || this.fill;
    this.stroke = stroke || this.stroke;
    this.canvasRunner.reDrawAll();
  }
}
