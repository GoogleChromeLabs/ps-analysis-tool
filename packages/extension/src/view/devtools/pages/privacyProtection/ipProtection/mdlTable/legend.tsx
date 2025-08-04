/*
 * Copyright 2025 Google LLC
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
import { Link } from '@google-psat/design-system';

const Legend = () => {
  return (
    <div className="flex-1 border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] overflow-y-auto text-raisin-black dark:text-bright-gray">
      <p className="px-2 py-1">
        The Masked Domain List (MDL) is part of Google&#39;s IP Protection
        initiative, designed to enhance user privacy. It comprises domains that,
        when embedded as third-party content (such as ads or analytics scripts),
        are capable of collecting user data across multiple websites. To
        mitigate potential privacy risks, traffic to these domains is routed
        through a proxy, masking the user&#39;s original IP address. For more
        details, please refer to the{' '}
        <Link href="https://github.com/GoogleChrome/ip-protection/blob/main/Masked-Domain-List.md">
          Masked Domain List on GitHub
        </Link>{' '}
        and the{' '}
        <Link href="https://github.com/GoogleChrome/ip-protection/blob/main/README.md">
          IP Protection README
        </Link>
        .
      </p>
    </div>
  );
};

export default Legend;
