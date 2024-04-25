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
 * External dependencies
 */
import React from 'react';
import { Button, ClearIcon } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies
 */
// @ts-ignore
import PSIcon from '../../../../../icons/icon.svg';

const TransitionBanner = () => {
  return (
    <div className="w-full border-b border-bright-gray dark:border-quartz">
      <div className="w-full p-6 pb-0 overflow-auto">
        <div className="min-w-[35rem] max-w-[50rem] h-[100px] mx-auto mb-6 px-8 py-6 relative flex items-center justify-between gap-6 bg-bright-gray dark:bg-charleston-green rounded-lg">
          <button className="absolute top-3 right-3 text-dim-gray">
            <ClearIcon className="w-3 h-3" />
          </button>
          <PSIcon className="w-12 h-12" />
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-bright-gray">
              PSAT Extension has a new home
            </h3>
            <p className="text-sm text-charcoal dark:text-manatee">
              Please download the new version from the Chrome web store
            </p>
          </div>
          <Button text="Add to Chrome" extraClasses="py-2 min-w-fit" />
        </div>
      </div>
    </div>
  );
};

export default TransitionBanner;
