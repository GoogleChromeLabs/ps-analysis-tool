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
import { getDomain } from 'tldts';
import { CookieData } from '@ps-analysis-tool/common';
import type { Page } from 'puppeteer';
/**
 * Internal dependencies.
 */
import { CookieDataFromNetwork, RequestData, ResponseData } from './types';

// eslint-disable-next-line complexity
export const parseNetworkDataToCookieData = async (
  responses: Record<string, ResponseData>,
  requests: Record<string, RequestData>,
  page: Page,
  pageFrames: Record<string, string>
): Promise<CookieDataFromNetwork> => {
  const mainFrameId = '';

  const frameIdNetworkDataMap: Record<
    string,
    {
      responses: ResponseData[];
      requests: RequestData[];
    }
  > = {};

  for (const response of Object.values(responses)) {
    if (!response.cookies || response.cookies.length === 0) {
      continue;
    }

    const frameId = response.frameId || mainFrameId;

    if (!frameIdNetworkDataMap[frameId]) {
      frameIdNetworkDataMap[frameId] = {
        requests: [],
        responses: [],
      };
    }

    frameIdNetworkDataMap[frameId].responses.push(response);
  }

  for (const request of Object.values(requests)) {
    if (!request.cookies || request.cookies.length === 0) {
      continue;
    }

    const frameId = request.frameId || mainFrameId;

    if (!frameIdNetworkDataMap[frameId]) {
      frameIdNetworkDataMap[frameId] = {
        requests: [],
        responses: [],
      };
    }

    frameIdNetworkDataMap[frameId].requests.push(request);
  }

  const frameIdCookiesMap: Record<
    string,
    {
      frameCookies: {
        [key: string]: CookieData;
      };
    }
  > = {};

  for (const [frameId, data] of Object.entries(frameIdNetworkDataMap)) {
    const _frameCookies: Record<string, CookieData> = {};

    data.responses?.forEach((response: ResponseData) => {
      response.cookies.forEach((cookie) => {
        // domain update required. Domain based on the server url
        let parsedDomain =
          cookie.parsedCookie.domain === ''
            ? getDomain(response.url)
            : cookie.parsedCookie.domain;

        if (parsedDomain && parsedDomain[0] !== '.') {
          parsedDomain = '.' + parsedDomain;
        }

        const key =
          cookie.parsedCookie.name +
          ':' +
          parsedDomain +
          ':' +
          cookie.parsedCookie.path;

        const prevEntry = _frameCookies[key.trim()];

        const blockedReasonsSet = new Set([
          ...(cookie?.blockedReasons || []),
          ...(prevEntry?.blockedReasons || []),
        ]);

        const networkEvents = {
          requestEvents: prevEntry?.networkEvents?.requestEvents || [],
          responseEvents: [
            ...(cookie?.networkEvents?.responseEvents || []),
            ...(prevEntry?.networkEvents?.responseEvents || []),
          ],
        };

        _frameCookies[key.trim()] = {
          ...cookie,
          url: response.url,
          blockedReasons: Array.from(blockedReasonsSet),
          isBlocked: Array.from(blockedReasonsSet).length > 0,
          networkEvents,
          parsedCookie: {
            ...cookie.parsedCookie,
            domain: parsedDomain || '',
          },
        };
      });
    });

    data.requests?.forEach((request: RequestData) => {
      request.cookies.forEach((cookie) => {
        // domain update required. Domain based on the server url
        let parsedDomain =
          cookie.parsedCookie.domain === ''
            ? getDomain(request.url)
            : cookie.parsedCookie.domain;

        if (parsedDomain && parsedDomain[0] !== '.') {
          parsedDomain = '.' + parsedDomain;
        }

        const key =
          cookie.parsedCookie.name +
          ':' +
          parsedDomain +
          ':' +
          cookie.parsedCookie.path;

        const prevEntry = _frameCookies[key.trim()];

        const blockedReasonsSet = new Set([
          ...(cookie?.blockedReasons || []),
          ...(prevEntry?.blockedReasons || []),
        ]);

        const networkEvents = {
          requestEvents: [
            ...(cookie?.networkEvents?.requestEvents || []),
            ...(prevEntry?.networkEvents?.requestEvents || []),
          ],
          responseEvents: prevEntry?.networkEvents?.responseEvents || [],
        };

        _frameCookies[key.trim()] = {
          ...cookie,
          url: request.url,
          blockedReasons: Array.from(blockedReasonsSet),
          networkEvents,
          isBlocked: Array.from(blockedReasonsSet).length > 0,
          parsedCookie: { ...cookie.parsedCookie, domain: parsedDomain || '' },
        };
      });
    });

    frameIdCookiesMap[frameId] = {
      frameCookies: _frameCookies,
    };
  }

  const cdpSession = await page.createCDPSession();

  const { targetInfos } = await cdpSession.send('Target.getTargets');

  const allTargets: Record<string, string> = {};
  const pageTargetsFromNetwork: Record<string, string> = {};

  targetInfos.forEach(({ targetId, url }) => {
    allTargets[targetId] = url;
  });

  for (const frameId of Object.keys(frameIdCookiesMap)) {
    let url = '';
    let _frameId = frameId;

    while (url === '') {
      if (_frameId === '0') {
        url = page.url();
      }

      if (allTargets[frameId]) {
        url = allTargets[frameId];
      } else {
        // Seek parent
        _frameId = pageFrames[_frameId] || '0';
      }
    }
    pageTargetsFromNetwork[frameId] = url;
  }

  const frameUrlCookiesMap: Record<
    string,
    {
      frameCookies: {
        [key: string]: CookieData;
      };
    }
  > = {};

  for (const [frameId, data] of Object.entries(frameIdCookiesMap)) {
    const key = new URL(pageTargetsFromNetwork[frameId]).origin;

    frameUrlCookiesMap[key] = {
      frameCookies: {
        ...data.frameCookies,
        ...(frameUrlCookiesMap[key]?.frameCookies || {}),
      },
    };
  }

  // Loop over pageFrames and add empty entry for any frame which was not found in frameUrlCookiesMap.
  for (const frameId of Object.keys(pageFrames)) {
    let url = '';
    let _frameId = frameId;

    while (url === '') {
      if (_frameId === '0') {
        url = page.url();
      }

      if (allTargets[frameId]) {
        url = allTargets[frameId];
      } else {
        // Seek parent
        _frameId = pageFrames[_frameId] || '0';
      }
    }

    const key = new URL(url).origin;

    if (!frameUrlCookiesMap[key]) {
      frameUrlCookiesMap[key] = {
        frameCookies: {},
      };
    }
  }

  return frameUrlCookiesMap;
};
