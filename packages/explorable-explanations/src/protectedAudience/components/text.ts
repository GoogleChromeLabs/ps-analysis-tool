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
import type { Coordinates } from '../types';
import { getCoordinateValues } from '../utils/getCoordinateValues';

type CoordinatesWithText = Coordinates & {
  text: string;
};

const Text = ({
  text,
  x: xValue,
  y: yValue,
}: CoordinatesWithText): Coordinates => {
  if (!yValue || !xValue) {
    return { x: 0, y: 0 };
  }

  const { x, y } = getCoordinateValues({ x: xValue, y: yValue });

  const nextTip = {
    x,
    y,
  };

  const p = app.p;

  if (!p) {
    return nextTip;
  }

  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(config.flow.colors.box.text);
  p.strokeWeight(0);
  p.textFont('sans-serif');
  p.text(text, x, y);
  p.pop();

  return nextTip;
};

export default Text;
