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
import React from 'react';

/**
 * Internal dependencies.
 */

const INFO_CARDS_DATA = [
  {
    heading: 'Membership in Experiment Group',
    content:
      '<p>To prepare for third-party cookie deprecation, we will be providing Chrome-facilitated testing modes that allow sites to preview how site behavior and functionality work without third-party cookies.</p> <p>Check <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing" target="_blank">this guide</a> to learn more.</p>',
  },
  {
    heading: 'Request Additional Migration Time',
    content:
      'For an easier transition through the deprecation process, Chrome is providing a third-party <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developer.chrome.com/docs/web-platform/origin-trials/" target="_blank">deprecation trial</a> which allows embedded sites and services to request additional time to migrate away from third-party cookie dependencies for non-advertising use cases. To learn more please check <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developers.google.com/privacy-sandbox/3pcd/temporary-exceptions/first-party-deprecation-trial?hl=en" target="_blank">this documentation.</a>',
  },
  {
    heading: 'Attestation Enrollment',
    content:
      'To access the Privacy Sandbox relevance and measurement APIs on <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developer.chrome.com/docs/privacy-sandbox/" target="_blank">Chrome</a> and <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developer.android.com/design-for-safety/privacy-sandbox" target="_blank">Android</a>, <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developer.chrome.com/blog/announce-enrollment-privacy-sandbox/" target="_blank">developers need to enroll</a> with the privacy sandbox as a mechanism to verify the entities that call these APIs, and to gather the developer-specific data needed for the proper configuration and use of the APIs. To learn more about this process and how to enroll please check <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://github.com/privacysandbox/attestation/blob/main/how-to-enroll.md" target="_blank">this documentation.</a>',
  },
  {
    heading: 'Reporting Breakages',
    content:
      'If your site or a service you depend on is breaking with third-party cookies disabled, you should file an issue <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://b.corp.google.com/issues/new?component=1306484&template=1777152" target="_blank">here</a>. And if you have questions or feedback about Privacy Sandbox, you can raise a new issue <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/issues/new/choose" target="_blank">here</a> using the third-party cookie deprecation.',
  },
];

const InfoCards = () => {
  return (
    <div className="grid grid-cols-2 gap-9">
      {INFO_CARDS_DATA.map((card, index) => (
        <div
          key={index}
          className="w-full h-full text-raisin-black dark:text-bright-gray"
        >
          <h3 className="text-xl font-bold break-words mb-3">{card.heading}</h3>
          <p
            className="text-sm break-words"
            dangerouslySetInnerHTML={{ __html: card.content }}
          ></p>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
