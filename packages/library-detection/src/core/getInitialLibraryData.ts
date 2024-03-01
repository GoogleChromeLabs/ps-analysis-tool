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
 * Internal dependencies.
 */
import LIBRARIES from '../config';
import type { LibraryData } from '../types';

const getInitialLibraryData = (): LibraryData => {
  return Object.fromEntries(
    LIBRARIES.map(({ name, domQueryFunction }) => {
      let initialData = {
        signatureMatches: 0,
        matches: [],
        moduleMatch: 0,
      };

      if (domQueryFunction) {
        initialData = {
          domQueryMatches: null,
        };
      }

      return [name, initialData];
    })
  );
};

export default getInitialLibraryData;
