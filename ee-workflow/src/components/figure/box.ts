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

  constructor(
    canvasRuuner: Main,
    x: number,
    y: number,
    width: number,
    height: number,
    canvasContainer: HTMLElement,
    id?: string,
    fill?: string,
    stroke?: string,
    tags?: string[],
    dispatcherId?: string,
    mouseClicked?: (figure: Figure) => void,
    mouseMoved?: (figure: Figure) => void,
    onLeave?: (figure: Figure) => void
  ) {
    super(
      canvasRuuner,
      x,
      y,
      id,
      fill,
      stroke,
      tags,
      canvasContainer,
      dispatcherId,
      mouseClicked,
      mouseMoved,
      onLeave
    );
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5?.push();
    this.p5?.fill(this.fill);
    this.p5?.stroke(this.stroke);
    this.p5?.rect(this.x, this.y, this.width, this.height);
    this.p5?.pop();

    if (this.runSideEffect) {
      this.sideEffectOnDraw?.(this);
    } else {
      this.runSideEffect = true;
    }
  }

  protected isPointInViewPort() {
    if (!this.canvasContainer) {
      return false;
    }

    const rect = this.canvasContainer?.getBoundingClientRect();

    const scrollTop = this.canvasContainer?.scrollTop;
    const top = scrollTop;
    const bottom = scrollTop + rect.height;

    const scrollLeft = this.canvasContainer?.scrollLeft;
    const left = scrollLeft;
    const right = scrollLeft + rect.width;

    return (
      this.x + this.width / 2 >= left &&
      this.x + this.width / 2 <= right &&
      this.y + this.height / 2 >= top &&
      this.y + this.height / 2 <= bottom
    );
  }

  scroll() {
    this.canvasContainer?.scrollTo({
      top: this.y + this.height / 2,
      left: this.x + this.width / 2,
      behavior: 'smooth',
    });
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

  shift(x?: number, y?: number) {
    this.x += x ?? 0;
    this.y += y ?? 0;
  }
}
