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
import { Protocol } from 'puppeteer';
import { type Cookie as SimpleCookie } from 'simple-cookie';

export interface Cookie extends Protocol.Network.Cookie {
  partitionKey?: string;
}

export type Cookies = Array<Cookie>;
export type CookiesObjects = { [key: string]: Cookie };

export type ParsedCookie = SimpleCookie;

export interface TechnologyDetail {
  name: string;
  categories: string[];
}

export type TechnologyDetailList = Array<TechnologyDetail>;

export interface CookieLogDetails
  extends Omit<
    Cookie,
    | 'sameSite'
    | 'size'
    | 'session'
    | 'priority'
    | 'sameParty'
    | 'sourceScheme'
    | 'sourcePort'
  > {
  name: string;
  domain: string;
  platform: string;
  category: string;
  description: string;
  isFirstParty: 'Yes' | 'No';
  sameSite: string;
  partitionKey?: string;
  pageUrl: string;
  frameUrl: string;
  isBlocked?: boolean;
  blockedReasons: Array<string>;
}

export type BlockedCookie = {
  blockedReasons: Array<string>;
  cookieLine: string;
  cookie?: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: string | number | Date;
    size: number;
    httpOnly: boolean;
    secure: boolean;
    session: boolean;
    sameSite: string;
    priority: string;
    sameParty: boolean;
    sourceScheme: string;
    sourcePort: number;
  };
};

export type BlockedCookies = Array<BlockedCookie>;

export type RequestDetail = {
  requestID: string;
  frameID: string;
  type: string;
  url: string;
  frameURL: string;
  allCookies: Cookies;
  blockedCookies: BlockedCookies;
  acceptedCookies: Cookies;
};

export type RequestDetails = {
  [requestID: string]: RequestDetail;
};

export interface TechnologiesDetails {
  name: string;
  description: string;
  confidence: number;
  website: string;
  categories: { name: string }[];
}

export interface TechnologiesDetailsSitemap extends TechnologiesDetails {
  frequency: number;
}

export type CookieLogDetailList = Array<CookieLogDetails>;

export type UniqueCookiesLogDetail = {
  [key: string]: CookieLogDetails;
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

export type CookieDatabase = {
  [name: string]: Array<CookieAnalytics>;
};

export type CookieData = {
  parsedCookie: ParsedCookie;
  analytics: CookieAnalytics | null;
  url: string;
  headerType: 'response' | 'request';
  isFirstParty: boolean | null;
};

export interface Job {
  data: any;
  status: string;
  response: any;
  message: string;
}
