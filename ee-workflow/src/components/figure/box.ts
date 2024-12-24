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

import Figure from '.';
import main from '../../main';

export default class Box extends Figure {
  width: number;
  height: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    fill?: string,
    stroke?: string
  ) {
    super(x, y, fill, stroke);
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.stroke(this.stroke);
    this.p5?.rect(this.x, this.y, this.width, this.height);
    this.p5?.pop();
  }

  onHover() {
    this.savePreviousColors();
    this.fill = 'red'; // TODO: Discuss the function
    main.addFigure(this, true);
  }

  onLeave() {
    if (
      this.fill === this.previousFill &&
      this.stroke === this.previousStroke
    ) {
      return;
    }

    this.reApplyPreviousColors();
    main.addFigure(this, true);
  }

  onClick() {
    // TODO: Discuss the function
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

  remove() {
    this.p5?.push();
    this.p5?.fill(main.backgroundColor);
    this.p5?.stroke(main.backgroundColor);
    this.p5?.rect(this.x, this.y, this.width, this.height);
    this.p5?.pop();
  }

  reDraw(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    fill?: string,
    stroke?: string
  ) {
    this.remove();
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    this.fill = fill || this.fill;
    this.stroke = stroke || this.stroke;
    main.reDrawAll();
  }
}
