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
 * Internal dependencies.
 */
import parseHeaders from '../parseHeaders';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';

describe('parseHeaders: ', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    globalThis.chrome = {
      ...(SinonChrome as unknown as typeof chrome),
      //@ts-ignore
      tabs: {
        reload: jest.fn(),
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: (_, __) => {
          return [{ id: 40245632, url: 'https://edition.cnn.com' }];
        },
      },
    };

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('should not process request headers', async () => {
    const cookies = await parseHeaders(
      false,
      'request',
      '123456',
      'single',
      12345,
      'https://cnn.com',
      {},
      'https://cnn.com',
      0,
      '123456',
      [
        {
          name: 'name',
          value: 'mkdes.pl',
        },
        {
          name: 'Accept',
          value:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        },
        {
          name: 'cookie',
          value:
            'cc_cookie={"categories":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"level":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"revision":0,"data":null,"rfc_cookie":false,"consent_date":"2024-02-21T10:25:39.063Z","consent_uuid":"7c4da0cf-3eb4-468a-91b0-a93a6a24cc59","last_consent_update":"2024-02-21T10:25:39.063Z"}; _ga=GA1.1.253380838.1708511136; _ga_FJBF08S8GG=GS1.1.1708580521.2.1.1708580783.60.0.1679255760',
        },
      ]
    );

    const cookies2 = await parseHeaders(
      false,
      'request',
      '123456',
      'single',
      12345,
      'https://cnn.com',
      {},
      'https://cnn.com',
      0,
      '123456'
    );

    const cookies3 = await parseHeaders(
      false,
      'request',
      '123456',
      'single',
      123456,
      'https://cnn.com',
      {},
      'https://cnn.com',
      0,
      '123456'
    );

    expect(cookies).toStrictEqual(null);
    expect(cookies2).toStrictEqual(null);
    expect(cookies3).toStrictEqual(null);
  });

  it('should process request headers', async () => {
    const timeStamp = 1577836800000;

    const cookies = await parseHeaders(
      false,
      'request',
      '123456',
      'single',
      123456,
      'https://cnn.com',
      {},
      'https://cnn.com',
      0,
      '123456',
      [
        {
          name: 'name',
          value: 'mkdes.pl',
        },
        {
          name: 'Accept',
          value:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        },
        {
          name: 'cookie',
          value:
            'cc_cookie={"categories":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"level":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"revision":0,"data":null,"rfc_cookie":false,"consent_date":"2024-02-21T10:25:39.063Z","consent_uuid":"7c4da0cf-3eb4-468a-91b0-a93a6a24cc59","last_consent_update":"2024-02-21T10:25:39.063Z"}; _ga=GA1.1.253380838.1708511136; _ga_FJBF08S8GG=GS1.1.1708580521.2.1.1708580783.60.0.1679255760',
        },
      ]
    );

    expect(cookies).toStrictEqual([
      {
        analytics: {
          category: 'Uncategorized',
          dataController: '',
          description: '',
          domain: '',
          gdprUrl: '',
          name: '',
          platform: '',
          retention: '',
          wildcard: '',
        },
        frameIdList: [0],
        headerType: 'request',
        isFirstParty: true,
        networkEvents: {
          requestEvents: [
            {
              blocked: false,
              requestId: '123456',
              timeStamp,
              type: 'CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS',
              url: 'https://cnn.com',
            },
          ],
          responseEvents: [],
        },
        parsedCookie: {
          domain: '.cnn.com',
          expires: 'Session',
          httponly: false,
          name: 'cc_cookie',
          partitionKey: '',
          path: '/',
          priority: 'Medium',
          samesite: '',
          secure: false,
          size: 570,
          value:
            '{"categories":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"level":["ccat_functionality_storage","ccat_security_storage","ccat_analytics_storage","ccat_ad_storage","ccat_ad_user_data","ccat_ad_personalization","ccat_personalization_storage"],"revision":0,"data":null,"rfc_cookie":false,"consent_date":"2024-02-21T10:25:39.063Z","consent_uuid":"7c4da0cf-3eb4-468a-91b0-a93a6a24cc59","last_consent_update":"2024-02-21T10:25:39.063Z"}',
        },
        url: 'https://cnn.com',
      },
      {
        analytics: {
          category: 'Uncategorized',
          dataController: '',
          description: '',
          domain: '',
          gdprUrl: '',
          name: '',
          platform: '',
          retention: '',
          wildcard: '',
        },
        frameIdList: [0],
        headerType: 'request',
        isFirstParty: true,
        networkEvents: {
          requestEvents: [
            {
              blocked: false,
              requestId: '123456',
              timeStamp,
              type: 'CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS',
              url: 'https://cnn.com',
            },
          ],
          responseEvents: [],
        },
        parsedCookie: {
          domain: '.cnn.com',
          expires: 'Session',
          httponly: false,
          name: '_ga',
          partitionKey: '',
          path: '/',
          priority: 'Medium',
          samesite: '',
          secure: false,
          size: 29,
          value: 'GA1.1.253380838.1708511136',
        },
        url: 'https://cnn.com',
      },
      {
        analytics: {
          category: 'Uncategorized',
          dataController: '',
          description: '',
          domain: '',
          gdprUrl: '',
          name: '',
          platform: '',
          retention: '',
          wildcard: '',
        },
        frameIdList: [0],
        headerType: 'request',
        isFirstParty: true,
        networkEvents: {
          requestEvents: [
            {
              blocked: false,
              requestId: '123456',
              timeStamp,
              type: 'CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS',
              url: 'https://cnn.com',
            },
          ],
          responseEvents: [],
        },
        parsedCookie: {
          domain: '.cnn.com',
          expires: 'Session',
          httponly: false,
          name: '_ga_FJBF08S8GG',
          partitionKey: '',
          path: '/',
          priority: 'Medium',
          samesite: '',
          secure: false,
          size: 61,
          value: 'GS1.1.1708580521.2.1.1708580783.60.0.1679255760',
        },
        url: 'https://cnn.com',
      },
    ]);
  });

  it('should process response headers', async () => {
    const cookies = await parseHeaders(
      false,
      'response',
      '123456',
      'single',
      123456,
      'https://cnn.com',
      {},
      'https://cnn.com',
      0,
      '123456',
      [
        {
          name: 'name',
          value: 'mkdes.pl',
        },
        {
          name: 'Date',
          value: 'Thu, 22 Feb 2024 07:59:33 GMT',
        },
        {
          name: 'set-cookie',
          value:
            'has_recent_activity=1; path=/; expires=Thu, 22 Feb 2024 08:59:32 GMT; secure; HttpOnly; SameSite=Lax',
        },
        {
          name: 'Content-Type',
          value: 'text/html; charset=utf-8',
        },
      ]
    );

    const timeStamp = 1577836800000;

    expect(cookies).toStrictEqual([
      {
        analytics: {
          category: 'Uncategorized',
          dataController: '',
          description: '',
          domain: '',
          gdprUrl: '',
          name: '',
          platform: '',
          retention: '',
          wildcard: '',
        },
        frameIdList: [0],
        headerType: 'response',
        isFirstParty: true,
        networkEvents: {
          requestEvents: [],
          responseEvents: [
            {
              blocked: false,
              requestId: '123456',
              timeStamp,
              type: 'CHROME_WEBREQUEST_ON_RESPONSE_STARTED',
              url: 'https://cnn.com',
            },
          ],
        },
        parsedCookie: {
          domain: 'cnn.com',
          expires: '2024-02-22T08:59:32.000Z',
          httponly: true,
          name: 'has_recent_activity',
          partitionKey: '',
          path: '/',
          priority: 'Medium',
          samesite: 'lax',
          secure: true,
          size: 20,
          value: '1',
        },
        url: 'https://cnn.com',
      },
    ]);
  });
});
