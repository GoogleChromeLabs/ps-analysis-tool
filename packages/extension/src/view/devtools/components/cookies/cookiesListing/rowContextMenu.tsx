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
import setParentDomain from './useAllowedList/setParentDomain';
import onAllowListClick from './useAllowedList/onAllowListClick';
import reloadCurrentTab from '../../../../../utils/reloadCurrentTab';
import getDotPrefixedDomain from './useAllowedList/getDotPrefixedDomain';

interface RowContextMenuProps {
  domainsInAllowList: Set<string>;
  isIncognito: boolean;
  setDomainsInAllowListCallback: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
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

  const [domain, name] = useMemo(
    () => [
      selectedCookie?.parsedCookie?.domain || '',
      selectedCookie?.parsedCookie?.name,
    ],
    [selectedCookie]
  );

  const _domain = useMemo(() => getDotPrefixedDomain(domain), [domain]);

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
      await setParentDomain(_domain || '', setParentDomainCallback);
    })();
  }, [_domain, setParentDomainCallback]);

  useImperativeHandle(ref, () => ({
    onRowContextMenu(e, row) {
      handleRightClick(e, row);
    },
  }));

  const isDomainInAllowList = useMemo(() => {
    let _isDomainInAllowList = domainsInAllowList.has(_domain);

    if (!_isDomainInAllowList) {
      _isDomainInAllowList = [...domainsInAllowList].some((storedDomain) => {
        // For example xyz.bbc.com and .bbc.com
        return _domain.endsWith(storedDomain) && _domain !== storedDomain;
      });
    }

    return _isDomainInAllowList;
  }, [_domain, domainsInAllowList]);

  const handleCopy = useCallback(() => {
    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = `cookie-domain:${domain} cookie-name:${name}`;
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
        _domain,
        tabUrl || '',
        isIncognito,
        domainsInAllowList.has(_domain),
        domainsInAllowList,
        setDomainsInAllowListCallback
      );
      setContextMenuOpen(false);
      await reloadCurrentTab();
    },
    [
      _domain,
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
      await reloadCurrentTab();
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
                onClick={handleCopy}
                className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
              >
                <span>Copy Network Filter String</span>
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
                      : 'Add Domain to Allow List'}
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
