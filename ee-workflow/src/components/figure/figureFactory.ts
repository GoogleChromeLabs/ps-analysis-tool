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
import Arc from './arc';
import Box from './box';
import Circle from './circle';
import Image from './image';
import Line from './line';
import Text from './text';

export type NextCoordinates = {
  left: { x: number; y: number };
  right: { x: number; y: number };
  up: { x: number; y: number };
  down: { x: number; y: number };
  middle: { x: number; y: number };
};

type FigureParams = {
  id?: string;
  x?: number;
  y?: number;
  fill?: string;
  stroke?: string;
  tags?: string[];
  shouldTravel?: boolean;
  travelInit?: (figure: Figure, ...args: any) => void;
  nextTipHelper?: (
    nextCoordinates: NextCoordinates,
    ...args: any
  ) => { x: number; y: number };
  mouseClicked?: () => void;
  mouseMoved?: () => void;
  onLeave?: () => void;
};

export default class FigureFactory {
  private canvasRunner: Main;

  private nextCoordinates: NextCoordinates = {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
    up: { x: 0, y: 0 },
    down: { x: 0, y: 0 },
    middle: { x: 0, y: 0 },
  };

  constructor(canvasRunner: Main) {
    this.canvasRunner = canvasRunner;
  }

  private nextTip(
    x?: number,
    y?: number,
    nextTipHelper?: FigureParams['nextTipHelper']
  ) {
    const possibleX = x ?? 0;
    const possibleY = y ?? 0;

    if (x === undefined || y === undefined) {
      if (!nextTipHelper) {
        throw new Error('x and y are required for figure');
      }

      const coordinates = nextTipHelper(this.nextCoordinates);
      return { possibleX: coordinates.x, possibleY: coordinates.y };
    }

    return { possibleX, possibleY };
  }

  private boxNextTips(x: number, y: number, width: number, height: number) {
    this.nextCoordinates = {
      left: { x, y: height / 2 },
      right: { x: width, y: height / 2 },
      up: { x: width / 2, y },
      down: { x: width / 2, y: height },
      middle: { x: x + width / 2, y: y + height / 2 },
    };
  }

  box({
    id,
    x,
    y,
    width,
    height,
    fill,
    stroke,
    tags,
    nextTipHelper,
    mouseClicked,
    mouseMoved,
    onLeave,
  }: FigureParams & {
    width: number;
    height: number;
  }): Box {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);
    this.boxNextTips(possibleX, possibleY, width, height);

