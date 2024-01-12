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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Resizable } from 're-resizable';
import {
  filterCookiesByFrame,
  type CookieTableData,
  getCookieKey,
} from '@ps-analysis-tool/common';
import {
  CookieDetails,
  CookieTable,
  RefreshButton,
  type InfoType,
  type TableColumn,
  type TableFilter,
  type TableRow,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import { BLOCKED_REASON_LIST } from '../../../../../constants';
import { getCurrentTab } from '../../../../../utils/getCurrentTabId';
import setDomainsInAllowList from './handleAllowList/setDomainsInAllowList';
import { createPortal } from 'react-dom';
import onAllowListClick from './handleAllowList/onAllowListClick';
import setParentDomain from './handleAllowList/setParentDomain';

interface CookiesListingProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

const CookiesListing = ({ setFilteredCookies }: CookiesListingProps) => {
  const {
    selectedFrame,
    cookies,
    tabFrames,
    tabUrl,
    getCookiesSetByJavascript,
  } = useCookieStore(({ state, actions }) => ({
    selectedFrame: state.selectedFrame,
    cookies: state.tabCookies || {},
    tabFrames: state.tabFrames,
    tabUrl: state.tabUrl,
    getCookiesSetByJavascript: actions.getCookiesSetByJavascript,
  }));

  const isIncognito = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      const tabs = await getCurrentTab();

      if (tabs?.length) {
        isIncognito.current = tabs[0].incognito;
      }
    })();
  }, [tabUrl]);

  const [tableData, setTableData] = useState<Record<string, CookieTableData>>(
    {}
  );

  const [domainsInAllowList, setDomainsInAllowListCallback] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    setTableData((prevData) =>
      Object.values(cookies).reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;

        if (cookie.parsedCookie?.domain) {
          setDomainsInAllowList(
            tabUrl || '',
            isIncognito.current,
            cookie.parsedCookie.domain,
            domainsInAllowList,
            setDomainsInAllowListCallback
          );
        }

        acc[key] = {
          ...cookie,
          highlighted: prevData?.[key]?.highlighted,
          isDomainInAllowList: domainsInAllowList.has(
            cookie.parsedCookie?.domain || ''
          ),
        };

        return acc;
      }, {} as Record<string, CookieTableData>)
    );
  }, [cookies, domainsInAllowList, tabUrl]);

  const [parentDomain, setParentDomainCallback] = useState<{
    value: string;
    exist: boolean;
  }>({
    exist: false,
    value: '',
  });

  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedCookie, setSelectedCookie] = useState<CookieTableData | null>(
    null
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
      setParentDomain(
        (originalData as CookieTableData).parsedCookie.domain || '',
        setParentDomainCallback
      );
    },
    [contextMenuOpen]
  );

  const [domain, name] = useMemo(
    () => [
      selectedCookie?.parsedCookie?.domain || '',
      selectedCookie?.parsedCookie?.name,
    ],
    [selectedCookie]
  );

  const isDomainInAllowList = useMemo(
    () => domainsInAllowList.has(domain || ''),
    [domain, domainsInAllowList]
  );

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

  const cookieTableRef = useRef<React.ElementRef<typeof CookieTable> | null>(
    null
  );

  const handleAllowListClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      cookieTableRef.current?.removeSelectedRow();
      onAllowListClick(
        domain,
        tabUrl || '',
        isIncognito.current,
        domainsInAllowList.has(domain),
        domainsInAllowList,
        setDomainsInAllowListCallback
      );
      setContextMenuOpen(false);
    },
    [domain, domainsInAllowList, tabUrl]
  );

  const handleAllowListWithParentDomainClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      cookieTableRef.current?.removeSelectedRow();
      onAllowListClick(
        parentDomain.value,
        tabUrl || '',
        isIncognito.current,
        domainsInAllowList.has(parentDomain.value),
        domainsInAllowList,
        setDomainsInAllowListCallback
      );
      setContextMenuOpen(false);
    },
    [domainsInAllowList, parentDomain.value, tabUrl]
  );

  const removeHighlights = useCallback(() => {
    setTableData((prev) =>
      Object.values(prev).reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;
        acc[key] = {
          ...cookie,
          highlighted: false,
        };

        return acc;
      }, {} as Record<string, CookieTableData>)
    );
  }, []);

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(removeHighlights);
    return () => {
      try {
        chrome.storage.session.onChanged.removeListener(removeHighlights);
      } catch (error) {
        /* do nothing */
      }
    };
  }, [removeHighlights]);

  const frameFilteredCookies = useMemo(
    () => filterCookiesByFrame(tableData, tabFrames, selectedFrame),
    [tableData, selectedFrame, tabFrames]
  );

  useEffect(() => {
    setFilteredCookies(frameFilteredCookies);
  }, [frameFilteredCookies, setFilteredCookies]);

  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Partition Key',
        accessorKey: 'parsedCookie.partitionKey',
        cell: (info: InfoType) => info,
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => <span>{info ? info : 'Unknown'}</span>,
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
      },
      {
        header: 'Priority',
        accessorKey: 'parsedCookie.priority',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Size',
        accessorKey: 'parsedCookie.size',
        cell: (info: InfoType) => info,
      },
    ],
    []
  );

  const blockedReasonFilterValues = useMemo<{
    [key: string]: { selected: boolean };
  }>(() => {
    const filterValues: { [key: string]: { selected: boolean } } = {};
    BLOCKED_REASON_LIST.forEach((reason) => {
      filterValues[reason] = { selected: false };
    });
    return filterValues;
  }, []);

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: 'Category',
      },
      isFirstParty: {
        title: 'Scope',
        hasStaticFilterValues: true,
        filterValues: {
          'First Party': {
            selected: false,
          },
          'Third Party': {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'First Party');
        },
      },
      'parsedCookie.domain': {
        title: 'Domain',
      },
      'parsedCookie.httponly': {
        title: 'HttpOnly',
        hasStaticFilterValues: true,
        filterValues: {
          True: {
            selected: false,
          },
          False: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'True');
        },
      },
      'parsedCookie.samesite': {
        title: 'SameSite',
        hasStaticFilterValues: true,
        filterValues: {
          None: {
            selected: false,
          },
          Lax: {
            selected: false,
          },
          Strict: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val?.toLowerCase() === filterValue.toLowerCase();
        },
      },
      'parsedCookie.secure': {
        title: 'Secure',
        hasStaticFilterValues: true,
        filterValues: {
          True: {
            selected: false,
          },
          False: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as boolean;
          return val === (filterValue === 'True');
        },
      },
      'parsedCookie.path': {
        title: 'Path',
      },
      'parsedCookie.expires': {
        title: 'Retention Period',
        hasStaticFilterValues: true,
        filterValues: {
          Session: {
            selected: false,
          },
          'Short Term (< 24h)': {
            selected: false,
          },
          'Medium Term (24h - 1 week)': {
            selected: false,
          },
          'Long Term (1 week - 1 month)': {
            selected: false,
          },
          'Extended Term (> 1 month)': {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          let diff = 0;
          const val = value as string;
          switch (filterValue) {
            case 'Session':
              return val === 'Session';

            case 'Short Term (< 24h)':
              diff = Date.parse(val) - Date.now();
              return diff < 86400000;

            case 'Medium Term (24h - 1 week)':
              diff = Date.parse(val) - Date.now();
              return diff >= 86400000 && diff < 604800000;

            case 'Long Term (1 week - 1 month)':
              diff = Date.parse(val) - Date.now();
              return diff >= 604800000 && diff < 2629743833;

            case 'Extended Term (> 1 month)':
              diff = Date.parse(val) - Date.now();
              return diff >= 2629743833;

            default:
              return false;
          }
        },
      },
      'analytics.platform': {
        title: 'Platform',
      },
      blockedReasons: {
        title: 'Cookie Blocked Reasons',
        description: 'Reason why the cookies were blocked.',
        hasStaticFilterValues: true,
        filterValues: blockedReasonFilterValues,
        comparator: (value: InfoType, filterValue: string) => {
          return (value as string[])?.includes(filterValue);
        },
      },
      headerType: {
        title: 'Set Via',
        hasStaticFilterValues: true,
        filterValues: {
          HTTP: {
            selected: false,
          },
          JS: {
            selected: false,
          },
        },
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'JS':
              return value === 'javascript';
            case 'HTTP':
              return value === 'request' || value === 'response';
            default:
              return true;
          }
        },
      },
      'parsedCookie.priority': {
        title: 'Priority',
        hasStaticFilterValues: true,
        filterValues: {
          Low: {
            selected: false,
          },
          Medium: {
            selected: false,
          },
          High: {
            selected: false,
          },
        },
      },
    }),
    [blockedReasonFilterValues]
  );

  const searchKeys = useMemo<string[]>(
    () => ['parsedCookie.name', 'parsedCookie.domain'],
    []
  );

  const tablePersistentSettingsKey = useMemo(() => {
    if (!selectedFrame) {
      return 'cookieListing';
    }

    return `cookieListing#${selectedFrame}`;
  }, [selectedFrame]);

  const extraInterfaceToTopBar = useMemo(
    () => <RefreshButton onClick={getCookiesSetByJavascript} />,
    [getCookiesSetByJavascript]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="6%"
        maxHeight="95%"
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
        }}
        className="h-full flex"
      >
        <CookieTable
          data={frameFilteredCookies}
          tableColumns={tableColumns}
          showTopBar={true}
          tableFilters={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          selectedFrame={selectedFrame}
          selectedFrameCookie={selectedFrameCookie}
          setSelectedFrameCookie={setSelectedFrameCookie}
          extraInterfaceToTopBar={extraInterfaceToTopBar}
          onRowContextMenu={handleRightClick}
          ref={cookieTableRef}
        />
      </Resizable>
      <CookieDetails selectedFrameCookie={selectedFrameCookie} />
      <>
        {domain &&
          name &&
          contextMenuOpen &&
          createPortal(
            <div className="transition duration-100" data-testid="column-menu">
              <div
                className="absolute z-50 text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl p-1.5 mr-2 divide-neutral-300 dark:divide-neutral-500 max-h-[78vh] bg-stone-200 dark:bg-neutral-700 shadow-3xl"
                style={{
                  left:
                    'min( calc( 100vw - 15rem),' + columnPosition.x + 'px )',
                  top: columnPosition.y + 'px',
                  border: '0.5px solid rgba(0, 0, 0, 0.20)',
                }}
              >
                <button
                  onClick={handleCopy}
                  className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                >
                  <span>Copy network filter string</span>
                </button>

                {isDomainInAllowList && parentDomain.exist ? (
                  <button
                    onClick={handleAllowListWithParentDomainClick}
                    className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                  >
                    <span>Remove `{parentDomain.value}` from allow list</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAllowListClick}
                    className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                  >
                    <span id="allow-list-option">
                      {isDomainInAllowList
                        ? 'Remove domain from allow list'
                        : 'Add domain to allow list'}
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
    </div>
  );
};

export default CookiesListing;
