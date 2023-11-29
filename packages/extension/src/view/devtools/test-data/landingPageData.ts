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

export const PSInfo = {
  'private-state-token': {
    name: 'Private State Token',
    description:
      "Allows websites and services to evaluate a user's authenticity without needing to know the user's identity.   With this API, a website/service can issue a batch of Private State Tokens (renamed to Private state tokens from Trust Tokens)  to a user's browser. The tokens are stored on the user’s browser and can then be “redeemed” by other sites and services as a signal of the user's authenticity.",
    proposal: 'https://github.com/WICG/trust-token-api',
    publicDiscussion: 'https://github.com/WICG/trust-token-api/issues',
    videoOverview: 'https://www.youtube.com/watch?v=bXB1Iwq6Eq4',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/trust-tokens/',
  },
  topics: {
    name: 'Topics',
    description:
      'Provide a way for advertising to reach users based on interests inferred from the sites or apps the user visits, without needing to know the specific sites or apps the user has visited.',
    proposal: 'https://github.com/patcg-individual-drafts/topics',
    publicDiscussion:
      'https://github.com/patcg-individual-drafts/topics/issues',
    videoOverview: 'https://youtu.be/hEBzWuXjeTQ',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/topics/',
  },
  'protected-audience': {
    name: 'Protected Audience (FLEDGE)',
    description:
      'A proposal to serve remarketing and custom audience use cases by allowing custom defined interested groups to be stored on-device and allowing an on-device auction that then matches appropriate ads with people in a desired interest group.',
    proposal: 'https://github.com/WICG/turtledove',
    publicDiscussion: 'https://github.com/WICG/turtledove/issues',
    videoOverview: 'https://www.youtube.com/watch?v=HkvmYKqnytw',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/fledge-api/',
  },
  'attribution-reporting': {
    name: 'Attribution Reporting',
    description:
      'Allow the recording and matching of ad events with conversion events to occur on-device. </br> Event-level: Determine the effectiveness of specific ad interactions to help drive optimization. </br>Summary Reporting: Allows for more detail about the overall conversions (e.g. region, revenue, time of day, etc) that their advertising has delivered, while minimizing details about individual conversions.',
    proposal: 'https://github.com/WICG/attribution-reporting-api',
    publicDiscussion:
      'https://github.com/WICG/attribution-reporting-api/issues',
    videoOverview: 'https://www.youtube.com/watch?v=UGA74CIcom8',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/attribution-reporting/',
  },
  'related-website-sets': {
    name: 'Related Website Sets',
    description:
      'A new web platform mechanism that would allow a company that owns multiple sites to declare a collection of related domains as being in a Related Website Sets. Sites that are part of a Related Website Set would be able to access cookies across the set of included domains.',
    proposal: 'https://github.com/WICG/first-party-sets',
    publicDiscussion: 'https://github.com/WICG/first-party-sets/issues',
    videoOverview: 'https://www.youtube.com/watch?v=cNJ8mZ-J3F8',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/related-website-sets/',
  },
  'shared-storage': {
    name: 'Shared Storage',
    description:
      'The Shared Storage API allows sites to store and access unpartitioned cross-site data as to prevent cross-site user tracking, browsers are partitioning all forms of storage (cookies, localStorage, caches, etc). However, there are a number of legitimate use cases that rely on unpartitioned storage which would be impossible without help from new web APIs.',
    proposal: 'https://github.com/WICG/shared-storage',
    publicDiscussion: 'https://github.com/WICG/shared-storage/issues',
    videoOverview: '',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/shared-storage/',
  },
  chips: {
    name: 'Cookies Having Independent Partitioned State (CHIPS)',
    description:
      'A new way to enable 3rd party developers to access cookies on sites where their services are embedded on a per-site basis (meaning a different cookie on each site), restricting the ability to track users across sites.',
    proposal: 'https://github.com/privacycg/CHIPS',
    publicDiscussion: 'https://github.com/privacycg/CHIPS/issues',
    videoOverview: '',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/chips/',
  },
  'fenced-frames': {
    name: 'Fenced Frames',
    description:
      'A fenced frame (<fencedframe>) is a proposed HTML element for embedded content, similar to an iframe. Unlike iframes, a fenced frame restricts communication with its embedding context to allow the frame access to cross-site data without sharing it with the embedding context.',
    proposal: 'https://github.com/WICG/fenced-frame',
    publicDiscussion: 'https://github.com/WICG/fenced-frame/issues',
    videoOverview: 'https://www.youtube.com/watch?v=CqbluZHZofI',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/fenced-frame/',
  },
  fedcm: {
    name: 'Federated Credential Management(FedCM)',
    description:
      'FedCM is a proposal for a privacy-preserving approach to federated identity services (such as "Sign in with...") where users can log into sites without sharing their personal information with the identity service or the site.',
    proposal: 'https://github.com/fedidcg/FedCM',
    publicDiscussion: 'https://github.com/fedidcg/FedCM/issues',
    videoOverview: 'https://www.youtube.com/watch?v=rSOqIR3lzBk',
    devDocumentation:
      'https://developer.chrome.com/docs/privacy-sandbox/fedcm/',
  },
  'bounce-tracking': {
    name: 'Bounce Tracking Mitigation',
    description:
      'Bounce Tracking Mitigation is a Privacy Sandbox proposal to mitigate bounce tracking, a technique used to track users across sites by abusing the referrer header.',
    proposal: 'https://github.com/privacycg/nav-tracking-mitigations',
    publicDiscussion:
      'https://github.com/privacycg/nav-tracking-mitigations/issues',
    videoOverview: '',
    devDocumentation:
      'https://developer.chrome.com/en/docs/privacy-sandbox/bounce-tracking-mitigations',
  },
  'user-agent-reduction': {
    name: 'User Agent Reduction',
    description:
      'User-Agent (UA) reduction minimizes the identifying information shared in the User-Agent string, which may be used for passive fingerprinting.',
    proposal: 'https://github.com/miketaylr/user-agent-reduction/',
    publicDiscussion:
      'https://github.com/miketaylr/user-agent-reduction/issues',
    videoOverview: '',
    devDocumentation:
      'https://developer.chrome.com/en/docs/privacy-sandbox/user-agent/',
  },
};

