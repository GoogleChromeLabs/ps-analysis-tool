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
import React, { useState } from 'react';
import classNames from 'classnames';
import { ArrowUp } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import { InformationContainer, SettingsContainer } from './components';

const Settings = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      data-testid="extension-settings-content"
      className="h-full w-full flex flex-col min-w-[40rem] overflow-auto"
    >
      <div
        className={`${!open && 'border-b border-hex-gray dark:border-quartz'}`}
      >
        <div
          className={`p-4 ${
            open && 'border-b border-hex-gray dark:border-quartz'
          }`}
        >
          <button
            data-testid="settings-collapse-button"
            className="flex gap-2 text-2xl font-bold items-baseline dark:text-bright-gray cursor-pointer"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <h1 className="text-left">{I18n.getMessage('settings')}</h1>
            <div>
              <ArrowUp
                className={classNames(open && 'rotate-180 -translate-y-1')}
              />
            </div>
          </button>
        </div>
        <div
          data-testid="settings-main-content"
          className={classNames({ hidden: !open })}
        >
          <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-2 pb-10 px-4 gap-y-4">
            <SettingsContainer />
            <InformationContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
