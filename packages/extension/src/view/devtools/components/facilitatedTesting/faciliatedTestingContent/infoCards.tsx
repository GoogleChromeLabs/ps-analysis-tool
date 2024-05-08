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
import { addUTMParams } from '@ps-analysis-tool/common';

const EXPERIMENT_GROUP = 'Membership in Experiment Group';

const INFO_CARDS_DATA = [
  {
    heading: 'Third-Party Cookie Depreciation Readiness',
    content:
      'Discover how companies across the web are gearing up for third-party cookie deprecation. This <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://github.com/privacysandbox/privacy-sandbox-dev-support/blob/main/3pcd-readiness.md" target="_blank">comprehensive list</a> is compiled with insights from participants who have voluntarily shared their preparations.',
  },
  {
    heading: EXPERIMENT_GROUP,
    content: `To prepare for third-party cookie deprecation, we will be providing Chrome-facilitated testing modes that allow sites to preview how site behavior and functionality work without third-party cookies. Check <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="${addUTMParams(
      'https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing'
    )}" target="_blank">this guide</a> to learn more.`,
  },
  {
    heading: 'Request Additional Migration Time',
    content: `For an easier transition through the deprecation process, Chrome is providing deprecation trials which allows top-level sites and embedded services to request additional time to migrate away from third-party cookie dependencies for non-advertising use cases. To learn more, please check this information regarding <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="${addUTMParams(
      'https://developers.google.com/privacy-sandbox/3pcd/temporary-exceptions/first-party-deprecation-trial?hl=en'
    )}" 
    target="_blank">3P</a> and <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="${addUTMParams(
      'https://developers.google.com/privacy-sandbox/3pcd/temporary-exceptions/first-party-deprecation-trial#apply_for_the_first-party_deprecation_trial'
    )}" 
    target="_blank">1P</a> deprecation trials.`,
  },
  {
    heading: 'Attestation Enrollment',
    content: `To access the Privacy Sandbox relevance and measurement APIs on Chrome and Android, developers need to enroll with the privacy sandbox as a mechanism to verify the entities that call these APIs, and to gather the developer-specific data needed for the proper configuration and use of the APIs. To learn more about this process and how to enroll please check this <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="${addUTMParams(
      'https://developer.chrome.com/blog/announce-enrollment-privacy-sandbox/'
    )}" 
    target="_blank">documentation</a>.`,
  },
  {
    heading: 'Reporting Breakages',
    content: `If your site or a service you depend on is breaking with third-party cookies disabled, you should file an issue <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="https://goo.gle/report-3pc-broken" 
    target="_blank">here</a>. And if you have questions or feedback about Privacy Sandbox, you can raise a new issue <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" 
    href="https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/issues/new/choose"
    target="_blank">here</a>  using the third-party cookie deprecation.`,
  },
];

const InfoCards = () => {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-500">
      {INFO_CARDS_DATA.map((card, index) => (
        <li className="py-4" key={index}>
          <div className="flex items-center">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <p className="text-xl font-bold text-raisin-black dark:text-bright-gray truncate capitalize">
                {card.heading}
              </p>
              <p
                className="text-sm break-words"
                dangerouslySetInnerHTML={{ __html: card.content }}
              />
              {card.heading === EXPERIMENT_GROUP && (
                <div className="p-3 flex-1 bg-anti-flash-white dark:bg-charleston-green rounded-md">
                  <p>
                    For browsers in the 1% group, users will get a new
                    chrome://settings/trackingProtection page instead of
                    chrome://settings/cookies
                  </p>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default InfoCards;
