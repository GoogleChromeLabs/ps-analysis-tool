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
 * External dependencies
 */
import cookie, { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import { createCookieObject } from '../worker/createCookieObject';
import { fetchDictionary } from './fetchCookieDictionary';
import findAnalyticsMatch from '../worker/findAnalyticsMatch';
import isFirstParty from './isFirstParty';
import { CookieStore, type CookieData } from '../localStore';
/**
 * Adds the cookies set via document.cookie.
 * @param tabId Id of the tab being listened to.
 */
async function getDocumentCookies(tabId: string) {
  let documentCookies: string[] = [];
  let parsedCookieData: CookieData[] = [];
  let tabUrl = '';
  const dictionary = await fetchDictionary();

  chrome.devtools.inspectedWindow.eval(
    'document.cookie.split(";")',
    (result: string[], isException) => {
      if (!isException && result.length > 0) {
        documentCookies = result;
      } else {
        return;
      }
    }
  );
  chrome.devtools.inspectedWindow.eval(
    'window.location.href',
    (result, isException) => {
      if (!isException && typeof result === 'string') {
        tabUrl = result;
      }
    }
  );

  const frames = await chrome.webNavigation.getAllFrames({
    tabId: Number(tabId),
  });
  const outerMostFrame = frames?.filter(
    (frame) => frame.frameType === 'outermost_frame'
  );

  parsedCookieData = await Promise.all(
    documentCookies.map(async (singleCookie) => {
      const cookieValue = singleCookie.split('=')[1];
      let analytics;

      let parsedCookie: ParsedCookie = cookie.parse(cookieValue);
      parsedCookie = await createCookieObject(parsedCookie, tabUrl);

      if (dictionary) {
        analytics = findAnalyticsMatch(parsedCookie.name, dictionary);
      }
      const isFirstPartyCookie = isFirstParty(
        parsedCookie.domain || '',
        tabUrl
      );
      return Promise.resolve({
        parsedCookie,
        analytics:
          analytics && Object.keys(analytics).length > 0 ? analytics : null,
        url: tabUrl,
        headerType: 'document',
        isFirstParty: isFirstPartyCookie || null,
        frameIdList: [
          outerMostFrame && outerMostFrame[0] ? outerMostFrame[0]?.frameId : 0,
        ],
      });
    })
  );
  await CookieStore.update(tabId, parsedCookieData);
}
export default getDocumentCookies;
