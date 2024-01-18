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
import { ScriptTagUnderCheck, ResourceTreeItem } from '../types';
import { getInlineScriptContent, filterResources } from '../core';

/**
 * This function populates the content from the resource using the getContent function async
 * @param {any} resources:ResourceTreeItem[]
 * @param resources
 * @returns {any}
 */
export const getResourcesWithContent = async (
  resources: ResourceTreeItem[]
) => {
  const filteredResources = filterResources(resources);

  const contentPromises: Promise<unknown>[] = [];
  const resourcesWithOutContent: ScriptTagUnderCheck[] = [];

  filteredResources.forEach((resource) => {
    contentPromises.push(
      new Promise((resolve) =>
        resource.getContent((content: string) => resolve(content))
      )
    );
    resourcesWithOutContent.push({
      origin: resource.url,
      content: '',
      type: resource?.type,
    });
  });

  const contents = await Promise.allSettled(contentPromises);

  const resourcesWithContent: ScriptTagUnderCheck[] = [];

  resourcesWithOutContent.forEach((networkScriptItem, index) => {
    let content = (contents[index] as PromiseFulfilledResult<string>)?.value;

    if (networkScriptItem.type === 'document') {
      content = getInlineScriptContent(
        (contents[index] as PromiseFulfilledResult<string>)?.value
      ).toString();
    }

    if (contents[index].status === 'fulfilled') {
      resourcesWithContent.push({
        origin: networkScriptItem.origin,
        content,
        type: networkScriptItem.type,
      });
    }
  });

  return resourcesWithContent;
};
