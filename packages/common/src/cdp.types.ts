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
export type CookieWarningReasons =
  | 'WarnSameSiteUnspecifiedCrossSiteContext'
  | 'WarnSameSiteNoneInsecure'
  | 'WarnSameSiteUnspecifiedLaxAllowUnsafe'
  | 'WarnSameSiteStrictLaxDowngradeStrict'
  | 'WarnSameSiteStrictCrossDowngradeStrict'
  | 'WarnSameSiteStrictCrossDowngradeLax'
  | 'WarnSameSiteLaxCrossDowngradeStrict'
  | 'WarnSameSiteLaxCrossDowngradeLax'
  | 'WarnAttributeValueExceedsMaxSize'
  | 'WarnDomainNonASCII'
  | 'WarnThirdPartyPhaseout'
  | 'WarnCrossSiteRedirectDowngradeChangesInclusion';

export type CookieExclusionReason =
  | 'ExcludeSameSiteUnspecifiedTreatedAsLax'
  | 'ExcludeSameSiteNoneInsecure'
  | 'ExcludeSameSiteLax'
  | 'ExcludeSameSiteStrict'
  | 'ExcludeInvalidSameParty'
  | 'ExcludeSamePartyCrossPartyContext'
  | 'ExcludeDomainNonASCII'
  | 'ExcludeThirdPartyCookieBlockedInFirstPartySet'
  | 'ExcludeThirdPartyPhaseout';

export type CookieIssueDetails = {
  cookie?: {
    name: string;
    domain: string;
    path: string;
  };
  rawCookieLine: string;
  cookieWarningReasons: CookieWarningReasons[];
  cookieExclusionReasons: CookieExclusionReason[];
  operation: 'SetCookie' | 'ReadCookie';
  siteForCookies?: string;
  cookieUrl?: string;
  request?: string;
};
export type AuditParamIssue = {
  code: string;
  details: { [key: string]: any };
  issueId: string;
};

export type AuditParams = {
  issue: AuditParamIssue;
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

export type NetworkRequestWillBeSentParams = {
  requestId: string;
  documentURL: string;
  wallTime: number;
  timestamp: number;
  frameId: string;
  loaderID: string;
  redirectHasExtraInfo: boolean;
  hasUserGesture: boolean;
};
