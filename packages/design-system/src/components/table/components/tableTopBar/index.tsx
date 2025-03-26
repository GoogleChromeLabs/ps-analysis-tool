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
import React from 'react';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import ExportButton from '../../../exportButton';
import { TableRow } from '../../useTable';
import TopBar from '../../../topbar';

interface TableTopBarProps {
  rows: TableRow[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  exportTableData?: (rows: TableRow[]) => void;
  showFilterSidebar: boolean;
  setShowFilterSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  hideFiltering?: boolean;
  disableFiltering?: boolean;
  extraInterface?: () => React.JSX.Element;
  hideSearch?: boolean;
}

const TableTopBar = ({
  rows,
  searchValue,
  setSearchValue,
  exportTableData,
  showFilterSidebar,
  setShowFilterSidebar,
  hideFiltering = false,
  disableFiltering = false,
  extraInterface,
  hideSearch = false,
}: TableTopBarProps) => {
  return (
    <TopBar
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      showFilterSidebar={showFilterSidebar}
      setShowFilterSidebar={setShowFilterSidebar}
      hideFiltering={hideFiltering}
      disableFiltering={disableFiltering}
      hideSearch={hideSearch}
      count={rows.length}
    >
      {extraInterface?.()}
      {exportTableData && (
        <ExportButton
          title={I18n.getMessage('exportTableData')}
          disabled={rows.length === 0}
          onClick={() => exportTableData(rows)}
        />
      )}
    </TopBar>
  );
};

export default TableTopBar;
