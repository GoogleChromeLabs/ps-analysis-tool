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
  <div className="bg-[#D4E3FC] rounded-lg p-6 flex w-full text-raisin-black">
    <div className="flex-1">
      <h2 className="text-2xl mb-3">
        Prepare for third-party cookie restrictions
      </h2>
      <p className="text-base break-words mb-6">
        <a
          href="https://privacysandbox.com/"
          className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Sandbox
        </a>{' '}
        is a multi-year{' '}
        <a
          href="https://developer.chrome.com/docs/privacy-sandbox/"
          className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
          target="_blank"
          rel="noreferrer"
        >
          initiative
        </a>{' '}
        for building a more private web by defining a set of building blocks
        (i.e. proposed APIs) enabling{' '}
        <a
          href="https://github.com/michaelkleber/privacy-model"
          className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
          target="_blank"
          rel="noreferrer"
        >
          a new privacy model for the web
        </a>
        .
      </p>
      <p className="text-sm mb-7">
        To facilitate testing,{' '}
        <a
          href="https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2024jan"
          className="text-bright-navy-blue hover:opacity-80 underline"
          target="_blank"
          rel="noreferrer"
        >
          Chrome has restricted third-party cookies by default for 1% of users.
        </a>
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
