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
/**
 * Convert title to hash.
 * @param title Title
 * @returns hash string
 */
const convertTitleToHash = (title: string): string => {
  return title
    ? title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove any non-alphanumeric characters except spaces
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-')
    : ''; // Replace multiple hyphens with a single hyphen
};

export default convertTitleToHash;
