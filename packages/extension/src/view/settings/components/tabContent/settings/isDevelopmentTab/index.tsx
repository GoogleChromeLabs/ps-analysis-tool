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
import React from 'react';

/**
 * Internal dependencies.
 */
import { useSettingsStore } from '../../../../stateProviders/syncSettingsStore';

const IsInDevelopmentMode: React.FC = () => {
  const { allowedNumberOfTabs, setSettingsInStorage } = useSettingsStore(
    ({ state, actions }) => ({
      allowedNumberOfTabs: state.allowedNumberOfTabs,
      setSettingsInStorage: actions.setSettingsInStorage,
    })
  );

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-medium">Is in debugging mode:</h3>
      <div className="flex flex-row gap-1">
        <input
          value="true"
          type="radio"
          name="allowed-number-of-tabs"
          className="text-xs"
          onChange={(e) => setSettingsInStorage('isDev', e.target?.value)}
          checked={allowedNumberOfTabs === 'true'}
        />
        On
      </div>
      <div className="flex flex-row gap-1">
        <input
          className="text-xs"
          value="false"
          type="radio"
          name="allowed-number-of-tabs"
          onChange={(e) => setSettingsInStorage('isDev', e.target?.value)}
          checked={allowedNumberOfTabs === 'false'}
        />
        Off
      </div>
    </div>
  );
};

export default IsInDevelopmentMode;
