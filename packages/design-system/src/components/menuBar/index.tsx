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
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { isElementInView } from './utils';
import { Export } from '../../icons';

export type MenuData = Array<{
  name: string;
  link: string;
}>;

interface MenuBarProps {
  disableReportDownload?: boolean;
  downloadReport?: () => Promise<void>;
  menuData: MenuData;
  extraClasses?: string;
  scrollContainerId: string;
}

const MenuBar = ({
  disableReportDownload = true,
  downloadReport,
  menuData,
  extraClasses,
  scrollContainerId,
}: MenuBarProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(menuData[0].link);
  const updateFromScrollRef = useRef<boolean>(false);
  const [isListenerDisabled, setIsListenerDisabled] = useState<boolean>(false);
  const [downloadingReport, setDownloadingReport] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!updateFromScrollRef.current) {
      const element = globalThis?.document?.getElementById(selectedItem);
      if (element) {
        element.scrollIntoView?.({ behavior: 'smooth' });
        timeout = setTimeout(() => {
          setIsListenerDisabled(false);
        }, 1000);
      }
    } else {
      updateFromScrollRef.current = false;
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedItem]);

  useEffect(() => {
    const scrollContainer =
      globalThis?.document.getElementById(scrollContainerId);

    const handleScroll = () => {
      const firstItemLink = menuData[0].link;
      const lastItemLink = menuData[menuData.length - 1].link;

      if (isListenerDisabled || !scrollContainer) {
        return;
      }

      menuData.forEach(({ link: id }) => {
        const section = globalThis?.document.getElementById(id);
        const isAlmostBottom =
          scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight;

        setSelectedItem((prev) => {
          updateFromScrollRef.current = true;

          if (scrollContainer?.scrollTop === 0) {
            return firstItemLink;
          } else if (isAlmostBottom <= 1 && isAlmostBottom >= 0) {
            return lastItemLink;
          } else if (section && isElementInView(section)) {
            return id;
          }

          return prev;
        });
      });
    };

    const handleScrollEnd = () => {
      updateFromScrollRef.current = false;
    };

    scrollContainer?.addEventListener('scroll', handleScroll);
    scrollContainer?.addEventListener('scrollend', handleScrollEnd);
    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
      scrollContainer?.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [menuData, isListenerDisabled, scrollContainerId]);

  return (
    <nav
      data-testid="menu-bar"
      className={classnames(
        'fixed right-0 flex flex-col gap-4 justify-center items-center z-10 w-10 p-2 bg-dynamic-grey dark:bg-charleston-green rounded-l-lg border border-bright-gray dark:border-quartz',
        extraClasses ? extraClasses : 'top-6'
      )}
    >
      {downloadReport && (
        <div className="relative">
          <button
            disabled={disableReportDownload || downloadingReport}
            className={classnames(
              'flex items-center relative justify-center w-6 h-6 rounded-full cursor-pointer transition-all ease-in-out group disabled:cursor-not-allowed disabled:opacity-50',
              {
                'bg-baby-blue-eyes': disableReportDownload,
                'bg-ultramarine-blue': !disableReportDownload,
              }
            )}
            onClick={async () => {
              setDownloadingReport(true);
              await downloadReport();
              setDownloadingReport(false);
            }}
          >
            {downloadingReport ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full animate-spin border-t-transparent border-solid border-white border-2" />
              </div>
            ) : (
              <>
                <div className="absolute flex items-center justify-center right-6 w-max px-3 py-1 rounded invisible text-sm text-white bg-ultramarine-blue group-hover:visible transition-all ease-in-out">
                  {disableReportDownload
                    ? I18n.getMessage('waitForLD')
                    : I18n.getMessage('downloadReport')}
                  <div className="absolute w-2 h-2 bg-ultramarine-blue top-1/3 -right-1 transform rotate-45" />
                </div>
                <Export className="text-white" />
              </>
            )}
          </button>
          <div className="absolute top-7 -left-2 border-b border-bright-gray dark:border-quartz w-9" />
        </div>
      )}

      {menuData.map((item, index) => (
        <div
          key={index}
          className={classnames(
            'relative w-3 h-3 rounded-full cursor-pointer hover:bg-baby-blue-eyes transition-all ease-in-out group',
            selectedItem === item.link
              ? 'bg-ultramarine-blue'
              : 'bg-bright-gray'
          )}
          onClick={() => {
            if (item.link !== selectedItem) {
              setIsListenerDisabled(true);
              setSelectedItem(item.link);
            }
          }}
        >
          <div className="absolute -top-1/2 right-6 w-max px-3 py-1 rounded invisible text-sm text-white bg-ultramarine-blue group-hover:visible transition-all ease-in-out">
            {item.name}
            <div className="absolute w-2 h-2 bg-ultramarine-blue top-1/3 -right-1 transform rotate-45" />
          </div>
        </div>
      ))}
    </nav>
  );
};

export default MenuBar;
