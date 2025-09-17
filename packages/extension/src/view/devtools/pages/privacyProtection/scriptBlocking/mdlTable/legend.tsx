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
import { Link } from '@google-psat/design-system';
import React from 'react';

const Legend = () => {
  return (
    <div className="flex-1 border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] overflow-y-auto text-raisin-black dark:text-bright-gray">
      <p className="px-2 py-1">
        The Blocked Domain List is a subset of the{' '}
        <Link href="https://github.com/GoogleChrome/ip-protection/blob/main/Masked-Domain-List.md">
          Masked Domain List (MDL)
        </Link>{' '}
        under Google’s{' '}
        <Link href="https://github.com/GoogleChrome/ip-protection/blob/main/README.md">
          IP Protection
        </Link>{' '}
        initiative. Domains on this list are either entirely or partially
        blocked.
      </p>
    </div>
  );
};

export default Legend;
