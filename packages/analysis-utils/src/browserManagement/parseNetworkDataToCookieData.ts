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
import type { Page,Frame, Protocol } from 'puppeteer';
/**
 * Internal dependencies.
 */
import { RequestData, ResponseData } from './types';

export const parseNetworkDataToCookieData = async(
  responses: Record<string, ResponseData>,
  requests: Record<string, RequestData>,
  page: Page
): Promise<{
  [frameUrl: string]: {
    cookiesCount: number;
    frameCookies: {
      [key: string]: CookieData;
    };
  };
}> => {

  const mainFrameId = "";

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

    if (!frameIdNetworkDataMap[frameId]){
      frameIdNetworkDataMap[frameId] = {
        requests:[],
        responses:[]
      }
    }

    frameIdNetworkDataMap[frameId].responses.push(response);
  }

  for (const request of Object.values(requests)) {

    if (!request.cookies || request.cookies.length === 0) {
      continue;
    }

    const frameId = request.frameId || mainFrameId;

    if (!frameIdNetworkDataMap[frameId]){
      frameIdNetworkDataMap[frameId] = {
        requests:[],
        responses:[]
      }
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

        const prevEntry = _frameCookies[key];

        const blockedReasonsSet = new Set([
          ...(cookie?.blockedReasons || []),
          ...(prevEntry?.blockedReasons || []),
        ]);

        _frameCookies[key] = {
          ...cookie,
          url: response.url,
          blockedReasons: Array.from(blockedReasonsSet),
          isBlocked: Array.from(blockedReasonsSet).length > 0,
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

        const prevEntry = _frameCookies[key];

        const blockedReasonsSet = new Set([
          ...(cookie?.blockedReasons || []),
          ...(prevEntry?.blockedReasons || []),
        ]);

        _frameCookies[key] = {
          ...cookie,
          url: request.url,
          blockedReasons: Array.from(blockedReasonsSet),
          isBlocked: Array.from(blockedReasonsSet).length > 0,
          parsedCookie: { ...cookie.parsedCookie, domain: parsedDomain || '' },
        };
      });
    });

    frameIdCookiesMap[frameId] = {
      frameCookies: _frameCookies,
    };
  }

  const frameUrlCookies: Record<
    string,
    {
      frameCookies: {
        [key: string]: CookieData;
      };
    }
  > = {};

  // const { frameTree } = await cdpSession.send('Page.getFrameTree');

  // const logFrame = ({frame,childFrames}:Protocol.Page.FrameTree) =>{
  //   console.log(frame.id);
  //   console.log(frame.url);

  //   childFrames?.forEach(logFrame);
  // }
 
  // logFrame(frameTree);

  // for (const data of Object.values(frameIdCookiesMap)) {
    
  //   if (!data.frameUrl.includes('http')) {
  //     continue;
  //   }

  //   const _url = new URL(data.frameUrl);

  //   const newFrameCookies = {
  //     ...data.frameCookies,
  //     ...(frameUrlCookies.get(_url.origin)?.frameCookies || {}),
  //   };

  //   frameUrlCookies.set(_url.origin, {
  //     cookiesCount: Object.keys(newFrameCookies)?.length || 0,
  //     frameCookies: {
  //       ...newFrameCookies,
  //     },
  //   });
  // }

  // return Object.fromEntries(frameUrlCookies);

  return {};
};
