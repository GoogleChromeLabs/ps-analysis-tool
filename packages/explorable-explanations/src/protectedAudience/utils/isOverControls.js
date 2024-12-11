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
 * Internal depencencies
 */
import app from '../app';

export const isOverControls = (mouseX, mouseY) => {
  // eslint-disable-next-line no-undef
  if (!process.env.IS_RUNNING_STANDALONE) {
    return false;
  }

  const controlsDivRect = document
    .getElementById('controls-div')
    .getBoundingClientRect();

  if (
    mouseX > controlsDivRect.left &&
    mouseX < controlsDivRect.left + controlsDivRect.width &&
    mouseY > controlsDivRect.top &&
    mouseY < controlsDivRect.top + controlsDivRect.height
  ) {
    return true;
  }

  const bubbleRect = app.minifiedBubbleContainer.getBoundingClientRect();

  if (
    mouseX > bubbleRect.left &&
    mouseX < bubbleRect.left + bubbleRect.width &&
    mouseY > bubbleRect.top &&
    mouseY < bubbleRect.top + bubbleRect.height
  ) {
    return true;
  }

  const closeButton = app.closeButton.getBoundingClientRect();

  if (
    mouseX > closeButton.left &&
    mouseX < closeButton.left + closeButton.width &&
    mouseY > closeButton.top &&
    mouseY < closeButton.top + closeButton.height
  ) {
    return true;
  }

  return false;
};
