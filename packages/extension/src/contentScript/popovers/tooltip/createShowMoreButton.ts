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
 * External dependencies.
 */
import { I18n } from '@ps-analysis-tool/i18n';

const createShowMoreButton = (): HTMLElement => {
  const tooltipShowButton: HTMLButtonElement = document.createElement('button');
  const tooltipShowButtonContainer: HTMLDivElement =
    document.createElement('div');

  tooltipShowButtonContainer.classList.add(
    'ps-tooltip-info-toggle-btn-container'
  );

  tooltipShowButton.classList.add(
    'ps-tooltip-info-toggle-btn',
    'ps-tooltip-compact'
  );
  tooltipShowButton.innerText = I18n.getMessage('showMore');

  tooltipShowButton.onclick = (event) => {
    const showMoreButton = event.target as HTMLElement;
    const tooltipContainer = showMoreButton.parentNode
      ?.parentNode as HTMLElement;

    const allowedFeatures = tooltipContainer.querySelector(
      '.ps-allowed-features'
    ) as HTMLElement;

    const compactAllowedFeatures = allowedFeatures.getAttribute(
      'data-compact-allowed-features'
    );

    const expandedAllowedFeatures = allowedFeatures.getAttribute(
      'data-expanded-allowed-features'
    );

    const isCompact = showMoreButton.classList.contains('ps-tooltip-compact');

    if (isCompact) {
      showMoreButton.innerText = I18n.getMessage('showLess');
      showMoreButton.classList.remove('ps-tooltip-compact');
      const hiddenElements = tooltipContainer.querySelectorAll('.hidden');
      hiddenElements.forEach((element) => {
        element.classList.remove('hidden');
      });
      allowedFeatures.innerText = expandedAllowedFeatures ?? 'N/A';
    } else {
      showMoreButton.innerText = I18n.getMessage('showMore');
      showMoreButton.classList.add('ps-tooltip-compact');
      const compactViewHiddenElements =
        tooltipContainer.querySelectorAll('.ps-compact');
      compactViewHiddenElements.forEach((element) => {
        element.classList.add('hidden');
      });
      allowedFeatures.innerText = compactAllowedFeatures ?? 'N/A';
    }
  };

  tooltipShowButtonContainer.appendChild(tooltipShowButton);

  return tooltipShowButtonContainer;
};

export default createShowMoreButton;
