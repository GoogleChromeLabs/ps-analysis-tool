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
import type {
  AdsAndBiddersType,
  CookieTableData,
  InterestGroups,
  NoBidsType,
  singleAuctionEvent,
  ErroredOutUrlsData,
  SourcesData,
} from '@google-psat/common';

export type PrebidConfigTableData = {
  name: string;
  value: string | number | boolean;
  index: number;
};

export type PrebidPriceGranularityTableData = {
  bucket: string;
  precision: number;
  minimum: number;
  maximum: number;
  increment: number;
  index: number;
};

export type PrebidConsentManagementTableData = {
  platform: 'gdpr' | 'usp';
  api: 'iab' | 'static' | 'iabnonsupport' | 'none';
  timeout?: number;
  allowAuctionWithoutConsent?: boolean;
  defaultGdprScope?: boolean;
};

export type PrebidUserIdsTableData = {
  name: string;
  type?: 'cookie' | 'html5';
  expires?: number;
  storageName?: string;
};

export type UserEID = {
  userId: string;
  aType: number;
  source: string;
};

export type TableData = (
  | CookieTableData
  | InterestGroups
  | singleAuctionEvent
  | NoBidsType[keyof NoBidsType]
  | AdsAndBiddersType[keyof AdsAndBiddersType]
  | ErroredOutUrlsData
  | SourcesData
  | ClassificationResult
  | PrebidConfigTableData
  | PrebidPriceGranularityTableData
  | PrebidConsentManagementTableData
  | PrebidUserIdsTableData
  | UserEID
) & {
  highlighted?: boolean;
};

export interface ClassificationResult {
  domain: string;
  categories?: { id: number; name: string }[];
  error?: string;
}

export type InfoType = number | string | boolean | Array<string | number> | [];

export type TableColumn = {
  header: string;
  accessorKey: string;
  cell: (info: InfoType, details?: TableData) => React.JSX.Element | InfoType;
  enableHiding?: boolean;
  isHiddenByDefault?: boolean;
  enableBodyCellPrefixIcon?: boolean;
  bodyCellPrefixIcon?: {
    Element: (props: any) => React.JSX.Element;
  };
  showBodyCellPrefixIcon?: (row: TableRow) => boolean;
  sortingComparator?: (a: InfoType, b: InfoType) => number;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
};

export type TableRow = {
  [accessorKey: string]: {
    value: () => React.JSX.Element;
  };
  //@ts-ignore
  originalData: TableData;
};

export type TableFilter = {
  [accessorKey: string]: {
    title: string;
    description?: string;
    hasStaticFilterValues?: boolean;
    hasPrecalculatedFilterValues?: boolean;
    enableSelectAllOption?: boolean;
    isSelectAllOptionSelected?: boolean;
    filterValues?: {
      [filterValue: string]: {
        selected: boolean | null;
        description?: string;
      };
    };
    sortValues?: boolean; // for dynamic filters, values are sorted by default even if not specified.
    useGenericPersistenceKey?: boolean;
    calculateFilterValues?: (value: InfoType) => string;
    comparator?: (value: InfoType, filterValue: string) => boolean;
  };
};

export type PersistentStorageData = {
  columnsVisibility?: { [key: string]: boolean };
  columnsSizing?: { [key: string]: number };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectedFilters?: {
    [key: string]: TableFilter[keyof TableFilter]['filterValues'];
  };
  searchValue?: string;
};

export interface TableProviderProps {
  data: TableData[];
  tableColumns: TableColumn[];
  tableFilterData?: TableFilter;
  tableSearchKeys?: string[];
  tablePersistentSettingsKey?: string;
  onRowClick: (row: TableData | null) => void;
  onRowContextMenu: (
    e: React.MouseEvent<HTMLDivElement>,
    row: TableRow
  ) => void;
  getRowObjectKey: (row: TableRow) => string;
  conditionalTableRowClassesHandler?: (
    row: TableRow,
    isRowFocused: boolean,
    rowIndex: number
  ) => string;
  exportTableData?: (rows: TableRow[]) => void;
  hasVerticalBar?: (row: TableRow) => boolean;
  getVerticalBarColorHash?: (row: TableRow) => string;
  isRowSelected?: (cookie: TableData | null) => boolean;
  tableContainerRef?: React.RefObject<HTMLDivElement>;
  tableRef?: React.RefObject<HTMLTableElement>;
  minColumnWidth?: number;
}
