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
import { type ResourceTreeItem } from '../types';
import { getResourcesWithContent } from './getResourcesWithContent';

/**
 * This function returns the Resources of the of the given website in the inspectedWindow
 * @returns {any}
 */
export const getNetworkResourcesWithContent = async () => {
  const resources: ResourceTreeItem[] = await new Promise((resolve) => {
    chrome.devtools.inspectedWindow.getResources((_resources) =>
      resolve(_resources)
    );
  });

  const resourcesWithContent = await getResourcesWithContent(resources);

  return resourcesWithContent;
};
