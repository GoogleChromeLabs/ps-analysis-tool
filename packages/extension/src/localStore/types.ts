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
import type {
  BlockedReason,
  CookieWarningReasons,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { CookieAnalytics } from '../utils/fetchCookieDictionary';

export type CookieData = {
  parsedCookie: ParsedCookie & {
    partitionKey?: string;
    priority?: 'Low' | 'Medium' | 'High';
  };
  analytics: CookieAnalytics | null;
  url: string;
  headerType: 'response' | 'request' | 'javascript'; // @todo Change headerType key name.
  isFirstParty: boolean | null;
  frameIdList: number[];
  isBlocked: boolean | null;
  blockedReasons?: BlockedReason[];
  warningReasons?: CookieWarningReasons[];
};

export type PreferenceKeyValues =
  | 'columnSorting'
  | 'selectedFrame'
  | 'columnSizing'
  | 'selectedColumns'
  | 'selectedFilter';

export type TabData = {
  cookies: {
    [key: string]: CookieData;
  } | null;
  focusedAt: number | null;
  preferences: {
    [key: string]: unknown;
  };
};

export type Storage = {
  [tabId: string]: TabData;
};
