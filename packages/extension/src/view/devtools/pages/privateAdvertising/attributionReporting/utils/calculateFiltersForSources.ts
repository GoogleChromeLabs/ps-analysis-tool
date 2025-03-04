/*
 * Copyright 2025 Google LLC
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
import type { SourcesRegistration } from '@google-psat/common';

type SourcesKeys = keyof SourcesRegistration;
/**
 * This calculates the filter data for the given key
 * @param {SourcesRegistration[]} sourcesRegistration The source registration from which key has to be calculated
 * @param {string} key The key to calculate the filter data for
 * @returns The filter values.
 */
const calculateFiltersForSources = (
  sourcesRegistration: SourcesRegistration[],
  key: SourcesKeys
) => {
  const filters: { [key: string]: Record<'selected', boolean> } = {};
  sourcesRegistration.forEach((sources) => {
    if (key === 'destinationSites') {
      if (Array.isArray(sources[key])) {
        sources[key].forEach((site) => {
          filters[site] = {
            selected: false,
          };
        });
      } else {
        filters[sources[key]] = {
          selected: false,
        };
      }
    } else {
      const _key = sources[key] as SourcesKeys;

      if (!_key) {
        return;
      }

      filters[_key] = {
        selected: false,
      };
    }
  });
  return filters;
};

export default calculateFiltersForSources;
