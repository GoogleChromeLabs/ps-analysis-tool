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
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';

const InformationContainer = () => {
  const { currentTabs, currentExtensions, browserInformation, OSInformation } =
    useSettingsStore(({ state }) => ({
      currentTabs: state.currentTabs,
      currentExtensions: state.currentExtensions,
      browserInformation: state.browserInformation,
      OSInformation: state.OSInformation,
    }));

  return (
    <div data-testid="Debugging information">
      <div>
        <div className="flex flex-row pl-3 mb-2">
          <span className="text-base font-bold dark:text-white">
            System Information
          </span>
        </div>
        <div className="rounded flex flex-col w-full px-4 py-2 border border-american-silver dark:border-quartz gap-y-3">
          <div className="flex flex-row gap-x-2 justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold dark:text-white">
                Current Open Tabs
              </span>
              <span className="text-xs text-mischka">{currentTabs}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold dark:text-white">
                Chrome version
              </span>
              <span className="text-xs text-mischka">{browserInformation}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold dark:text-white">
                OS - System Architecture
              </span>
              <span className="text-xs text-mischka">{OSInformation}</span>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="mt-1">
              <span className="text-sm font-bold dark:text-white">
                Current Installed Extensions
              </span>
              <ul className="list-disc ml-4 mt-1">
                {currentExtensions?.map((extension, index) => {
                  return (
                    <li className="text-xs text-mischka mt-1" key={index}>
                      {extension.extensionName}: {extension.extensionId}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationContainer;
