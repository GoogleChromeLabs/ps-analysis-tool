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
import Box from './box';
import Circle from './circle';
import Image from './image';
import Line from './line';
import Text from './text';

export default class FigureFactory {
  private canvasRunner: Main;

  constructor(canvasRunner: Main) {
    this.canvasRunner = canvasRunner;
  }

  box(
    x: number,
    y: number,
    width: number,
    height: number,
    fill?: string,
    stroke?: string
  ): Box {
    return new Box(this.canvasRunner, x, y, width, height, fill, stroke);
  }

  circle(
    x: number,
    y: number,
    diameter: number,
    fill?: string,
    stroke?: string
  ): Circle {
    return new Circle(this.canvasRunner, x, y, diameter, fill, stroke);
  }

  image(
    x: number,
    y: number,
    imageData: string,
    width: number,
    height: number
  ): Image {
    return new Image(this.canvasRunner, x, y, imageData, width, height);
  }

  line(
    x: number,
    y: number,
    endX: number,
    endY: number,
    stroke?: string,
    hasArrow?: boolean,
    shouldTravel?: boolean
  ): Line {
    const line = new Line(
      this.canvasRunner,
      x,
      y,
      endX,
      endY,
      stroke,
      hasArrow
    );

    if (shouldTravel) {
      let currentX = x;
      let currentY = y;
      line.setShouldTravel(shouldTravel);
      line.setEndX(currentX);
      line.setEndY(currentY);

      const traveller = (figure: Figure) => {
        const _figure = <Line>figure;
        const p5 = _figure.getP5();

        if (hasArrow) {
          _figure.remove();
        }

        currentX = p5?.lerp(currentX, endX, 0.1) ?? endX;
        currentY = p5?.lerp(currentY, endY, 0.1) ?? endY;

        _figure.setEndX(currentX);
        _figure.setEndY(currentY);
        _figure.draw();

        if (Math.round(currentX) === endX && Math.round(currentY) === endY) {
          return true;
        }

        return false;
      };

      line.setTraveller(traveller);
    }

    return line;
  }

  text(x: number, y: number, text: string, size?: number, fill?: string): Text {
    return new Text(this.canvasRunner, x, y, text, size, fill);
  }
}
