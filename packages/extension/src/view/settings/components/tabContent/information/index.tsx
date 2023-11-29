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
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
import InformationDisplay from './informationDisplay';

const Information = () => {
  const { currentTabs, currentExtensions, browserInformation } =
    useSettingsStore(({ state }) => ({
      currentTabs: state.currentTabs,
      currentExtensions: state.currentExtensions,
      browserInformation: state.browserInformation,
    }));
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div>
        <p className="font-semibold text-lg">Current Tabs:</p>
        <div className="bg-dynamic-grey">
          {currentTabs?.map((tab, index) => {
            return (
              <InformationDisplay
                key={index}
                information={`${tab.tabTitle}: ${tab.tabURL}`}
              />
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">Current installed extensions:</p>
        <div className="bg-dynamic-grey">
          {currentExtensions?.map((extension, index) => {
            return (
              <InformationDisplay
                key={index}
                information={`${extension.extensionName}: ${extension.extensionId}`}
              />
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">Browser version:</p>
        <div className="bg-dynamic-grey">
          <InformationDisplay information={`${browserInformation}`} />
        </div>
      </div>
    </div>
  );
};

export default Information;
