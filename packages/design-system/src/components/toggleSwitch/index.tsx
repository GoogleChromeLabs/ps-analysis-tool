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
 * External dependencies
 */
import React from 'react';

type ToggleSwitchProps = {
  enabled: boolean;
  setEnabled: (newValue: boolean) => void;
  onLabel: string;
  additionalStyles?: string;
};

const ToggleSwitch = ({
  enabled,
  setEnabled,
  onLabel,
  additionalStyles = 'relative',
}: ToggleSwitchProps) => {
  return (
    <div
      className={`${additionalStyles} flex flex-col items-center justify-center overflow-hidden`}
    >
      <>
        <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
          <input
            type="checkbox"
            name="autoSaver"
            className="sr-only"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <span
            className={`slider mr-3 flex h-3 w-6 items-center rounded-full p-1 duration-200 ${
              enabled ? 'bg-toggle-on' : 'bg-quartz'
            }`}
          >
            <span
              className={`dot h-1.5 w-1.5 rounded-full bg-white duration-200 ${
                enabled ? 'translate-x-2.5' : ''
              }`}
            ></span>
          </span>
          <span className="label flex items-center text-sm font-medium text-black">
            {onLabel} <span className="pl-1"> {enabled ? 'On' : 'Off'} </span>
          </span>
        </label>
      </>
    </div>
  );
};

export default ToggleSwitch;
