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
import EventsContainer from './tabs/events';
import ToolsContainer from './tabs/tools';
import UserIdsContainer from './tabs/userIds';
import VersionComponent from './tabs/version';
import { usePrebid } from '../../../../stateProviders';
import NamespaceTab from './tabs/namespace';

enum PillToggleOptions {
  Config = 'Config',
  Events = 'Events',
  Tools = 'Tools',
  UserId = 'UserId',
  Namespace = 'Namespace',
  Version = 'Version',
}

const Panel = () => {
  const [pillToggle, setPillToggle] = useState<string | null>(
    PillToggleOptions.Config
  );

  const { config, errorEvents, installedModules, prebidVersion } = usePrebid(
    ({ state }) => ({
      config: state.prebidData?.config,
      installedModules: state.prebidData?.installedModules ?? [],
      prebidVersion: state.prebidData?.versionInfo,
      errorEvents: state.prebidData?.errorEvents,
    })
  );

  const containerToShow = useMemo(() => {
    switch (pillToggle) {
      case PillToggleOptions.Config:
        return (
          <ConfigContainer
            config={config}
            installedModules={installedModules}
          />
        );
      case PillToggleOptions.Events:
        return <EventsContainer errorEvents={errorEvents} />;
      case PillToggleOptions.Tools:
        return <ToolsContainer />;
      case PillToggleOptions.UserId:
        return <UserIdsContainer config={config} />;
      case PillToggleOptions.Version:
        return <VersionComponent prebidVersion={prebidVersion} />;
      case PillToggleOptions.Namespace:
        return <NamespaceTab />;
      default:
        return <></>;
    }
  }, [pillToggle, config, installedModules, errorEvents, prebidVersion]);

  return (
    <div className="flex flex-col pt-4 h-full w-full bg-lotion dark:bg-raisin-black">
      <div className="px-4 pb-4 mb-4">
        <PillToggle
          options={Object.values(PillToggleOptions)}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={false}
          persistenceKey="prebidPanelPillToggle"
        />
      </div>
      <div className="flex-1 overflow-auto my-1 text-outer-space-crayola">
        <div className="w-full h-full border-american-silver dark:border-quartz">
          {containerToShow}
        </div>
      </div>
    </div>
  );
};

export default Panel;
