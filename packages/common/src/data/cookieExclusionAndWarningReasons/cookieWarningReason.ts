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
import { I18n } from '@google-psat/i18n';
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
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedCrossSiteContextSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedCrossSiteContextReadCookie
    );
  },
  WarnSameSiteNoneInsecure: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteNoneInsecureSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteNoneInsecureReadCookie
    );
  },
  WarnSameSiteUnspecifiedLaxAllowUnsafe: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie
    );
  },
  WarnSameSiteStrictLaxDowngradeStrict: (cookieURL: string): string => {
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteStrictLaxDowngradeStrictSecure
      );
    }
    // For insecure URL.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteStrictLaxDowngradeStrictInsecure
    );
  },
  WarnSameSiteStrictCrossDowngradeStrict: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return I18n.getFormattedMessages(
          CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure
      );
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure
      );
    }
    // For insecure URL.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure
    );
  },
  WarnSameSiteStrictCrossDowngradeLax: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return I18n.getFormattedMessages(
          CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure
      );
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure
      );
    }
    // For insecure URL.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure
    );
  },
  WarnSameSiteLaxCrossDowngradeStrict: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return I18n.getFormattedMessages(
          CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure
      );
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure
      );
    }
    // For insecure URL.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure
    );
  },
  WarnSameSiteLaxCrossDowngradeLax: (
    operation: string,
    cookieURL: string
  ): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      // For secure URL.
      if (isURLSecure(cookieURL)) {
        return I18n.getFormattedMessages(
          CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure
      );
    }
    // For ReadCookie operation.
    // For secure URL.
    if (isURLSecure(cookieURL)) {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure
      );
    }
    // For insecure URL.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure
    );
  },
  WarnAttributeValueExceedsMaxSize: (): string => {
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnAttributeValueExceedsMaxSize
    );
  },
  WarnDomainNonASCII: (): string => {
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnDomainNonASCII
    );
  },
  WarnThirdPartyPhaseout: (operation: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return I18n.getFormattedMessages(
        CookieWarningReasonHTMLContent.WarnThirdPartyPhaseoutSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnThirdPartyPhaseoutReadCookie
    );
  },
  WarnCrossSiteRedirectDowngradeChangesInclusion: (): string => {
    return I18n.getFormattedMessages(
      CookieWarningReasonHTMLContent.WarnCrossSiteRedirectDowngradeChangesInclusion
    );
  },
};

export default CookieWarningReason;
