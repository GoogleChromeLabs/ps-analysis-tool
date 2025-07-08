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
 * Class for creating a arc figure.
 * Contains the properties and methods that a arc should have.
 * Extends the Figure class to inherit the basic properties and methods.
 */
export default class Arc extends Figure {
  /**
   * Diameter of the arc.
   */
  diameter: number;

  /**
   * Start angle of the arc.
   */
  startAngle: number;

  /**
   * Stop angle of the arc.
   */
  stopAngle: number;

  /**
   * Callback defined by the user to be executed when the arc is clicked.
   */

  constructor(
    canvasRuuner: Main,
    x: number,
    y: number,
    diameter: number,
    startAngle: number,
    stopAngle: number,
    canvasContainer: HTMLElement,
    id?: string,
    fill?: string,
    stroke?: string,
    tags?: string[],
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
      mouseClicked,
      mouseMoved,
      onLeave
    );

    this.diameter = diameter;
    this.startAngle = startAngle;
    this.stopAngle = stopAngle;
  }

  draw() {
    this.p5?.push();
    this.p5?.arc(
      this.x,
      this.y,
      this.diameter / 2,
      this.diameter / 2,
      this.startAngle,
      this.stopAngle,
      this.p5.OPEN
    );
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

    const rect = this.canvasContainer.getBoundingClientRect();

    const scrollTop = this.canvasContainer.scrollTop;
    const top = scrollTop;
    const bottom = scrollTop + rect.height;

    const scrollLeft = this.canvasContainer.scrollLeft;
    const left = scrollLeft;
    const right = scrollLeft + rect.width;

    return (
      this.x >= left && this.x <= right && this.y >= top && this.y <= bottom
    );
  }

  scroll() {
    this.canvasContainer?.scrollTo({
      top: this.y,
      left: this.x,
      behavior: 'smooth',
    });
  }

  isHovering(): boolean {
    if (this.p5?.mouseX === undefined || this.p5?.mouseY === undefined) {
      return false;
    }

    return (
      this.p5?.mouseX > this.x &&
      this.p5?.mouseX < this.x + this.diameter &&
      this.p5?.mouseY > this.y &&
      this.p5?.mouseY < this.y + this.diameter
    );
  }

  reDraw(
    x?: number,
    y?: number,
    diameter?: number,
    startAngle?: number,
    stopAngle?: number,
    fill?: string,
    stroke?: string
  ) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.diameter = diameter ?? this.diameter;
    this.startAngle = startAngle ?? this.startAngle;
    this.stopAngle = stopAngle ?? this.stopAngle;
    this.fill = fill || this.fill;
    this.stroke = stroke || this.stroke;
    this.canvasRunner.reDrawAll();
  }

  setDiameter(diameter: number) {
    this.diameter = diameter;
  }

  shift(x?: number, y?: number) {
    this.x += x ?? 0;
    this.y += y ?? 0;
  }
}
