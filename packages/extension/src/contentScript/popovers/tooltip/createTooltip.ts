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
import { TOOLTIP_CLASS, DISPLAY_SHOW_MORE_BUTTON } from '../../constants';
import {
  getFrameAttributes,
  getAllowedFeatures,
  getFrameOrigin,
  getFrameType,
  getTooltipInfoData,
  isFrameHidden,
} from '../../utils';
import type { ResponseType } from '../../types';
import createShowMoreButton from './createShowMoreButton';
import createTooltipHTML from './createTooltipHTML';

/**
 * Creates a tooltip element for an iframe overlay.
 * @todo Needs refactoring and code improvement.
 * @param {HTMLIFrameElement | HTMLElement} frame - The iframe or HTML element for which the tooltip is created.
 * @param {ResponseType} data - The response data associated with the frame.
 * @param {number} numberOfVisibleFrames - The number of visible frames.
 * @param {number} numberOfHiddenFrames - The number of hidden frames.
 * @returns {HTMLDivElement} The tooltip element containing information about the frame.
 */
const createTooltip = (
  frame: HTMLIFrameElement | HTMLElement | null,
  data: ResponseType,
  numberOfVisibleFrames: number,
  numberOfHiddenFrames: number
) => {
  const isMainFrame = document.location.origin === data.selectedFrame;
  const isHidden = isFrameHidden(frame);
  const tooltip = document.createElement('div');
  const content = document.createElement('div');

  let insideFrame: HTMLIFrameElement | null = null;
  let attributes = {};

  if (!isMainFrame && frame) {
    if (frame.dataset?.psatInsideFrame) {
      // We don't need to worry if querySelector will fail because there will be no psatInsideFrame if we can't access contentDocument of frame.
      insideFrame = frame?.contentDocument.querySelector(
        'iframe[src="' + frame.dataset.psatInsideFrame + '"]'
      );
      attributes = getFrameAttributes(insideFrame as HTMLIFrameElement);
    } else {
      attributes = getFrameAttributes(frame as HTMLIFrameElement);
    }
  }
  if (!frame) {
    attributes.src = data.selectedFrame;
  }

  tooltip.classList.add(TOOLTIP_CLASS);
  content.classList.add('ps-content');

  const origin = isMainFrame ? data.selectedFrame : getFrameOrigin(attributes);

  const allowedFeatured =
    frame && frame.tagName !== 'BODY' ? getAllowedFeatures(frame) : 'N/A';

  // Reset the dataset of parent frame.
  if (frame && insideFrame) {
    frame.dataset.psatInsideFrame = '';
  }

  const infoData = getTooltipInfoData(
    getFrameType(isHidden, insideFrame, frame ? frame.tagName : 'Unknown'),
    origin ?? '',
    numberOfVisibleFrames,
    numberOfHiddenFrames,
    data?.firstPartyCookies || 0,
    data?.thirdPartyCookies || 0,
    origin ? (data?.isOnRWS ? 'Yes' : 'No') : 'N/A',
    allowedFeatured,
    DISPLAY_SHOW_MORE_BUTTON,
    data?.blockedCookies || 0,
    data?.blockedReasons || ''
  );

  const info = infoData['info'];
  const infoAttribtues = infoData['attr'];

  const tooltipHTML = createTooltipHTML(info, infoAttribtues);
  content.appendChild(tooltipHTML);

  if (DISPLAY_SHOW_MORE_BUTTON) {
    const tooltipShowButtonContainer = createShowMoreButton();
    content.appendChild(tooltipShowButtonContainer);
  }
  const toolTipArrow = document.createElement('div');
  toolTipArrow.classList.add('ps-content-arrow');
  toolTipArrow.id = 'ps-content-tooltip-arrow';
  tooltip.appendChild(toolTipArrow);
  tooltip.appendChild(content);

  tooltip.popover = 'manual';

  return tooltip;
};

export default createTooltip;
