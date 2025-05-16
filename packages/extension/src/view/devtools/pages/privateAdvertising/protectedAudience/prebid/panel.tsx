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
import { PillToggle } from '@google-psat/design-system';
import React, { useState } from 'react';
import ConfigContainer from './tabs';

/**
 * Internal dependencies.
 */

enum PillToggleOptions {
  Config = 'Config',
  Events = 'Events',
  Tools = 'Tools',
  UserId = 'UserId',
  Version = 'Version',
}

interface PanelProps {
  config: PrebidConfig;
}

const Panel = ({ config }: PanelProps) => {
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.Config
  );

  return (
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="px-4 pb-4">
        <PillToggle
          options={Object.values(PillToggleOptions)}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={false}
        />
      </div>
      <div className="flex-1 overflow-auto text-outer-space-crayola">
        {pillToggle === PillToggleOptions.Config ? (
          <div className="w-full h-full border-t border-american-silver dark:border-quartz overflow-auto">
            <ConfigContainer config={config} />
          </div>
        ) : (
          <div className="h-full border-r border-t border-american-silver dark:border-quartz w-full">
            events babua
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;
