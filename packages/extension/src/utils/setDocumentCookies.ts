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
import { isFirstParty, findAnalyticsMatch } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { createCookieObject } from '../serviceWorker/createCookieObject';
import { fetchDictionary, type CookieDatabase } from './fetchCookieDictionary';
import { CookieStore, type CookieData } from '../localStore';

interface ProcessAndStoreDucmentCookiesProps {
  tabUrlResult: string;
  tabId: string;
  documentCookies: string[];
  dictionary: CookieDatabase;
  isException: object;
}

const processAndStoreDocumentCookies = async ({
  tabUrlResult,
  tabId,
  documentCookies,
  dictionary,
  isException,
}: ProcessAndStoreDucmentCookiesProps) => {
  try {
    if (!isException && typeof tabUrlResult === 'string') {
      const tabUrl = tabUrlResult;

      const frames = await chrome.webNavigation.getAllFrames({
        tabId: Number(tabId),
      });

      const outerMostFrame = frames?.filter(
        (frame) => frame.frameType === 'outermost_frame'
      );

      const cdpCookies = await chrome.debugger.sendCommand(
        { tabId: parseInt(tabId) },
        'Network.getCookies',
        { urls: [tabUrl] }
      );

      const parsedCookieData: CookieData[] = await Promise.all(
        documentCookies.map(async (singleCookie: string) => {
          const [name, ...rest] = singleCookie.split('=');
          let analytics;

          const parsedCookie = await createCookieObject(
            {
              name: name.trim(),
              value: rest.join('='),
            },
            tabUrl,
            cdpCookies?.cookies ?? []
          );

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
            headerType: 'javascript', // @todo Update headerType name.
            isFirstParty: isFirstPartyCookie || null,
            frameIdList: [
              outerMostFrame && outerMostFrame[0]
                ? outerMostFrame[0]?.frameId
                : 0,
            ],
          });
        })
      );
      await CookieStore.update(tabId, parsedCookieData);
    }
  } catch (error) {
    //Just handle this error
  }
};

/**
 * Utility function to get the cookies from result and send it for processing.
 * @param result the evaluated value of array of string.
 * @param exceptionGenerated Boolean value which specifies if an exception was generated during evaluating the javascript.
 * @param tabId Tab ID from which the JS cookies have to be read.
 * @param dictionary JSON object which is used to classify cookie based on their use.
 */
const getJSCookiesForProcessing = (
  result: string[],
  exceptionGenerated: object,
  tabId: string,
  dictionary: CookieDatabase
) => {
  let documentCookies: string[] = [];

  if (!exceptionGenerated && result.length > 1) {
    documentCookies = result;

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (tabUrlResult: string, isException) =>
        processAndStoreDocumentCookies({
          tabUrlResult,
          tabId,
          documentCookies,
          dictionary,
          isException,
        })
    );
  } else {
    return;
  }
};

/**
 * Adds the cookies set via document.cookie.
 * @param tabId Id of the tab being listened to.
 */
async function setDocumentCookies(tabId: string) {
  if (!tabId) {
    return;
  }

  const dictionary = await fetchDictionary();

  chrome.devtools.inspectedWindow.eval(
    'document.cookie.split(";")',
    (result: string[], isException) =>
      getJSCookiesForProcessing(result, isException, tabId, dictionary)
  );
}
export default setDocumentCookies;
