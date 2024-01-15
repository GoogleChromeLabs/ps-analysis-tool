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
import { ResourceTreeItem } from '../libraries';
import { filterRemoteAndInlineScript } from './filterRemoteAndInlineScript';

export const populateContentFromResource = async (
  resources: ResourceTreeItem[]
) => {
  const filteredScripts = filterRemoteAndInlineScript(resources);

  const networkScript = [];
  const networkCallPromiseStack = [];

  for (let i = 0; i < filteredScripts.length; i++) {
    networkCallPromiseStack.push(
      new Promise((resolve) =>
        filteredScripts[i].getContent((content: string) => resolve(content))
      )
    );
    networkScript.push({ origin: filteredScripts[i].url, content: '' });
  }

  const responsePromiseArray = await Promise.allSettled(
    networkCallPromiseStack
  );

  networkScript.forEach((networkScriptItem, index) => {
    if (responsePromiseArray[index].status === 'fulfilled') {
      networkScriptItem.content = responsePromiseArray[index].value; //TODO: get help to fix this type issue. In the run time this .value exists but type fails
    }
  });

  return networkScript;
};
