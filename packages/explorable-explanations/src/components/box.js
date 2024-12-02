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

const Box = ({
  title,
  description,
  x,
  y,
  width = config.flow.box.width,
  height = config.flow.box.height,
  color = config.flow.colors.box.background,
}) => {
  x = typeof x === 'function' ? x() : x;
  y = typeof y === 'function' ? y() : y;

  const nextTip = {
    down: {
      x: x + width / 2,
      y: y + height / 4,
    },
  };

  app.p.push();
  app.p.textAlign(app.p.CENTER, app.p.CENTER);
  app.p.fill(color);
  app.p.rect(x, y, width, height);
  app.p.strokeWeight(0.1);
  app.p.fill(config.flow.colors.box.text);
  app.p.textFont('sans-serif');

  if (description) {
    app.p.text(title, x + width / 2, y + height / 2 - 5);
    app.p.text(description, x + width / 2, y + height / 2 + 10);
  } else {
    app.p.text(title, x + width / 2, y + height / 2);
  }

  app.p.pop();

  return nextTip;
};

export default Box;
