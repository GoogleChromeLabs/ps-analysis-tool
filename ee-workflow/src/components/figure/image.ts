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
 * External dependencies.
 */
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import Figure from '.';
import Main from '../../main';

/**
 * Class for creating image figures.
 * Contains the properties and methods that an image should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Image extends Figure {
  /**
   * Image to be displayed.
   */
  private image: p5.Image;

  /**
   * Width of the image.
   */
  private width: number;

  /**
   * Height of the image.
   */
  private height: number;

  constructor(
    canvasRunner: Main,
    x: number,
    y: number,
    imageData: string,
    width: number,
    height: number,
    id?: string,
    tags?: string[],
    mouseClicked?: () => void,
    mouseMoved?: () => void,
    onLeave?: () => void
  ) {
    super(
      canvasRunner,
      x,
      y,
      id,
      undefined,
      undefined,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );
    this.image = <p5.Image>this.p5?.loadImage(imageData);
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5?.push();
    this.p5?.imageMode(this.p5?.CENTER);
    this.p5?.image(this.image, this.x, this.y, this.width, this.height);
    this.p5?.pop();

    if (this.runSideEffect) {
      this.sideEffectOnDraw?.(this);
    }
  }

  isHovering(): boolean {
    return false;
  }

  reDraw(
    x?: number,
    y?: number,
    image?: p5.Image,
    width?: number,
    height?: number
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.image = image || this.image;
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    this.canvasRunner.reDrawAll();
  }
}
