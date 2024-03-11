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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getValueByKey } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { TableData, TableFilter } from '../types';
import useFiltersPersistence from './useFiltersPersistence';

export type TableFilteringOutput = {
  filters: TableFilter;
  selectedFilters: TableFilter;
  filteredData: TableData[];
  isFiltering: boolean;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean
  ) => void;
  toggleSelectAllFilter: (
    filterKey: string,
    isSingleFilterRemovalAction?: boolean
  ) => void;
  isSelectAllFilterSelected: (filterKey: string) => boolean;
  resetFilters: () => void;
};

const useFiltering = (
  data: TableData[],
  tableFilterData: TableFilter | undefined,
  specificTablePersistentSettingsKey?: string,
  genericTablePersistentSettingsKey?: string
): TableFilteringOutput => {
  const [filters, setFilters] = useState<TableFilter>({
    ...(tableFilterData || {}),
  });
  const [selectAllFilterSelection, setSelectAllFilterSelection] = useState<{
    [accessorKey: string]: { selected: boolean };
  }>({});
  const [options, setOptions] = useState<{
    [filterKey: string]: TableFilter[keyof TableFilter]['filterValues'];
  }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(true);
  }, [specificTablePersistentSettingsKey]);

  useEffect(() => {
    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          let filterValues = { ...(filter.filterValues || {}) };

          if (filter.hasStaticFilterValues) {
            return [filterKey, { ...filter, filterValues }];
          }

          filterValues = data
            .map((row) => {
              let value = getValueByKey(filterKey, row);

              if (filter.calculateFilterValues) {
                value = filter.calculateFilterValues(value);
              }

              return value;
            })
            .filter((value) => value && value.toString().trim())
            .reduce((acc, value) => {
              const val = value.toString().trim();

              // if selectAll is selected, then select all filter values
              if (val && !acc[val]) {
                const isSelectAllFilterSelected =
                  selectAllFilterSelection?.[filterKey]?.selected;

                if (filterValues[val]) {
                  acc[val] = {
                    ...filterValues[val],
                    selected:
                      isSelectAllFilterSelected || filterValues[val].selected,
                  };
                } else {
                  acc[val] = {
                    selected: isSelectAllFilterSelected || false,
                  };
                }
              }

              return acc;
            }, {});

          return [filterKey, { ...filter, filterValues }];
        })
      )
    );
  }, [data, selectAllFilterSelection]);

  useEffect(() => {
    const filtersByKey = Object.fromEntries(
      Object.entries(tableFilterData || {})
        .filter(([, filter]) => filter.hasPrecalculatedFilterValues)
        .map(([key, filter]) => {
          return [key, filter.filterValues];
        })
    );

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
                selected: isSelectAllFilterSelected || false,
              };
            } else {
              filterValues[_filterValue] = {
                ...filterValueData,
                selected:
                  isSelectAllFilterSelected ||
                  filter.filterValues[_filterValue].selected,
              };
            }
          }
        );

        filter.filterValues = filterValues;
      });

      return newFilters;
    });
  }, [selectAllFilterSelection, tableFilterData]);

  useEffect(() => {
    const filtersWithSelectAllFilterEnabled = Object.entries(
      tableFilterData || {}
    )
      .filter(([, filter]) => filter.enableSelectAllOption)
      .reduce<Record<string, { selected: boolean }>>((acc, [filterKey]) => {
        acc[filterKey] = {
          selected: false,
        };

        return acc;
      }, {});

    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.entries(filtersWithSelectAllFilterEnabled).forEach(
        ([filterKey, filterValueData]) => {
          if (!newSelectAllFilterSelection[filterKey]) {
            newSelectAllFilterSelection[filterKey] = filterValueData;
          }
        }
      );

      return newSelectAllFilterSelection;
    });
  }, [tableFilterData]);

  const isSelectAllFilterSelected = useCallback(
    (filterKey: string) => {
      return selectAllFilterSelection?.[filterKey]?.selected;
    },
    [selectAllFilterSelection]
  );

  const toggleSelectAllFilter = useCallback(
    (filterKey: string, isSingleFilterRemovalAction?: boolean) => {
      let valueToSet = false;
      setSelectAllFilterSelection((prev) => {
        const newSelectAllFilterSelection = { ...prev };

        newSelectAllFilterSelection[filterKey] = {
          selected: !newSelectAllFilterSelection[filterKey].selected,
        };

        valueToSet = newSelectAllFilterSelection[filterKey].selected;

        return newSelectAllFilterSelection;
      });

      if (isSingleFilterRemovalAction) {
        return;
      }

      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const filterValues = newFilters[filterKey].filterValues || {};

        Object.entries(filterValues).forEach(([filterValue]) => {
          filterValues[filterValue].selected = valueToSet;
        });

        return newFilters;
      });
    },
    []
  );

  const toggleFilterSelection = useCallback(
    (filterKey: string, filterValue: string, isRemovalAction?: boolean) => {
      if (selectAllFilterSelection?.[filterKey]?.selected) {
        toggleSelectAllFilter(filterKey, isRemovalAction);
      }

      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const filterValues = newFilters[filterKey].filterValues || {};

        if (filterValues[filterValue]) {
          filterValues[filterValue].selected = isRemovalAction
            ? false
            : !filterValues[filterValue].selected;
        }

        return newFilters;
      });
    },
    [selectAllFilterSelection, toggleSelectAllFilter]
  );

  const resetFilters = useCallback(() => {
    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.entries(newSelectAllFilterSelection).forEach(
        ([filterKey, filterValueData]) => {
          newSelectAllFilterSelection[filterKey] = {
            ...filterValueData,
            selected: false,
          };
        }
      );

      return newSelectAllFilterSelection;
    });

    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      Object.entries(newFilters).forEach(([, filter]) => {
        const filterValues = filter.filterValues || {};

        Object.keys(filterValues).forEach((filterValue) => {
          filterValues[filterValue].selected = false;
        });
      });

      return newFilters;
    });
  }, []);

  const selectedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).map(([filterKey, filter]) => {
          const filterValues = Object.fromEntries(
            Object.entries(filter.filterValues || {}).filter(
              ([, filterValueData]) => filterValueData.selected
            )
          );

          return [filterKey, { ...filter, filterValues }];
        })
      ),
    [filters]
  );

  const filteredData = useMemo<TableData[]>(() => {
    if (isDataLoading) {
      return [];
    }

    if (
      Object.values(selectedFilters).every(
        (filter) => Object.keys(filter.filterValues || {}).length === 0
      )
    ) {
      return data;
    }

    return data.filter((row) => {
      return Object.entries(selectedFilters).every(([filterKey, filter]) => {
        const filterValues = filter.filterValues || {};

        if (Object.keys(filterValues).length === 0) {
          return true;
        }

        const value = getValueByKey(filterKey, row);

        if (filter.comparator !== undefined) {
          return Object.keys(filterValues).some((filterValue) =>
            filter.comparator?.(value, filterValue)
          );
        } else if (filterValues[value]) {
          return filterValues[value].selected;
        }

        return false;
      });
    });
  }, [data, isDataLoading, selectedFilters]);

  useEffect(() => {
    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.keys(newSelectAllFilterSelection).forEach((filterKey) => {
        const savedFilters = options?.[filterKey];
        const isSelectAllSelected = savedFilters?.All?.selected;

        if (!isSelectAllSelected) {
          return;
        }

        newSelectAllFilterSelection[filterKey].selected = true;
      });

      return newSelectAllFilterSelection;
    });

    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          const savedFilterValues = options?.[filterKey];
          const filterValues = filter.filterValues || {};

          Object.entries(filterValues).forEach(
            ([filterValue, filterValueData]) => {
              filterValues[filterValue] = {
                ...filterValueData,
                selected: false,
              };
            }
          );

          if (!Object.keys(savedFilterValues || {}).length) {
            return [filterKey, { ...filter, filterValues }];
          }

          Object.entries(savedFilterValues || {}).forEach(
            ([filterValue, filterValueData]) => {
              if (filterValue === 'All') {
                return;
              }

              if (!filterValues?.[filterValue]) {
                filterValues[filterValue] = {
                  selected: false,
                };
              }

              filterValues[filterValue] = {
                ...filterValueData,
              };
            }
          );

          return [filterKey, { ...filter, filterValues }];
        })
      )
    );
  }, [options]);

  const isFiltering = useMemo(
    () =>
      Object.values(selectedFilters).some((filter) =>
        Object.values(filter.filterValues).some(
          (filterValue) => filterValue.selected
        )
      ),
    [selectedFilters]
  );

  useFiltersPersistence(
    filters,
    selectAllFilterSelection,
    setOptions,
    setIsDataLoading,
    specificTablePersistentSettingsKey,
    genericTablePersistentSettingsKey
  );

  return {
    filters,
    selectedFilters,
    filteredData,
    isFiltering,
    toggleFilterSelection,
    toggleSelectAllFilter,
    isSelectAllFilterSelected,
    resetFilters,
  };
};

export default useFiltering;
