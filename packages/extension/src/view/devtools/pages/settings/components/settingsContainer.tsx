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
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import SettingOption from './settingOption';
import { useSettings } from '../../../stateProviders';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import Gear from '../../../../../../../../assets/icons/gear.svg?react';
import { SETTING_PAGE_CONTROLS } from '../../../../../constants';

interface settingsToReturnObject {
  id: string;
  heading: string;
  switchState: boolean;
  changeSwitchState: (newState: boolean) => void;
}
const SettingsContainer = () => {
  const {
    isObservabilityForSettingsPageDisplay,
    setIsObservability,
    observabilityEnabled,
    handleObservabilityEnabled,
  } = useSettings(({ state, actions }) => ({
    isObservabilityForSettingsPageDisplay:
      state.isObservabilityForSettingsPageDisplay,
    setIsObservability: actions.setIsObservability,
    observabilityEnabled: state.observabilityEnabled,
    handleObservabilityEnabled: actions.handleObservabilityEnabled,
  }));

  const memoisedSettings = useMemo(() => {
    const settingsToReturn: settingsToReturnObject[] = [];

    SETTING_PAGE_CONTROLS.map((setting) => {
      switch (setting.id) {
        case 'enableObservability':
          settingsToReturn.push({
            ...setting,
            heading: setting.heading(),
            changeSwitchState: setIsObservability,
            switchState: isObservabilityForSettingsPageDisplay,
          });
          break;
        default:
          break;
      }
      return setting;
    });

    return settingsToReturn;
  }, [isObservabilityForSettingsPageDisplay, setIsObservability]);

  return (
    <div data-testid="Settings">
      <div className="flex items-center flex-row mb-2 gap-x-2">
        <Gear className="dark:text-bright-gray" />
        <span className="text-base font-bold dark:text-bright-gray">
          {I18n.getMessage('pSATSettings')}
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
            />
          );
        })}
        <div className="px-3">
          {Object.keys(observabilityEnabled).map((key) => (
            <SettingOption
              key={key}
              title={key}
              switchState={observabilityEnabled[key]}
              changeSwitchState={(newState) => {
                handleObservabilityEnabled(key, newState);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer;
