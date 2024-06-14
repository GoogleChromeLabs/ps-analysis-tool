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

import { renderHook } from '@testing-library/react';
import useFiltersExtraction from '../useFiltersExtraction';
import React from 'react';

describe('useFiltersExtraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const data = [
    {
      parsedCookie: {
        name: 'cookie1',
        value: 'value1',
        sameSite: 'Lax',
      },
    },
    {
      parsedCookie: {
        name: 'cookie2',
        value: 'value2',
        sameSite: 'None',
      },
    },
  ];

  const tableFilterData = {
    'parsedCookie.name': {
      title: 'Cookie Name',
      description: 'Name of the cookie',
      enableSelectAllOption: true,
    },
    'parsedCookie.value': {
      title: 'Cookie Value',
      description: 'Value of the cookie',
      hasStaticFilterValues: true,
      filterValues: {
        value1: {
          selected: false,
        },
        value2: {
          selected: false,
        },
      },
    },
    'parsedCookie.sameSite': {
      title: 'Same Site',
      description: 'Same site of the cookie',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      filterValues: {
        Lax: {
          selected: false,
        },
        None: {
          selected: false,
        },
      },
    },
  };

  const options = {
    current: {
      'parsedCookie.value': {
        value1: {
          selected: true,
        },
        value2: {
          selected: true,
        },
      },
      'parsedCookie.sameSite': {
        None: {
          selected: true,
        },
      },
    },
  };

  const selectAllFilterSelection = {
    'parsedCookie.name': {
      selected: true,
    },
  };

  const expectedFilters = {
    'parsedCookie.name': {
      title: 'Cookie Name',
      description: 'Name of the cookie',
      enableSelectAllOption: true,
      filterValues: {
        cookie1: {
          selected: true,
        },
        cookie2: {
          selected: true,
        },
      },
    },
    'parsedCookie.value': {
      title: 'Cookie Value',
      description: 'Value of the cookie',
      hasStaticFilterValues: true,
      filterValues: {
        value1: {
          selected: true,
        },
        value2: {
          selected: true,
        },
      },
    },
    'parsedCookie.sameSite': {
      title: 'Same Site',
      description: 'Same site of the cookie',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      filterValues: {
        Lax: {
          selected: null,
        },
        None: {
          selected: true,
        },
      },
    },
  };

  const expectedSelectAllFilterSelection = {
    'parsedCookie.name': {
      selected: true,
    },
  };

  it('should extract filters from data with options', () => {
    const setFilters = jest.fn();
    const useFiltersSpy = jest.spyOn(React, 'useState');
    useFiltersSpy.mockImplementation(() => [{}, setFilters]);

    const setSelectAllFilterSelection = jest.fn();
    const useSelectAllFilterSelectionSpy = jest.spyOn(React, 'useState');
    useSelectAllFilterSelectionSpy.mockImplementation(() => [
      {},
      setSelectAllFilterSelection,
    ]);

    renderHook(() =>
      useFiltersExtraction(
        // @ts-ignore
        data,
        tableFilterData,
        options,
        selectAllFilterSelection,
        setFilters,
        setSelectAllFilterSelection
      )
    );

    expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

    const setFiltersFn = setFilters.mock.calls[0][0];
    const setSelectAllFilterSelectionFn =
      setSelectAllFilterSelection.mock.calls[0][0];

    expect(setFiltersFn(tableFilterData)).toEqual(expectedFilters);
    expect(setSelectAllFilterSelectionFn(selectAllFilterSelection)).toEqual(
      expectedSelectAllFilterSelection
    );
  });
});
