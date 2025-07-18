/*
 * Copyright 2024 Google LLC
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
import { I18n } from '@google-psat/i18n';
import { JsonView } from '@google-psat/design-system';

interface BottomTrayProps {
  selectedJSON?: object;
}

const BottomTray = ({ selectedJSON }: BottomTrayProps) => {
  return (
    <div className="flex-1 z-20 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
      <div className="text-xs py-1 px-1.5 h-full">
        {selectedJSON ? (
          <JsonView src={selectedJSON} />
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomTray;
