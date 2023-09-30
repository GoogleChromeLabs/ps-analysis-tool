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
 * @param {boolean} isHiddenFrame - Indicates if the frame is hidden.
 * @param {HTMLElement} Frame - The target frame element.
 * @param {string | undefined} selectedFrame - The selected frame's origin.
 * @returns {void}
 */
const setTooltipPosition = (
  tooltip: HTMLElement,
  isHiddenFrame: boolean,
  Frame: HTMLElement,
  selectedFrame: string | undefined
) => {
  const tooltipHeight = tooltip.offsetHeight;
  const frameOffsetTop = Frame.offsetTop;

  // Overlay will not exist for hidden elements. show at bottom of screen.
  if (isHiddenFrame) {
    tooltip.style.top = `${window.innerHeight - tooltipHeight + 5}px`;
  } else if (tooltipHeight > frameOffsetTop) {
    // Is it the main frame?
    if (document.location.origin === selectedFrame) {
      tooltip.style.top = '5px';
    } else {
      // Show the tooltip at the bottom if there isn't enough space at the top.
      tooltip.style.top = `${tooltip.offsetTop + Frame.offsetHeight - 1}px`;
    }

    // Set tooltip tip at the top of the box.
    tooltip.firstElementChild?.classList.add('tooltip');
  } else {
    tooltip.style.top = `${tooltip.offsetTop - tooltipHeight + 5}px`;
  }
};

export default setTooltipPosition;
