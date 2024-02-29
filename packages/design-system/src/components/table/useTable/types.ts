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
import { CookieTableData, TechnologyData } from '@ps-analysis-tool/common';

export type TableData = (CookieTableData | TechnologyData) & {
  highlighted?: boolean;
};

export type InfoType = number | string | boolean | string[] | [];

export type TableColumn = {
  header: string;
  accessorKey: string;
  cell: (info: InfoType, details?: TableData) => React.JSX.Element | InfoType;
  enableHiding?: boolean;
  enableBodyCellPrefixIcon?: boolean;
  bodyCellPrefixIcon?: (row: TableRow) => React.JSX.Element;
  showBodyCellPrefixIcon?: (row: TableRow) => boolean;
  widthWeightagePercentage?: number;
  width?: number; // For internal use only
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
    filterValues?: {
      [filterValue: string]: {
        selected: boolean;
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
}
