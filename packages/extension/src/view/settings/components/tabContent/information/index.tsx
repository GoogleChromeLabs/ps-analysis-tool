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
import React, { useCallback, useEffect, useState, useRef } from 'react';
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

  const [clipboardText, setClipboardText] = useState('');
  const [copyDone, setCopyDone] = useState(false);

  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    //doing this instead of css because if text is too long then user might think the text has been copied and which might result in bad UX. Similar to github's copy button.
    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopyDone(true);
      timeOutRef.current = setTimeout(() => {
        setCopyDone(false);
      }, 500);
    });
  }, [clipboardText]);

  useEffect(() => {
    if (!copyDone && timeOutRef.current) {
      setCopyDone(false);
    }
  }, [copyDone]);

  useEffect(() => {
    setClipboardText(`
    Number of open tabs: ${currentTabs}
    Active extensions:
    ${currentExtensions?.map((extension) => {
      return `${extension.extensionName}: ${extension.extensionId}\n`;
    })}
    Browser Version: ${browserInformation}
    OS information: ${OSInformation}
    `);
  }, [OSInformation, browserInformation, currentExtensions, currentTabs]);

  return (
    <div className="relative w-full h-full flex flex-col gap-5 p-3 bg-dynamic-grey">
      <button
        disabled={copyDone}
        className="absolute right-0 top-0"
        onClick={handleCopy}
      >
        <Copy className={copyDone ? 'text-mischka' : ''} />
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
        <p className="font-semibold text-lg">Browser version:</p>
        <div>
          <InformationDisplay information={browserInformation ?? ''} />
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">OS</p>
        <div>
          <InformationDisplay information={OSInformation ?? ''} />
        </div>
      </div>
    </div>
  );
};

export default Information;
