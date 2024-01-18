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
import { ResourceTreeItem } from '../types';

/**
 * Filters the document and scripts of interest from all the Resources given as input
 * @param {any} inputResources:ResourceTreeItem[]
 * @param inputResources
 * @returns {any}
 */
const filterResources = (inputResources: ResourceTreeItem[]) => {
  return inputResources
    .filter((i: ResourceTreeItem) => ['script', 'document'].includes(i.type))
    .filter(
      (i) =>
        !i.url.includes('chrome-extension://') && !i.url.includes('debugger://')
    );
};

export default filterResources;
