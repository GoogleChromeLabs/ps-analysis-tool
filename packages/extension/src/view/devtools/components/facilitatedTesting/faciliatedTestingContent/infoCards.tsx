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
import { I18n } from '@ps-analysis-tool/i18n';

const EXPERIMENT_GROUP = I18n.getMessage('memberShipInExperimentGroup');

const INFO_CARDS_DATA = [
  {
    heading: EXPERIMENT_GROUP,
    content: I18n.getMessage('memberShipInExperimentGroupNote', [
      `<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="${addUTMParams(
        'https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing'
      )}" target="_blank">`,
      '</a>',
    ]),
  },
  {
    heading: I18n.getMessage('requestAdditionalMigrationTime'),
    content: I18n.getMessage('requestAdditionalMigrationTimeNote', [
      `<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="${addUTMParams(
        'https://developers.google.com/privacy-sandbox/3pcd/temporary-exceptions/first-party-deprecation-trial?hl=en'
      )}" target="_blank">`,
      '</a>',
      `<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="${addUTMParams(
        'https://developers.google.com/privacy-sandbox/3pcd/temporary-exceptions/first-party-deprecation-trial#apply_for_the_first-party_deprecation_trial'
      )}" target="_blank">`,
      '</a>',
    ]),
  },
  {
    heading: I18n.getMessage('attestationEnrollment'),
    content: I18n.getMessage('attestationEnrollmentNote', [
      `<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="${addUTMParams(
        'https://developer.chrome.com/blog/announce-enrollment-privacy-sandbox/'
      )}" target="_blank">`,
      '</a>',
    ]),
  },
  {
    heading: I18n.getMessage('reportingBreakages'),
    content: I18n.getMessage('reportingBreakagesNote', [
      '<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://goo.gle/report-3pc-broken" target="_blank">',
      '</a>',
      '<a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/issues/new/choose" target="_blank">',
      '</a>',
    ]),
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
                  <p>{I18n.getMessage('partOfExperimentGroup')}</p>
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
