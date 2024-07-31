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
 * Internal Dependencies.
 */
import { I18n } from '@google-psat/i18n';
import { NUMBER_OF_ALLOWED_FEATURES_IN_COMPACT_VIEW } from '../constants';

const getTooltipInfoData = (
  frameType: string,
  origin: string,
  numberOfVisibleFrames: number,
  numberOfHiddenFrames: number,
  numberOfFirstPartyCookies: number,
  numberOfThirdPartyCookies: number,
  belongsToRWS: string,
  allowedFeatures: string[] | string,
  displayShowMoreButton: boolean,
  blockedCookies: number,
  blockedReasons: string
): { [key: string]: Record<string, string> } => {
  let allowedFeatureInExpandedView;
  let allowedFeaturesInCompactView;
  const info: Record<string, string> = {};
  const attr: Record<string, string> = {};
  const infoData = {
    info: info,
    attr: attr,
  };

  info[I18n.getMessage('type')] = frameType;

  if (origin) {
    info[I18n.getMessage('origin')] =
      origin === 'about:blank'
        ? origin
        : `<a href="${origin}" target="_blank" class="ps-enable-pointer-event">${origin}</a>`;
  } else {
    info[I18n.getMessage('origin')] = 'empty';
  }

  info[I18n.getMessage('visibleIframes')] = String(numberOfVisibleFrames);
  info[I18n.getMessage('hiddenIframes')] = String(numberOfHiddenFrames);
  info[I18n.getMessage('firstPartyCookies')] = String(
    numberOfFirstPartyCookies
  );
  info[I18n.getMessage('thirdPartyCookies')] = String(
    numberOfThirdPartyCookies
  );
  info[I18n.getMessage('blockedCookies')] = String(blockedCookies);
  info[I18n.getMessage('blockedReasons')] = String(blockedReasons);

  if (Array.isArray(allowedFeatures)) {
    allowedFeatureInExpandedView = allowedFeatures.join(', ');
    if (allowedFeatures.length > NUMBER_OF_ALLOWED_FEATURES_IN_COMPACT_VIEW) {
      const filteredAllowedFeatures = allowedFeatures.slice(
        0,
        NUMBER_OF_ALLOWED_FEATURES_IN_COMPACT_VIEW
      );
      allowedFeaturesInCompactView =
        filteredAllowedFeatures.join(', ') + ', ...';
    } else {
      allowedFeaturesInCompactView = allowedFeatureInExpandedView;
    }
  } else {
    // In this case, allowedFeatures will be either 'N/A' or 'Unknown'.
    allowedFeatureInExpandedView = allowedFeatures;
    allowedFeaturesInCompactView = allowedFeatures;
  }

  const allowedFeaturesValue = displayShowMoreButton
    ? allowedFeaturesInCompactView
    : allowedFeatureInExpandedView;

  if (frameType === 'Unknown') {
    info[I18n.getMessage('note')] = I18n.getMessage('unknownFrameNote');
  } else {
    info[I18n.getMessage('belongsToRWSHeader')] = belongsToRWS;
    attr['allowedFeaturesInCompactView'] = allowedFeaturesInCompactView;
    attr['allowedFeatureInExpandedView'] = allowedFeatureInExpandedView;

    info[I18n.getMessage('allowedFeatures')] = allowedFeaturesValue;
  }

  return infoData;
};

export default getTooltipInfoData;
