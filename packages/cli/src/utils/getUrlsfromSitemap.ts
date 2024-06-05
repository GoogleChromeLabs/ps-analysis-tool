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
 * External dependencies.
 */
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
import Sitemapper from 'sitemapper';

/**
 * Get List of urls from sitemap url.
 * @param {string} sitemapURL Site map URL.
 * @returns {Promise<Array<string>>} List of URLs.
 */
async function getUrlsFromSitemap(sitemapURL: string): Promise<Array<string>> {
  const siteMapper = new Sitemapper({
    url: sitemapURL,
    timeout: 3000,
  });

  let urls: Array<string> = [];
  try {
    const { sites } = await siteMapper.fetch();
    urls = sites;
  } catch (error) {
    console.log('Error: error parsing sitemap ');
  }

  return urls;
}

export default getUrlsFromSitemap;
