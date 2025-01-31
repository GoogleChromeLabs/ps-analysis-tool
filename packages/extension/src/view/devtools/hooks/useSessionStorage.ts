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
import { useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies.
 */
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

type SessionData = Record<string, unknown> | undefined;

const useSessionStorage = (items: SessionData) => {
  const tabId = useRef<string | undefined>(undefined);
  const [sessionData, setSessionData] = useState<SessionData>({});

  useEffect(() => {
    const updateSessionStorage = async () => {
      tabId.current = tabId.current || (await getCurrentTabId());

      if (!tabId.current) {
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
              `${key}#${tabId.current}`,
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
