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
import { SavedSelectedFilters, SelectedFilters } from '../types';
import { Storage } from '../../../../../../localStore';

const getSavedSelectedCookies = (
  tabId: string | undefined,
  storage: Storage
): SelectedFilters | null => {
  if (!tabId || !storage[tabId] || !storage[tabId]?.extState) {
    return null;
  }

  const savedSelectedFilters = storage[tabId].extState
    ?.selectedFilters as SavedSelectedFilters;

  if (!savedSelectedFilters) {
    return null;
  }

  return Object.entries(savedSelectedFilters).reduce(
    (toUse: SelectedFilters, [keys, filters]) => {
      toUse[keys] = new Set(filters);
      return toUse;
    },
    {}
  );
};

export default getSavedSelectedCookies;
