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
 * Internal dependencies
 */
import SettingOption from './settingOption';
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';

const SettingsContainer = () => {
  const { allowedNumberOfTabs, isUsingCDP, setIsUsingCDP, setProcessingMode } =
    useSettingsStore(({ state, actions }) => ({
      allowedNumberOfTabs: state.allowedNumberOfTabs,
      isUsingCDP: state.isUsingCDP,
      setProcessingMode: actions.setProcessingMode,
      setIsUsingCDP: actions.setIsUsingCDP,
    }));

  return (
    <div data-testid="Settings">
      <div className="flex flex-row pl-3 mb-2">
        <span className="text-base font-bold dark:text-white">
          PSAT Extension Settings
        </span>
      </div>
      <div className="rounded w-full divide-y divide-hex-gray dark:divide-quartz px-2 border border-american-silver dark:border-quartz">
        <SettingOption
          title="Enable CDP"
          switchState={isUsingCDP}
          changeSwitchState={setIsUsingCDP}
          description="The Chrome DevTools Protocol allows for tools to instrument, inspect, debug and profile Chromium,
Chrome and other Blink-based browsers."
        />
        <SettingOption
          title="Multitab Debugging"
          switchState={allowedNumberOfTabs === 'unlimited'}
          changeSwitchState={setProcessingMode}
          description="By default, the PSAT tool analyzes one tab at a time. You can enable multi-tab debugging by toggling the appropriate option. However, be aware that this may slow down the extension's performance"
        />
      </div>
    </div>
  );
};

export default SettingsContainer;
