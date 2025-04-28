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
import { ArrowUp, Copy } from '@google-psat/design-system';
import classNames from 'classnames';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import { useSettings } from '../../../stateProviders';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import InformationIcon from '../../../../../../../../assets/icons/information-icon.svg';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import Done from '../../../../../../../../assets/icons/done.svg';

const InformationContainer = () => {
  const {
    currentTabs,
    currentExtensions,
    browserInformation,
    OSInformation,
    PSATVersion,
  } = useSettings(({ state }) => ({
    currentTabs: state.currentTabs,
    currentExtensions: state.currentExtensions,
    browserInformation: state.browserInformation,
    OSInformation: state.OSInformation,
    PSATVersion: state.PSATVersion,
  }));

  const [copying, setCopying] = useState(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (copying) {
      timeOutRef.current = setTimeout(() => {
        setCopying(false);
      }, 500);
    } else {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    }
  }, [copying]);

  const handleCopy = useCallback(() => {
    setCopying(true);

    let clipboardText = `**Open Tabs:** ${currentTabs}\n`;

    clipboardText += `**Active Extensions:**\n`;
    currentExtensions?.forEach((extension) => {
      clipboardText += `${extension.extensionName}: ${extension.extensionId}\n`;
    });
    clipboardText += `**Chrome Version:** ${browserInformation}\n`;
    clipboardText += `**PSAT Version:** ${PSATVersion}\n`;
    clipboardText += `**OS - System Architecture:** ${OSInformation}`;

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
        e.clipboardData?.setData('text/plain', clipboardText);
        e.preventDefault();
      });
      document.execCommand('copy');
      document.removeEventListener('copy', (e) => {
        e.clipboardData?.setData('text/plain', clipboardText);
        e.preventDefault();
      });

      copyFrom.blur();
      document.body.removeChild(copyFrom);
    } catch (error) {
      //Fail silently
    }
  }, [
    OSInformation,
    PSATVersion,
    browserInformation,
    currentExtensions,
    currentTabs,
  ]);

  const sysInfo = [
    {
      label: I18n.getMessage('openTabs'),
      value: currentTabs,
    },
    {
      label: I18n.getMessage('chromeVersion'),
      value: browserInformation,
    },
    {
      label: I18n.getMessage('pSATVersion'),
      value: PSATVersion,
    },
    {
      label: I18n.getMessage('systemArchitecture'),
      value: OSInformation,
    },
  ];

  return (
    <div data-testid="debugging-information">
      <div>
        <button
          className="w-full flex gap-2 justify-between text-2xl font-bold items-baseline dark:text-bright-gray cursor-pointer"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <div className="flex items-center flex-row mb-2 gap-x-2">
            <InformationIcon className="dark:text-bright-gray" />
            <span className="text-base font-bold dark:text-bright-gray">
              {I18n.getMessage('systemInformation')}
            </span>
          </div>
          <ArrowUp
            className={classNames('mr-4', open && 'rotate-180 -translate-y-1')}
          />
        </button>
        <div
          className={classNames(
            { hidden: !open },
            'relative rounded flex flex-col w-full px-4 py-4 border border-american-silver dark:border-quartz gap-y-3'
          )}
        >
          <div className="flex flex-row gap-x-2 justify-between items-start">
            {sysInfo.map((info) => (
              <div className="flex flex-col" key={info.label}>
                <span className="text-sm dark:text-bright-gray">
                  {info.label}
                </span>
                <span className="text-xs text-darkest-gray dark:text-bright-gray">
                  {info.value}
                </span>
              </div>
            ))}
            <button
              data-testid="copy-button"
              disabled={copying}
              onClick={handleCopy}
              className="-ml-8 -mt-1"
            >
              {copying ? (
                <Done className="active:text-mischka dark:text-bright-gray active:dark:text-mischka" />
              ) : (
                <Copy className="active:text-mischka dark:text-bright-gray active:dark:text-mischka" />
              )}
            </button>
          </div>
          <div className="flex flex-row">
            <div className="mt-1">
              <span className="text-sm dark:text-bright-gray">
                {I18n.getMessage('activeExtensions')}
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
