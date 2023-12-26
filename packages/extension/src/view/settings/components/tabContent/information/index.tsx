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
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
import InformationDisplay from './informationDisplay';
import { Copy } from '@ps-analysis-tool/design-system';

const Information = () => {
  const { currentTabs, currentExtensions, browserInformation, OSInformation } =
    useSettingsStore(({ state }) => ({
      currentTabs: state.currentTabs,
      currentExtensions: state.currentExtensions,
      browserInformation: state.browserInformation,
      OSInformation: state.OSInformation,
    }));

  const [copying, setCopying] = useState(false);

  const handleCopy = useCallback(() => {
    setCopying(true);

    const clipboardText = `
    Number of open tabs: ${currentTabs}
    Active extensions:
    ${currentExtensions?.map((extension) => {
      return `${extension.extensionName}: ${extension.extensionId}\n`;
    })}
    Browser Version: ${browserInformation}
    OS information: ${OSInformation}
    `;

    //doing this instead of css because if text is too long then user might think the text has been copied and which might result in bad UX. Similar to github's copy button.
    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopying(false);
    });
  }, [OSInformation, browserInformation, currentExtensions, currentTabs]);

  return (
    <div className="w-full h-ful">
      <div className="relative w-fit h-fit flex flex-col gap-5 px-5 py-2 border rounded text-raisin-black">
        <button
          disabled={copying}
          className="absolute right-1 top-1"
          onClick={handleCopy}
        >
          <Copy className={copying ? 'text-mischka' : ''} />
        </button>
        <div>
          <p className="font-semibold text-lg">Current Tabs:</p>
          <div>
            <InformationDisplay information={`${currentTabs}`} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">Current installed extensions:</p>
          <div>
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
          <p className="font-semibold text-lg">Chrome version:</p>
          <div>
            <InformationDisplay information={browserInformation ?? ''} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">OS - System architecture</p>
          <div>
            <InformationDisplay information={OSInformation ?? ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
