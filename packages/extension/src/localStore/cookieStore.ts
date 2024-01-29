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
import type { AllowedDomainObject, AllowedDomainStorage } from './types';
import fetchTopicsTaxonomy from '../utils/fetchTopicsTaxonomy';
import getIndexForAllowListedItem from './utils/getIndexForAllowListedItem';

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

  /**
   * Add domain to allow-list.
   * @param {AllowedDomainObject} domainObject The domain to be added to allow-list.
   */
  async addDomainToAllowList(domainObject: AllowedDomainObject) {
    const storage = await chrome.storage.session.get();

    if (!storage.allowList) {
      storage.allowList = [];
    }

    const index = getIndexForAllowListedItem(
      storage as AllowedDomainStorage,
      domainObject
    );

    if (index === -1) {
      storage.allowList = [...storage.allowList, domainObject];
    }

    await chrome.storage.session.set(storage);
  },

  /**
   * Remove domain from allow-list.
   * @param {AllowedDomainObject} domainObject The domain to be removed from allow-list.
   * @returns AllowedDomainObject[] Remaning objects.
   */
  async removeDomainFromAllowList(
    domainObject: AllowedDomainObject
  ): Promise<AllowedDomainObject[] | []> {
    const storage = await chrome.storage.session.get();

    if (!storage?.allowList || storage?.allowList?.length === 0) {
      return [];
    }

    const indexToRemove = getIndexForAllowListedItem(
      storage as AllowedDomainStorage,
      domainObject
    );

    if (indexToRemove !== -1) {
      storage.allowList.splice(indexToRemove, 1);
    }

    await chrome.storage.session.set(storage);

    return (storage.allowList as AllowedDomainObject[]) || [];
  },

  /**
   * Get domains in allow-list.
   * @returns {Promise<Record<string, string>>} Set of domains in allow-list.
   */
  async getDomainsInAllowList(): Promise<AllowedDomainObject[] | []> {
    const storage = await chrome.storage.session.get();

    return storage?.allowList ?? [];
  },
};

export default CookieStore;
