/*
 * Copyright 2023 Google LLC
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
import { OVERLAY_CLASS } from '../../constants';

/**
 * Creates a frame overlay element to cover iframe.
 * The overlay is positioned and sized to match the target element.
 * @param {HTMLElement} frame - The HTML element (usually an iframe) for which the overlay is created.
 * @returns {HTMLElement | null} The frame overlay element if it was successfully created, or `null` if the element dimensions are zero.
 */
const createFrameOverlay = (frame: HTMLElement): HTMLElement | null => {
  const { width, height } = frame.getBoundingClientRect();

  if (height === 0 || width === 0) {
    return null;
  }

  const frameOverlay = document.createElement('div');
  frameOverlay.classList.add(OVERLAY_CLASS);

  if (frame.tagName !== 'BODY') {
    frameOverlay.style.width = width + 'px';
    frameOverlay.style.height = height + 'px';
  } else {
    frameOverlay.style.width = '100%';
    frameOverlay.style.height = '100%';
    frameOverlay.classList.add('ps-fixed');
  }

  frameOverlay.popover = 'manual';

  return frameOverlay;
};

export default createFrameOverlay;
