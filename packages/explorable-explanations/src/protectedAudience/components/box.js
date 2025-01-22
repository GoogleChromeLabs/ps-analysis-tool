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
import app from '../app';
import config from '../config';
import {
  addCanvasEventListener,
  isInsideBox,
  scrollToCoordinates,
} from '../utils';

const INFO_ICON_SPACING = 3;

const Box = ({
  title,
  description,
  x,
  y,
  width = config.flow.box.width,
  height = config.flow.box.height,
  color,
  info = false,
  isBranchComponent = false,
}) => {
  x = typeof x === 'function' ? x() : x;
  y = typeof y === 'function' ? y() : y;

  const nextTip = {
    down: {
      x: x + width / 2,
      y: y + height / 4,
    },
  };

  const {
    flow: {
      colors: {
        box: { background, text },
      },
    },
    timeline: { infoIconSize },
  } = config;

  const p = app.p;

  if (!isBranchComponent) {
    scrollToCoordinates(x, y - height / 2);
  }

  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(color || background);
  p.rect(x, y, width, height);
  p.strokeWeight(0.1);
  p.fill(text);
  p.textFont('sans-serif');

  if (description) {
    p.text(title, x + width / 2, y + height / 2 - 5);
    p.text(description, x + width / 2, y + height / 2 + 10);
  } else {
    p.text(title, x + width / 2, y + height / 2);
  }

  if (info) {
    const iconX = x + width - infoIconSize - INFO_ICON_SPACING;
    const iconY = y + INFO_ICON_SPACING;
    app.timeline.infoIconsPositions.push({ x: iconX, y: iconY });

    p.image(p.infoIcon, iconX, iconY, infoIconSize, infoIconSize);

    const mouseClickedCallback = (mouseX, mouseY) => {
      if (isInsideBox(mouseX, mouseY, iconX, iconY, infoIconSize)) {
        app.setInfo({
          title,
          description,
          info,
          key: Date.now(), // To force change the state, so that the info modal is shown in case of same value.
        });
      }
    };

    const key = title + description + x + y;
    addCanvasEventListener('mouseClicked', mouseClickedCallback, key);
  }

  p.pop();

  return nextTip;
};

export default Box;
