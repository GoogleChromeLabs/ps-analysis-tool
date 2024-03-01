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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Copy } from '@ps-analysis-tool/design-system';
import classNames from 'classnames';
/**
 * Internal dependencies
 */
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import InformationIcon from '../../../../../../../../assets/icons/information-icon.svg';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import Done from '../../../../../../../../assets/icons/done.svg';

const InformationContainer = () => {
  const { currentTabs, currentExtensions, browserInformation, OSInformation } =
    useSettingsStore(({ state }) => ({
      currentTabs: state.currentTabs,
      currentExtensions: state.currentExtensions,
      browserInformation: state.browserInformation,
      OSInformation: state.OSInformation,
    }));

  const [copying, setCopying] = useState(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (copying) {
      timeOutRef.current = setTimeout(() => {
        setCopying(false);
      }, 200);
    } else {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    }
  }, [copying]);

  const handleCopy = useCallback(() => {
    setCopying(true);

    let clipboardText = `<strong>Open Tabs:</strong> ${currentTabs}<br/>`;

    clipboardText += `<strong>Active Extensions:</strong><br/>`;
    currentExtensions?.forEach((extension) => {
      clipboardText += `${extension.extensionName}: ${extension.extensionId}<br/>`;
    });
    clipboardText += `<strong>Chrome Version:</strong> ${browserInformation}<br/>`;
    clipboardText += `<strong>OS - System Architecture:</strong> ${OSInformation}`;

    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('div');
      copyFrom.style.textAlign = 'left';
      copyFrom.contentEditable = 'true';

      copyFrom.innerHTML = clipboardText;

      document.body.appendChild(copyFrom);

      const range = new Range();
      range.selectNodeContents(copyFrom);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);

      document.addEventListener('copy', (e) => {
        e.clipboardData?.setData('text/html', clipboardText);
        e.preventDefault();
      });
      document.execCommand('copy');
      document.removeEventListener('copy', (e) => {
        e.clipboardData?.setData('text/html', clipboardText);
        e.preventDefault();
      });

      copyFrom.blur();
      document.body.removeChild(copyFrom);
    } catch (error) {
      //Fail silently
    }
  }, [OSInformation, browserInformation, currentExtensions, currentTabs]);

  return (
    <div data-testid="debugging-information">
      <div>
        <button
          className="w-full flex gap-2 justify-between text-2xl font-bold items-baseline dark:text-bright-gray cursor-pointer"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <div className="flex items-center flex-row pl-3 mb-2 gap-x-3">
            <InformationIcon className="dark:text-bright-gray" />
            <span className="text-base font-bold dark:text-bright-gray">
              System Information
            </span>
          </div>
          <ArrowUp
            className={classNames('mr-4', open && 'rotate-180 -translate-y-1')}
          />
        </button>
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
            {copying ? (
              <Done className="active:text-mischka dark:text-bright-gray active:dark:text-mischka" />
            ) : (
              <Copy className="active:text-mischka dark:text-bright-gray active:dark:text-mischka" />
            )}
          </button>
          <div className="flex flex-row gap-x-2 justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-sm dark:text-bright-gray">Open Tabs</span>
              <span className="text-xs text-darkest-gray dark:text-bright-gray">
                {currentTabs}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm dark:text-bright-gray">
                Chrome version
              </span>
              <span className="text-xs text-darkest-gray dark:text-bright-gray">
                {browserInformation}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm dark:text-bright-gray">
                OS - System Architecture
              </span>
              <span className="text-xs text-darkest-gray dark:text-bright-gray">
                {OSInformation}
              </span>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="mt-1">
              <span className="text-sm dark:text-bright-gray">
                Active Extensions
              </span>
              <ul className="list-disc ml-4 mt-1">
                {currentExtensions?.map((extension, index) => {
                  return (
                    <li
                      className="text-xs text-darkest-gray dark:text-bright-gray mt-1"
                      key={index}
                    >
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
