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
import { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import { TableData } from '..';
import getValueByKey from '../../utils/getValueByKey';

export type TableSearchOutput = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchFilteredData: TableData[];
};

const useSearch = (
  data: TableData[],
  searchKeys?: string[],
  options?: string
) => {
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setSearchValue(options || '');
  }, [options]);

  const searchFilteredData = useMemo<TableData[]>(() => {
    if (!searchValue || !searchKeys) {
      return data;
    }

    return data.filter((row) => {
      return searchKeys.some((key) => {
        const value = getValueByKey(key, row);

        if (value.toLowerCase().includes(searchValue.toLowerCase())) {
          return true;
        }

        return false;
      });
    }, []);
  }, [data, searchKeys, searchValue]);

  return {
    searchValue,
    setSearchValue,
    searchFilteredData,
  };
};

export default useSearch;
