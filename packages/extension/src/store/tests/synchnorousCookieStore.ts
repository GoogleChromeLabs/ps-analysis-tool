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
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies
 */
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import OpenCookieDatabase from 'ps-analysis-tool/assets/data/open-cookie-database.json';
import data from '../../utils/test-data/cookieMockData';
import dataStore, { DataStore } from '../dataStore';
import cookieStore from '../cookieStore';
import { BlockedReason, CookieData } from '@google-psat/common';

describe('SynchnorousCookieStore:', () => {
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
  });

  beforeEach(() => {
    dataStore.addTabData('123456');
    dataStore.updateUrl('123456', 'https://bbc.com');
  });

  afterEach(() => {
    dataStore.clear();
  });

  it('Should not update storage if there are no new cookies', () => {
    cookieStore.update('123456', []);
    expect(Object.keys(cookieStore.getTabsData('123456')).length).toBe(0);
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(0);
  });

  it('Should add new cookie if cookie doesnt exist', () => {
    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']).toBeUndefined();
    cookieStore.update('123456', [data.tabCookies['_cb']]);
    expect(
      cookieStore.getTabsData('123456')['_cbcnn.com/']
    ).not.toBeUndefined();
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(1);
  });

  it('Should update cookie with new blocked reason', () => {
    cookieStore.update('123456', [
      { ...data.tabCookies['_cb'], isBlocked: false, blockedReasons: [] },
    ]);

    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']?.isBlocked).toBe(
      false
    );

    expect(
      (
        cookieStore.getTabsData('123456')['_cbcnn.com/']
          ?.blockedReasons as BlockedReason[]
      )?.length
    ).toBe(0);
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(1);

    cookieStore.update('123456', [
      {
        ...data.tabCookies['_cb'],
        isBlocked: false,
        blockedReasons: ['InvalidDomain'],
      },
    ]);

    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']?.isBlocked).toBe(
      true
    );

    expect(
      cookieStore.getTabsData('123456')['_cbcnn.com/'].blockedReasons
    ).toContain('InvalidDomain');
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(2);
  });

  it('Should persist the partition key from the previous set data', () => {
    cookieStore.update('123456', [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: 'https://bbc.com',
          priority: 'Medium',
        },
      },
    ]);

    expect(
      (
        cookieStore.getTabsData('123456')['_cbcnn.com/']
          ?.parsedCookie as CookieData['parsedCookie']
      )?.partitionKey
    ).toBe('https://bbc.com');
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(1);

    cookieStore.update('123456', [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: '',
          priority: 'Medium',
        },
      },
    ]);

    expect(
      (
        cookieStore.getTabsData('123456')['_cbcnn.com/']
          ?.parsedCookie as CookieData['parsedCookie']
      )?.partitionKey
    ).toBe('https://bbc.com');
    expect(DataStore.tabs['123456'].newUpdatesCA).toBe(2);
  });

  it('Should not update the data if tabId is not present', () => {
    cookieStore.update('12345', [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: 'https://bbc.com',
          priority: 'Medium',
        },
      },
    ]);
    expect(DataStore.tabs['12345']?.newUpdatesCA).toBeUndefined();
  });

  it('Should clear cookie store when clear is called', () => {
    expect(DataStore.tabs['123456']).toBeDefined();
    expect(cookieStore.getTabsData('123456')).toBeDefined();

    cookieStore.clear();

    expect(DataStore.tabs['123456']).toBeUndefined();
    expect(cookieStore.getTabsData('123456')).toBeUndefined();
  });

  it('Should return the tab url for tab if exists', () => {
    expect(cookieStore.getTabUrl('123456')).toBe('https://bbc.com');
    expect(cookieStore.getTabUrl('12345')).toBeNull();
  });

  it('Should update the url of tab if it exists', () => {
    expect(cookieStore.getTabUrl('123456')).toBe('https://bbc.com');
    cookieStore.updateUrl('123456', 'https://cnn.com');
    expect(cookieStore.getTabUrl('123456')).toBe('https://cnn.com');
  });

  it('Should add cookie exclusion reason and warning reason', () => {
    cookieStore.addCookieExclusionWarningReason(
      '_cbcnn.com/',
      [],
      ['WarnSameSiteUnspecifiedCrossSiteContext'],
      '123456'
    );

    expect(
      cookieStore.getTabsData('123456')['_cbcnn.com/'].warningReasons
    ).toContain('WarnSameSiteUnspecifiedCrossSiteContext');

    cookieStore.addCookieExclusionWarningReason(
      '_cbcnn.com/',
      ['SameSiteUnspecifiedTreatedAsLax'],
      [],
      '123456'
    );

    expect(
      cookieStore.getTabsData('123456')['_cbcnn.com/'].blockedReasons
    ).toContain('SameSiteUnspecifiedTreatedAsLax');
  });

  it('Should remove tabData', () => {
    expect(DataStore.tabs['123456']).toBeDefined();
    cookieStore.removeTabData('123456');
    expect(DataStore.tabs['123456']).toBeUndefined();
  });

  it('Should remove cookie', () => {
    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']).toBeUndefined();

    cookieStore.update('123456', [data.tabCookies['_cb']]);

    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']).toBeDefined();

    cookieStore.removeCookieData('123456');

    expect(cookieStore.getTabsData('123456')['_cbcnn.com/']).toBeUndefined();
  });
});
