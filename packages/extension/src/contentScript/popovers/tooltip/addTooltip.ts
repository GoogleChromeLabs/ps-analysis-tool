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
import createTooltip from './createTooltip';
import type { ResponseType } from '../../types';

/**
 * Adds a frame overlay and tooltip to an HTML iframe or element.
 * @param {HTMLIFrameElement | HTMLElement} frame - The HTML iframe or element to which the overlay and tooltip are added.
 * @param {ResponseType} data - The response data containing information to display in the tooltip.
 * @param {number} numberOfVisibleFrames - The number of visible frames.
 * @param {number} numberOfHiddenFrames - The number of hidden frames.
 * @returns {HTMLElement} - The added tooltip.
 */
const addTooltip = (
  frame: HTMLIFrameElement | HTMLElement | null,
  data: ResponseType,
  numberOfVisibleFrames: number,
  numberOfHiddenFrames: number
): HTMLElement | null => {
  const body = document.querySelector('body');

  if (!body) {
    return null;
  }

  const tooltip = createTooltip(
    frame,
    data,
    numberOfVisibleFrames,
    numberOfHiddenFrames
  );

  if (tooltip) {
    body.appendChild(tooltip);
    tooltip.showPopover();
  }

  return tooltip;
};

export default addTooltip;
