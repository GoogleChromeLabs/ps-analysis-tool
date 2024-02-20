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
import { PSTimelineIcon } from '@ps-analysis-tool/design-system';
import { addUTMParams } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import Link from './link';

const RestrictionInfoContainer = () => (
  <div className="flex flex-col w-full text-sm text-raisin-black dark:text-bright-gray mb-7">
    <p className="mb-7">
      To facilitate testing,{' '}
      <Link
        href={addUTMParams(
          'https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2024jan'
        )}
        title="Chrome has restricted third-party cookies by default for 1% of users."
      />
    </p>
    <div className="w-full grid place-items-center mb-2">
      <PSTimelineIcon />
    </div>
    <p>
      During this testing period, it is important for sites and services to{' '}
      <Link
        href={addUTMParams(
          'https://developers.google.com/privacy-sandbox/3pcd/prepare/audit-cookies'
        )}
        title="start preparing"
      />{' '}
      for third-party cookie restrictions, including moving to more private
      alternatives.
    </p>
  </div>
);

export default RestrictionInfoContainer;
