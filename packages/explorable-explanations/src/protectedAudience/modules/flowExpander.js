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
import config from '../config';
import { isInsideCircle } from '../utils';

const FlowExpander = ({ nextTipCoordinates }) => {
  const p = app.p;
  const iconSize = config.timeline.expandIconSize;

  return new Promise((resolve) => {
    p.mouseClicked = (event) => {
      nextTipCoordinates.forEach(({ x, y }) => {
        const updatedX = x + iconSize / 2;
        const updatedY = y + iconSize / 2;
        if (isInsideCircle(event.x, event.y, updatedX, updatedY, iconSize)) {
          resolve({ x, y });
        }
      });
    };
  });
};

export default FlowExpander;
