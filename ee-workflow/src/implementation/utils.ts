/*
 * Copyright 2025 Google LLC
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
import Figure from '../components/figure';
import Arc from '../components/figure/arc';
import Circle from '../components/figure/circle';
import { FigureFactory, Group, NextCoordinates } from '../components';
import Main from '../main';

export const circleTravelInit = (endX?: number, endY?: number) => {
  return (object: Figure, ...args: any) => {
    const circle = <Circle>object;
    const possibleX = args[0];
    const possibleY = args[1];
    let currentX = possibleX;
    let currentY = possibleY;
    const _endX = endX ?? 0;
    const _endY = endY ?? 0;
    let lerpSpeed = 0.01;
    circle.setShouldTravel(true);

    const traveller = (figure: Figure, speed: number) => {
      const _figure = <Circle>figure;
      const p = _figure.getP5();

      currentX = p?.lerp(currentX, _endX, lerpSpeed * speed) ?? _endX;
      currentY = p?.lerp(currentY, _endY, lerpSpeed * speed) ?? _endY;

      _figure.setX(currentX);
      _figure.setY(currentY);
      _figure.draw();

      if (
        (Math.floor(currentX) === Math.floor(_endX) &&
          Math.floor(currentY) === Math.floor(_endY)) ||
        (Math.ceil(currentX) === Math.ceil(_endX) &&
          Math.ceil(currentY) === Math.ceil(_endY))
      ) {
        return true;
      }

      lerpSpeed += 0.0003;

      return false;
    };

    const resetTravel = (figure: Figure) => {
      const _figure = <Circle>figure;
      currentX = possibleX;
      currentY = possibleY;
      _figure.setX(currentX);
      _figure.setY(currentY);
      lerpSpeed = 0.01;
    };

    const completeTravel = (figure: Figure, skipDraw: boolean) => {
      const _figure = <Circle>figure;
      _figure.setX(_endX);
      _figure.setY(_endY);

      if (!skipDraw) {
        _figure.draw();
      }
    };

    circle.setTraveller(traveller);
    circle.setResetTravel(resetTravel);
    circle.setCompleteTravel(completeTravel);
  };
};

export const getRandomOffset = (range: number) =>
  Math.floor(Math.random() * range) - range / 2;

export const arcTravelInit = (startDiameterOnTravel: number) => {
  return (object: Figure, ...args: any) => {
    let currentDiameter = startDiameterOnTravel ?? 0;
    const [possibleX, possibleY, startAngle, stopAngle, diameter] = args;

    const arc = <Arc>object;
    arc.setShouldTravel(true);
    arc.setDiameter(currentDiameter);

    const clearTravelMarks = (p: p5 | null) => {
      p?.push();
      p?.stroke('white');
      p?.arc(
        possibleX - 1,
        possibleY,
        currentDiameter / 2 + 5,
        currentDiameter / 2 + 5,
        startAngle,
        stopAngle
      );
      p?.pop();
    };

    const traveller = (figure: Figure, speed: number) => {
      const _figure = <Arc>figure;
      const p = _figure.getP5();

      currentDiameter = currentDiameter + 5 * speed;

      _figure.setDiameter(currentDiameter);

      if (currentDiameter > 0) {
        clearTravelMarks(p);
        _figure.draw();
      }

      if (Math.ceil(currentDiameter) === Math.ceil(diameter)) {
        clearTravelMarks(p);
        _figure.setDiameter(0);

        return true;
      }

      return false;
    };

    const resetTravel = (figure: Figure) => {
      const _figure = <Arc>figure;
      currentDiameter = startDiameterOnTravel ?? 0;
      _figure.setDiameter(currentDiameter);
    };

    const completeTravel = (figure: Figure, skipDraw: boolean) => {
      const _figure = <Arc>figure;
      _figure.setDiameter(0);

      if (!skipDraw) {
        currentDiameter = diameter;
        clearTravelMarks(_figure.getP5());
      }
    };

    arc.setTraveller(traveller);
    arc.setResetTravel(resetTravel);
    arc.setCompleteTravel(completeTravel);
  };
};

export const rippleEffect = (mainCanvas: Main, mainFF: FigureFactory) => {
  return (diameter: number, times: number) => {
    const startingCoordinates = {
      x: 0,
      y: 0,
    };

    const arcs = Array.from({ length: times }, (_, index) => {
      return mainFF.arc({
        diameter,
        startAngle: -Math.PI / 2,
        stopAngle: Math.PI / 2,
        fill: 'white',
        stroke: 'white',
        shouldTravel: true,
        travelInit: arcTravelInit(-index * 200),
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          if (!index) {
            startingCoordinates.x = nextCoordinates.middle.x + 52;
            startingCoordinates.y = nextCoordinates.middle.y;
          }

          return startingCoordinates;
        },
      });
    });

    const arcGroup = new Group(mainCanvas, arcs);

    return arcGroup;
  };
};
