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
 * Class for creating a box figure.
 * Contains the properties and methods that a box should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Box extends Figure {
  /**
   * Width of the box.
   */
  private width: number;

  /**
   * Height of the box.
   */
  private height: number;

  /**
   * Callback defined by the user to be executed when the box is clicked.
   */
  private customMouseClicked: (() => void) | undefined;

  constructor(
    canvasRuuner: Main,
    x: number,
    y: number,
    width: number,
    height: number,
    id?: string,
    fill?: string,
    stroke?: string,
    tags?: string[],
    mouseClicked?: () => void
  ) {
    super(canvasRuuner, x, y, id, fill, stroke, tags);
    this.width = width;
    this.height = height;
    this.customMouseClicked = mouseClicked;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.stroke(this.stroke);
    this.p5?.rect(this.x, this.y, this.width, this.height);
    this.p5?.pop();
  }

  mouseMoved() {
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

  mouseClicked() {
    // TODO: Discuss the function
    this.customMouseClicked?.();
  }

  isHovering(): boolean {
    if (this.p5?.mouseX === undefined || this.p5?.mouseY === undefined) {
      return false;
    }

    return (
      this.p5?.mouseX > this.x &&
      this.p5?.mouseX < this.x + this.width &&
      this.p5?.mouseY > this.y &&
      this.p5?.mouseY < this.y + this.height
    );
  }

  reDraw(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    fill?: string,
    stroke?: string
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    this.fill = fill || this.fill;
    this.stroke = stroke || this.stroke;
    this.canvasRunner.reDrawAll();
  }
}
