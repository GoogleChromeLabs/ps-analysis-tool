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
import type { Protocol } from 'devtools-protocol';
import { LibraryData } from './libraryDetection.types';

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
  blockedCookies: {
    total: number;
    [key: string]: number;
  };
  exemptedCookies: {
    total: number;
    [key: string]: number;
  };
};

export type CookieAnalytics = {
  platform?: string;
  category?: string;
  name?: string;
  domain?: string;
  description?: string;
  retention?: string;
  dataController?: string;
  gdprUrl?: string;
  wildcard?: string;
};

export type CookieDatabase = {
  [name: string]: Array<CookieAnalytics>;
};

export type BlockedReason =
  | Protocol.Network.SetCookieBlockedReason
  | Protocol.Network.CookieBlockedReason;

export enum RESPONSE_EVENT {
  CHROME_WEBREQUEST_ON_RESPONSE_STARTED = 'CHROME_WEBREQUEST_ON_RESPONSE_STARTED',
  CDP_RESPONSE_RECEIVED = 'CDP_RESPONSE_RECEIVED',
  CDP_RESPONSE_RECEIVED_EXTRA_INFO = 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
}

export enum REQUEST_EVENT {
  CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS = 'CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS',
  CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO = 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
}

export enum BLOCK_STATUS {
  UNKNOWN = 'UNKNOWN',
  BLOCKED_IN_ALL_EVENTS = 'BLOCKED_IN_ALL_EVENTS',
  BLOCKED_IN_SOME_EVENTS = 'BLOCKED_IN_SOME_EVENTS',
  NOT_BLOCKED = 'NOT_BLOCKED',
}

export type requestEvent = {
  type: REQUEST_EVENT;
  requestId: string;
  url: string;
  blocked: boolean;
  timeStamp: number;
};

export type responseEvent = {
  type: RESPONSE_EVENT;
  requestId: string;
  url: string;
  blocked: boolean;
  timeStamp: number;
};

export type CookieData = {
  parsedCookie: ParsedCookie & {
    partitionKey: string;
    priority?: 'Low' | 'Medium' | 'High';
    size?: number;
  };
  networkEvents?: {
    requestEvents: requestEvent[];
    responseEvents: responseEvent[];
  };
  analytics?: CookieAnalytics | null;
  url?: string;
  headerType?: 'response' | 'request' | 'javascript' | 'http';
  isFirstParty?: boolean | null;
  frameIdList?: Array<number | string>;
  blockedReasons?: BlockedReason[];
  warningReasons?: Protocol.Audits.CookieWarningReason[];
  isBlocked?: boolean | null;
  blockingStatus?: {
    inboundBlock: BLOCK_STATUS;
    outboundBlock: BLOCK_STATUS;
  };
  exemptionReason?: Protocol.Network.CookieExemptionReason;
  pageUrl?: string;
};

export type CookieTableData = CookieData & {
  frameUrls?: string | string[];
  isDomainInAllowList?: boolean;
};

export type ErroredOutUrlsData = {
  errorCode?: string;
  errorMessage: string;
  url: string;
  stackTrace?: string;
  errorName: string;
};
export interface TabCookies {
  [key: string]: CookieTableData;
}

export type FrameType = 'outermost_frame' | 'fenced_frame' | 'sub_frame';
export interface TabFrames {
  [key: string]: {
    frameIds: string[];
    frameType?: FrameType;
  };
}

export interface Legend {
  label: string;
  descriptionKey?: string;
  count: number;
  color: string;
  countClassName: string;
  onClick?: (title: string) => void;
}

export interface CookieStatsComponents {
  legend: Legend[];
  blockedCookiesLegend: Legend[];
  exemptedCookiesLegend: Legend[];
  firstParty: {
    count: number;
    color: string;
  }[];
  thirdParty: {
    count: number;
    color: string;
  }[];
  blocked: {
    count: number;
    color: string;
  }[];
  exempted: {
    count: number;
    color: string;
  }[];
}

export interface FramesWithCookies {
  [key: string]: { frameIds: number[] | string[] };
}

export type CookieJsonDataType = {
  parsedCookie: {
    name: string;
    value: string;
    domain: string;
    partitionKey: string;
    path: string;
    expires: string;
    httponly: boolean;
    secure: boolean;
    samesite: string;
    priority?: 'Low' | 'Medium' | 'High';
    size?: number;
  };
  analytics: {
    platform: string;
    category: string;
    description: string;
    GDPR?: string;
  };
  isFirstParty: boolean;
  url: string;
  pageUrl?: string;
  requestUrls?: { [id: string]: string };
  frameUrls?: { [id: string]: string };
  isBlocked: boolean;
  blockingStatus?: {
    inboundBlock: BLOCK_STATUS;
    outboundBlock: BLOCK_STATUS;
  };
  blockedReasons?: BlockedReason[];
};

export type CookieFrameStorageType = {
  [frame: string]: {
    [cookieKey: string]: CookieJsonDataType;
  };
};

export type SingleURLError = {
  errorMessage: string;
  errorCode?: string;
  stackTrace?: string;
  errorName: string;
};

export type CompleteJson = {
  pageUrl: string;
  cookieData: {
    [frame: string]: {
      frameCookies: {
        [cookieKey: string]: CookieJsonDataType;
      };
      frameType?: string | undefined;
    };
  };
  erroredOutUrls: ErroredOutUrlsData[];
  libraryMatches: { [key: string]: LibraryData };
};

export interface DataMapping {
  title: string;
  count: number;
  data: {
    count: number;
    color: string;
  }[];
  onClick?: (() => void) | null;
}

export type FrameStateCreator = {
  dataMapping: DataMapping[];
  legend: Legend[];
};

export type Selectors = {
  textSelectors: string[];
  cssSelectors: string[];
  xPath: string[];
};