    return new Box(
      this.canvasRunner,
      possibleX,
      possibleY,
      width,
      height,
      id,
      fill,
      stroke,

      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );
  }

  private circleNextTips(x: number, y: number, diameter: number) {
    this.nextCoordinates = {
      left: { x: x - diameter / 2, y },
      right: { x: x + diameter / 2, y },
      up: { x, y: y - diameter / 2 },
      down: { x, y: y + diameter / 2 },
      middle: { x, y },
    };
  }

  circle({
    id,
    x,
    y,
    diameter,
    fill,
    stroke,
    tags,
    shouldTravel,
    travelInit,
    nextTipHelper,
    mouseClicked,
    mouseMoved,
    onLeave,
  }: FigureParams & {
    diameter: number;
  }): Circle {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);

    this.circleNextTips(possibleX, possibleY, diameter);

    const circle = new Circle(
      this.canvasRunner,
      possibleX,
      possibleY,
      diameter,
      id,
      fill,
      stroke,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );

    if (shouldTravel) {
      travelInit?.(circle, possibleX, possibleY);
    }

    return circle;
  }

  private imageNextTips(x: number, y: number, width: number, height: number) {
    this.nextCoordinates = {
      left: { x: x - width / 2, y },
      right: { x: x + width / 2, y },
      up: { x, y: y - height / 2 },
      down: { x, y: y + height / 2 },
      middle: { x, y },
    };
  }

  image({
    id,
    x,
    y,
    imageData,
    width,
    height,
    tags,
    nextTipHelper,
    mouseClicked,
    mouseMoved,
    onLeave,
  }: FigureParams & {
    imageData: string;
    width: number;
    height: number;
  }): Image {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);

    this.imageNextTips(possibleX, possibleY, width, height);

    return new Image(
      this.canvasRunner,
      possibleX,
      possibleY,
      imageData,
      width,
      height,
      id,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );
  }

  private lineNextTips(x: number, y: number, endX: number, endY: number) {
    this.nextCoordinates = {
      left: { x, y },
      right: { x: endX, y: endY },
      up: { x, y },
      down: { x: endX, y: endY },
      middle: { x: (x + endX) / 2, y: (y + endY) / 2 },
    };
  }

  line({
    id,
    x,
    y,
    endX,
    endY,
    endXwith,
    endYwith,
    stroke,
    hasArrow,
    shouldTravel,
    tags,
    nextTipHelper,
    mouseClicked,
    mouseMoved,
    onLeave,
  }: FigureParams & {
    endX?: number;
    endY?: number;
    endXwith?: number;
    endYwith?: number;
    hasArrow?: boolean;
  }): Line {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);

    endX = endX ?? possibleX + (endXwith ?? 0);
    endY = endY ?? possibleY + (endYwith ?? 0);
    this.lineNextTips(possibleX, possibleY, endX, endY);

    const line = new Line(
      this.canvasRunner,
      possibleX,
      possibleY,
      endX,
      endY,
      id,
      stroke,
      hasArrow,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );

    if (shouldTravel) {
      let currentX = possibleX;
      let currentY = possibleY;
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

        if (
          Math.ceil(currentX) === Math.ceil(endX) &&
          Math.ceil(currentY) === Math.ceil(endY)
        ) {
          return true;
        }

        return false;
      };

      const resetTravel = (figure: Figure) => {
        const _figure = <Line>figure;
        currentX = possibleX;
        currentY = possibleY;
        _figure.setEndX(currentX);
        _figure.setEndY(currentY);
      };

      const completeTravel = (figure: Figure, skipDraw: boolean) => {
        const _figure = <Line>figure;
        _figure.setEndX(endX);
        _figure.setEndY(endY);

        if (!skipDraw) {
          _figure.draw();
        }
      };

      line.setTraveller(traveller);
      line.setResetTravel(resetTravel);
      line.setCompleteTravel(completeTravel);
    }

    return line;
  }

  private textNextTips(x: number, y: number) {
    // p5.textWidth is giving error, so for now everything has same points
    this.nextCoordinates = {
      left: { x, y },
      right: { x, y },
      up: { x, y },
      down: { x, y },
      middle: { x, y },
    };
  }

  text({
    id,
    x,
    y,
    text,
    size,
    fill,
    tags,
    nextTipHelper,
    mouseClicked,
    mouseMoved,
    onLeave,
  }: FigureParams & {
    text: string;
    size?: number;
  }): Text {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);

    this.textNextTips(possibleX, possibleY);

    return new Text(
      this.canvasRunner,
      possibleX,
      possibleY,
      text,
      id,
      size,
      fill,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );
  }

  private arcNextTips(x: number, y: number, diameter: number) {
    this.nextCoordinates = {
      left: { x: x - diameter / 2, y },
      right: { x: x + diameter / 2, y },
      up: { x, y: y - diameter / 2 },
      down: { x, y: y + diameter / 2 },
      middle: { x, y },
    };
  }

  arc({
    id,
    x,
    y,
    diameter,
    startAngle,
    stopAngle,
    shouldTravel,
    travelInit,
    fill,
    stroke,
    tags,
    mouseClicked,
    mouseMoved,
    onLeave,
    nextTipHelper,
  }: FigureParams & {
    diameter: number;
    startAngle: number;
    stopAngle: number;
  }): Arc {
    const { possibleX, possibleY } = this.nextTip(x, y, nextTipHelper);

    this.arcNextTips(possibleX, possibleY, diameter);

    const arc = new Arc(
      this.canvasRunner,
      possibleX,
      possibleY,
      diameter,
      startAngle,
      stopAngle,
      id,
      fill,
      stroke,
      tags,
      mouseClicked,
      mouseMoved,
      onLeave
    );

    if (shouldTravel) {
      travelInit?.(arc, possibleX, possibleY, startAngle, stopAngle, diameter);
    }

    return arc;
  }
}
