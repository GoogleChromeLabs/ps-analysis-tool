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

const fetchedAssets = new Set<string>();

const resourceMapper = {
  script: (doc: Document) =>
    Array.from(doc.getElementsByTagName('script')).map((script) => script.src),
  stylesheet: (doc: Document) =>
    Array.from(doc.getElementsByTagName('link')).map((link) => link.href),
  image: (doc: Document) =>
    Array.from(doc.getElementsByTagName('img')).map((img) => img.src),
};

const fetchPageAssets = async (
  pageUrl: string,
  options: {
    resourceType?: ('script' | 'stylesheet' | 'image')[];
    getAssetsUrl?: (doc: Document) => string[];
  }
): Promise<void> => {
  const response = await fetch(pageUrl);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  if (!doc) {
    return;
  }

  let allResources = options.resourceType
    ? options.resourceType
        .map((resourceType) => {
          const assetsGetter = resourceMapper[resourceType];
          return assetsGetter ? assetsGetter(doc) : [];
        })
        .flat()
    : [];

  if (options.getAssetsUrl) {
    allResources = [...allResources, ...options.getAssetsUrl(doc)];
  }

  const assetPromises = allResources
    .filter((assetUrl) => assetUrl && !fetchedAssets.has(assetUrl))
    .map((assetUrl) => {
      fetchedAssets.add(assetUrl);
      return fetch(assetUrl);
    });

  await Promise.all(assetPromises);
};

export default fetchPageAssets;
