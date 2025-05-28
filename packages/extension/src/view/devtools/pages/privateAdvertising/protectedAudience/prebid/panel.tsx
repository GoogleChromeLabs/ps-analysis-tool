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
import React, { useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import ConfigContainer from './tabs/config';
import type { PrebidEvents } from '../../../../../../store';
import EventsContainer from './tabs/events';
import ToolsContainer from './tabs/tools';
import UserIdsContainer from './tabs/userIds';
import VersionComponent from './tabs/version';

enum PillToggleOptions {
  Config = 'Config',
  Events = 'Events',
  Tools = 'Tools',
  UserId = 'UserId',
  Version = 'Version',
}

interface PanelProps {
  prebidResponse: PrebidEvents;
}

const Panel = ({ prebidResponse }: PanelProps) => {
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.Config
  );

  const containerToShow = useMemo(() => {
    switch (pillToggle) {
      case PillToggleOptions.Config:
        return (
          <ConfigContainer
            config={prebidResponse.config}
            installedModules={prebidResponse.installedModules ?? []}
          />
        );
      case PillToggleOptions.Events:
        return <EventsContainer errorEvents={prebidResponse.errorEvents} />;
      case PillToggleOptions.Tools:
        return <ToolsContainer />;
      case PillToggleOptions.UserId:
        return <UserIdsContainer config={prebidResponse.config} />;
      case PillToggleOptions.Version:
        return <VersionComponent prebidVersion={prebidResponse.versionInfo} />;
      default:
        return <></>;
    }
  }, [
    pillToggle,
    prebidResponse.config,
    prebidResponse.installedModules,
    prebidResponse.errorEvents,
    prebidResponse.versionInfo,
  ]);

  return (
    <div className="flex flex-col pt-4 h-full w-full bg-lotion dark:bg-raisin-black">
      <div className="px-4 pb-4">
        <PillToggle
          options={Object.values(PillToggleOptions)}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={false}
          width="w-24"
        />
      </div>
      <div className="flex-1 overflow-auto text-outer-space-crayola">
        <div className="ml-4 w-full h-full border-american-silver dark:border-quartz overflow-auto">
          {containerToShow}
        </div>
      </div>
    </div>
  );
};

export default Panel;
