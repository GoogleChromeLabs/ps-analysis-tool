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
import { type Cookie as ParsedCookie } from 'simple-cookie';

export type CookiesCount = {
  total: number;
  firstParty: {
    total: number;
    functional: number;
    marketing: number;
    analytics: number;
    uncategorized: number;
  };
  thirdParty: {
    total: number;
    functional: number;
    marketing: number;
    analytics: number;
    uncategorized: number;
  };
};

export type CookieAnalytics = {
  platform: string;
  category: string;
  name: string;
  domain: string;
  description: string;
  retention: string;
  dataController: string;
  gdprUrl: string;
  wildcard: string;
};

export type CookieData = {
  parsedCookie: ParsedCookie;
  analytics: CookieAnalytics | null;
  url: string;
  headerType: 'response' | 'request' | 'javascript';
  isFirstParty: boolean | null;
  frameIdList: number[];
};

export type CookieTableData = CookieData & {
  isCookieSet: boolean | null;
  frameUrl?: string;
};

export type TechnologyData = {
  slug: string;
  name: string;
  description: string;
  confidence: number;
  version: string | null;
  icon: string;
  website: string;
  cpe: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  rootPath: boolean;
  pageUrl?: string;
};

export interface TabCookies {
  [key: string]: CookieTableData;
}

export interface TabFrames {
  [key: string]: { frameIds: number[] };
}

export interface Legend {
  label: string;
  count: number;
  color: string;
  countClassName: string;
}

export interface CookieStatsComponents {
  legend: Legend[];
  firstParty: {
    count: number;
    color: string;
  }[];
  thirdParty: {
    count: number;
    color: string;
  }[];
}

export interface FramesWithCookies {
  [key: string]: { frameIds: number[] };
}
