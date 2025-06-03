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
import OpenCookieDatabase from 'ps-analysis-tool/packages/extension/public/assets/data/open-cookie-database.json';
import { onBeforeSendHeadersListener } from '../beforeSendHeadersListener';
import { requestHeaders } from '../test-utils/requestHeaders';
import dataStore, { DataStore } from '../../../../store/dataStore';
import cookieStore from '../../../../store/cookieStore';

describe('chrome.webRequest.onBeforeSendHeaders.addListener', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    SinonChrome.webRequest.onBeforeSendHeaders.addListener(
      onBeforeSendHeadersListener,
      { urls: ['*://*/*'] },
      ['extraHeaders', 'requestHeaders']
    );
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...OpenCookieDatabase,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  beforeEach(() => {
    DataStore.globalIsUsingCDP = false;
    dataStore.addTabData('1141143618');
    dataStore.updateUrl('1141143618', 'https://bbc.com');
    cookieStore.initialiseVariablesForNewTab('1141143618');
  });
  afterEach(() => {
    dataStore.removeTabData('1141143618');
    cookieStore.deinitialiseVariablesForTab('1141143618');
  });

  test('Should parse request Cookies', async () => {
    SinonChrome.webRequest.onBeforeSendHeaders.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      requestHeaders,
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(cookieStore.getTabsData('1141143618')).length).toEqual(
      24
    );
  });

  test('Should not parse cookies if no cookie header is found in request header', async () => {
    SinonChrome.webRequest.onBeforeSendHeaders.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      requestHeaders: requestHeaders.filter(({ name }) => name !== 'Cookie'),
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(cookieStore.getTabsData('1141143618')).length).toEqual(
      0
    );
  });

  test('Should not parse cookies if cdp is on', async () => {
    DataStore.globalIsUsingCDP = true;
    SinonChrome.webRequest.onBeforeSendHeaders.dispatch({
      url: 'https://bbc.com',
      frameId: 0,
      requestHeaders: requestHeaders.filter(({ name }) => name !== 'Cookie'),
      tabId: 1141143618,
      requestId: 457,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(cookieStore.getTabsData('1141143618')).length).toEqual(
      0
    );
    DataStore.globalIsUsingCDP = false;
  });
});
