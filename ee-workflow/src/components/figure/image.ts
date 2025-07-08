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
  private image: () => p5.Image;

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
    imageLoader: () => p5.Image,
    width: number,
    height: number,
    canvasContainer: HTMLElement,
    id?: string,
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
      undefined,
      tags,
      canvasContainer,
      mouseClicked,
      mouseMoved,
      onLeave
    );
    this.image = imageLoader;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5?.push();
    this.p5?.imageMode(this.p5?.CENTER);
    this.p5?.image(this.image(), this.x, this.y, this.width, this.height);
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
    const xInViewPort =
      this.x - this.width / 2 >= rect.left &&
      this.x + this.width / 2 <= rect.right;
    const yInViewPort =
      this.y - this.height / 2 >= rect.top &&
      this.y + this.height / 2 <= rect.bottom;

    return xInViewPort && yInViewPort;
  }

  scroll(): void {
    if (!this.canvasContainer) {
      return;
    }

    this.canvasContainer.scrollTo({
      top: this.y - window.innerHeight / 2 + this.height / 2,
      left: this.x - window.innerWidth / 2 + this.width / 2,
      behavior: 'smooth',
    });
  }

  isHovering(): boolean {
    return (
      this.p5?.mouseX !== undefined &&
      this.p5?.mouseY !== undefined &&
      this.p5?.mouseX > this.x - this.width / 2 &&
      this.p5?.mouseX < this.x + this.width / 2 &&
      this.p5?.mouseY > this.y - this.height / 2 &&
      this.p5?.mouseY < this.y + this.height / 2
    );
  }

  reDraw(
    x?: number,
    y?: number,
    image?: () => p5.Image,
    width?: number,
    height?: number
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.image = image ?? this.image;
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    this.canvasRunner.reDrawAll();
  }

  shift(x?: number, y?: number) {
    this.x += x ?? 0;
    this.y += y ?? 0;
  }
}
