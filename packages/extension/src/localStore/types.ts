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

/**
 * Internal dependencies.
 */
import type { CookieAnalytics } from '../utils/fetchCookieDictionary';

export type CookieData = {
  parsedCookie: ParsedCookie;
  analytics: CookieAnalytics | null;
  url: string;
  headerType: 'response' | 'request' | 'javascript'; // @todo Change headerType key name.
  isFirstParty: boolean | null;
  frameIdList: number[];
  isBlocked?: boolean;
  partitionKey?: string;
  blockedReasons?: BlockedReason[];
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

export type NetworkCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  size: number;
  httpOnly: boolean;
  secure: boolean;
  session: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  priority: 'Low' | 'Medium' | 'High';
  sameParty: boolean;
  sourceScheme: 'Unset' | 'NonSecure' | 'Secure';
  sourcePort: number;
  partitionKey?: string;
  partitionKeyOpaque?: boolean;
};

export type BlockedReason =
  | 'SecureOnly'
  | 'NotOnPath'
  | 'DomainMismatch'
  | 'SameSiteStrict'
  | 'SameSiteLax'
  | 'SameSiteUnspecifiedTreatedAsLax'
  | 'SameSiteNoneInsecure'
  | 'UserPreferences'
  | 'ThirdPartyPhaseout'
  | 'ThirdPartyBlockedInFirstPartySet'
  | 'UnknownError'
  | 'SchemefulSameSiteStrict'
  | 'SchemefulSameSiteLax'
  | 'SchemefulSameSiteUnspecifiedTreatedAsLax'
  | 'SamePartyFromCrossPartyContext'
  | 'NameValuePairExceedsMaxSize';

export type BlockedRequestCookieWithReason = {
  blockedReasons: BlockedReason[];
  cookie: NetworkCookie;
};

export type BlockedResponseCookieWithReason = {
  blockedReasons: BlockedReason[];
  cookieLine: string;
  cookie?: NetworkCookie;
};

export type NetworkRequestExtraInfoParams = {
  requestId: string;
  associatedCookies: BlockedRequestCookieWithReason[];
  headers: { [key: string]: any };
  connectTiming: {
    requestTime: number;
  };
  clientSecurityState?: {
    initiatorIsSecureContext: boolean;
    initiatorIPAddressSpace: 'Local' | 'Private' | 'Public' | 'Unknown';
    privateNetworkRequestPolicy:
      | 'Allow'
      | 'BlockFromInsecureToMorePrivate'
      | 'WarnFromInsecureToMorePrivate'
      | 'PreflightBlock'
      | 'PreflightWarn';
  };
  siteHasCookieInOtherPartition: boolean;
};

export type NetworkResponseReceivedExtraInfo = {
  requestId: string;
  blockedCookies: BlockedResponseCookieWithReason[];
  headers: { [key: string]: any };
  resourceIPAddressSpace: 'Local' | 'Private' | 'Public' | 'Unknown';
  statusCode: number;
  headersText?: string;
  cookiePartitionKey?: string;
  cookiePartitionKeyOpaque?: boolean;
};
