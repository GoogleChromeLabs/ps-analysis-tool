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
 * Sets the position of a tooltip element based on various conditions.
 * @param {HTMLElement} tooltip - The tooltip element.
 * @param {HTMLElement} frame - The target f element.
 * @param {boolean} isHiddenFrame - Indicates if the frame is hidden.
 * @param {string | undefined} selectedFrame - The selected frame's origin.
 * @param selectedFrame
 * @returns {void}
 */
const setTooltipPosition = (
  tooltip: HTMLElement | null,
  frame: HTMLElement,
  isHiddenFrame: boolean,
  selectedFrame: string | undefined
) => {
  if (!tooltip) {
    return;
  }

  const {
    x: frameX,
    y: frameY,
    width: frameWidth,
  } = frame.getBoundingClientRect();

  tooltip.style.maxWidth = frameWidth - 40 + 'px';
  tooltip.style.top = frameY + Number(window.scrollY) + 'px';
  tooltip.style.left = frameX + Number(window.scrollX) + 'px';

  // Overlay will not exist for hidden elements. show at bottom of screen.
  if (isHiddenFrame) {
    tooltip.classList.add('ps-fixed');
    tooltip.style.top = `0`;
    tooltip.style.left = 'auto';
    tooltip.style.right = '30px';
    tooltip.firstElementChild?.classList.add('ps-tooltip-top-notch');

    return;
  }

  if (tooltip.offsetHeight > frame.offsetTop) {
    // Is it the main frame?
    if (document.location.origin === selectedFrame) {
      tooltip.style.top = '5px';
      tooltip.classList.add('ps-fixed');
    } else {
      // Show the tooltip at the bottom if there isn't enough space at the top.
      tooltip.style.top = `${tooltip.offsetTop + frame.offsetHeight - 1}px`;
    }

    // Set tooltip tip at the top of the box.
    tooltip.firstElementChild?.classList.add('ps-tooltip-top-notch');

    return;
  }

  tooltip.style.top = `${tooltip.offsetTop - tooltip.offsetHeight + 5}px`;
};

export default setTooltipPosition;
