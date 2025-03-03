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
 * External dependencies
 */
import throttle from 'just-throttle';

/**
 * Internal dependencies
 */
import app from '../app';
import { isPointInViewport } from './isPointInViewport';

type ScrollCoordinate = {
  x: number;
  y: number;
};

type ScrollToCoordinatesProps = ScrollCoordinate & {
  override?: boolean;
  force?: boolean;
};

// threshold to avoid scrolling when the element is close to the viewport
const SCROLL_THRESHOLD = 50;

// throttled scroll to avoid performance issues
const scrollTo = throttle(({ x, y }: ScrollCoordinate) => {
  app.canvasParentElement?.scrollTo({
    left: x,
    top: y,
    behavior: 'smooth',
  });
}, 1000);

export const scrollToCoordinates = ({
  x,
  y,
  override = false,
  force = false,
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

  if (isPointInViewport(x, y, SCROLL_THRESHOLD) && !force) {
    return;
  }

  const finalX = x - rect.width / 2;
  const finalY = y - rect.height / 2;

  scrollTo({ x: finalX, y: finalY });
};
