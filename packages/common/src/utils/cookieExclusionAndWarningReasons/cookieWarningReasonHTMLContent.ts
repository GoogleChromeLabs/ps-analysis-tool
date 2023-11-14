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
export const WarnSameSiteUnspecifiedCrossSiteContextReadCookie = `
    <h1>Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute</h1>
    <br />
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeSet.md
export const WarnSameSiteUnspecifiedCrossSiteContextSetCookie = `
    <h1>Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute</h1>
    <br />
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteNoneInsecureWarnRead.md
export const WarnSameSiteNoneInsecureReadCookie = `
    <h1>Mark cross-site cookies as Secure to allow them to be sent in cross-site requests</h1>
    <br />
    <p>In a future version of the browser, cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to get sent in cross-site requests. This behavior protects user data from being sent over an insecure connection.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteNoneInsecureWarnSet.md
export const WarnSameSiteNoneInsecureSetCookie = `
    <h1>Mark cross-site cookies as Secure to allow setting them in cross-site contexts</h1>
    <br />
    <p>In a future version of the browser, cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to allow setting them in a cross-site context. This behavior protects user data from being sent over an insecure connection.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeRead.md
export const WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie = `
    <h1>Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute</h1>
    <br />
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeSet.md
export const WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie = `
    <h1>Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute</h1>
    <br />
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevents the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <br />
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
`;

// Filename: SameSiteWarnStrictLaxDowngradeStrict.md
export const WarnSameSiteStrictLaxDowngradeStrictSecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent on same-site requests</h1>
    <br />
    <p>A cookie is being sent to a secure origin from an insecure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnStrictLaxDowngradeStrict.md
export const WarnSameSiteStrictLaxDowngradeStrictInsecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent on same-site requests</h1>
    <br />
    <p>A cookie is being sent to an insecure origin from a secure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</h1>
    <br />
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure = `
    <h1>Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</h1>
    <br />
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <br />
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
`;

// Filename: CookieAttributeValueExceedsMaxSize.md
export const WarnAttributeValueExceedsMaxSize = `
    <h1>Ensure cookie attribute values don't exceed 1024 characters</h1>
    <br />
    <p>Cookie attribute values exceeding 1024 characters in size will result in the attribute being ignored. This could lead to unexpected behavior since the cookie will be processed as if the offending attribute / attribute value pair were not present.</p>
    <br />
    <p>Resolve this issue by ensuring that cookie attribute values don't exceed 1024 characters.</p>
`;

// Filename: cookieWarnDomainNonAscii.md
export const WarnDomainNonASCII = `
    <h1>Ensure cookie <code>Domain</code> attribute values only contain ASCII characters</h1>
    <br />
    <p><code>Domain</code> attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their <code>Domain</code> attribute will be ignored in the future.</p>
    <br />
    <p>To resolve this issue, you need to remove all non-ASCII characters from the <code>Domain</code> attribute of the affected cookies.</p>
    <br />
    <p>If your site has an internationalized domain name (IDN), you should use <a href="punycodeReference">punycode</a> representation for the <code>Domain</code> attribute instead.</p>
`;

// Filename: cookieWarnThirdPartyPhaseoutRead.md
export const WarnThirdPartyPhaseoutReadCookie = `
    <h1>Cookie sent in cross-site context will be blocked in future Chrome versions</h1>
    <br />
    <p>In a future version of the browser, cookies marked with <code>SameSite=None; Secure</code> and not <code>Partitioned</code> will be blocked in cross-site requests. This behavior protects user data from cross-site tracking.</p>
`;

// Filename: cookieWarnThirdPartyPhaseoutSet.md
export const WarnThirdPartyPhaseoutSetCookie = `
    <h1>Cookie set in cross-site context will be blocked in future Chrome versions</h1>
    <br />
    <p>In a future version of the browser, cookies marked with <code>SameSite=None; Secure</code> and not <code>Partitioned</code> will be blocked in cross-site context. This behavior protects user data from cross-site tracking.</p>
`;

// Filename: cookieCrossSiteRedirectDowngrade.md
export const WarnCrossSiteRedirectDowngradeChangesInclusion = `
    <h1>Cookie is blocked due to a cross-site redirect chain</h1>
    <br />
    <p>The cookie was blocked because the URL redirect chain was not fully same-site, meaning the final request was treated as a cross-site request. Like other cross-site requests, this blocks cookies with <code>SameSite=Lax</code> or <code>SameSite=Strict</code>.</p>
    <br />
    <p>For example: If site A redirects to site B which then redirects back to site A, the final request to site A will be a cross-site request.</p>
`;
