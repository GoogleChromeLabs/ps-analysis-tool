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
import createTooltip from '../createTooltip';

describe('createTooltip', () => {
  it('should be an instance of HTMLDivElement', () => {
    const response = {
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    const tooltip = createTooltip(iframe, response, 0, 0);
    document.body.appendChild(tooltip);

    expect(tooltip instanceof HTMLDivElement).toEqual(true);
  });

  it('child element should contain required elements, classes and attributes', () => {
    const response = {
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    const tooltip = createTooltip(iframe, response, 0, 0);
    document.body.appendChild(tooltip);

    expect(tooltip.popover).toEqual('manual');
    expect(tooltip.classList.contains('ps-tooltip')).toEqual(true);
    expect(tooltip.querySelectorAll('.ps-content')).toHaveLength(1);
    expect(tooltip.querySelectorAll('p')).toHaveLength(8);
    expect(tooltip.querySelectorAll('strong')).toHaveLength(8);
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
    expect(infos[0].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Type: Hidden iframe'
    );

    // Second tooltip info.
    expect(infos[1].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Origin: empty'
    );

    // Third tooltip info.
    expect(infos[2].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Visible iframes: 0'
    );

    // Fourth tooltip info.
    expect(infos[3].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Hidden iframes: 0'
    );

    // Fifth tooltip info.
    expect(infos[4].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'First-party cookies: 0'
    );

    // Sixth tooltip info.
    expect(infos[5].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Third-party cookies: 0'
    );

    // Sixth tooltip info.
    expect(infos[6].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Belongs to RWS: N/A'
    );

    // Seventh tooltip info.
    expect(infos[7].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Allowed Features (PS related): Unknown'
    );
  });
});
