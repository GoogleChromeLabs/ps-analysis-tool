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
import { Help, SIDEBAR_ITEMS_KEYS, TabIcon } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { ITEMS } from '../contentPanel';

const HelpCenter = () => {
  const description =
    ITEMS.find((item) => item.sidebarKey === SIDEBAR_ITEMS_KEYS.HELP_CENTER)
      ?.description ?? '';

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-center text-lg flex flex-col items-center gap-2 text-raisin-black dark:text-bright-gray">
          <Help className="w-10 h-10 fill-granite-gray dark:fill-bright-gray" />
          {description && (
            <p className="border-b border-bright-gray dark:border-quartz font-semibold p-b-2 m-b-1">
              {description}
            </p>
          )}
          <p className="text-sm flex items-center gap-1">
            Please refer to the help center opened in the current browser tab.
            <TabIcon className="w-4 h-4 fill-granite-gray dark:fill-bright-gray" />
          </p>
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
