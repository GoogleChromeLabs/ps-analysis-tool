/*
 * Copyright 2025 Google LLC
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
import throttle from 'just-throttle';
import { isCoordinateInView } from './isCoordinateInView';

const scrollTo = throttle((x: number, y: number) => {
  app.canvasParentElement?.scrollTo({
    left: x,
    top: y,
    behavior: 'smooth',
  });
}, 1000);

export const scrollToCoordinates = (x: number, y: number, override = false) => {
  if (!app.autoScroll || app.isRevisitingNodeInInteractiveMode) {
    return;
  }

  if (override) {
    scrollTo(0, 0);
    return;
  }

  const rect = app.canvasParentElement?.getBoundingClientRect();

  if (!rect) {
    return;
  }

  const finalX = x - rect.left,
    finalY = y - rect.top;

  scrollTo(finalX, finalY);
};

export const scrollToCoordinatesIfNotInView = (x: number, y: number) => {
  if (!isCoordinateInView(x, y)) {
    scrollToCoordinates(x, y);
  }
};