export const latestNewsXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
          <channel>
              <title>The Privacy Sandbox</title>
              <description>The Privacy Sandbox</description>
              <atom:link href="https://privacysandbox.com/rss/" rel="self"/>
              <link>https://privacysandbox.com/</link>
              <lastBuildDate></lastBuildDate>
              <item>
                  <title>Digiday survey: Why publishers are ready to end the high cost of third-party cookies and data leakage</title>
                  <link>https://privacysandbox.com/news/digiday-survey-data-leakage</link>
                  <pubDate>Mon, 13 Nov 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>Protected Audience API: Our new name for FLEDGE</title>
                  <link>https://privacysandbox.com/news/protected-audience-api-our-new-name-for-fledge</link>
                  <pubDate>Sun, 16 Apr 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>Working Together to Build a More Private Internet</title>
                  <link>https://privacysandbox.com/news/working-together-to-build-a-more-private-internet</link>
                  <pubDate>Wed, 05 Apr 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>Maximize ad relevance without third-party cookies</title>
                  <link>https://privacysandbox.com/news/maximize-ad-relevance-after-third-party-cookies</link>
                  <pubDate>Tue, 13 Dec 2022 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>The next stages of Privacy Sandbox: General availability and supporting scaled testing</title>
                  <link>https://privacysandbox.com/news/the-next-stages-of-privacy-sandbox-general-availability</link>
                  <pubDate>Wed, 17 May 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>Privacy Sandbox for the Web reaches general availability</title>
                  <link>https://privacysandbox.com/news/privacy-sandbox-for-the-web-reaches-general-availability</link>
                  <pubDate>Wed, 06 Sep 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>How Privacy Sandbox raises the bar for ads privacy</title>
                  <link>https://privacysandbox.com/news/how-privacy-sandbox-raises-the-bar-for-ads-privacy</link>
                  <pubDate>Mon, 14 Aug 2023 18:30:00 +0000</pubDate>
              </item>
              <item>
                  <title>AdExchanger study: Cookies’ low match rates cost Ad Tech millions</title>
                  <link>https://privacysandbox.com/news/adexchanger-study-cookies-low-match-rates</link>
                  <pubDate>Tue, 11 Apr 2023 18:30:00 +0000</pubDate>
              </item>
          </channel>
      </rss>
  `;

export const latestNewsLinks: Record<string, string> = {
  'Digiday survey: Why publishers are ready to end the high cost of third-party cookies and data leakage':
    'https://privacysandbox.com/news/digiday-survey-data-leakage',
  'Privacy Sandbox for the Web reaches general availability':
    'https://privacysandbox.com/news/privacy-sandbox-for-the-web-reaches-general-availability',
  'How Privacy Sandbox raises the bar for ads privacy':
    'https://privacysandbox.com/news/how-privacy-sandbox-raises-the-bar-for-ads-privacy',
  'The next stages of Privacy Sandbox: General availability and supporting scaled testing':
    'https://privacysandbox.com/news/the-next-stages-of-privacy-sandbox-general-availability',
  'Protected Audience API: Our new name for FLEDGE':
    'https://privacysandbox.com/news/protected-audience-api-our-new-name-for-fledge',
  'AdExchanger study: Cookies’ low match rates cost Ad Tech millions':
    'https://privacysandbox.com/news/adexchanger-study-cookies-low-match-rates',
  'Working Together to Build a More Private Internet':
    'https://privacysandbox.com/news/working-together-to-build-a-more-private-internet',
  'Maximize ad relevance without third-party cookies':
    'https://privacysandbox.com/news/maximize-ad-relevance-after-third-party-cookies',
};
