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
import * as CookieWarningReasonHTMLContent from './cookieWarningReasonHTMLContent';

const isURLSecure = (cookieUrl: string): boolean => {
  return Boolean(
    cookieUrl &&
      (cookieUrl.startsWith('https://') || cookieUrl.startsWith('wss://'))
  );
};

const CookieWarningReason = {
  WarnSameSiteUnspecifiedCrossSiteContext: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedCrossSiteContextSetCookie;
    }
    // For ReadCookie operation.
    return CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedCrossSiteContextReadCookie;
  },
  WarnSameSiteNoneInsecure: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return CookieWarningReasonHTMLContent.WarnSameSiteNoneInsecureSetCookie;
    }
    // For ReadCookie operation.
    return CookieWarningReasonHTMLContent.WarnSameSiteNoneInsecureReadCookie;
  },
  WarnSameSiteUnspecifiedLaxAllowUnsafe: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie;
    }
    // For ReadCookie operation.
    return CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie;
  },
  WarnSameSiteStrictLaxDowngradeStrict: (cookieURL: string): string => {
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return CookieWarningReasonHTMLContent.WarnSameSiteStrictLaxDowngradeStrictSecure;
    }
    // For insecure URL.
    return CookieWarningReasonHTMLContent.WarnSameSiteStrictLaxDowngradeStrictInsecure;
  },
  WarnSameSiteStrictCrossDowngradeStrict: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure;
      }
      // For insecure URL.
      return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure;
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure;
    }
    // For insecure URL.
    return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure;
  },
  WarnSameSiteStrictCrossDowngradeLax: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure;
      }
      // For insecure URL.
      return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure;
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure;
    }
    // For insecure URL.
    return CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure;
  },
  WarnSameSiteLaxCrossDowngradeStrict: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure;
      }
      // For insecure URL.
      return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure;
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure;
    }
    // For insecure URL.
    return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure;
  },
  WarnSameSiteLaxCrossDowngradeLax: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure;
      }
      // For insecure URL.
      return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure;
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure;
    }
    // For insecure URL.
    return CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure;
  },
  WarnAttributeValueExceedsMaxSize: (): string => {
    return CookieWarningReasonHTMLContent.WarnAttributeValueExceedsMaxSize;
  },
  WarnDomainNonASCII: (): string => {
    return CookieWarningReasonHTMLContent.WarnDomainNonASCII;
  },
  WarnThirdPartyPhaseout: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return CookieWarningReasonHTMLContent.WarnThirdPartyPhaseoutSetCookie;
    }
    // For ReadCookie operation.
    return CookieWarningReasonHTMLContent.WarnThirdPartyPhaseoutReadCookie;
  },
  WarnCrossSiteRedirectDowngradeChangesInclusion: (): string => {
    return CookieWarningReasonHTMLContent.WarnCrossSiteRedirectDowngradeChangesInclusion;
  },
};

export default CookieWarningReason;
