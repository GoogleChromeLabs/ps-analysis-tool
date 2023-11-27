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
import getTooltipInfoData from '../getTooltipInfoData';
import {
  getTooltipInfoDataProp,
  expectedResult,
  resetExpectedResult,
} from '../test-data/getTooltipInfoData';

describe('getTooltipInfoData', () => {
  it('should return an object containing data for tooltip', () => {
    resetExpectedResult();
    const result = getTooltipInfoData(
      getTooltipInfoDataProp.frameType,
      getTooltipInfoDataProp.origin,
      getTooltipInfoDataProp.numberOfVisibleFrames,
      getTooltipInfoDataProp.numberOfHiddenFrames,
      getTooltipInfoDataProp.numberOfFirstPartyCookies,
      getTooltipInfoDataProp.numberOfThirdPartyCookies,
      getTooltipInfoDataProp.belongsToRWS,
      getTooltipInfoDataProp.allowedFeatures,
      getTooltipInfoDataProp.displayShowMoreButton
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return an object with frame type data', () => {
    resetExpectedResult();
    const frameTypes = [
      'Hidden iframe',
      'Nested iframe',
      'Main frame',
      'iframe',
    ];

    frameTypes.forEach((frameType) => {
      const result = getTooltipInfoData(
        frameType,
        getTooltipInfoDataProp.origin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['Type'] = frameType;

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with frame origin data', () => {
    resetExpectedResult();
    const frameOrigins = [
      'https://example.com',
      'https://google.com',
      'about:blank',
      '',
    ];

    frameOrigins.forEach((frameOrigin) => {
      resetExpectedResult();
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        frameOrigin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      if ('' === frameOrigin) {
        expectedResult.info['Origin'] = 'empty';
      } else if ('about:blank' === frameOrigin) {
        expectedResult.info['Origin'] = 'about:blank';
      } else {
        expectedResult.info[
          'Origin'
        ] = `<a href="${frameOrigin}" target="_blank" class="ps-enable-pointer-event">${frameOrigin}</a>`;
      }

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with visible frame count', () => {
    resetExpectedResult();
    const visibleFrameCounts = [0, 1, 2, 3];

    visibleFrameCounts.forEach((visibleFrameCount) => {
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        getTooltipInfoDataProp.origin,
        visibleFrameCount,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['Visible iframes'] = String(visibleFrameCount);

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with hidden frame count', () => {
    resetExpectedResult();
    const hiddenFrameCounts = [0, 1, 2, 3];

    hiddenFrameCounts.forEach((hiddenFrameCount) => {
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        getTooltipInfoDataProp.origin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        hiddenFrameCount,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['Hidden iframes'] = String(hiddenFrameCount);

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with first party cookie count', () => {
    resetExpectedResult();
    const numberOfFirstPartyCookies = [0, 1, 2, 3];

    numberOfFirstPartyCookies.forEach((cookieCount) => {
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        getTooltipInfoDataProp.origin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        cookieCount,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['First-party cookies'] = String(cookieCount);

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with third party cookie count', () => {
    resetExpectedResult();
    const numberOfThirdPartyCookies = [0, 1, 2, 3];

    numberOfThirdPartyCookies.forEach((cookieCount) => {
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        getTooltipInfoDataProp.origin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        cookieCount,
        getTooltipInfoDataProp.belongsToRWS,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['Third-party cookies'] = String(cookieCount);

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with RWS data', () => {
    resetExpectedResult();
    const belongsToRWS = ['Yes', 'No'];

    belongsToRWS.forEach((rws) => {
      const result = getTooltipInfoData(
        getTooltipInfoDataProp.frameType,
        getTooltipInfoDataProp.origin,
        getTooltipInfoDataProp.numberOfVisibleFrames,
        getTooltipInfoDataProp.numberOfHiddenFrames,
        getTooltipInfoDataProp.numberOfFirstPartyCookies,
        getTooltipInfoDataProp.numberOfThirdPartyCookies,
        rws,
        getTooltipInfoDataProp.allowedFeatures,
        getTooltipInfoDataProp.displayShowMoreButton
      );

      expectedResult.info['Belongs to RWS'] = rws;

      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an object with PS related allowed features data', () => {
    resetExpectedResult();
    const allowedFeatures = [
      'attribution-reporting',
      'browsing-topics',
      'interest-cohort',
      'join-ad-interest-group',
      'private-aggregation',
      'run-ad-auction',
      'shared-storage',
      'shared-storage-select-url',
    ];

    const result = getTooltipInfoData(
      getTooltipInfoDataProp.frameType,
      getTooltipInfoDataProp.origin,
      getTooltipInfoDataProp.numberOfVisibleFrames,
      getTooltipInfoDataProp.numberOfHiddenFrames,
      getTooltipInfoDataProp.numberOfFirstPartyCookies,
      getTooltipInfoDataProp.numberOfThirdPartyCookies,
      getTooltipInfoDataProp.belongsToRWS,
      allowedFeatures,
      getTooltipInfoDataProp.displayShowMoreButton
    );

    expectedResult.info['Allowed Features (PS related)'] =
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url';

    expectedResult.attr['allowedFeaturesInCompactView'] =
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, ...';

    expectedResult.attr['allowedFeatureInExpandedView'] =
      'attribution-reporting, browsing-topics, interest-cohort, join-ad-interest-group, private-aggregation, run-ad-auction, shared-storage, shared-storage-select-url';

    expect(result).toEqual(expectedResult);
  });
});
