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
/**
 * External dependencies.
 */
import React, {
  type PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import { EXTRA_DATA } from '../../../../constants';
import Context, { type ScriptBlockingData } from './context';

const ScriptBlockingProvider = ({ children }: PropsWithChildren) => {
  const [uniqueResponseDomains, setUniqueResponseDomains] = useState<string[]>(
    []
  );
  const [scriptBlockingData, setScriptBlockingData] =
    useState<ScriptBlockingData>({});

  useEffect(() => {
    (async () => {
      const data = await fetch(
        'https://raw.githubusercontent.com/GoogleChrome/ip-protection/refs/heads/main/Masked-Domain-List.md'
      );

      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const text = await data.text();

      const lines = text
        .split('\n')
        .filter((line) => line.includes('|'))
        .slice(2);

      const mdlData = lines.map((line) =>
        line.split('|').map((item) => item.trim())
      );

      setScriptBlockingData(() => {
        const _data = mdlData.reduce((acc, item: string[]) => {
          let owner = item[1];

          if (item[1].includes('PSL Domain')) {
            owner = 'PSL Domain';
          }

          const scriptBlocking = item[2];

          acc[item[0] as string] = {
            domain: item[0],
            owner,
            scriptBlocking,
          };

          return acc;
        }, {} as ScriptBlockingData);

        return _data;
      });
    })();
  }, []);

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        uniqueResponseDomains?: string[];
        tabId: string;
      };
    }) => {
      if (
        message.type !== EXTRA_DATA ||
        String(message.payload.tabId) !==
          String(chrome.devtools.inspectedWindow.tabId)
      ) {
        return;
      }

      setUniqueResponseDomains((prev) => {
        return isEqual(message.payload.uniqueResponseDomains, prev)
          ? prev
          : message.payload.uniqueResponseDomains || [];
      });
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
          scriptBlockingData,
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
