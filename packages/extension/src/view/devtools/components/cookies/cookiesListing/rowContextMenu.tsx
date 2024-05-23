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
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { noop, type CookieTableData } from '@ps-analysis-tool/common';
import type { TableRow } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies
 */
import reloadCurrentTab from '../../../../../utils/reloadCurrentTab';
import {
  setParentDomain,
  onAllowListClick,
  getDotPrefixedDomain,
  isCookieDomainInAllowList,
} from '../../../stateProviders/allowedList/utils';

interface RowContextMenuProps {
  domainsInAllowList: Set<string>;
  isIncognito: boolean;
  setDomainsInAllowListCallback: (list: Set<string>) => void;
  tabUrl: string;
  removeSelectedRow?: () => void;
}

const RowContextMenu = forwardRef<
  {
    onRowContextMenu: (e: React.MouseEvent<HTMLElement>, row: TableRow) => void;
  },
  RowContextMenuProps
>(function RowContextMenu(
  {
    domainsInAllowList,
    isIncognito,
    setDomainsInAllowListCallback,
    tabUrl,
    removeSelectedRow = noop,
  }: RowContextMenuProps,
  ref
) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [parentDomain, setParentDomainCallback] = useState<string>('');
  const [selectedCookie, setSelectedCookie] = useState<CookieTableData>();

  const [domain, dotPrefixedDomain, name] = useMemo(
    () => [
      selectedCookie?.parsedCookie?.domain || '',
      getDotPrefixedDomain(selectedCookie?.parsedCookie?.domain || ''),
      selectedCookie?.parsedCookie?.name,
    ],
    [selectedCookie]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, { originalData }: TableRow) => {
      e.preventDefault();
      const x = e.clientX,
        y = e.clientY;
      setColumnPosition({ x, y });
      document.body.style.overflow = contextMenuOpen ? 'auto' : 'hidden';
      setContextMenuOpen(!contextMenuOpen);
      setSelectedCookie(originalData as CookieTableData);
    },
    [contextMenuOpen]
  );

  useEffect(() => {
    (async () => {
      await setParentDomain(dotPrefixedDomain || '', setParentDomainCallback);
    })();
  }, [dotPrefixedDomain, setParentDomainCallback, contextMenuOpen]);

  useImperativeHandle(ref, () => ({
    onRowContextMenu(e, row) {
      handleRightClick(e, row);
    },
  }));

  const isDomainInAllowList = isCookieDomainInAllowList(
    dotPrefixedDomain,
    domainsInAllowList
  );

  const handleFilterClick = useCallback(() => {
    const filter = `cookie-domain:${domain} cookie-name:${name}`;

    // @ts-ignore
    if (chrome.devtools.panels?.network?.show) {
      // @ts-ignore
      chrome.devtools.panels.network.show({ filter });
      return;
    }

    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = filter;
      document.body.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand('copy');
      copyFrom.blur();
      document.body.removeChild(copyFrom);
      setContextMenuOpen(false);
    } catch (error) {
      //Fail silently
    }
  }, [domain, name]);

  const handleAllowListClick = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      removeSelectedRow();
      await onAllowListClick(
        dotPrefixedDomain,
        tabUrl || '',
        isIncognito,
        domainsInAllowList.has(dotPrefixedDomain),
        domainsInAllowList,
        setDomainsInAllowListCallback
      );
      setContextMenuOpen(false);
      await reloadCurrentTab(chrome.devtools.inspectedWindow.tabId);
    },
    [
      dotPrefixedDomain,
      domainsInAllowList,
      isIncognito,
      removeSelectedRow,
      setDomainsInAllowListCallback,
      tabUrl,
    ]
  );

  const handleAllowListWithParentDomainClick = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      removeSelectedRow();
      await onAllowListClick(
        parentDomain,
        tabUrl || '',
        isIncognito,
        domainsInAllowList.has(parentDomain),
        domainsInAllowList,
        setDomainsInAllowListCallback
      );
      setContextMenuOpen(false);
      await reloadCurrentTab(chrome.devtools.inspectedWindow.tabId);
    },
    [
      domainsInAllowList,
      isIncognito,
      parentDomain,
      removeSelectedRow,
      setDomainsInAllowListCallback,
      tabUrl,
    ]
  );

  return (
    <>
      {domain &&
        name &&
        contextMenuOpen &&
        createPortal(
          <div className="transition duration-100" data-testid="column-menu">
            <div
              className="absolute z-50 text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl p-1.5 mr-2 divide-neutral-300 dark:divide-neutral-500 max-h-[78vh] bg-stone-200 dark:bg-neutral-700 shadow-3xl"
              style={{
                left: 'min( calc( 100vw - 15rem),' + columnPosition.x + 'px )',
                top: columnPosition.y + 'px',
                border: '0.5px solid rgba(0, 0, 0, 0.20)',
              }}
            >
              <button
                onClick={handleFilterClick}
                className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
              >
                <span>
                  {
                    // @ts-ignore
                    chrome.devtools.panels?.network?.show
                      ? 'Show Requests With This Cookie'
                      : 'Copy Network Filter String'
                  }
                </span>
              </button>

              {isDomainInAllowList && parentDomain ? (
                <button
                  onClick={handleAllowListWithParentDomainClick}
                  className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                >
                  <span>Remove `{parentDomain}` From Allow List</span>
                </button>
              ) : (
                <button
                  onClick={handleAllowListClick}
                  className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                >
                  <span id="allow-list-option">
                    {isDomainInAllowList
                      ? 'Remove Domain from Allow List'
                      : 'Allow Domain During Session'}
                  </span>
                </button>
              )}
            </div>
            <div
              data-testid="column-menu-overlay"
              onClick={() => setContextMenuOpen(false)}
              className="absolute w-screen h-screen z-10 top-0 left-0"
            />
          </div>,
          document.body
        )}
    </>
  );
});

export default RowContextMenu;
