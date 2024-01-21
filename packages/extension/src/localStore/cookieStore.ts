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
import fetchTopicsTaxonomy from '../utils/fetchTopicsTaxonomy';

const CookieStore = {
  /**
   * Handle topics.
   * @param {string} activeTabUrl The active tab origin location.
   * @param {number[]} topics The topics for active tab.
   */
  async setTopics(activeTabUrl: string, topics: (string | number)[] = []) {
    const storage = await chrome.storage.local.get();

    if (!storage[activeTabUrl]) {
      storage[activeTabUrl] = {};
    }

    const topicsTaxonomy = await fetchTopicsTaxonomy();

    storage[activeTabUrl].topics = topics.map(
      (topicsId) => topicsTaxonomy[topicsId]
    );

    await chrome.storage.local.set(storage);
  },

  /**
   * Get topics list.
   * @param {string} activeTabUrl The host name for which topics is to be fetched.
   * @returns {Promise<string[]>} The list of topics.
   */
  async getTopics(activeTabUrl: string): Promise<string[]> {
    const storage = await chrome.storage.local.get();

    if (storage && storage[activeTabUrl] && storage[activeTabUrl].topics) {
      return storage[activeTabUrl].topics;
    }

    return [];
  },
};

export default CookieStore;
