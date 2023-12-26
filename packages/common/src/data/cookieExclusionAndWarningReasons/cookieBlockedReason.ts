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
const CookieBlockedReason = {
  SecureOnly: `<p>This cookie was blocked because it had the 'Secure' attribute and the connection was not secure.</p><br />`,
  NotOnPath: `<p>This cookie was blocked because its path was not an exact match for, or a superdirectory of, the request URL's path.</p><br />`,
  DomainMismatch: `<p>This cookie was blocked because the request URL's domain did not exactly match the cookie's domain, nor was the request URL's domain a subdomain of the cookie's Domain attribute value.</p><br />`,
  SameSiteStrict: `<p>This cookie was blocked because it had the <code>SameSite=Strict</code> attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.</p><br />`,
  SameSiteLax: `<p>This cookie was blocked because it had the <code>SameSite=Lax</code> attribute and the request was made from a different site and was not initiated by a top-level navigation.</p><br />`,
  SameSiteUnspecifiedTreatedAsLax: `<p>This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to <code>SameSite=Lax</code>, and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with <code>SameSite=None</code> to enable cross-site usage.</p><br />`,
  SameSiteNoneInsecure: `This cookie was blocked because it had the <code>SameSite=None</code> attribute but was not marked 'Secure'. Cookies without SameSite restrictions must be marked 'Secure' and sent over a secure connection.</p><br />`,
  UserPreferences: `<p>This cookie was blocked due to user preferences.</p><br />`,
  ThirdPartyPhaseout: `<p>Prepare for phasing out third-party cookies.</p><br />`,
  ThirdPartyBlockedInFirstPartySet: `<p>The cookie was blocked by third-party cookie blocking between sites in the same First-Party Set.</p><br />`,
  UnknownError: `<p>Unknown error.</p><br />`,
  SchemefulSameSiteStrict: `<p>This cookie was blocked because it had the <code>SameSite=Strict</code> attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.</p><br />`,
  SchemefulSameSiteLax: `<p>This cookie was blocked because it had the <code>SameSite=Lax</code> attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.</p><br />`,
  SchemefulSameSiteUnspecifiedTreatedAsLax: `<p>This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to <code>SameSite=Lax</code>, and was blocked because the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.</p><br />`,
  SamePartyFromCrossPartyContext: `<p>This cookie was blocked because it had the 'SameParty' attribute but the request was cross-party. The request was considered cross-party because the domain of the resource's URL and the domains of the resource's enclosing frames/documents are neither owners nor members in the same first-party set.</p><br />`,
  NameValuePairExceedsMaxSize: `<p>This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4,096 characters.</p><br />`,
  InvalidDomain: `<p>This attempt to set a cookie via 'Set-Cookie' header was blocked because its Domain value was invalid with regards to the current host url.</p>`,
};

export default CookieBlockedReason;
