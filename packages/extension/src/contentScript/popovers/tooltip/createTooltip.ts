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
import { TOOLTIP_CLASS, ALL_ALLOWED_FEATURES } from '../../constants';
import getFrameAttributes from '../../utils/getFrameAttributes';
import type { ResponseType } from '../../types';
import getAllowedFeatures from '../../utils/getAllowedFeatures';

/**
 * Creates a tooltip element for an iframe overlay.
 * @param {HTMLIFrameElement | HTMLElement} frame - The iframe or HTML element for which the tooltip is created.
 * @param {number} numberOfVisibleFrames - The number of visible frames.
 * @param {number} numberOfHiddenFrames - The number of hidden frames.
 * @param {ResponseType} data - The response data associated with the frame.
 * @returns {HTMLDivElement} The tooltip element containing information about the frame.
 */
// eslint-disable-next-line complexity
const createTooltip = (
  frame: HTMLIFrameElement | HTMLElement,
  data: ResponseType,
  numberOfVisibleFrames: number,
  numberOfHiddenFrames: number
) => {
  const isMainFrame = document.location.origin === data.selectedFrame;
  let isHidden = false;
  const displayShowMoreButton = false;
  const tooltip = document.createElement('div');
  const content = document.createElement('div');
  let insideFrame: HTMLIFrameElement | null = null;

  let attributes = {};

  if (!isMainFrame) {
    if (frame.dataset?.psatInsideFrame) {
      // we don't need to worry if querySelector will fail becuase there will be no psatInsideFrame if we can't access contentDocument of frame.
      insideFrame = frame?.contentDocument.querySelector(
        'iframe[src="' + frame.dataset.psatInsideFrame + '"]'
      );
      attributes = getFrameAttributes(insideFrame as HTMLIFrameElement);
    } else {
      attributes = getFrameAttributes(frame as HTMLIFrameElement);
    }
  }

  const { width, height } = frame.getBoundingClientRect();

  tooltip.classList.add(TOOLTIP_CLASS);
  content.classList.add('ps-content');

  if (height === 0 && width === 0) {
    isHidden = true;
  }

  const frameSrc = attributes.src?.startsWith('//')
    ? 'https:' + attributes.src
    : attributes?.src;

  let frameOrigin = '';

  try {
    frameOrigin =
      frameSrc && frameSrc !== 'about:blank' ? new URL(frameSrc).origin : ''; // @todo Show about:blank in origin.
  } catch (error) {
    /* Do nothing */
  }

  const origin = isMainFrame ? data.selectedFrame : frameOrigin;
  const allowedFeatured =
    frame.tagName !== 'BODY' ? getAllowedFeatures(frame) : 'N/A';

  const numberOfAllowedFeaturesInCompactView = 5;
  let allowedFeatureInExpandedView;
  let allowedFeaturesInCompactView;

  if (allowedFeatured !== 'N/A') {
    allowedFeatureInExpandedView = allowedFeatured.join(', ');
    if (allowedFeatured.length > numberOfAllowedFeaturesInCompactView) {
      const filteredAllowedFeatures = allowedFeatured.slice(
        0,
        numberOfAllowedFeaturesInCompactView
      );
      allowedFeaturesInCompactView =
        filteredAllowedFeatures.join(', ') + ', ...';
    }
  } else {
    allowedFeatureInExpandedView = 'N/A';
    allowedFeaturesInCompactView = 'N/A';
  }

  const info: Record<string, string> = {};

  if (isHidden) {
    info['Type'] = 'Hidden iframe';
  } else if (insideFrame) {
    info['Type'] = 'Nested iframe';
  } else if (frame.tagName === 'BODY') {
    info['Type'] = 'Main frame';
  } else {
    info['Type'] = 'iframe';
  }

  info['Visible iframes'] = String(numberOfVisibleFrames);
  info['Hidden iframes'] = String(numberOfHiddenFrames);
  info['Origin'] = origin ? origin : '(empty)';
  info['First-party cookies'] = String(data?.firstPartyCookies || '0');
  info['Third-party cookies'] = String(data?.thirdPartyCookies || '0');
  info['Belongs to RWS'] = origin ? (data?.isOnRWS ? 'Yes' : 'No') : 'N/A';

  const allowedFeaturedValue = displayShowMoreButton
    ? allowedFeaturesInCompactView
    : allowedFeatureInExpandedView;
  info['Allowed features'] =
    allowedFeaturedValue === ALL_ALLOWED_FEATURES
      ? 'all'
      : allowedFeaturedValue;

  // Reset the dataset of parent frame.
  if (insideFrame) {
    frame.dataset.psatInsideFrame = '';
  }

  const tooltipShowButtonContainer: HTMLDivElement =
    document.createElement('div');

  tooltipShowButtonContainer.classList.add(
    'ps-tooltip-info-toggle-btn-container'
  );

  const tooltipShowButton: HTMLButtonElement = document.createElement('button');

  tooltipShowButton.classList.add(
    'ps-tooltip-info-toggle-btn',
    'ps-tooltip-compact'
  );
  tooltipShowButton.innerText = 'Show more';

  tooltipShowButton.onclick = (event) => {
    const btn = event.target as HTMLElement;
    const tooltipContainer = btn.parentNode?.parentNode as HTMLElement;

    const allowedFeatures = tooltipContainer.querySelector(
      '.ps-allowed-features'
    ) as HTMLElement;

    const compactAllowedFeatures = allowedFeatures.getAttribute(
      'data-compact-allowed-features'
    );

    const expandedAllowedFeatures = allowedFeatures.getAttribute(
      'data-expanded-allowed-features'
    );

    const isCompact = btn.classList.contains('ps-tooltip-compact');

    if (isCompact) {
      btn.innerText = 'Show less';
      btn.classList.remove('ps-tooltip-compact');
      const hiddenElements = tooltipContainer.querySelectorAll('.hidden');
      hiddenElements.forEach((element) => {
        element.classList.remove('hidden');
      });
      allowedFeatures.innerText = expandedAllowedFeatures ?? 'N/A';
    } else {
      btn.innerText = 'Show more';
      btn.classList.add('ps-tooltip-compact');
      const compactViewHiddenElements =
        tooltipContainer.querySelectorAll('.ps-compact');
      compactViewHiddenElements.forEach((element) => {
        element.classList.add('hidden');
      });
      allowedFeatures.innerText = compactAllowedFeatures ?? 'N/A';
    }
  };

  const infoLabelStyle = `
    color:#202124 !important;
    font-weight:bold !important;
  `;

  const infoValueStyle = `
    word-break: break-all !important;
    text-decoration: none !important;
  `;

  // eslint-disable-next-line guard-for-in
  for (const label in info) {
    const value = info[label];

    if (value) {
      const p: HTMLParagraphElement = document.createElement('p');

      if (label === 'Visible iframes') {
        if (numberOfVisibleFrames > 1) {
          p.innerHTML = `<span style="${infoLabelStyle}">${label}</span>: <span style="${infoValueStyle}">${value}</span>`;
        } else {
          p.innerHTML = `<span class="ps-compact hidden"><span style="${infoLabelStyle}">${label}</span>: <span style="${infoValueStyle}">${value}</span></span>`;
        }
      } else if (label === 'Hidden iframes') {
        if (numberOfHiddenFrames > 0) {
          p.innerHTML = `<span style="${infoLabelStyle}">${label}</span>: <span style="${infoValueStyle}">${value}</span>`;
        } else {
          p.innerHTML = `<span class="ps-compact hidden"><span style="${infoLabelStyle}">${label}</span>: <span style="${infoValueStyle}">${value}</span></span>`;
        }
      } else if (label === 'Allowed features') {
        p.innerHTML = `<span style="${infoLabelStyle}">${label}</span>: <span class="ps-allowed-features" data-compact-allowed-features="${allowedFeaturesInCompactView}" data-expanded-allowed-features="${allowedFeatureInExpandedView}" style="${infoValueStyle}">${value}</span>`;
      } else if (label === 'Origin') {
        const originLink = `<a href="${value}" target="_blank" class="ps-enable-pointer-event" style="${infoValueStyle}">${value}</a>`;
        p.innerHTML = `<span style="${infoLabelStyle}">${label}</span>: ${
          value !== '(empty)' ? originLink : value
        }`;
      } else {
        p.innerHTML = `<span style="${infoLabelStyle}">${label}</span>: <span style="${infoValueStyle}">${value}</span>`;
      }

      content.appendChild(p);
    }
  }

  if (displayShowMoreButton) {
    tooltipShowButtonContainer.appendChild(tooltipShowButton);
  }

  content.appendChild(tooltipShowButtonContainer);
  tooltip.appendChild(content);

  tooltip.popover = 'manual';

  return tooltip;
};

export default createTooltip;
