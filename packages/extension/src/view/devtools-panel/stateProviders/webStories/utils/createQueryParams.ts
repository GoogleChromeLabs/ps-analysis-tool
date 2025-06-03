/*
 * Copyright 2024 Google LLC
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
export const createQueryParams = (
  selectedFilterValues: Record<string, string[]>,
  categories: Record<number, string>,
  tags: Record<number, string>,
  searchValue: string,
  pageNumber: number,
  sortValue: string
) => {
  const selectedAuthorsID: number[] = [];
  const selectedCategoriesId: number[] = [];
  const selectedTagId: number[] = [];

  Object.keys(categories).forEach((key) => {
    const keyToUse = Number(key);
    if (selectedFilterValues?.category?.includes(categories[keyToUse])) {
      selectedCategoriesId.push(keyToUse);
    }
  });

  Object.keys(tags).forEach((key) => {
    const keyToUse = Number(key);
    if (selectedFilterValues?.tag?.includes(tags[keyToUse])) {
      selectedTagId.push(keyToUse);
    }
  });

  const urlSearchParams = new URLSearchParams();

  urlSearchParams.append('per_page', '8');
  urlSearchParams.append('page', pageNumber.toString());

  if (selectedAuthorsID.length > 0) {
    urlSearchParams.append('author', selectedAuthorsID.join(','));
  }

  if (selectedCategoriesId.length > 0) {
    urlSearchParams.append(
      'web_story_category',
      selectedCategoriesId.join(',')
    );
  }

  if (selectedTagId.length > 0) {
    urlSearchParams.append('web_story_tag', selectedTagId.join(','));
  }

  urlSearchParams.append('order', sortValue === 'latest' ? 'desc' : 'asc');

  if (searchValue) {
    urlSearchParams.append('search', searchValue);
  }
  return urlSearchParams.toString();
};
