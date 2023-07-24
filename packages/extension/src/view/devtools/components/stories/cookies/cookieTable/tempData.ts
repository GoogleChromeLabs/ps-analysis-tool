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
import type { Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import type { CookieAnalytics } from '../../../../../../utils/fetchCookieDictionary';
import type { CookieData } from '../../../../../../localStore';

export const TempData: CookieData[] = [
  {
    parsedCookie: {
      name: 'cookie1',
      value:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      domain: 'example.com',
      path: '/',
      expires: '2023-06-30',
      secure: true,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Marketing',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie2',
      value: 'value2',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2023-07-15',
      secure: false,
      samesite: 'None',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Marketing',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie3',
      value: 'value3',
      domain: 'example.com',
      path: '/',
      expires: '2023-08-01',
      secure: true,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Marketing',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie4',
      value: 'value4',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2023-09-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie5',
      value: 'value5',
      domain: 'example.com',
      path: '/',
      expires: '2023-10-01',
      secure: true,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie6',
      value: 'value6',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2023-11-15',
      secure: false,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Functional',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie7',
      value: 'value7',
      domain: 'example.com',
      path: '/',
      expires: '2023-12-01',
      secure: true,
      samesite: 'None',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie8',
      value: 'value8',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-01-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie9',
      value: 'value9',
      domain: 'example.com',
      path: '/',
      expires: '2024-02-01',
      secure: true,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie10',
      value: 'value10',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-03-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Unknown',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie11',
      value: 'value11',
      domain: 'example.com',
      path: '/',
      expires: '2024-04-01',
      secure: true,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie12',
      value: 'value12',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-05-15',
      secure: false,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie13',
      value: 'value13',
      domain: 'example.com',
      path: '/',
      expires: '2024-06-01',
      secure: true,
      samesite: 'None',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie14',
      value: 'value14',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-07-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie15',
      value: 'value15',
      domain: 'example.com',
      path: '/',
      expires: '2024-08-01',
      secure: true,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie16',
      value: 'value16',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-09-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie17',
      value: 'value17',
      domain: 'example.com',
      path: '/',
      expires: '2024-10-01',
      secure: true,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie18',
      value: 'value18',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2024-11-15',
      secure: false,
      samesite: 'Strict',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie19',
      value: 'value19',
      domain: 'example.com',
      path: '/',
      expires: '2024-12-01',
      secure: true,
      samesite: 'None',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
  {
    parsedCookie: {
      name: 'cookie20',
      value: 'value20',
      domain: 'subdomain.example.com',
      path: '/subpath',
      expires: '2025-01-15',
      secure: false,
      samesite: 'Lax',
      httponly: true,
    } as ParsedCookie,
    analytics: {
      platform: 'Google',
      retention: '1 year',
      category: 'Analytics',
      gdprUrl: 'https://gdprUrl.com',
      description:
        'This is a long description about the cookie. It comes from open cookie db.',
    } as CookieAnalytics,
    url: 'https://example.com',
    headerType: 'response',
  },
];
