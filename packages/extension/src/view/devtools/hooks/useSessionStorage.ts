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

/**
 * Internal dependencies.
 */
import updateSessionStorage, {
  type SessionData,
} from '../../../utils/udpateSessionStorage';

/**
 * Custom hook to manage session storage.
 * @param {SessionData} items - The session data to be stored.
 * @returns sessionData - The session data stored in session storage.
 */
const useSessionStorage = (items: SessionData) => {
  const [sessionData, setSessionData] = useState<SessionData>({});

  useEffect(() => {
    const _updateSessionStorage = async () => {
      const updatedData = await updateSessionStorage(items);
      setSessionData(updatedData);
    };
    _updateSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- For deep comparison and memoization.
  }, [JSON.stringify(items)]);

  return sessionData;
};

export default useSessionStorage;
