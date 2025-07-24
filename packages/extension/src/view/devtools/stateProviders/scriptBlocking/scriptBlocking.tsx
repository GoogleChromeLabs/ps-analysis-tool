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
import React, {
  type PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from 'react';
/**
 * Internal dependencies.
 */
import Context from './context';
import { EXTRA_DATA } from '../../../../constants';

const ScriptBlockingProvider = ({ children }: PropsWithChildren) => {
  const [uniqueResponseDomains, setUniqueResponseDomains] = useState<string[]>(
    []
  );

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        uniqueResponseDomains?: string[];
      };
    }) => {
      if (message.type !== EXTRA_DATA) {
        return;
      }

      setUniqueResponseDomains(message.payload.uniqueResponseDomains || []);
    },
    []
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
    };
  }, [messagePassingListener]);

  return (
    <Context.Provider
      value={{
        state: {
          uniqueResponseDomains,
        },
        actions: {
          setUniqueResponseDomains,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ScriptBlockingProvider;
