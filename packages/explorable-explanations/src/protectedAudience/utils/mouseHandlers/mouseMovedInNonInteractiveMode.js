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
import app from '../../app';
import config from '../../config';
import { isInsideBox } from '../isInsideBox';
import { isInsideCircle } from '../isInsideCircle';

const mouseMovedInNonInteractiveMode = (event) => {
  const { offsetX, offsetY } = event;

  app.mouseX = offsetX;
  app.mouseY = offsetY;

  const { infoIconSize } = config.timeline;

  let hoveredOverIcons = false;

  app.timeline.infoIconsPositions.forEach(({ x: _x, y: _y }) => {
    if (isInsideBox(app.p.mouseX, app.p.mouseY, _x, _y, infoIconSize)) {
      hoveredOverIcons = true;
    }
  });

  if (config.timeline.circles.every(({ visited }) => visited === true)) {
    app.timeline.expandIconPositions.forEach((positions) => {
      if (isInsideCircle(offsetX, offsetY, positions.x, positions.y + 10, 10)) {
        hoveredOverIcons = true;
      }
    });
  }

  if (hoveredOverIcons) {
    app.p.cursor('pointer');
  } else {
    app.p.cursor('default');
  }
};

export default mouseMovedInNonInteractiveMode;
