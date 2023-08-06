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
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import { COLOR_MAP } from '../../../../../design-system/theme/colors';

const CookiesLanding = () => {
  const ladingHeaderProps = {
    dataMapping: [
      {
        title: 'Total cookies',
        count: 20,
        data: [
          { count: 5, color: COLOR_MAP.functional },
          { count: 7, color: COLOR_MAP.marketing },
          { count: 7, color: COLOR_MAP.analytics },
          { count: 3, color: COLOR_MAP.uncategorised },
        ],
      },
      {
        title: '1st party cookies',
        count: 10,
        data: [
          { count: 7, color: COLOR_MAP.functional },
          { count: 3, color: COLOR_MAP.marketing },
          { count: 10, color: COLOR_MAP.analytics },
        ],
      },
      {
        title: '3rd party cookies',
        count: 10,
        data: [
          { count: 5, color: COLOR_MAP.functional },
          { count: 10, color: COLOR_MAP.marketing },
        ],
      },
    ],
  };

  return (
    <div>
      <LandingHeader {...ladingHeaderProps} />
      <div className="flex justify-center mt-10">
        <CookiesMatrix />
      </div>
    </div>
  );
};

export default CookiesLanding;
