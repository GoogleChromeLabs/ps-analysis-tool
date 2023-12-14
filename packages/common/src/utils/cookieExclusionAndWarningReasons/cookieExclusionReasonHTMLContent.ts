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
export const sameSiteExcludeNavigationContextDowngradeSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to have cookies sent on same-site requests</p>
    <p>A cookie was not sent to a secure origin from an insecure context on a navigation. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteExcludeNavigationContextDowngrade.md
export const sameSiteExcludeNavigationContextDowngradeInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to have cookies sent on same-site requests</p>
    <p>A cookie was not sent to an insecure origin from a secure context on a navigation. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteExcludeContextDowngradeSet.md
export const sameSiteExcludeContextDowngradeSetCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to allow cookies to be set by same-site subresources</p>
    <p>A cookie was not set by an insecure origin in a secure context. Because this cookie would have been set across schemes on the same site, it was blocked. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteExcludeContextDowngradeSet.md
export const sameSiteExcludeContextDowngradeSetCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to allow cookies to be set by same-site subresources</p>
    <p>A cookie was not set by a secure origin in an insecure context. Because this cookie would have been set across schemes on the same site, it was blocked. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteExcludeContextDowngradeRead.md
export const sameSiteExcludeContextDowngradeReadCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to have cookies sent to same-site subresources</p>
    <p>A cookie was not sent to a secure origin from an insecure context. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteExcludeContextDowngradeRead.md
export const sameSiteExcludeContextDowngradeReadCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to have cookies sent to same-site subresources</p>
    <p>A cookie was not sent to an insecure origin from a secure context. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: NetworkRequest.ts
export const ExcludeSameSiteUnspecifiedTreatedAsLax =
  "This <code>Set-Cookie</code> header didn't specify a 'SameSite' attribute and was defaulted to <code>SameSite=Lax</code> and was blocked because it came from a cross-site response which was not the response to a top-level navigation. The <code>Set-Cookie</code> had to have been set with <code>SameSite=None</code> to enable cross-site usage.";

// Filename: cookieCrossSiteRedirectDowngrade.md
export const cookieCrossSiteRedirectDowngrade = `
    <p class="font-semibold">Cookie is blocked due to a cross-site redirect chain</p>
    <p>The cookie was blocked because the URL redirect chain was not fully same-site, meaning the final request was treated as a cross-site request. Like other cross-site requests, this blocks cookies with <code>SameSite=Lax</code> or <code>SameSite=Strict</code>.</p>
    <p>For example: If site A redirects to site B which then redirects back to site A, the final request to site A will be a cross-site request.</p>
    <br />
`;

// Filename: SameSiteNoneInsecureErrorSet.md
export const ExcludeSameSiteNoneInsecureSetCookie = `
    <p class="font-semibold">Mark cross-site cookies as Secure to allow setting them in cross-site contexts</p>
    <p>Cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to allow setting them in a cross-site context. This behavior protects user data from being sent over an insecure connection.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteNoneInsecureErrorRead.md
export const ExcludeSameSiteNoneInsecureReadCookie = `
    <p class="font-semibold">Mark cross-site cookies as Secure to allow them to be sent in cross-site requests</p>
    <p>Cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to get sent in cross-site requests. 
    This behavior protects user data from being sent over an insecure connection.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteInvalidSameParty.md
export const ExcludeInvalidSameParty = `
    <p class="font-semibold">Mark SameParty cookies as Secure and do not use SameSite=Strict for SameParty cookies</p>
    <p>Cookies marked with <code>SameParty</code> must also be marked with <code>Secure</code>. In addition, cookies marked with <code>SameParty</code> cannot use <code>SameSite=Strict</code>.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Remove <code>SameParty</code> if the cookie should only be used by the same site but not the same first-party set</li>
        <li>Remove <code>SameSite=Strict</code> and specify <code>Secure</code> if the cookie should be available to all sites of the same first-party set</li>
    </ul>
    <br />
`;

// Filename: SameSiteSamePartyCrossPartyContextSet.md
export const ExcludeSamePartyCrossPartyContext = `
    <p class="font-semibold">Make sure a cookie is using the SameParty attribute correctly</p>
    <p>Setting cross-site cookies with the <code>SameParty</code> attribute is only possible if both domains are a part of the same First-Party Set.</p>
    <p>To allow setting cross-site cookies, try one of the following:</p>
    <ul>
        <li>If the domains satisfy the First-Party Set criteria, add them to the same First-Party Set.</li>
        <li>If the domains don't satisfy the First-Party Set criteria, remove the <code>SameParty</code> attribute and specify <code>SameSite=None</code>.</li>
    </ul>
    <p>If you don't have the option to do any of the above, cookies are not intended to be set in cross-site contexts.</p>
    <br />
`;

// Filename: cookieExcludeDomainNonAscii.md
export const ExcludeDomainNonASCII = `
    <p class="font-semibold">Ensure cookie <code>Domain</code> attribute values only contain ASCII characters</p>
    <p><code>Domain</code> attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their <code>Domain</code> attribute will be ignored.</p>
    <p>To resolve this issue, you need to remove all non-ASCII characters from the <code>Domain</code> attribute of the affected cookies.</p>
    <p>If your site has an internationalized domain name (IDN), you should use <a href="punycodeReference">punycode</a> representation for the <code>Domain</code> attribute instead.</p>
    <br />
`;

// Filename: cookieExcludeBlockedWithinFirstPartySet.md
export const ExcludeThirdPartyCookieBlockedInFirstPartySet = `
    <p class="font-semibold">Third-party cookie blocked within the same First-Party Set</p>
    <p>
        A cookie embedded by a site in the top-level page's First-Party Set was blocked by third-party cookie blocking.
    </p>
    <br />
`;

// Filename: cookieExcludeThirdPartyPhaseoutRead.md
export const ExcludeThirdPartyPhaseoutReadCookie = `
    <p class="font-semibold">Cookie is blocked when sent in cross-site context</p>
    <p>
        Cookies marked with <code>SameSite=None; Secure;</code> and not <code>Partitioned</code> are blocked in cross-site requests. This behavior protects user data from cross-site tracking.
    </p>
    <br />
`;

// Filename: cookieExcludeThirdPartyPhaseoutSet.md
export const ExcludeThirdPartyPhaseoutSetCookie = `
    <p class="font-semibold">Cookie is blocked when set in cross-site context</p>
    <p>
        Cookies marked with <code>SameSite=None; Secure</code> and not <code>Partitioned</code> are blocked in cross-site contexts. This behavior protects user data from cross-site tracking.
    </p>
    <br />
`;
