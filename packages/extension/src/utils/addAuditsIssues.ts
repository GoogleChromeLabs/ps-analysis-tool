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
 * External dependencies
 */
import { Protocol } from 'devtools-protocol';
/**
 * Internal dependencies
 */
import { CookieStore } from '../localStore';

/**
 * This will add audits issue to the function
 * @param details {Protocol.Audits.CookieIssueDetails} The issues for cookies added by audits event.
 * @param tabId {string} The tabId whose audit issue was generated.
 * @returns Promise<void>
 */
export default async function addAuditsIssues(
  details: Protocol.Audits.CookieIssueDetails,
  tabId: string
) {
  const { cookie, cookieExclusionReasons, cookieWarningReasons } = details;
  const primaryDomain = cookie?.domain.startsWith('.')
    ? cookie.domain
    : '.' + cookie?.domain;
  const secondaryDomain = cookie?.domain.startsWith('.')
    ? cookie.domain.slice(1)
    : cookie?.domain;
  // Adding alternate domains here because our extension calculates domain differently that the application tab.
  // This is done to capture both NID.google.com/ and NIDgoogle.com/ so that if we find either of the cookie we add issues to the cookie object
  try {
    await CookieStore.addCookieExclusionWarningReason(
      cookie?.name + primaryDomain + cookie?.path,
      //@ts-ignore since The details has been checked before sending them as parameter.
      cookie?.name + secondaryDomain + cookie?.path,
      cookieExclusionReasons,
      cookieWarningReasons,
      tabId
    );
  } catch (error) {
    // fail silently
  }
}
