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
import { getCurrentTabId } from '../../../../../../utils/getCurrentTabId';
import { CookieStore } from '../../../../../../localStore';
import type { SelectedFilters, SavedSelectedFilters } from '../types';

const saveSelectedCookies = async (selectedFilters: SelectedFilters) => {
  const filtersToSave = Object.entries(selectedFilters).reduce(
    (toSave: SavedSelectedFilters, [keys, filters]) => {
      toSave[keys] = [...filters];
      return toSave;
    },
    {}
  );

  const tabId = await getCurrentTabId();

  if (tabId) {
    await CookieStore.updateSelectedFilters(tabId, filtersToSave);
  }
};

export default saveSelectedCookies;
