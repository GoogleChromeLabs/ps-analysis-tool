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
 * Class for creating text figures.
 * Contains the properties and methods that a text should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Text extends Figure {
  /**
   * Text to be displayed.
   */
  private str: string;

  /**
   * Font size of the text.
   */
  private size: number;

  constructor(
    canvasRunnner: Main,
    x: number,
    y: number,
    str: string,
    size?: number,
    fill?: string
  ) {
    super(canvasRunnner, x, y, fill);
    this.str = str;
    this.size = size || 16;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.textSize(this.size);
    this.p5?.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5?.text(this.str, this.x, this.y);
    this.p5?.pop();
  }

  onHover() {
    return;
  }

  onLeave() {
    return;
  }

  onClick() {
    // TODO: Discuss the function
  }

  isHovering(): boolean {
    return false;
  }

  reDraw(
    x?: number,
    y?: number,
    str?: string,
    size?: number,
    fill?: string,
    stroke?: string
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.str = str || this.str;
    this.size = size ?? this.size;
    this.fill = fill || this.fill;
    this.stroke = stroke || this.stroke;
    this.canvasRunner.reDrawAll();
  }
}
