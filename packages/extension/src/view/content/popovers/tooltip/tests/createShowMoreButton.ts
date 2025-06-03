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
import { I18n } from '@google-psat/i18n';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import createShowMoreButton from '../createShowMoreButton';

describe('createShowMoreButton', () => {
  beforeAll(() => {
    globalThis.chrome.i18n = null;

    I18n.initMessages({
      showMore: {
        message: 'Show more',
      },
      showLess: {
        message: 'Show less',
      },
    });
  });

  it('should contain "Show More" button components', () => {
    // Get HTML element from the function being tested.
    const tooltipShowButtonContainer = createShowMoreButton();
    const tooltipShowButton = tooltipShowButtonContainer.children[0];

    // Create additional content for the tooltip.
    const tooltipContent = document.createElement('div');
    tooltipContent.innerHTML = `
        <p class="ps-allowed-features" data-compact-allowed-features="" data-expanded-allowed-features=""></p>
    `;

    // Create tooltip and append to the body element.
    const tooltip = document.createElement('div');
    tooltip.appendChild(tooltipContent);
    tooltip.appendChild(tooltipShowButtonContainer);
    document.body.appendChild(tooltip);

    expect(tooltipShowButton instanceof HTMLButtonElement).toBe(true);
    expect(tooltipShowButtonContainer instanceof HTMLDivElement).toBe(true);
    expect((tooltipShowButton as HTMLElement).innerText).toBe('Show more');

    expect(tooltipShowButton).toHaveClass('ps-tooltip-compact');
    expect(tooltipShowButton).toHaveClass('ps-tooltip-info-toggle-btn');
  });

  it('button click should perform an action', () => {
    // Get HTML element from the function being tested.
    const tooltipShowButtonContainer = createShowMoreButton();
    const tooltipShowButton = tooltipShowButtonContainer.children[0];

    // Create additional content for the tooltip.
    const tooltipContent = document.createElement('div');
    tooltipContent.innerHTML = `
        <p class="ps-allowed-features" data-compact-allowed-features="" data-expanded-allowed-features=""></p>
    `;

    // Create tooltip and append to the body element.
    const tooltip = document.createElement('div');
    tooltip.appendChild(tooltipContent);
    tooltip.appendChild(tooltipShowButtonContainer);
    document.body.appendChild(tooltip);

    (tooltipShowButton as HTMLButtonElement).click();

    expect((tooltipShowButton as HTMLElement).innerText).toBe('Show less');
    expect(tooltip.querySelectorAll('.hidden')).toHaveLength(0);
    expect(tooltipShowButton).not.toHaveClass('ps-tooltip-compact');
  });
});
