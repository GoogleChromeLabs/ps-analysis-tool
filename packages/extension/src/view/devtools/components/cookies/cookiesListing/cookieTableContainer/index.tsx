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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCookieKey,
  type CookieTableData,
  type SortingState,
} from '@ps-analysis-tool/common';
import {
  type InfoType,
  type TableColumn,
  CookieTable,
  type TableData,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { usePreferenceStore } from '../../../../stateProviders/preferenceStore';
import EditableCheckBoxInput from './editableComponents/editableCheckBox';
import EditableTextInput from './editableComponents/editableTextInput';

export interface CookieTableContainerProps {
  cookies: CookieTableData[];
  selectedFrame: string | null;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
}

const CookieTableContainer = ({
  cookies,
  selectedFrame,
  selectedFrameCookie,
  setSelectedFrameCookie,
}: CookieTableContainerProps) => {
  const { updatePreference, columnSorting, columnSizing, selectedColumns } =
    usePreferenceStore(({ actions, state }) => ({
      updatePreference: actions.updatePreference,
      columnSorting: state?.columnSorting as SortingState[],
      columnSizing: state?.columnSizing as Record<string, number>,
      selectedColumns: state?.selectedColumns as Record<string, boolean>,
    }));

  const [tableData, setTableData] = useState<Record<string, CookieTableData>>(
    {}
  );

  const removeHighlights = useCallback(() => {
    setTableData(() =>
      cookies.reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;
        acc[key] = {
          ...cookie,
          highlighted: false,
        };

        return acc;
      }, {} as Record<string, CookieTableData>)
    );
  }, [cookies]);

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

  useEffect(() => {
    setTableData((prevData) =>
      cookies.reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;
        acc[key] = {
          ...cookie,
          highlighted: prevData?.[key]?.highlighted,
        };

        return acc;
      }, {} as Record<string, CookieTableData>)
    );
  }, [cookies]);

  const rowHighlighter = useCallback(
    (value: boolean, toChangeCookieKey: string) => {
      setTableData((prevData) => {
        const newData = { ...prevData };

        Object.keys(prevData).forEach((key) => {
          const cookieKey = getCookieKey(newData[key].parsedCookie);

          if (cookieKey === toChangeCookieKey) {
            newData[key].highlighted = value;
          }
        });

        return newData;
      });
    },
    []
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="name"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
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
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="domain"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="sameSite"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="value"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableCheckBoxInput
            info={info}
            keyToChange="httpOnly"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableCheckBoxInput
            info={info}
            keyToChange="secure"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType, rowData?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="path"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((rowData as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType, details?: TableData) => (
          <EditableTextInput
            info={info}
            keyToChange="expirationDate"
            rowHighlighter={rowHighlighter}
            cookieKey={getCookieKey((details as CookieTableData)?.parsedCookie)}
          />
        ),
      },
      {
        header: 'Cookie Accepted',
        accessorKey: 'isCookieSet',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? (
              <span className="font-serif">✓</span>
            ) : (
              <span className="font-serif">✗</span>
            )}
          </p>
        ),
      },
      {
        header: 'GDPR Portal',
        accessorKey: 'analytics.gdprUrl',
        cell: (info: InfoType) => (
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href={info as string}
            rel="noreferrer"
          >
            <abbr title={info as string}>{info}</abbr>
          </a>
        ),
      },
    ],
    [rowHighlighter]
  );

  return (
    <CookieTable
      tableColumns={tableColumns}
      data={Object.values(tableData)}
      selectedFrame={selectedFrame}
      selectedFrameCookie={selectedFrameCookie}
      setSelectedFrameCookie={setSelectedFrameCookie}
      columnSorting={columnSorting}
      columnSizing={columnSizing}
      selectedColumns={selectedColumns}
      updatePreference={updatePreference}
    />
  );
};

export default CookieTableContainer;
