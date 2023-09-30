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
import type { ResponseType } from '../types';
import compareFrameSource from '../utils/compareFrameSource';
import removeAllPopovers from './removeAllPopovers';
import addPopover from './addPopover';

/**
 * Handles the addition of frame overlays and tooltips based on a given response object.
 * It adds an overlay and tooltip to the main document or an iframe depending on the selected frame's origin.
 * @param {ResponseType} response - The response object containing information about the selected frame.
 * @returns {void}
 */
const togglePopovers = (response: ResponseType) => {
  const selectedOrigin = response.selectedFrame;

  if (!selectedOrigin) {
    return;
  }

  if (selectedOrigin === document.location.origin) {
    addPopover(document.body, response);
    return;
  }

  const iframes = document.querySelectorAll('iframe');

  let frameFound = false;

  for (const iframe of iframes) {
    const src = iframe.getAttribute('src');

    if (src && compareFrameSource(selectedOrigin, src)) {
      frameFound = addPopover(iframe, response);
      break;
    }
  }

  if (!frameFound) {
    removeAllPopovers();
  }
};

export default togglePopovers;
