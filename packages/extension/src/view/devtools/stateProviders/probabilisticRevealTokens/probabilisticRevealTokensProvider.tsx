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
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import Context, {
  initialState,
  type ProbabilisticRevealTokensContextType,
} from './context';
import { TAB_TOKEN_DATA } from '../../../../constants';
import { useScriptBlocking } from '../scriptBlocking';
import { isValidURL } from '@google-psat/common';

const Provider = ({ children }: PropsWithChildren) => {
  const [decryptedTokens, setDecryptedTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['decryptedTokens']
  >([]);

  const [statistics, setStatistics] = useState<
    ProbabilisticRevealTokensContextType['state']['statistics']
  >(initialState.state.statistics);

  const [prtTokens, setPrtTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['prtTokens']
  >([]);

  const [plainTextTokens, setPlainTextTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['plainTextTokens']
  >([]);

  const [perTokenMetadata, setPerTokenMetadata] = useState<
    ProbabilisticRevealTokensContextType['state']['perTokenMetadata']
  >([]);

  const { scriptBlockingData } = useScriptBlocking(({ state }) => ({
    scriptBlockingData: state.scriptBlockingData,
  }));

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: string;
        tokens: ProbabilisticRevealTokensContextType['state'];
        stats: ProbabilisticRevealTokensContextType['state']['statistics'];
      };
    }) => {
      if (![TAB_TOKEN_DATA].includes(message.type)) {
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

      if (message.payload.tokens) {
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

      if (message.payload.stats) {
        setStatistics((prev) => {
          if (isEqual(prev, message.payload.stats)) {
            return prev;
          }
          return message.payload.stats;
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

  const syncStorageListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      const hasChangesForPrtStatisticsData =
        Object.keys(changes).includes('prtStatistics') &&
        Object.keys(changes.prtStatistics).includes('newValue');
      const { prtStatistics = {} } = await chrome.storage.sync.get(
        'prtStatistics'
      );

      const globalStats = Object.keys(prtStatistics).reduce(
        (acc, key) => {
          if (prtStatistics[key]) {
            acc.totalTokens = prtStatistics[key].totalTokens + acc.totalTokens;
            acc.nonZeroSignal =
              prtStatistics[key].nonZeroSignal + acc.nonZeroSignal;

            let hostname = isValidURL(origin) ? new URL(origin).hostname : '';

            hostname = hostname.startsWith('www.')
              ? hostname.slice(4)
              : hostname;

            acc.mdl +=
              hostname &&
              scriptBlockingData.filter((_data) => _data.domain === hostname)
                .length > 0
                ? 1
                : 0;
          }
          return acc;
        },
        { totalTokens: 0, nonZeroSignal: 0, domains: 0, mdl: 0 }
      );

      globalStats.domains = Object.keys(prtStatistics).length;

      if (hasChangesForPrtStatisticsData) {
        setStatistics((prev) => {
          return {
            ...prev,
            globalView: globalStats,
          };
        });
      }
    },
    [scriptBlockingData]
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation?.onCommitted?.addListener(
      onCommittedNavigationListener
    );
    chrome.storage.sync.onChanged.addListener(syncStorageListener);

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation?.onCommitted?.removeListener(
        onCommittedNavigationListener
      );
      chrome.storage.sync.onChanged.removeListener(syncStorageListener);
    };
  }, [
    messagePassingListener,
    onCommittedNavigationListener,
    syncStorageListener,
  ]);

  const memoisedValue: ProbabilisticRevealTokensContextType = useMemo(() => {
    return {
      state: {
        plainTextTokens,
        decryptedTokens,
        prtTokens,
        perTokenMetadata,
        statistics,
      },
    };
  }, [
    plainTextTokens,
    decryptedTokens,
    prtTokens,
    perTokenMetadata,
    statistics,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
