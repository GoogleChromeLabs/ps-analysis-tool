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
    <p class="font-semibold">Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute</p>
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeSet.md
export const WarnSameSiteUnspecifiedCrossSiteContextSetCookie = `
    <p class="font-semibold">Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute</p>
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteNoneInsecureWarnRead.md
export const WarnSameSiteNoneInsecureReadCookie = `
    <p class="font-semibold">Mark cross-site cookies as Secure to allow them to be sent in cross-site requests</p>
    <p>In a future version of the browser, cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to get sent in cross-site requests. This behavior protects user data from being sent over an insecure connection.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteNoneInsecureWarnSet.md
export const WarnSameSiteNoneInsecureSetCookie = `
    <p class="font-semibold">Mark cross-site cookies as Secure to allow setting them in cross-site contexts</p>
    <p>In a future version of the browser, cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to allow setting them in a cross-site context. This behavior protects user data from being sent over an insecure connection.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeRead.md
export const WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie = `
    <p class="font-semibold">Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute</p>
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteUnspecifiedLaxAllowUnsafeSet.md
export const WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie = `
    <p class="font-semibold">Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute</p>
    <p>Because a cookie's <code>SameSite</code> attribute was not set or is invalid, it defaults to <code>SameSite=Lax</code>, which will prevents the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.</p>
    <p>Resolve this issue by updating the attributes of the cookie:</p>
    <ul>
        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie is intended to be set in cross-site contexts. Note that only cookies sent over HTTPS may use the <code>Secure</code> attribute.</li>
        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be set by cross-site requests.</li>
    </ul>
    <br />
`;

// Filename: SameSiteWarnStrictLaxDowngradeStrict.md
export const WarnSameSiteStrictLaxDowngradeStrictSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent on same-site requests</p>
    <p>A cookie is being sent to a secure origin from an insecure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnStrictLaxDowngradeStrict.md
export const WarnSameSiteStrictLaxDowngradeStrictInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent on same-site requests</p>
    <p>A cookie is being sent to an insecure origin from a secure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeRead.md
export const WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue having cookies sent to same-site subresources</p>
    <p>A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: SameSiteWarnCrossDowngradeSet.md
export const WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure = `
    <p class="font-semibold">Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources</p>
    <p>A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the <code>SameSite</code> attribute's protection of user data from request forgery by network attackers.</p>
    <p>Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the <code>Secure</code> attribute if that is not already the case.</p>
    <br />
`;

// Filename: CookieAttributeValueExceedsMaxSize.md
export const WarnAttributeValueExceedsMaxSize = `
    <p class="font-semibold">Ensure cookie attribute values don't exceed 1024 characters</p>
    <p>Cookie attribute values exceeding 1024 characters in size will result in the attribute being ignored. This could lead to unexpected behavior since the cookie will be processed as if the offending attribute / attribute value pair were not present.</p>
    <p>Resolve this issue by ensuring that cookie attribute values don't exceed 1024 characters.</p>
    <br />
`;

// Filename: cookieWarnDomainNonAscii.md
export const WarnDomainNonASCII = `
    <p class="font-semibold">Ensure cookie <code>Domain</code> attribute values only contain ASCII characters</p>
    <p><code>Domain</code> attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their <code>Domain</code> attribute will be ignored in the future.</p>
    <p>To resolve this issue, you need to remove all non-ASCII characters from the <code>Domain</code> attribute of the affected cookies.</p>
    <p>If your site has an internationalized domain name (IDN), you should use <a href="punycodeReference">punycode</a> representation for the <code>Domain</code> attribute instead.</p>
    <br />
`;

// Filename: cookieWarnThirdPartyPhaseoutRead.md
export const WarnThirdPartyPhaseoutReadCookie = `
    <p class="font-semibold">Cookie sent in cross-site context will be blocked in future Chrome versions</p>
    <p>In a future version of the browser, cookies marked with <code>SameSite=None; Secure</code> and not <code>Partitioned</code> will be blocked in cross-site requests. This behavior protects user data from cross-site tracking.</p>
    <br />
`;

// Filename: cookieWarnThirdPartyPhaseoutSet.md
export const WarnThirdPartyPhaseoutSetCookie = `
    <p class="font-semibold">Cookie set in cross-site context will be blocked in future Chrome versions</p>
    <p>In a future version of the browser, cookies marked with <code>SameSite=None; Secure</code> and not <code>Partitioned</code> will be blocked in cross-site context. This behavior protects user data from cross-site tracking.</p>
    <br />
`;

// Filename: cookieCrossSiteRedirectDowngrade.md
export const WarnCrossSiteRedirectDowngradeChangesInclusion = `
    <p class="font-semibold">Cookie is blocked due to a cross-site redirect chain</p>
    <p>The cookie was blocked because the URL redirect chain was not fully same-site, meaning the final request was treated as a cross-site request. Like other cross-site requests, this blocks cookies with <code>SameSite=Lax</code> or <code>SameSite=Strict</code>.</p>
    <p>For example: If site A redirects to site B which then redirects back to site A, the final request to site A will be a cross-site request.</p>
    <br />
`;
