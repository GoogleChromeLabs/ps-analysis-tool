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
import createTooltipHTML from '../createTooltipHTML';

const getInfo = () => {
  return {
    Type: 'iframe',
    Origin: 'about:blank',
    'Visible iframes': '2',
    'Hidden iframes': '3',
    'First-party cookies': '4',
    'Third-party cookies': '5',
    'Belongs to RWS': 'Yes',
    'Allowed Features (PS related)':
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url',
  };
};

const getInfoAttributes = () => {
  return {
    allowedFeaturesInCompactView:
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, ...',
    allowedFeatureInExpandedView:
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url',
  };
};

describe('createTooltipHTML', () => {
  it('should contain "p" and "strong" tag', () => {
    const infoHTMLElement = createTooltipHTML(getInfo(), getInfoAttributes());
    document.body.appendChild(infoHTMLElement);

    expect(infoHTMLElement instanceof HTMLElement).toEqual(true);
    expect(infoHTMLElement.querySelectorAll('p')).toHaveLength(8);
    expect(infoHTMLElement.querySelectorAll('strong')).toHaveLength(8);
  });

  it('should contain the specified text', () => {
    const infoHTMLElement = createTooltipHTML(getInfo(), getInfoAttributes());
    document.body.appendChild(infoHTMLElement);

    const infos = infoHTMLElement.querySelectorAll('p');

    // First tooltip info.
    expect(infos[0].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Type: iframe'
    );

    // Second tooltip info.
    expect(infos[1].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Origin: about:blank'
    );

    // Third tooltip info.
    expect(infos[2].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Visible iframes: 2'
    );

    // Fourth tooltip info.
    expect(infos[3].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Hidden iframes: 3'
    );

    // Fifth tooltip info.
    expect(infos[4].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'First-party cookies: 4'
    );

    // Sixth tooltip info.
    expect(infos[5].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Third-party cookies: 5'
    );

    // Sixth tooltip info.
    expect(infos[6].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Belongs to RWS: Yes'
    );

    // Seventh tooltip info.
    expect(infos[7].textContent?.trim().replace(/\s+/g, ' ')).toEqual(
      'Allowed Features (PS related): attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url'
    );

    // Seventh tooltip info attributes.
    const elementWithAttr = infoHTMLElement.querySelector(
      '.ps-allowed-features'
    );
    expect(
      elementWithAttr?.getAttribute('data-compact-allowed-features')
    ).toEqual(
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, ...'
    );
    expect(
      elementWithAttr?.getAttribute('data-expanded-allowed-features')
    ).toEqual(
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url'
    );
  });
});
