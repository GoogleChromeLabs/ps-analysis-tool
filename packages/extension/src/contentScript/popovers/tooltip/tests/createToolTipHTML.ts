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
import createTooltipHTML from '../createTooltipHTML';
import {
  getInfo,
  getInfoAttributes,
} from '../../../utils/test-data/getToolTipInfoData';

describe('createTooltipHTML', () => {
  it('should contain "p" and "strong" tag elements', () => {
    const infoHTMLElement = createTooltipHTML(getInfo(), getInfoAttributes());
    document.body.appendChild(infoHTMLElement);

    expect(infoHTMLElement instanceof HTMLElement).toBe(true);
    expect(infoHTMLElement.querySelectorAll('p')).toHaveLength(8);
    expect(infoHTMLElement.querySelectorAll('strong')).toHaveLength(8);
  });

  it('should contain the specified text', () => {
    const infoHTMLElement = createTooltipHTML(getInfo(), getInfoAttributes());
    document.body.appendChild(infoHTMLElement);

    const infos = infoHTMLElement.querySelectorAll('p');

    // First tooltip info.
    expect(infos[0].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Type: iframe'
    );

    // Second tooltip info.
    expect(infos[1].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Origin: about:blank'
    );

    // Third tooltip info.
    expect(infos[2].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Visible iframes: 2'
    );

    // Fourth tooltip info.
    expect(infos[3].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Hidden iframes: 3'
    );

    // Fifth tooltip info.
    expect(infos[4].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'First-party cookies: 4'
    );

    // Sixth tooltip info.
    expect(infos[5].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Third-party cookies: 5'
    );

    // Sixth tooltip info.
    expect(infos[6].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Belongs to RWS: Yes'
    );

    // Seventh tooltip info.
    expect(infos[7].textContent?.trim().replace(/\s+/g, ' ')).toBe(
      'Allowed Features (PS related): attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url'
    );

    // Seventh tooltip info attributes.
    const elementWithAttr = infoHTMLElement.querySelector(
      '.ps-allowed-features'
    );
    expect(elementWithAttr?.getAttribute('data-compact-allowed-features')).toBe(
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, ...'
    );
    expect(
      elementWithAttr?.getAttribute('data-expanded-allowed-features')
    ).toBe(
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url'
    );
  });
});
