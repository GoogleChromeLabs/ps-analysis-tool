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
import createFrameOverlay from './createFrameOverlay';

/**
 * Adds a frame overlay and tooltip to an HTML iframe or element.
 * @param {HTMLIFrameElement | HTMLElement} frame - The HTML iframe or element to which the overlay and tooltip are added.
 * @returns {HTMLElement} - The added overlay.
 */
const addOverlay = (
  frame: HTMLIFrameElement | HTMLElement
): HTMLElement | null => {
  const body = document.querySelector('body');

  if (!body) {
    return null;
  }

  const overlay = createFrameOverlay(frame);

  if (overlay) {
    body.appendChild(overlay);
    overlay.showPopover();
  }

  return overlay;
};

export default addOverlay;
