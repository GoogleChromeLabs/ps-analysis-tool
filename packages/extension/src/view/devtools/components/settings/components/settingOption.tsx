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
import { ToggleSwitch } from '@ps-analysis-tool/design-system';
import React from 'react';

interface SettingOptionProps {
  title: string;
  description: string;
  switchState: boolean;
  changeSwitchState: (newState: boolean) => void;
}

const SettingOption = ({
  title,
  description,
  switchState,
  changeSwitchState,
}: SettingOptionProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col w-11/12 mx-2 gap-y-1 py-4">
        <div className="text-sm dark:text-bright-gray">{title}</div>
        <div
          className="text-xs text-darkest-gray dark:text-bright-gray"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      <div className="flex w-1/12">
        <ToggleSwitch enabled={switchState} setEnabled={changeSwitchState} />
      </div>
    </div>
  );
};

export default SettingOption;
