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
import { addCanvasEventListener } from '../utils';

const INFO_ICON_SIZE = 16;
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
}) => {
  x = typeof x === 'function' ? x() : x;
  y = typeof y === 'function' ? y() : y;

  const nextTip = {
    down: {
      x: x + width / 2,
      y: y + height / 4,
    },
  };

  const p = app.p;

  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(color || config.flow.colors.box.background);
  p.rect(x, y, width, height);
  p.strokeWeight(0.1);
  p.fill(config.flow.colors.box.text);
  p.textFont('sans-serif');

  if (description) {
    p.text(title, x + width / 2, y + height / 2 - 5);
    p.text(description, x + width / 2, y + height / 2 + 10);
  } else {
    p.text(title, x + width / 2, y + height / 2);
  }

  if (info) {
    const iconX = x + width - INFO_ICON_SIZE - INFO_ICON_SPACING;
    const iconY = y + INFO_ICON_SPACING;

    p.image(p.infoIcon, iconX, iconY, INFO_ICON_SIZE, INFO_ICON_SIZE);

    const callback = (mouseX, mouseY) => {
      if (
        mouseX >= iconX &&
        mouseX <= iconX + INFO_ICON_SIZE &&
        mouseY >= iconY &&
        mouseY <= iconY + INFO_ICON_SIZE
      ) {
        console.log(info); // eslint-disable-line no-console
      }
    };

    const key = title + description + x + y;
    addCanvasEventListener('mouseMoved', callback, key);
  }

  p.pop();

  return nextTip;
};

export default Box;
