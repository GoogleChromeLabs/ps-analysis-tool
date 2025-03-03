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
import { isPointInViewport } from './isPointInViewport';
import throttle from 'just-throttle';

const SCROLL_THRESHOLD = 50;

type ScrollCoordinate = {
  x: number;
  y: number;
};

// throttled scroll to avoid performance issues
const scrollTo = throttle(({ x, y }: ScrollCoordinate) => {
  app.canvasParentElement?.scrollTo({
    left: x,
    top: y,
    behavior: 'smooth',
  });
}, 1000);

type ScrollToCoordinatesProps = ScrollCoordinate & {
  override?: boolean;
};

export const scrollToCoordinates = ({
  x,
  y,
  override = false,
}: ScrollToCoordinatesProps) => {
  const rect = app.canvasParentElement?.getBoundingClientRect();

  if (
    !rect ||
    !app.autoScroll ||
    app.isRevisitingNodeInInteractiveMode ||
    !app.canvasParentElement
  ) {
    return;
  }

  if (override) {
    scrollTo({ x: 0, y: 0 });
    return;
  }

  if (isPointInViewport(x, y, SCROLL_THRESHOLD)) {
    return;
  }

  const finalX = x - rect.left;
  const finalY = y - rect.top;

  scrollTo({ x: finalX, y: finalY });
};
