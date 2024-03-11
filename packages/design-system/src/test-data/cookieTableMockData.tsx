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
import React from 'react';
import { noop, type InfoType } from '@ps-analysis-tool/design-system';

export const originalData = [
  {
    parsedCookie: {
      name: 'guest_id',
      value: 'v1%3A169761712418716012',
      expires: '2024-11-21T08:18:44.337Z',
      path: '/',
      domain: '.twitter.com',
      httponly: true,
      secure: true,
      samesite: '',
    },
    analytics: {
      platform: 'Twitter',
      category: 'Marketing',
      name: 'guest_id',
      domain: '.twitter.com',
      description:
        'This cookie is set by Twitter to identify and track the website visitor. Registers if a users is signed in the Twitter platform and collects information about ad preferences.',
      retention: '',
      dataController: '',
      gdprUrl:
        'https://help.twitter.com/nl/safety-and-security#ads-and-data-privacy',
      wildcard: '',
    },
    url: 'https://psanalysis.rt.gw/post/123',
    headerType: 'javascript',
    isFirstParty: false,
    frameIdList: [0, 123],
    // @ts-ignore
    isCookieSet: false,
    frameUrls: 'https://psanalysis.rt.gw',
    highlighted: true,
  },
  {
    parsedCookie: {
      name: 'example_id',
      value: 'zyx123',
      expires: '2025-11-21T08:18:44.337Z',
      path: '/',
      domain: '.example.com',
      httponly: true,
      secure: true,
      samesite: '',
    },
    analytics: {
      platform: 'Example',
      category: 'Analytics',
      name: 'example_id',
      domain: '.example.com',
      description: 'This is an example cookie.',
      retention: '',
      dataController: '',
      gdprUrl: 'https://help.example.com/',
      wildcard: '',
    },
    url: 'https://example.com/post/123',
    headerType: 'javascript',
    isFirstParty: false,
    frameIdList: [0, 123],
    // @ts-ignore
    isCookieSet: false,
    frameUrls: 'https://example.com',
    highlighted: true,
  },
];

export const rows = [
  {
    // @ts-ignore
    'parsedCookie.name': {
      value: () => 'guest_id',
    },
    'parsedCookie.value': {
      value: () => 'v1%3A169761712418716012',
    },
    'parsedCookie.domain': {
      value: () => '.twitter.com',
    },
    'parsedCookie.path': {
      value: () => '/',
    },
    'parsedCookie.expires': {
      value: () => '2024-11-21T08:18:44.337Z',
    },
    'parsedCookie.httponly': {
      value: () => <span className="font-serif">✓</span>,
    },
    'parsedCookie.samesite': {
      value: () => <span className="capitalize"></span>,
    },
    'parsedCookie.secure': {
      value: () => (
        <p className="flex justify-center items-center">
          <span className="font-serif">✓</span>
        </p>
      ),
    },
    'analytics.category': {
      value: () => 'Marketing',
    },
    'analytics.platform': {
      value: () => 'Twitter',
    },
    isFirstParty: {
      value: () => 'Third Party',
    },
    originalData: originalData[0],
  },
  {
    // @ts-ignore
    'parsedCookie.name': {
      value: () => 'personalization_id',
    },
    'parsedCookie.value': {
      value: () => 'v1_HJmmucUuUZDLmLGgaw/32w==',
    },
    'parsedCookie.domain': {
      value: () => '.twitter.com',
    },
    'parsedCookie.path': {
      value: () => '/',
    },
    'parsedCookie.expires': {
      value: () => '2024-11-21T08:18:44.337Z',
    },
    'parsedCookie.httponly': {
      value: () => <span className="font-serif">✓</span>,
    },
    'parsedCookie.samesite': {
      value: () => <span className="capitalize"></span>,
    },
    'parsedCookie.secure': {
      value: () => (
        <p className="flex justify-center items-center">
          <span className="font-serif">✓</span>
        </p>
      ),
    },
    'analytics.category': {
      value: () => 'Marketing',
    },
    'analytics.platform': {
      value: () => 'Twitter',
    },
    isFirstParty: {
      value: () => 'Third Party',
    },
    originalData: originalData[1],
  },
];

const columns = [
  {
    header: 'Name',
    accessorKey: 'parsedCookie.name',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Value',
    accessorKey: 'parsedCookie.value',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Domain',
    accessorKey: 'parsedCookie.domain',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Path',
    accessorKey: 'parsedCookie.path',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Expires / Max-Age',
    accessorKey: 'parsedCookie.expires',
    cell: (info: InfoType) => (info ? info : 'Session'),
    enableHiding: true,
  },
  {
    header: 'HttpOnly',
    accessorKey: 'parsedCookie.httponly',
    cell: (info: InfoType) => (
      <p className="flex justify-center items-center">
        {info ? <span className="font-serif">✓</span> : ''}
      </p>
    ),
    enableHiding: true,
  },
  {
    header: 'SameSite',
    accessorKey: 'parsedCookie.samesite',
    cell: (info: InfoType) => <span className="capitalize">{info}</span>,
    enableHiding: true,
  },
  {
    header: 'Secure',
    accessorKey: 'parsedCookie.secure',
    cell: (info: InfoType) => (
      <p className="flex justify-center items-center">
        {info ? <span className="font-serif">✓</span> : ''}
      </p>
    ),
    enableHiding: true,
  },
  {
    header: 'Category',
    accessorKey: 'analytics.category',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Platform',
    accessorKey: 'analytics.platform',
    cell: (info: InfoType) => info,
    enableHiding: true,
  },
  {
    header: 'Scope',
    accessorKey: 'isFirstParty',
    cell: (info: InfoType) => (
      <p className="truncate w-full">{!info ? 'Third Party' : 'First Party'}</p>
    ),
    enableHiding: true,
  },
];

const table = {
  columns: columns,
  hideableColumns: columns,
  rows: rows,
  sortKey: '',
  sortOrder: '',
  setSortKey: noop,
  setSortOrder: noop,
  hideColumn: noop,
  toggleVisibility: noop,
  areAllColumnsVisible: true,
  showColumn: noop,
  isColumnHidden: noop,
  tableContainerRef: null,
  onMouseDown: noop,
  isResizing: false,
  filters: {},
  selectedFilters: {},
  isFiltering: false,
  toggleFilterSelection: noop,
  resetFilters: noop,
  searchValue: '',
  setSearchValue: noop,
};

export default table;
