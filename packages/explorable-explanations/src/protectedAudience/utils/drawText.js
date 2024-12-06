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

export const drawText = (text, x, y) => {
  const p = app.p;

  if (text) {
    p.push();
    p.strokeWeight(0.1);
    p.fill('#000'); // @todo Use color from config.
    p.textSize(config.canvas.fontSize - 2);
    p.textFont('sans-serif');
    p.text(text, x, y);
    p.pop();
  }
};
