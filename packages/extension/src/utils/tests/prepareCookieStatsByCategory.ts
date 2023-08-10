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
 * Internal dependencies.
 */
import prepareCookieStatsByCategory from '../prepareCookieStatsByCategory';

const functional1pCookie = {
  parsedCookie: {
    name: 'cookie_name_1',
    value: 'val',
    domain: 'example.com',
  },
  analytics: {
    category: 'functional',
  },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const marketing1pCookie = {
  parsedCookie: {
    name: 'cookie_name_2',
    value: 'val',
    domain: 'example.com',
  },
  analytics: {
    category: 'marketing',
  },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const analytics1pCookie = {
  parsedCookie: {
    name: 'cookie_name_3',
    value: 'val',
    domain: 'example.com',
  },
  analytics: {
    category: 'analytics',
  },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const uncategorized1pCookie = {
  parsedCookie: {
    name: 'cookie_name_4',
    value: 'val',
    domain: 'example.com',
  },
  analytics: null,
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const functional3pCookie = {
  parsedCookie: {
    name: 'cookie_name_5',
    value: 'val',
    domain: 'other.server.com',
  },
  analytics: {
    category: 'functional',
  },
  url: 'https://other.server.com/public/api/alerts',
  headerType: 'request',
};

const marketing3pCookie = {
  parsedCookie: {
    name: 'cookie_name_6',
    value: 'val',
    domain: 'other.server.com',
  },
  analytics: {
    category: 'marketing',
  },
  url: 'https://other.server.com/public/api/alerts',
  headerType: 'request',
};

const analytics3pCookie = {
  parsedCookie: {
    name: 'cookie_name_7',
    value: 'val',
    domain: 'other.server.com',
  },
  analytics: {
    category: 'analytics',
  },
  url: 'https://other.server.com/public/api/alerts',
  headerType: 'request',
};

const uncategorized3pCookie = {
  parsedCookie: {
    name: 'cookie_name_8',
    value: 'val',
    domain: 'other.server.com',
  },
  analytics: null,
  url: 'https://other.server.com/public/api/alerts',
  headerType: 'request',
};

const EMPTY_STATS = {
  total: 0,
  firstParty: {
    total: 0,
    functional: 0,
    marketing: 0,
    analytics: 0,
    uncategorized: 0,
  },
  thirdParty: {
    total: 0,
    functional: 0,
    marketing: 0,
    analytics: 0,
    uncategorized: 0,
  },
};

describe('prepareCookieStatsByCategory : ', () => {
  it('Gives empty stats with cookies', () => {
    expect(
      prepareCookieStatsByCategory({}, 'https://example.com/page')
    ).toEqual(EMPTY_STATS);
  });

  it('Gives empty stats with null passed as cookies', () => {
    expect(countCookiesByCategory(null, 'https://example.com/page')).toEqual(
      EMPTY_STATS
    );
  });

  it('Generates correct tests', () => {
    const cookies = {
      [functional1pCookie.parsedCookie.name]: functional1pCookie,
      [functional3pCookie.parsedCookie.name]: functional3pCookie,
      [marketing1pCookie.parsedCookie.name]: marketing1pCookie,
      [marketing3pCookie.parsedCookie.name]: marketing3pCookie,
      [analytics1pCookie.parsedCookie.name]: analytics1pCookie,
      [analytics3pCookie.parsedCookie.name]: analytics3pCookie,
      [uncategorized1pCookie.parsedCookie.name]: uncategorized1pCookie,
      [uncategorized3pCookie.parsedCookie.name]: uncategorized3pCookie,
    };

    const expectedStats = {
      total: 8,
      firstParty: {
        total: 4,
        functional: 1,
        marketing: 1,
        analytics: 1,
        uncategorized: 1,
      },
      thirdParty: {
        total: 4,
        functional: 1,
        marketing: 1,
        analytics: 1,
        uncategorized: 1,
      },
    };
    expect(
      //@ts-ignore Missing properties are not required in the function.
      prepareCookieStatsByCategory(cookies, 'https://example.com/page')
    ).toEqual(expectedStats);
  });
});
