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
import {
  isFirstParty,
  findAnalyticsMatch,
  type CookieData,
  type CookieDatabase,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { createCookieObject } from '../serviceWorker/createCookieObject';
import { DEVTOOLS_SET_JAVASCSCRIPT_COOKIE } from '../constants';
import type { CookieStoreCookie } from '../contentScript/types';

interface ProcessAndStoreDucmentCookies {
  tabUrl: string;
  tabId: string;
  frameId: string;
  documentCookies: CookieStoreCookie[];
  cookieDB: CookieDatabase;
}

const processAndStoreDocumentCookies = async ({
  tabUrl,
  tabId,
  frameId,
  documentCookies,
  cookieDB,
}: ProcessAndStoreDucmentCookies) => {
  try {
    const parsedCookieData: CookieData[] = documentCookies.map(
      (singleCookie: CookieStoreCookie) => {
        const { sameSite, partitioned, ...cookieWithoutAttributes } =
          singleCookie;

        let parsedCookie = {
          ...cookieWithoutAttributes,
          partitionKey: partitioned ? '' : '',
          httponly: false,
          samesite: sameSite?.toLowerCase() || 'lax',
        };

        if (singleCookie.domain) {
          parsedCookie.domain = singleCookie.domain?.startsWith('.')
            ? singleCookie.domain
            : '.' + singleCookie.domain;
        } else {
          parsedCookie.domain = window.location.hostname;
        }

        //@ts-ignore
        parsedCookie = createCookieObject(
          parsedCookie,
          tabUrl,
          [],
          'javascript'
        );

        const analytics = findAnalyticsMatch(parsedCookie.name, cookieDB);

        const isFirstPartyCookie = isFirstParty(
          parsedCookie.domain || '',
          tabUrl
        );

        return {
          parsedCookie,
          networkEvents: {
            requestEvents: [],
            responseEvents: [],
          },
          analytics:
            analytics && Object.keys(analytics).length > 0 ? analytics : null,
          url: tabUrl,
          headerType: 'javascript', // @todo Update headerType name.
          isFirstParty: isFirstPartyCookie || null,
          frameIdList: [frameId.toString()],
        };
      }
    );

    await chrome.runtime.sendMessage({
      type: DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
      payload: {
        tabId,
        cookieData: parsedCookieData,
      },
    });
  } catch (error) {
    //Just handle this error
    // eslint-disable-next-line no-console
    console.warn(error);
  }
};

export default processAndStoreDocumentCookies;
