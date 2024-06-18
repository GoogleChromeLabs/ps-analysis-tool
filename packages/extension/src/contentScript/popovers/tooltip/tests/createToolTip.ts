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
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import createTooltip from '../createTooltip';

describe.skip('createTooltip', () => {
  it('should be an instance of HTMLDivElement', () => {
    const response = {
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    const tooltip = createTooltip(iframe, response, 0, 0);
    document.body.appendChild(tooltip);

    expect(tooltip instanceof HTMLDivElement).toBe(true);
  });

  it('child element should contain required elements, classes and attributes', () => {
    const response = {
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    const tooltip = createTooltip(iframe, response, 0, 0);
    document.body.appendChild(tooltip);

    expect(tooltip.popover).toBe('manual');
    expect(tooltip.classList.contains('ps-tooltip')).toBe(true);
    expect(tooltip.querySelectorAll('.ps-content')).toHaveLength(1);
    expect(tooltip.querySelectorAll('p')).toHaveLength(9);
    expect(tooltip.querySelectorAll('strong')).toHaveLength(9);
  });

  it('should contain the specified text', () => {
    const response = {
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    const tooltip = createTooltip(iframe, response, 0, 0);
    document.body.appendChild(tooltip);

    const infos = tooltip.querySelectorAll('p');

    // First tooltip info.
    expect(infos[0].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Type: Hidden iframe'
    );

    // Second tooltip info.
    expect(infos[1].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Origin: empty'
    );

    // Third tooltip info.
    expect(infos[2].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Visible iframes: 0'
    );

    // Fourth tooltip info.
    expect(infos[3].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Hidden iframes: 0'
    );

    // Fifth tooltip info.
    expect(infos[4].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'First-party cookies: 0'
    );

    // Sixth tooltip info.
    expect(infos[5].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Third-party cookies: 0'
    );

    // Sixth tooltip info.
    expect(infos[6].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Blocked cookies: 0'
    );

    // Seventh tooltip info.
    expect(infos[7].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Belongs to RWS: N/A'
    );

    // Eighth tooltip info.
    expect(infos[8].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Allowed Features (PS related): Unknown'
    );
  });
});
