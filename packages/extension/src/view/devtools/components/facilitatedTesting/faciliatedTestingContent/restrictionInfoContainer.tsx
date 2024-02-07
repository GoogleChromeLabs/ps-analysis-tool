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
import Link from './link';

const RestrictionInfoContainer = () => (
  <div className="bg-[#D4E3FC] rounded-lg p-6 flex w-full text-raisin-black">
    <div className="flex-1">
      <h2 className="text-2xl mb-3">
        Prepare for third-party cookie restrictions
      </h2>
      <p className="text-base break-words mb-6">
        <Link href="https://privacysandbox.com/" title="Privacy Sandbox" /> is a
        multi-year{' '}
        <Link
          href="https://developer.chrome.com/docs/privacy-sandbox/"
          title="initiative"
        />{' '}
        for building a more private web by defining a set of building blocks
        (i.e. proposed APIs) enabling{' '}
        <Link
          href="https://github.com/michaelkleber/privacy-model"
          title="a new privacy model for the web"
        />
        .
      </p>
      <p className="text-sm mb-7">
        To facilitate testing,{' '}
        <Link
          href="https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2024jan"
          title="Chrome has restricted third-party cookies by default for 1% of users."
        />
      </p>
    </div>
    <div className="w-[10rem] h-full relative">
      <div className="absolute fill-[#A1A6B4] top-2">
        <Cookie />
      </div>
      <div className="absolute top-16 left-8 fill-[#006E8C]">
        <VisibilityOff />
      </div>
    </div>
  </div>
);

export default RestrictionInfoContainer;
