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

/**
 * Internal dependencies.
 */
import { Cookie, RequestData, ResponseData } from './types';

export const parseNetworkDataToCookieData = (
  responseMap: Map<string, ResponseData>,
  requestMap: Map<string, RequestData>,
  frameIdUrlMap: Map<string, string>,
  mainFrameId: string,
  pageUrl: string
): {
  [frameUrl: string]: {
    cookiesCount: number;
    frameCookies: {
      [key: string]: Cookie;
    };
  };
} => {
  const frameIdNetworkDataMap = new Map<
    string,
    { responses: ResponseData[]; requests: RequestData[] }
  >();

  for (const [, response] of responseMap) {
    if (!response.cookies || response.cookies.length === 0) {
      continue;
    }
    const frameId = response.frameId || mainFrameId;
    const prevResposes = frameIdNetworkDataMap.get(frameId)?.responses || [];
    const prevRequests = frameIdNetworkDataMap.get(frameId)?.requests || [];

    frameIdNetworkDataMap.set(frameId, {
      responses: [...prevResposes, response],
      requests: prevRequests,
    });
  }

  for (const [, request] of requestMap) {
    if (!request.cookies || request.cookies.length === 0) {
      continue;
    }
    const frameId = request.frameId || mainFrameId;
    const prevResposes = frameIdNetworkDataMap.get(frameId)?.responses || [];
    const prevRequests = frameIdNetworkDataMap.get(frameId)?.requests || [];

    frameIdNetworkDataMap.set(frameId, {
      responses: prevResposes,
      requests: [...prevRequests, request],
    });
  }

  const frameIdCookiesMap = new Map<
    string,
    {
      frameUrl: string;
      frameCookies: {
        [key: string]: Cookie;
      };
    }
  >();

  for (const [frameId, data] of frameIdNetworkDataMap) {
    const _frameCookies = new Map<string, Cookie>();

    data.requests?.forEach((request: RequestData) => {
      request.cookies.forEach((cookie) => {
        const key = cookie.name + ':' + cookie.domain + ':' + cookie.path;
        _frameCookies.set(key, cookie);
      });
    });

    data.responses?.forEach((response: ResponseData) => {
      response.cookies.forEach((cookie) => {
        // domain update required. Domain based on the server url
        const parsedDomain =
          cookie.domain === '' ? getDomain(response.serverUrl) : cookie.domain;

        const key = cookie.name + ':' + parsedDomain + ':' + cookie.path;
        _frameCookies.set(key, { ...cookie, domain: parsedDomain || '' });
      });
    });

    frameIdCookiesMap.set(frameId, {
      frameUrl: frameIdUrlMap.get(frameId) || pageUrl,
      frameCookies: Object.fromEntries(_frameCookies),
    });
  }
  const frameUrlCookies = new Map<
    string,
    {
      cookiesCount: number;
      frameCookies: {
        [key: string]: Cookie;
      };
    }
  >();

  for (const [, data] of frameIdCookiesMap) {
    if (!data.frameUrl.includes('http')) {
      continue;
    }
    const _url = new URL(data.frameUrl);

    const newFrameCookies = {
      ...data.frameCookies,
      ...(frameUrlCookies.get(_url.origin)?.frameCookies || {}),
    };

    frameUrlCookies.set(_url.origin, {
      cookiesCount: Object.keys(newFrameCookies)?.length || 0,
      frameCookies: {
        ...newFrameCookies,
      },
    });
  }

  return Object.fromEntries(frameUrlCookies);
};
