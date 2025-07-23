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
import Context, { type ProbabilisticRevealTokensContextType } from './context';
import { TAB_TOKEN_DATA } from '../../../../constants';

const Provider = ({ children }: PropsWithChildren) => {
  const [decodedTokens, setDecodedTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['decodedTokens']
  >([]);

  const [prtTokens, setPrtTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['prtTokens']
  >([]);

  const [plainTextTokens, setPlainTextTokens] = useState<
    ProbabilisticRevealTokensContextType['state']['plainTextTokens']
  >([]);

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: number;
        tokens: ProbabilisticRevealTokensContextType['state'];
      };
    }) => {
      if (![TAB_TOKEN_DATA].includes(message.type)) {
        return;
      }

      if (!message.type) {
        return;
      }

      if (message.payload.tokens) {
        setPrtTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.prtTokens)) {
            return prev;
          }
          return message.payload.tokens.prtTokens;
        });

        setDecodedTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.decodedTokens)) {
            return prev;
          }
          return message.payload.tokens.decodedTokens;
        });

        setPlainTextTokens((prev) => {
          if (isEqual(prev, message.payload.tokens.plainTextTokens)) {
            return prev;
          }
          return message.payload.tokens.plainTextTokens;
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
      setDecodedTokens([]);
      setPrtTokens([]);
    },
    []
  );

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

  const memoisedValue: ProbabilisticRevealTokensContextType = useMemo(() => {
    return {
      state: {
        plainTextTokens,
        decodedTokens,
        prtTokens,
      },
    };
  }, [plainTextTokens, decodedTokens, prtTokens]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
