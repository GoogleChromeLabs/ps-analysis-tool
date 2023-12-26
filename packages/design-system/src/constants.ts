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
interface LegendData {
  [key: string]: string;
}

export const LEGEND_DESCRIPTION: LegendData = {
  Functional:
    'Cookies necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size, etc.)',
  Marketing:
    "Cookies used to track visitors across websites, gathering information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
  Analytics:
    'Cookies used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site.',
  Uncategorized:
    'Cookies that could not be categorized. You may check sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
  SecureOnly:
    "<p class='font-semibold'>This cookie was blocked because it had the 'Secure' attribute and the connection was not secure.</p>",
  DomainMismatch:
    "<p class='font-semibold'>This cookie was blocked because the request URL's domain did not exactly match the cookie's domain, nor was the request URL's domain a subdomain of the cookie's Domain attribute value.</p>",
  NotOnPath:
    "<p class='font-semibold'>This cookie was blocked because its path was not an exact match for, or a superdirectory of, the request URL's path.</p>",
  SameSiteStrict:
    "<p class='font-semibold'>This cookie was blocked because it had the <code>SameSite=Strict</code> attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.</p>",
  SameSiteLax:
    "<p class='font-semibold'>This cookie was blocked because it had the <code>SameSite=Lax</code> attribute and the request was made from a different site and was not initiated by a top-level navigation.</p>",
  SameSiteUnspecifiedTreatedAsLax:
    "<p class='font-semibold'>This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to <code>SameSite=Lax</code>, and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with <code>SameSite=None</code> to enable cross-site usage.</p>",
  SameSiteNoneInsecure:
    "<p class='font-semibold'>This cookie was blocked because it had the <code>SameSite=None</code> attribute but was not marked 'Secure'. Cookies without SameSite restrictions must be marked 'Secure' and sent over a secure connection.</p>",
  UserPreferences:
    "<p class='font-semibold'>This cookie was blocked due to user preferences.</p>",
  ThirdPartyPhaseout:
    "<p class='font-semibold'>Prepare for phasing out third-party cookies</p>",
  ThirdPartyBlockedInFirstPartySet:
    "<p class='font-semibold'>The cookie was blocked by third-party cookie blocking between sites in the same First-Party Set.</p>",
  UnknownError: "<p class='font-semibold'>Unknown error</p>",
  SchemefulSameSiteStrict:
    "<p class='font-semibold'>This cookie was blocked because it had the <code>SameSite=Strict</code> attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.</p>",
  SchemefulSameSiteLax:
    "<p class='font-semibold'>This cookie was blocked because it had the <code>SameSite=Lax</code> attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.</p>",
  SchemefulSameSiteUnspecifiedTreatedAsLax:
    "<p class='font-semibold'>This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax\"', and was blocked because the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.</p>",
  SamePartyFromCrossPartyContext:
    "<p class='font-semibold'>This cookie was blocked because it had the 'SameParty' attribute but the request was cross-party. The request was considered cross-party because the domain of the resource's URL and the domains of the resource's enclosing frames/documents are neither owners nor members in the same first-party set.</p>",
  NameValuePairExceedsMaxSize:
    "<p class='font-semibold'>This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4,096 characters.</p>",
  ExcludeSameSiteUnspecifiedTreatedAsLax:
    "<p class='font-semibold'>This <code>Set-Cookie</code> header didn't specify a 'SameSite' attribute and was defaulted to <code>SameSite=Lax,</code> and was blocked because it came from a cross-site response which was not the response to a top-level navigation. The <code>Set-Cookie</code> had to have been set with <code>SameSite=None</code> to enable cross-site usage.</p>",
  ExcludeSameSiteNoneInsecure:
    '\n    <p class="font-semibold">Mark cross-site cookies as Secure to allow them to be sent in cross-site requests</p>\n    <br />\n    <p>Cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to get sent in cross-site requests. \n    This behavior protects user data from being sent over an insecure connection.</p>\n    <br />\n    <p>Resolve this issue by updating the attributes of the cookie:</p>\n    <ul>\n        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>\n        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>\n    </ul>\n',
  ExcludeSameSiteLax: 'Something went wrong',
  ExcludeSameSiteStrict: 'Something went wrong',
  ExcludeInvalidSameParty:
    '\n    <p class="font-semibold">Mark SameParty cookies as Secure and do not use SameSite=Strict for SameParty cookies</p>\n    <br />\n    <p>Cookies marked with <code>SameParty</code> must also be marked with <code>Secure</code>. In addition, cookies marked with <code>SameParty</code> cannot use <code>SameSite=Strict</code>.</p>\n    <br />\n    <p>Resolve this issue by updating the attributes of the cookie:</p>\n    <ul>\n        <li>Remove <code>SameParty</code> if the cookie should only be used by the same site but not the same first-party set</li>\n        <li>Remove <code>SameSite=Strict</code> and specify <code>Secure</code> if the cookie should be available to all sites of the same first-party set</li>\n    </ul>\n',
  ExcludeSamePartyCrossPartyContext:
    "\n    <p class='font-semibold'>Make sure a cookie is using the SameParty attribute correctly</p>\n    <br />\n    <p>Setting cross-site cookies with the <code>SameParty</code> attribute is only possible if both domains are a part of the same First-Party Set.</p>\n    <br />\n    <p>To allow setting cross-site cookies, try one of the following:</p>\n    <ul>\n        <li>If the domains satisfy the First-Party Set criteria, add them to the same First-Party Set.</li>\n        <li>If the domains don't satisfy the First-Party Set criteria, remove the <code>SameParty</code> attribute and specify <code>SameSite=None</code>.</li>\n    </ul>\n    <br />\n    <p>If you don't have the option to do any of the above, cookies are not intended to be set in cross-site contexts.</p>\n",
  ExcludeDomainNonASCII:
    '\n    <p class="font-semibold">Ensure cookie <code>Domain</code> attribute values only contain ASCII characters</p>\n    <br />\n    <p><code>Domain</code> attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their <code>Domain</code> attribute will be ignored.</p>\n    <br />\n    <p>To resolve this issue, you need to remove all non-ASCII characters from the <code>Domain</code> attribute of the affected cookies.</p>\n    <br />\n    <p>If your site has an internationalized domain name (IDN), you should use <a href="punycodeReference">punycode</a> representation for the <code>Domain</code> attribute instead.</p>\n',
  ExcludeThirdPartyCookieBlockedInFirstPartySet:
    "\n    <p class='font-semibold'>Third-party cookie blocked within the same First-Party Set</p>\n    <br />\n    <p>\n        A cookie embedded by a site in the top-level page's First-Party Set was blocked by third-party cookie blocking.\n    </p>\n",
  ExcludeThirdPartyPhaseout:
    '\n    <p class="font-semibold">Cookie is blocked when sent in cross-site context</p>\n    <br />\n    <p>\n        Cookies marked with <code>SameSite=None; Secure;</code> and not <code>Partitioned</code> are blocked in cross-site requests. This behavior protects user data from cross-site tracking.\n    </p>\n',
  InvalidDomain: `<p class="font-semibold">This attempt to set a cookie via 'Set-Cookie' header was blocked because its Domain value was invalid with regards to the current host url.</p>`,
  'Total frames': 'The total frames present inside the current page.',
  'Frames with cookies': 'The count of frames which have cookies in them',
  'Frames with blocked cookies':
    'The count of frames which have blocked cookies.',
  'Frames with unblocked cookies':
    'The count of frames which have unblocked cookies.',
  'Fenced frames':
    'A fenced frames is a proposed HTML element for embedded content, similar to an iframe. Unlike iframes, a fenced frame restricts communication with its embedding context to allow the frame access to cross-site data without sharing it with the embedding context.',
};

export const EMPTY_FRAME_COUNT = [
  {
    title: 'Frame details',
    count: 0,
    data: [
      {
        count: 0,
        color: '#F54021',
      },
      {
        count: 0,
        color: '#AF7AA3',
      },
      {
        count: 0,
        color: '#C5A06A',
      },
    ],
  },
];

export const EMPTY_FRAME_LEGEND = [
  {
    label: 'Total frames',
    count: 0,
    color: '#25ACAD',
    countClassName: 'text-greenland-green',
  },
  {
    label: 'Frames with cookies',
    count: 0,
    color: '#C5A06A',
    countClassName: 'text-good-life',
  },
  {
    label: 'Frames with blocked cookies',
    count: 0,
    color: '#AF7AA3',
    countClassName: 'text-victorian-violet',
  },
  {
    label: 'Frames with unblocked cookies',
    count: 0,
    color: '#F54021',
    countClassName: 'text-strawberry-spinach-red',
  },
];
