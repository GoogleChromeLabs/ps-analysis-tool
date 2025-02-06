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
import { drawOpenArrowWithoutAnimationIcon } from '../drawOpenArrowWithoutAnimationIcon';
import { isInsideBox } from '../isInsideBox';
import { isInsideCircle } from '../isInsideCircle';
import { isOverControls } from '../isOverControls';
import { wipeAndRecreateUserCanvas } from '../wipeAndRecreateCanvas';
const mouseMovedInInteractiveMode = (event, renderUserIcon) => {
  const { offsetX, offsetY } = event;
  app.mouseX = offsetX;
  app.mouseY = offsetY;

  if (!app.isInteractiveMode || app.mouseOutOfDiv) {
    return;
  }

  let hoveringOnExpandIconPositions = false;
  let hoveringOnCircles = false;
  let hoveredOverIcons = false;

  const { circlePositions, expandIconPositions } = app.timeline;
  const {
    circleProps: { diameter },
    infoIconSize,
  } = config.timeline;

  app.timeline.infoIconsPositions.forEach(({ x: _x, y: _y }) => {
    if (isInsideBox(app.p.mouseX, app.p.mouseY, _x, _y, infoIconSize)) {
      hoveredOverIcons = true;
    }
  });

  if (hoveredOverIcons) {
    app.p.cursor('pointer');
  } else {
    app.p.cursor('default');
  }

  expandIconPositions.forEach((positions) => {
    if (isInsideCircle(offsetX, offsetY, positions.x, positions.y + 10, 10)) {
      hoveringOnExpandIconPositions = true;
    }
  });

  circlePositions.forEach((positions) => {
    if (
      isInsideCircle(offsetX, offsetY, positions.x, positions.y, diameter / 2)
    ) {
      hoveringOnCircles = true;
    }
  });

  if (!app.shouldRespondToClick) {
    return;
  }

  if (hoveringOnExpandIconPositions || hoveringOnCircles || hoveredOverIcons) {
    app.p.cursor('pointer');
  } else {
    app.p.cursor('default');
  }

  if (
    hoveringOnExpandIconPositions ||
    isOverControls(event.clientX, event.clientY) ||
    hoveredOverIcons
  ) {
    app.startTrackingMouse = false;
  } else {
    app.startTrackingMouse = true;
  }

  wipeAndRecreateUserCanvas();

  drawOpenArrowWithoutAnimationIcon();
  renderUserIcon();
};

export default mouseMovedInInteractiveMode;
