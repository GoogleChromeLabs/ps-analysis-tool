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
 * Internal dependencies.
 */
import React from 'react';
import { addUTMParams } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

const RestrictionInfoContainer = () => (
  <div className="flex flex-col w-full text-sm text-raisin-black dark:text-bright-gray mb-7">
    <p
      className="mb-7"
      dangerouslySetInnerHTML={{
        __html: I18n.getMessage('facilitateTesting', [
          `<a 
						className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
						target="_blank"
						rel="noreferrer"
						href="${addUTMParams(
              'https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2024jan'
            )}">`,
          '</a>',
        ]),
      }}
    />
    <p
      dangerouslySetInnerHTML={{
        __html: I18n.getMessage('faciliatedTestingPeriod', [
          `<a 
				className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
				target="_blank"
				rel="noreferrer"
				href="${addUTMParams(
          'https://developers.google.com/privacy-sandbox/3pcd/prepare/audit-cookies'
        )}">`,
          '</a>',
        ]),
      }}
    />
  </div>
);

export default RestrictionInfoContainer;
