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
import React, { useMemo, useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies
 */
import {
  CookieDetails,
  CookieTable,
  type InfoType,
  type TableColumn,
} from '@cookie-analysis-tool/design-system';
import type { CookieTableData } from '@cookie-analysis-tool/common';
import { useContentStore } from '../../stateProviders/contentStore';

interface AffectedCookiesProps {
  selectedFrameUrl: string | null;
}

const AffectedCookies = ({ selectedFrameUrl }: AffectedCookiesProps) => {
  const cookies = useContentStore(({ state }) => state.cookies || []);
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
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
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
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
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
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
      },
    ],
    []
  );

  const tabCookies1 = Object.fromEntries(
    cookies.map((cookie) => {
      return [
        cookie.name + cookie.domain + cookie.path,
        {
          parsedCookie: {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            expires: cookie.expires,
            httponly: cookie.httpOnly,
            secure: cookie.secure,
            samesite: cookie.sameSite,
          },
          analytics: {
            platform: cookie.platform,
            category:
              cookie.category === 'Unknown Category'
                ? 'Uncategorized'
                : cookie.category,
            description: cookie.description,
          },
          url: cookie.pageUrl,
          headerType: 'response',
          isFirstParty: cookie.isFirstParty,
          frameIdList: [],
          isCookieAccepted: !cookie.isBlocked,
        },
      ];
    })
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1 overflow-hidden h-full flex flex-col">
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
            tableColumns={tableColumns}
            data={Object.values(tabCookies1)}
            selectedFrame={selectedFrameUrl}
            selectedFrameCookie={selectedFrameCookie}
            setSelectedFrameCookie={setSelectedFrameCookie}
          />
        </Resizable>
        <CookieDetails selectedFrameCookie={selectedFrameCookie} />
      </div>
    </div>
  );
};

export default AffectedCookies;
