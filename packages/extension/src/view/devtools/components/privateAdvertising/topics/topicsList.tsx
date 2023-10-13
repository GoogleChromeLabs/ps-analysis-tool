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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import { CookieStore } from '../../../../../localStore';

const TopicsList = () => {
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    chrome.devtools.inspectedWindow.eval(
      'window.location.origin',
      (activeTabUrl: string, isException) => {
        if (!isException) {
          CookieStore.getTopics(activeTabUrl).then((resolvedTopics) => {
            setTopics(resolvedTopics);
          });
        }
      }
    );
  }, []);

  return (
    <div className="max-w-2xl m-3 border-t border-american-silver">
      <div className="p-6 pl-0 dark:bg-davys-grey ">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-bright-gray">
          Topics List
        </h5>
        {topics.length > 0 ? (
          <ul className="ml-3 list-disc text-gray-700 dark:text-bright-gray">
            {topics.map((topic: string) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-bright-gray">
            No topics found on this page.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopicsList;
