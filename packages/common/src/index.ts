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

export { default as isFirstParty } from './utils/isFirstParty';
export { default as filterFramesWithCookies } from './utils/filterFramesWithCookies';
export { default as filterCookiesByFrame } from './utils/filterCookiesByFrame';
export { default as getCookieKey } from './utils/getCookieKey';
export {
  default as findAnalyticsMatch,
  emptyAnalytics,
} from './utils/findAnalyticsMatch';
export { default as removeAndAddNewSpinnerText } from './utils/removeAndAddNewSpinnerText';
export { default as calculateEffectiveExpiryDate } from './utils/calculateEffectiveExpiryDate';
export { default as generateErrorLogFile } from './utils/generateErrorLogs';
export { default as sanitizeCsvRecord } from './utils/sanitizeCsvRecord';
export { parseUrl } from './utils/parseUrl';
export { default as fetchLocalData } from './utils/fetchLocalData';
export * from './data';
export { default as parseResponseReceivedExtraInfo } from './utils/parseResponseReceivedExtraInfo';
export { default as parseRequestWillBeSentExtraInfo } from './utils/parseRequestWillBeSentExtraInfo';
export { default as getDomainFromUrl } from './utils/getDomainFromUrl';
export { default as extractUrl } from './utils/extractUrl';
export { default as noop } from './utils/noop';
export { default as getDevToolWorker } from './worker/devToolWorker';
export { default as executeTaskInDevToolWorker } from './worker/executeTaskInDevToolWorker';
export { default as getValueByKey } from './utils/getValueByKey';
export * from './utils/contextSelector';
export { default as addUTMParams, type MediumType } from './utils/addUTMParams';
export { default as delay } from './utils/delay';
export { default as mergeDeep } from './utils/mergeDeep';
export { default as getCurrentDateAndTime } from './utils/getCurrentDateAndTime';
export { default as resolveWithTimeout } from './utils/resolveWithTimeout';
export { default as deriveBlockingStatus } from './utils/deriveBlockingStatus';
export { default as getLegendDescription } from './utils/getLegendDescription';
export { default as extractCookies } from './utils/extractCookies';
export { default as extractReportData } from './utils/extractReportData';
export { default as reshapeCookies } from './utils/reshapeCookies';
// eslint-disable-next-line import/named
export { type Context } from 'use-context-selector';
export * from './utils/sessionStorage';
export * from './worker/enums';
export * from './utils/generateReports';
export * from './cookies.types';
export * from './libraryDetection.types';
export * from './protectedAudience.types';
export * from './attributionReporting.types';
export * from './prebid.types';
export * from './prebidGlobal.types';
export * from './utils/auctions';
