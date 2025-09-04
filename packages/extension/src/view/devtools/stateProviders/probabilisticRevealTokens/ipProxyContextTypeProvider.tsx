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
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  ProbablisticRevealToken,
  PRTMetadata,
  UniqueDecryptedToken,
  UniquePlainTextToken,
} from '@google-psat/common';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import Context, {
  type IPProxyContextType,
  type ScriptBlockingData,
} from './context';
import { EXTRA_DATA, TAB_TOKEN_DATA } from '../../../../constants';

const Provider = ({ children }: PropsWithChildren) => {
  const [decryptedTokens, setDecryptedTokens] = useState<
    IPProxyContextType['state']['decryptedTokens']
  >([]);

  const [prtTokens, setPrtTokens] = useState<
    IPProxyContextType['state']['prtTokens']
  >([]);

  const [plainTextTokens, setPlainTextTokens] = useState<
    IPProxyContextType['state']['plainTextTokens']
  >([]);

  const [perTokenMetadata, setPerTokenMetadata] = useState<
    IPProxyContextType['state']['perTokenMetadata']
  >([]);

  const [uniqueResponseDomains, setUniqueResponseDomains] = useState<string[]>(
    []
  );
  const [scriptBlockingData, setScriptBlockingData] =
    useState<ScriptBlockingData>({});

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: string;
        tokens: {
          plainTextTokens: UniquePlainTextToken[];
          decryptedTokens: UniqueDecryptedToken[];
          prtTokens: ProbablisticRevealToken[];
          perTokenMetadata: PRTMetadata[];
        };
        uniqueResponseDomains: string[];
      };
    }) => {
      if (![TAB_TOKEN_DATA, EXTRA_DATA].includes(message.type)) {
        return;
      }

      if (!message.type) {
        return;
      }

      if (
        message.payload.tabId.toString() !==
        chrome.devtools.inspectedWindow.tabId.toString()
      ) {
        return;
      }

      if (message.payload.tokens && TAB_TOKEN_DATA === message.type) {
        setPrtTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.prtTokens)) {
            return prev;
          }
          return message.payload.tokens.prtTokens;
        });

        setDecryptedTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.decryptedTokens)) {
            return prev;
          }
          return message.payload.tokens.decryptedTokens;
        });

        setPlainTextTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.plainTextTokens)) {
            return prev;
          }
          return message.payload.tokens.plainTextTokens;
        });

        setPerTokenMetadata((prev) => {
          if (isEqual(prev, message.payload.tokens.perTokenMetadata)) {
            return prev;
          }
          return message.payload.tokens.perTokenMetadata;
        });
      }

      if (EXTRA_DATA === message.type) {
        setUniqueResponseDomains((prev) => {
          return isEqual(message.payload.uniqueResponseDomains, prev)
            ? prev
            : message.payload.uniqueResponseDomains || [];
        });
      }
    },
    []
  );

  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        !(
          chrome.devtools.inspectedWindow.tabId === tabId &&
          frameType === 'outermost_frame' &&
          frameId === 0
        )
      ) {
        return;
      }

      setPlainTextTokens([]);
      setDecryptedTokens([]);
      setPrtTokens([]);
      setPerTokenMetadata([]);
    },
    []
  );

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

          let scriptBlocking;

          switch (item[2] as string) {
            case 'Not Impacted By Script Blocking':
              scriptBlocking = 'None';
              break;
            case 'Some URLs are Blocked':
              scriptBlocking = 'Partial';
              break;
            case 'Entire Domain Blocked':
              scriptBlocking = 'Complete';
              break;
            default:
              scriptBlocking = 'None';
              break;
          }

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

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation?.onCommitted?.addListener(
      onCommittedNavigationListener
    );

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation?.onCommitted?.removeListener(
        onCommittedNavigationListener
      );
    };
  }, [messagePassingListener, onCommittedNavigationListener]);

  const memoisedValue: IPProxyContextType = useMemo(() => {
    return {
      state: {
        plainTextTokens,
        decryptedTokens,
        prtTokens,
        perTokenMetadata,
        scriptBlockingData,
        uniqueResponseDomains,
      },
    };
  }, [
    uniqueResponseDomains,
    scriptBlockingData,
    plainTextTokens,
    prtTokens,
    perTokenMetadata,
    decryptedTokens,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
