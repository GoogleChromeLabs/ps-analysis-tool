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

// Function to get new info object.
export const getInfo = () => {
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

// Function to get new info attribute object.
export const getInfoAttributes = () => {
  return {
    allowedFeaturesInCompactView:
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, ...',
    allowedFeatureInExpandedView:
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url',
  };
};

// Values to pass to getTooltipInfoData.
export const getTooltipInfoDataProp = {
  frameType: 'iframe',
  origin: 'https://example.com',
  numberOfVisibleFrames: 0,
  numberOfHiddenFrames: 0,
  numberOfFirstPartyCookies: 0,
  numberOfThirdPartyCookies: 0,
  belongsToRWS: 'No',
  allowedFeatures: 'N/A',
  displayShowMoreButton: false,
};

// Expected result.
export const expectedResult = {
  info: {
    Type: 'iframe',
    Origin:
      '<a href="https://example.com" target="_blank" class="ps-enable-pointer-event">https://example.com</a>',
    'Visible iframes': '0',
    'Hidden iframes': '0',
    'First-party cookies': '0',
    'Third-party cookies': '0',
    'Belongs to RWS': 'No',
    'Allowed Features (PS related)': 'N/A',
    'Blocked cookies': '0',
    'Blocked reasons': '',
  },
  attr: {
    allowedFeaturesInCompactView: 'N/A',
    allowedFeatureInExpandedView: 'N/A',
  },
};

// Reset expectedResult to its initial state.
export const resetExpectedResult = () => {
  expectedResult.info = {
    Type: 'iframe',
    Origin:
      '<a href="https://example.com" target="_blank" class="ps-enable-pointer-event">https://example.com</a>',
    'Visible iframes': '0',
    'Hidden iframes': '0',
    'First-party cookies': '0',
    'Third-party cookies': '0',
    'Belongs to RWS': 'No',
    'Allowed Features (PS related)': 'N/A',
    'Blocked cookies': '0',
    'Blocked reasons': '',
  };
  expectedResult.attr = {
    allowedFeaturesInCompactView: 'N/A',
    allowedFeatureInExpandedView: 'N/A',
  };
};
