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
 * Internal dependencies
 */
import app from '../app';
import config, { publisherData } from '../config';
import { isInsideCircle, scrollToCoordinates } from '../utils';
import { getCoordinateValues } from '../utils/getCoordinateValues';
import type { Coordinates } from '../types';

type FlowExpanderProps = {
  nextTipCoordinates: Coordinates[];
  typeOfBranches?: string;
};

type MouseEvent = {
  offsetX: number;
  offsetY: number;
};

const FlowExpander = async ({
  nextTipCoordinates,
  typeOfBranches,
}: FlowExpanderProps): Promise<void | { x: number; y: number }> => {
  const p = app.p;
  const igp = app.igp;

  if (!p || !igp) {
    return;
  }

  const iconSize = config.timeline.expandIconSize;
  const iconRadius = iconSize / 2;
  const currentSite =
    config.timeline.circles[app.timeline.currentIndex].website;

  igp.mouseMoved = ({
    offsetX,
    offsetY,
  }: {
    offsetX: number;
    offsetY: number;
  }) => {
    let hoveringOverSomething = false;
    nextTipCoordinates.forEach((coordinates) => {
      const { x, y } = getCoordinateValues(coordinates);
      if (isInsideCircle(offsetX, offsetY, x, y + 27, iconRadius)) {
        hoveringOverSomething = true;
      }
    });
    if (hoveringOverSomething) {
      p.cursor('pointer');
    } else {
      p.cursor('default');
    }
    return false;
  };

  const endpoint = await new Promise<{ x: number; y: number }>((resolve) => {
    igp.mouseClicked = (event: MouseEvent | undefined) => {
      nextTipCoordinates.forEach((coordinates, index) => {
        const { x, y } = getCoordinateValues(coordinates);
        const offsetX = event?.offsetX ?? 0;
        const offsetY = event?.offsetY ?? 0;
        if (isInsideCircle(offsetX, offsetY, x, y + 27, iconRadius)) {
          igp.mouseClicked();
          igp.mouseMoved();
          if (typeOfBranches === 'datetime') {
            app.setSelectedDateTime(
              `${publisherData[currentSite].branches[index].date} ${publisherData[currentSite].branches[index].time}`
            );
          } else {
            app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
          }
          resolve({ x, y });
          return;
        }
      });
    };
  });

  nextTipCoordinates.forEach((coordinates) => {
    const { x, y } = getCoordinateValues(coordinates);
    p.push();
    p.noStroke();
    p.circle(x, y + 27, 25);
    p.pop();

    if (endpoint.x !== x) {
      p.push();
      p.tint(255, 90);
      p.image(p.expandIcon, x - iconRadius, y + 17, iconSize, iconSize);
      p.pop();
    } else {
      p.push();
      p.rotate(p.TWO_PI / 2, [1, 1, 0]);
      p.image(p.expandIcon, -x - iconRadius, -y - 35, iconSize, iconSize);
      p.pop();
    }
  });
  scrollToCoordinates(endpoint.x, endpoint.y);
  // eslint-disable-next-line consistent-return
  return endpoint;
};

export default FlowExpander;
