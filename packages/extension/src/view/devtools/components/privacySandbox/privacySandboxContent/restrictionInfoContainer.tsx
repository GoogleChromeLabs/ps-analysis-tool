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
import { Cookie, VisibilityOff } from '@ps-analysis-tool/design-system';
import React from 'react';

const RestrictionInfoContainer = () => (
  <div className="bg-light-yellow rounded-lg p-6 flex w-full text-raisin-black">
    <div className="flex-1">
      <h2 className="text-2xl mb-3">
        Prepare for third-party cookie restrictions
      </h2>
      <p className="text-sm mb-7">
        To facilitate testing,{' '}
        <a
          href="https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2024jan"
          className="text-bright-navy-blue hover:opacity-80 underline"
        >
          Chrome has restricted third-party cookies by default for 1% of users.
        </a>
      </p>
      <p className="text-sm">
        During this testing period, it is important for sites and services to
        start preparing for third-party cookie restrictions, including moving to
        more private alternatives. Subject to addressing any remaining
        competition concerns of the UK&apos;s Competition and Markets Authority,
        Chrome will ramp up third-party cookie restrictions to 100% of users
        from Q3 2024.
      </p>
    </div>
    <div className="w-[10rem] h-full relative">
      <div className="absolute fill-[#D4E3FC]">
        <Cookie />
      </div>
      <div className="absolute top-[70px] left-[70px] fill-[#006E8C]">
        <VisibilityOff />
      </div>
    </div>
  </div>
);

export default RestrictionInfoContainer;
