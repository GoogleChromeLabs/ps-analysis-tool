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

import { useCallback, useEffect } from 'react';
import { PersistentStorageData, TableData, TableFilter } from '../../types';
import { getValueByKey } from '@google-psat/common';

/**
 * External dependencies.
 */

const useFiltersExtraction = (
  data: TableData[],
  tableFilterData: TableFilter | undefined,
  options: React.MutableRefObject<PersistentStorageData['selectedFilters']>,
  selectAllFilterSelection: {
    [filterKey: string]: { selected: boolean | null };
  },
  setFilters: React.Dispatch<React.SetStateAction<TableFilter>>,
  setSelectAllFilterSelection: React.Dispatch<
    React.SetStateAction<{ [filterKey: string]: { selected: boolean | null } }>
  >
) => {
  const handleStaticFilters = useCallback(
    (filter: TableFilter[keyof TableFilter], filterKey: string) => {
      const filterValues = { ...(filter.filterValues || {}) };

      const updatedFilterValues = Object.fromEntries(
        Object.keys(filterValues).map((filterValue) => {
          const _filterValue = filterValue.trim();
          return [
            _filterValue,
            {
              ...filterValues[_filterValue],
              selected:
                options.current?.[filterKey]?.[_filterValue]?.selected || null,
            },
          ];
        })
      );

      return [filterKey, { ...filter, filterValues: updatedFilterValues }];
    },
    [options]
  );

  const calculateDynamicFilterValues = useCallback(
    (filterKey: string, filter: TableFilter[keyof TableFilter]) => {
      const filterValues = { ...(filter.filterValues || {}) };

      const mappedValues = data
        .map((row) => {
          let value = getValueByKey(filterKey, row);

          if (filter.calculateFilterValues) {
            value = filter.calculateFilterValues(value);
          }

          return value;
        })
        .filter((value) => value && value.toString().trim());

      const newFilterValues = mappedValues.reduce((acc, value) => {
        const val = value.toString().trim();

        // if selectAll is selected, then select all filter values
        if (val && !acc[val]) {
          const isSelectAllFilterSelected =
            selectAllFilterSelection?.[filterKey]?.selected;

          if (filterValues[val]) {
            acc[val] = {
              ...filterValues[val],
              selected:
                isSelectAllFilterSelected ||
                filterValues[val].selected ||
                options.current?.[filterKey]?.[val]?.selected ||
                null,
            };
          } else {
            acc[val] = {
              selected:
                isSelectAllFilterSelected ||
                options.current?.[filterKey]?.[val]?.selected ||
                null,
            };
          }
        }

        return acc;
      }, {});

      return newFilterValues;
    },
    [data, options, selectAllFilterSelection]
  );

  // extract filters from data
  useEffect(() => {
    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          if (filter.hasStaticFilterValues) {
            return handleStaticFilters(filter, filterKey);
          }

          const filterValues = calculateDynamicFilterValues(
            filterKey,
            filter as TableFilter[keyof TableFilter]
          );

          return [filterKey, { ...filter, filterValues }];
        })
      )
    );
  }, [calculateDynamicFilterValues, handleStaticFilters, setFilters]);

  const extractPrecalculatedFilterKeys = useCallback(() => {
    return Object.fromEntries(
      Object.entries(tableFilterData || {})
        .filter(([, filter]) => filter.hasPrecalculatedFilterValues)
        .map(([key, filter]) => {
          return [key, filter.filterValues];
        })
    );
  }, [tableFilterData]);

  // extract filters from precalculated filter values
  useEffect(() => {
    const filtersByKey = extractPrecalculatedFilterKeys();

    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      Object.entries(newFilters).forEach(([key, filter]) => {
        if (!filtersByKey[key]) {
          return;
        }

        const filterValues: TableFilter[keyof TableFilter]['filterValues'] = {};

        Object.entries(filtersByKey[key] || {}).forEach(
          ([filterValue, filterValueData]) => {
            const _filterValue = filterValue.trim();
            const isSelectAllFilterSelected =
              selectAllFilterSelection?.[key]?.selected;

            if (!filter.filterValues) {
              filter.filterValues = {};
            }

            if (!filter.filterValues?.[_filterValue]) {
              filterValues[_filterValue] = {
                ...filterValueData,
                selected:
                  isSelectAllFilterSelected ||
                  filterValueData.selected ||
                  options.current?.[key]?.[_filterValue]?.selected ||
                  null,
              };
            } else {
              filterValues[_filterValue] = {
                ...filterValueData,
                selected:
                  isSelectAllFilterSelected ||
                  filter.filterValues[_filterValue].selected ||
                  filterValueData.selected ||
                  options.current?.[key]?.[_filterValue]?.selected ||
                  null,
              };
            }
          }
        );

        filter.filterValues = filterValues;
      });

      return newFilters;
    });
  }, [
    extractPrecalculatedFilterKeys,
    options,
    selectAllFilterSelection,
    setFilters,
  ]);

  // extract filterKeys with selectAllFilter enabled
  useEffect(() => {
    const filtersWithSelectAllFilterEnabled = Object.entries(
      tableFilterData || {}
    )
      .filter(([, filter]) => filter.enableSelectAllOption)
      .reduce<Record<string, { selected: boolean | null }>>(
        (acc, [filterKey, filterValueData]) => {
          acc[filterKey] = {
            selected:
              filterValueData.isSelectAllOptionSelected ||
              options.current?.[filterKey]?.All?.selected ||
              null,
          };

          return acc;
        },
        {}
      );

    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.entries(filtersWithSelectAllFilterEnabled).forEach(
        ([filterKey, filterValueData]) => {
          if (!newSelectAllFilterSelection[filterKey]) {
            newSelectAllFilterSelection[filterKey] = {
              selected:
                newSelectAllFilterSelection[filterKey]?.selected ||
                filterValueData.selected ||
                null,
            };
          }
        }
      );

      return newSelectAllFilterSelection;
    });
  }, [options, setSelectAllFilterSelection, tableFilterData]);
};

export default useFiltersExtraction;
