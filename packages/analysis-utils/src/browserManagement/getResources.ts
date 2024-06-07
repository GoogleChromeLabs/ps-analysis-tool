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
 * External dependencies
 */
import { CDPSession } from 'puppeteer';

export const getResources = async (session: CDPSession) => {
  await session.send('Page.enable');
  const {
    frameTree: { frame, resources },
  } = await session.send('Page.getResourceTree');

  const resourcesContent = await Promise.all(
    resources.map(async (resource) => {
      if (resource.type !== 'Script') {
        return {};
      }
      const { content, base64Encoded } = await session.send(
        'Page.getResourceContent',
        {
          frameId: frame.id,
          url: resource.url,
        }
      );
      if (base64Encoded) {
        return {
          origin: resource.url,
          content: Buffer.from(content, 'base64'),
          type: resource.type,
        };
      }
      return {
        origin: resource.url,
        content,
        type: resource.type,
      };
    })
  );
  return resourcesContent;
};
