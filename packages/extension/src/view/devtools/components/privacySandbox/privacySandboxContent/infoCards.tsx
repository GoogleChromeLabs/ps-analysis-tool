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
      'To prepare for third-party cookie deprecation, we will be providing Chrome-facilitated testing modes that allow sites to preview how site behavior and functionality work without third-party cookies. <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing">This guide</a> provides an overview of the testing modes.',
  },
  {
    heading: 'Request Additional Migration Time',
    content:
      'Deprecation trials are a standard option that Chrome provides to allow sites to <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"  href="https://developer.chrome.com/origintrials/#/view_trial/3315212275698106369">register for additional time to migrate away</a> from the legacy functionality being removed. A deprecation trial is a type of origin trial that allows a feature to be temporarily re-enabled.',
  },
  {
    heading: 'Attestation Enrollment',
    content:
      'As we make plans for general availability of the Privacy Sandbox relevance and measurement APIs, including Attribution Reporting, FLEDGE, Topics, Private Aggregation and Shared Storage, we want to make sure these technologies are used as intended and with transparency.',
  },
  {
    heading: 'Reporting Breakages',
    content: `<p>If your site or a service you depend on is breaking with third-party cookies disabled, you should file an issue here - <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="http://goo.gle/report-3pc-broken" >goo.gle/report-3pc-broken</a></p>
		<p>If you have questions around the deprecation process, you can <a class="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline" href="https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/issues/new/choose">raise a new issue using the "third-party cookie deprecation"</a> tag.</p>`,
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
