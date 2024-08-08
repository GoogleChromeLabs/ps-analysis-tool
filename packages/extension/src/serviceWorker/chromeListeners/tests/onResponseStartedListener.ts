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
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies
 */
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import OpenCookieDatabase from 'ps-analysis-tool/assets/data/open-cookie-database.json';

import { onResponseStartedListener } from '../onResponseStartedListener';
import { responseHeaders } from '../test-utils/requestHeaders';
import dataStore from '../../../store/dataStore';

describe('chrome.webRequest.onResponseStarted.addListener', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...OpenCookieDatabase,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;

    SinonChrome.webRequest.onResponseStarted.addListener(
      onResponseStartedListener,
      { urls: ['*://*/*'] },
      ['extraHeaders', 'responseHeaders']
    );
  });

  beforeEach(() => {
    dataStore.globalIsUsingCDP = false;
    dataStore.tabMode = 'single';
    dataStore.addTabData(1141143618);
    dataStore.updateUrl(1141143618, 'https://bbc.com');
    dataStore.tabToRead = '1141143618';
  });

  afterEach(() => {
    dataStore.removeTabData(1141143618);
  });

  test('Should parse response Cookies', async () => {
    await new Promise((r) => setTimeout(r, 2000));
    SinonChrome.webRequest.onResponseStarted.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      responseHeaders,
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(dataStore.tabsData[1141143618]).length).toEqual(2);
  });

  test('Should not parse cookies if no cookie header is found in response header', async () => {
    SinonChrome.webRequest.onResponseStarted.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      requestHeaders: responseHeaders.filter(
        ({ name }) => name !== 'set-cookie'
      ),
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(dataStore.tabsData[1141143618]).length).toEqual(0);
  });

  test('Should not parse cookies if cdp is on', async () => {
    dataStore.globalIsUsingCDP = true;
    SinonChrome.webRequest.onResponseStarted.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      requestHeaders: responseHeaders.filter(
        ({ name }) => name !== 'set-cookie'
      ),
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(dataStore.tabsData[1141143618]).length).toEqual(0);
    dataStore.globalIsUsingCDP = false;
  });
});
