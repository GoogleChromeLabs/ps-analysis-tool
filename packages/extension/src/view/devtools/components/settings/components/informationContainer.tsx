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
import React, { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
import {
  ArrowUp,
  Copy,
  InformationIcon,
} from '@ps-analysis-tool/design-system';
import classNames from 'classnames';

const InformationContainer = () => {
  const { currentTabs, currentExtensions, browserInformation, OSInformation } =
    useSettingsStore(({ state }) => ({
      currentTabs: state.currentTabs,
      currentExtensions: state.currentExtensions,
      browserInformation: state.browserInformation,
      OSInformation: state.OSInformation,
    }));

  const [copying, setCopying] = useState(false);
  const [open, setOpen] = useState(true);

  const handleCopy = useCallback(() => {
    setCopying(true);
    let clipboardText = `Number of open tabs: ${currentTabs}\n`;
    clipboardText += `Active extensions:\n`;
    currentExtensions?.forEach((extension) => {
      clipboardText += `${extension.extensionName}: ${extension.extensionId}\n`;
    });
    clipboardText += `Chrome Version: ${browserInformation}\n`;
    clipboardText += `OS information: ${OSInformation}`;

    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('textarea');
      copyFrom.style.textAlign = 'left';
      copyFrom.textContent = clipboardText;
      document.body.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand('copy');
      copyFrom.blur();
      document.body.removeChild(copyFrom);
      setCopying(false);
    } catch (error) {
      //Fail silently
    }
  }, [OSInformation, browserInformation, currentExtensions, currentTabs]);

  return (
    <div data-testid="Debugging information">
      <div>
        <div className="flex flex-row justify-between items-baseline">
          <div className="flex items-center flex-row pl-3 mb-2 gap-x-1">
            <InformationIcon className="text-white dark:text-mischka" />
            <span className="text-base font-bold dark:text-white">
              System Information
            </span>
          </div>
          <button
            className="flex gap-2 text-2xl font-bold items-baseline dark:text-bright-gray cursor-pointer"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <ArrowUp
              className={classNames(open && 'rotate-180 -translate-y-1')}
            />
          </button>
        </div>
        <div
          className={classNames(
            { hidden: !open },
            'relative rounded flex flex-col w-full px-4 pr-8 py-2 border border-american-silver dark:border-quartz gap-y-3'
          )}
        >
          <button
            disabled={copying}
            className="absolute right-1 top-1"
            onClick={handleCopy}
          >
            <Copy
              className={`dark:text-white  ${copying ? 'text-mischka' : ''}`}
            />
          </button>
          <div className="flex flex-row gap-x-2 justify-between mt-4">
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
