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
  SecureOnly:
    "This cookie was blocked because it had the 'Secure' attribute and the connection was not secure.",
  NotOnPath:
    "This cookie was blocked because its path was not an exact match for, or a superdirectory of, the request URL's path.",
  DomainMismatch:
    "This cookie was blocked because the request URL's domain did not exactly match the cookie's domain, nor was the request URL's domain a subdomain of the cookie's Domain attribute value.",
  SameSiteStrict:
    "This cookie was blocked because it had the 'SameSite=Strict' attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.",
  SameSiteLax:
    "This cookie was blocked because it had the 'SameSite=Lax' attribute and the request was made from a different site and was not initiated by a top-level navigation.",
  SameSiteUnspecifiedTreatedAsLax:
    "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax', and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with 'SameSite=None' to enable cross-site usage.",
  SameSiteNoneInsecure:
    "This cookie was blocked because it had the 'SameSite=None' attribute but was not marked 'Secure'. Cookies without SameSite restrictions must be marked 'Secure' and sent over a secure connection.",
  UserPreferences: 'This cookie was blocked due to user preferences.',
  ThirdPartyPhaseout: 'Prepare for phasing out third-party cookies',
  ThirdPartyBlockedInFirstPartySet:
    'The cookie was blocked by third-party cookie blocking between sites in the same First-Party Set.',
  UnknownError: 'Unknown error',
  SchemefulSameSiteStrict:
    "This cookie was blocked because it had the 'SameSite=Strict' attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.",
  SchemefulSameSiteLax:
    "This cookie was blocked because it had the 'SameSite=Lax' attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.",
  SchemefulSameSiteUnspecifiedTreatedAsLax:
    "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax\"', and was blocked because the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.",
  SamePartyFromCrossPartyContext:
    "This cookie was blocked because it had the 'SameParty' attribute but the request was cross-party. The request was considered cross-party because the domain of the resource's URL and the domains of the resource's enclosing frames/documents are neither owners nor members in the same first-party set.",
  NameValuePairExceedsMaxSize:
    'This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4,096 characters.',
};

export default CookieBlockedReason;
