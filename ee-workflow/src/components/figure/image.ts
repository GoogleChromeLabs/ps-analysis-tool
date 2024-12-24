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

import p5 from 'p5';
import Figure from '.';
import main from '../../main';

export default class Image extends Figure {
  image: p5.Image;
  width: number;
  height: number;

  constructor(
    x: number,
    y: number,
    image: p5.Image,
    width: number,
    height: number
  ) {
    super(x, y);
    this.image = image;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5?.push();
    this.p5?.image(this.image, this.x, this.y, this.width, this.height);
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
    const whiteImage = this.p5?.createImage(
      this.width,
      this.height
    ) as p5.Image;

    whiteImage.set(this.x, this.y, this.p5?.color(255) as p5.Color);

    this.p5?.push();
    this.p5?.image(whiteImage, this.x, this.y, this.width, this.height);
    this.p5?.pop();
  }

  reDraw(
    x?: number,
    y?: number,
    image?: p5.Image,
    width?: number,
    height?: number
  ) {
    this.remove();
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.image = image || this.image;
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    main.reDrawAll();
  }
}
