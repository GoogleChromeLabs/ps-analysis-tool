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

export default class Text extends Figure {
  str: string;
  size: number;

  constructor(
    x: number,
    y: number,
    str: string,
    size?: number,
    fill?: string,
    stroke?: string
  ) {
    super(x, y, fill, stroke);
    this.str = str;
    this.size = size || 16;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.stroke(this.stroke);
    this.p5?.textSize(this.size);
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

  remove() {
    this.p5?.push();
    this.p5?.fill(main.backgroundColor);
    this.p5?.stroke(main.backgroundColor);
    this.p5?.textSize(this.size);
    this.p5?.text(this.str, this.x, this.y);
    this.p5?.pop();
  }
}
