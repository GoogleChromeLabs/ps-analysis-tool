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
import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { useLibraryDetectionContext } from '@ps-analysis-tool/library-detection';

/**
 * Internal dependencies.
 */
import Context, { type DataStoreContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<DataStoreContext['state']['data']>(null);
  const [isDataLoaded, setIsDataLoaded] =
    useState<DataStoreContext['state']['isDataLoaded']>(false);

  const { setLibraryMatches, setShowLoader } = useLibraryDetectionContext(
    ({ actions }) => ({
      setLibraryMatches: actions.setLibraryMatches,
      setShowLoader: actions.setShowLoader,
    })
  );

  useEffect(() => {
    //@ts-ignore custom data attached to window breaks types
    const _data = window.PSAT_DATA;

    setData(_data);
    if (_data?.libraryMatches) {
      setLibraryMatches(_data.libraryMatches);
    }
    setShowLoader(false);
    setIsDataLoaded(true);
  }, [setLibraryMatches, setShowLoader]);

  return (
    <Context.Provider
      value={{
        state: {
          data,
          isDataLoaded,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
