/*
 * Copyright 2024 Google LLC
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
import { useEffect, useState } from 'react';

type SessionData = Record<string, unknown> | undefined;

/**
 * Custom hook to manage session storage.
 * @param {SessionData} items - The session data to be stored.
 * @returns sessionData - The session data stored in session storage.
 */
const useSessionStorage = (items: SessionData) => {
  const [sessionData, setSessionData] = useState<SessionData>({});

  useEffect(() => {
    const updateSessionStorage = async () => {
      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (!tabId) {
        return;
      }

      let data = await chrome.storage.session.get();

      if (!data) {
        data = {};
      }

      let updatedData: SessionData = undefined;

      if (items) {
        // Merge new items with tab-specific keys
        updatedData = {
          ...data,
          ...Object.fromEntries(
            Object.entries(items).map(([key, value]) => [
              `${key}#${tabId}`,
              value,
            ])
          ),
        };

        await chrome.storage.session.set(updatedData);
      }

      setSessionData(updatedData || data); // Update local state
    };

    updateSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- For deep comparison and memoization.
  }, [JSON.stringify(items)]);

  return sessionData;
};

export default useSessionStorage;
