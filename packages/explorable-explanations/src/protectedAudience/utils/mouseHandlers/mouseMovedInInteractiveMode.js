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
import { isInsideCircle } from '../isInsideCircle';
import { isOverControls } from '../isOverControls';
import { wipeAndRecreateUserCanvas } from '../wipeAndRecreateCanvas';
const mouseMovedInInteractiveMode = (event, renderUserIcon) => {
  if (!app.isInteractiveMode) {
    return;
  }

  const { offsetX, offsetY, pageY, pageX } = event;
  let hoveringOnExpandIconPositions = false;
  let hoveringOnCircles = false;

  const { circlePositions, expandIconPositions } = app.timeline;
  const {
    circleProps: { diameter },
  } = config.timeline;

  expandIconPositions.forEach((positions) => {
    if (
      isInsideCircle(
        offsetX,
        offsetY,
        positions.x - 10,
        positions.y + diameter / 2,
        20
      )
    ) {
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

  if (pageY > 120 && pageY < 490 && pageX > 40) {
    app.mouseX = offsetX;
    app.mouseY = offsetY;
  }

  if (!app.shouldRespondToClick) {
    return;
  }

  if (hoveringOnExpandIconPositions || hoveringOnCircles) {
    app.p.cursor('pointer');
  } else {
    app.p.cursor('default');
  }

  if (
    hoveringOnExpandIconPositions ||
    isOverControls(event.clientX, event.clientY)
  ) {
    app.startTrackingMouse = false;
  } else {
    app.startTrackingMouse = true;
  }

  wipeAndRecreateUserCanvas();
  renderUserIcon();
};

export default mouseMovedInInteractiveMode;
