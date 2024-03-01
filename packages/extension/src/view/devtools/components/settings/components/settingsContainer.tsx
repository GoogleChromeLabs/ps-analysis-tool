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
import React, { useMemo } from 'react';

/**
 * Internal dependencies
 */
import SettingOption from './settingOption';
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import Gear from '../../../../../../../../assets/icons/gear.svg';
import { SETTING_PAGE_CONTROLS } from '../../../../../constants';

interface settingsToReturnObject {
  id: string;
  heading: string;
  switchState: boolean;
  description: string;
  changeSwitchState: (newState: boolean) => void;
}
const SettingsContainer = () => {
  const { allowedNumberOfTabs, isUsingCDP, setIsUsingCDP, setProcessingMode } =
    useSettingsStore(({ state, actions }) => ({
      allowedNumberOfTabs: state.allowedNumberOfTabsForSettingsPageDisplay,
      isUsingCDP: state.isUsingCDPForSettingsPageDisplay,
      setProcessingMode: actions.setProcessingMode,
      setIsUsingCDP: actions.setIsUsingCDP,
    }));

  const memoisedSettings = useMemo(() => {
    const settingsToReturn: settingsToReturnObject[] = [];

    SETTING_PAGE_CONTROLS.map((setting) => {
      switch (setting.id) {
        case 'enableCDP':
          settingsToReturn.push({
            ...setting,
            changeSwitchState: setIsUsingCDP,
            switchState: isUsingCDP,
          });
          break;
        case 'multitabDebugging':
          settingsToReturn.push({
            ...setting,
            changeSwitchState: setProcessingMode,
            switchState: allowedNumberOfTabs === 'unlimited',
          });
          break;
        default:
          break;
      }
      return setting;
    });

    return settingsToReturn;
  }, [allowedNumberOfTabs, isUsingCDP, setIsUsingCDP, setProcessingMode]);

  return (
    <div data-testid="Settings">
      <div className="flex items-center flex-row pl-3 mb-2 gap-x-3">
        <Gear className="dark:text-bright-gray" />
        <span className="text-base font-bold dark:text-bright-gray">
          PSAT Extension Settings
        </span>
      </div>
      <div className="rounded w-full divide-y divide-hex-gray dark:divide-quartz px-2 border border-american-silver dark:border-quartz">
        {memoisedSettings?.map((setting) => {
          return (
            <SettingOption
              key={setting.id}
              title={setting.heading}
              switchState={setting.switchState}
              changeSwitchState={setting.changeSwitchState}
              description={setting.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SettingsContainer;
