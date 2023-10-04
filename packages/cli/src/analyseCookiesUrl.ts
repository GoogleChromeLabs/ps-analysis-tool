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
//@ts-nocheck
import puppeteer from 'puppeteer';
import { delay } from './utils';
import { parse } from 'simple-cookie';
import { CookieDatabase } from './types';
import findAnalyticsMatch from './utils/findAnalyticsMatch';

/**
 *
 * @param url
 * @param shouldBlock
 * @param delayTime
 * @param isHeadless
 * @param cookieDictionary
 */
async function analyzeCookies(
  url: string,
  shouldBlock: boolean,
  delayTime: number,
  isHeadless: false,
  cookieDictionary: CookieDatabase
) {
  const browser = await puppeteer.launch({
    devtools: true,
    headless: isHeadless ? 'new' : false,
  });

  const sitePage = await browser.newPage();
  sitePage.setViewport({
    width: 1440,
    height: 790,
    deviceScaleFactor: 1,
  });
  if (shouldBlock) {
    const cookiesPage = await browser.newPage();
    await cookiesPage.goto('chrome://settings/cookies');

    const radioButton = await cookiesPage.$(
      'settings-ui >>> settings-main >>> settings-basic-page >>> settings-section settings-privacy-page >>> settings-cookies-page >>> #blockThirdParty >>> #label'
    );

    if (radioButton) {
      // @ts-ignore
      await radioButton.evaluate((b) => b.click());
    } else {
      console.log('radio button not found');
    }

    await cookiesPage.close();
  }
  const cdpSession = await sitePage.createCDPSession();
  await cdpSession.send('Network.enable');

  const responseMap = new Map();

  cdpSession.on('Network.responseReceived', (response) => {
    responseMap.set(response.requestId, {
      ...(responseMap.get(response.requestId) || {}),
      frameId: response.frameId,
      serverUrl: response.response.url,
    });
  });

  cdpSession.on('Network.responseReceivedExtraInfo', (response) => {
    const cookies = response.headers['set-cookie']?.split('\n').map(parse);

    responseMap.set(response.requestId, {
      ...(responseMap.get(response.requestId) || {}),
      cookies: cookies || [],
    });
  });

  const requestMap = new Map();

  cdpSession.on('Network.requestWillBeSent', (request) => {
    requestMap.set(request.requestId, {
      ...(requestMap.get(request.requestId) || {}),
      frameId: request.frameId,
      serverUrl: request.request.url,
    });
  });

  cdpSession.on('Network.requestWillBeSentExtraInfo', (request) => {
    if (request.associatedCookies && request.associatedCookies.length !== 0) {
      requestMap.set(request.requestId, {
        ...(requestMap.get(request.requestId) || {}),
        cookies: request.associatedCookies,
      });
    }
  });

  try {
    await sitePage.goto(url, { timeout: 10000 });
  } catch (error) {
    //ignore
  }

  await delay(delayTime / 2);

  await sitePage.evaluate(() => {
    window.scrollBy(0, 10000);
  });

  await delay(delayTime / 2);

  //make frame id to url maps
  const frameIdMapFromTree = new Map();
  const frames = sitePage.frames();
  const frameCallback = (frame) => {
    const id = frame._id;
    const _url = frame.url();
    frameIdMapFromTree.set(id, _url);

    if (frame.childFrames()) {
      frame.childFrames().forEach(frameCallback);
    }
  };

  frames.forEach(frameCallback);

  const frameCookies = new Map();

  const mainFrameId = sitePage.mainFrame()._id;

  for (const [, response] of responseMap) {
    if (!response.cookies || response.cookies.length === 0) {
      continue;
    }
    const frameId = response.frameId || mainFrameId;

    frameCookies.set(frameId, {
      ...frameCookies.get(frameId),
      responses: [
        ...(frameCookies.get(frameId)?.responses || []),
        { ...response },
      ],
    });
  }

  for (const [, request] of requestMap) {
    if (!request.cookies || request.cookies.length === 0) {
      continue;
    }
    const frameId = request.frameId || mainFrameId;

    frameCookies.set(frameId, {
      ...frameCookies.get(frameId),
      requests: [
        ...(frameCookies.get(frameId)?.requests || []),
        { ...request },
      ],
    });
  }

  for (const [frameId, data] of frameCookies) {
    const _frameCookies = new Map();

    data.requests?.forEach((request) => {
      request.cookies.forEach(({ cookie }) => {
        const key = cookie.name + ':' + cookie.domain + ':' + cookie.path;
        _frameCookies.set(key, cookie);
      });
    });

    data.responses?.forEach((response) => {
      response.cookies.forEach((cookie) => {
        const key = cookie.name + ':' + cookie.domain + ':' + cookie.path;
        _frameCookies.set(key, {
          expires: cookie.expires,
          httpOnly: cookie.httponly,
          secure: cookie.secure,
          path: cookie.path,
          domain: cookie.domain,
          sameSite: cookie.samesite,
          name: cookie.name,
          value: cookie.value,
        });
      });
    });

    frameCookies.set(frameId, {
      frameUrl: frameIdMapFromTree.get(frameId) || url,
      frameCookies: Object.fromEntries(_frameCookies),
      cookieCount: frameCookies.size,
    });
  }

  // Multiple iframes have same URL

  const frameUrlCookies = new Map();

  for (const [, data] of frameCookies) {
    const _url = new URL(data.frameUrl);

    const newFrameCookies = {
      ...data.frameCookies,
      ...(frameUrlCookies.get(_url.origin)?.frameCookies || {}),
    };

    frameUrlCookies.set(_url.origin, {
      frameCookies: newFrameCookies,
      cookieCount: Object.keys(newFrameCookies).length,
    });
  }
  await browser.close();

  console.log(frameUrlCookies);

  for (const [, data] of frameUrlCookies) {
    Object.values(data.frameCookies).forEach((cookie) => {
      const analytics = findAnalyticsMatch(cookie.name, cookieDictionary);

      cookie.platform = analytics.platform || 'Unknown';
      cookie.category = analytics.category || 'Uncategorized';
      cookie.description = analytics.description || '';
    });
  }
  console.log(frameUrlCookies);
  return Object.fromEntries(frameUrlCookies);
}

/**
 *
 * @param url
 * @param isHeadless
 * @param delayTime
 * @param cookieDictionary
 */
export async function analyzeCookiesUrl(
  url: string,
  isHeadless,
  delayTime,
  cookieDictionary
) {
  const normalEnvFrameCookies = await analyzeCookies(
    url,
    false,
    delayTime,
    isHeadless,
    cookieDictionary
  );
  const blockedEnvFrameCookies = await analyzeCookies(
    url,
    false,
    delayTime,
    isHeadless,
    cookieDictionary
  );

  const cookieKeysInBlockedEnv = new Set();
  Object.values(blockedEnvFrameCookies).forEach(({ frameCookies }) => {
    Object.keys(frameCookies).forEach((key) => {
      cookieKeysInBlockedEnv.add(key);
    });
  });

  Object.values(normalEnvFrameCookies).forEach(({ frameCookies }) => {
    Object.keys(frameCookies).forEach((key) => {
      frameCookies[key].isBlocked = !cookieKeysInBlockedEnv.has(key);
    });
  });

  return normalEnvFrameCookies;
}
