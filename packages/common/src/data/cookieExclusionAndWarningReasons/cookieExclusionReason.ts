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
import { I18n } from '@ps-analysis-tool/i18n';
/**
 * Internal dependencies.
 */
import * as CookieExclusionReasonHTMLContent from './cookieExclusionReasonHTMLContent';

const codeForCookieIssueDetails = (
  reason: string,
  warningReasons?: string[],
  operation?: string,
  cookieUrl?: string
): string => {
  const isURLSecure =
    cookieUrl &&
    (cookieUrl.startsWith('https://') || cookieUrl.startsWith('wss://'));

  if (warningReasons && warningReasons.length > 0) {
    if (warningReasons.includes('WarnSameSiteStrictLaxDowngradeStrict')) {
      // For secure URL.
      if (isURLSecure) {
        return I18n.getFormattedMessages(
          CookieExclusionReasonHTMLContent.sameSiteExcludeNavigationContextDowngradeSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieExclusionReasonHTMLContent.sameSiteExcludeNavigationContextDowngradeInsecure
      );
    }

    if (
      warningReasons.includes('WarnSameSiteStrictCrossDowngradeStrict') ||
      warningReasons.includes('WarnSameSiteStrictCrossDowngradeLax') ||
      warningReasons.includes('WarnSameSiteLaxCrossDowngradeStrict') ||
      warningReasons.includes('WarnSameSiteLaxCrossDowngradeLax')
    ) {
      // For SetCookie operation.
      if (operation === 'SetCookie') {
        // For secure URL.
        if (isURLSecure) {
          return I18n.getFormattedMessages(
            CookieExclusionReasonHTMLContent.sameSiteExcludeContextDowngradeSetCookieSecure
          );
        }
        // For insecure URL.
        return I18n.getFormattedMessages(
          CookieExclusionReasonHTMLContent.sameSiteExcludeContextDowngradeSetCookieInsecure
        );
      }
      // For ReadCookie operation.
      // For secure URL.
      if (isURLSecure) {
        return I18n.getFormattedMessages(
          CookieExclusionReasonHTMLContent.sameSiteExcludeContextDowngradeReadCookieSecure
        );
      }
      // For insecure URL.
      return I18n.getFormattedMessages(
        CookieExclusionReasonHTMLContent.sameSiteExcludeContextDowngradeReadCookieInsecure
      );
    }
  }

  if (
    warningReasons?.includes('WarnCrossSiteRedirectDowngradeChangesInclusion')
  ) {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.cookieCrossSiteRedirectDowngrade
    );
  }

  // If we have ExcludeSameSiteUnspecifiedTreatedAsLax but no corresponding warnings, then add just
  // the Issue code for ExcludeSameSiteUnspecifiedTreatedAsLax.
  if (reason === 'ExcludeSameSiteUnspecifiedTreatedAsLax') {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeSameSiteUnspecifiedTreatedAsLax
    );
  }

  // ExcludeSameSiteStrict and ExcludeSameSiteLax require being paired with an appropriate warning. We didn't
  // find one of those warnings so return null to indicate there shouldn't be an issue created.
  return `<p>Something went wrong</p><br />`; // null value was changed to error message.
};

const CookieExclusionReason = {
  ExcludeSameSiteUnspecifiedTreatedAsLax: (
    warningReasons?: string[],
    operation?: string,
    cookieUrl?: string
  ): string => {
    const reason = 'ExcludeSameSiteUnspecifiedTreatedAsLax';
    return codeForCookieIssueDetails(
      reason,
      warningReasons,
      operation,
      cookieUrl
    );
  },
  ExcludeSameSiteNoneInsecure: (operation?: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return I18n.getFormattedMessages(
        CookieExclusionReasonHTMLContent.ExcludeSameSiteNoneInsecureSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeSameSiteNoneInsecureReadCookie
    );
  },
  ExcludeSameSiteLax: (
    warningReasons?: string[],
    operation?: string,
    cookieUrl?: string
  ): string => {
    const reason = 'ExcludeSameSiteLax';
    return codeForCookieIssueDetails(
      reason,
      warningReasons,
      operation,
      cookieUrl
    );
  },
  ExcludeSameSiteStrict: (
    warningReasons?: string[],
    operation?: string,
    cookieUrl?: string
  ): string => {
    const reason = 'ExcludeSameSiteStrict';
    return codeForCookieIssueDetails(
      reason,
      warningReasons,
      operation,
      cookieUrl
    );
  },
  ExcludeInvalidSameParty: (): string => {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeInvalidSameParty
    );
  },
  ExcludeSamePartyCrossPartyContext: (): string => {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeSamePartyCrossPartyContext
    );
  },
  ExcludeDomainNonASCII: (): string => {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeDomainNonASCII
    );
  },
  ExcludeThirdPartyCookieBlockedInFirstPartySet: (): string => {
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeThirdPartyCookieBlockedInFirstPartySet
    );
  },
  ExcludeThirdPartyPhaseout: (operation?: string): string => {
    // For SetCookie operation.
    if (operation === 'SetCookie') {
      return I18n.getFormattedMessages(
        CookieExclusionReasonHTMLContent.ExcludeThirdPartyPhaseoutSetCookie
      );
    }
    // For ReadCookie operation.
    return I18n.getFormattedMessages(
      CookieExclusionReasonHTMLContent.ExcludeThirdPartyPhaseoutReadCookie
    );
  },
};

export default CookieExclusionReason;
