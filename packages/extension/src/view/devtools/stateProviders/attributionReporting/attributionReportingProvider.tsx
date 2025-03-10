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
import Context, { type AttributionReportingContextType } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [sourcesRegistration, setSourcesRegistration] = useState<
    AttributionReportingContextType['state']['sourcesRegistration']
  >([]);

  const [triggerRegistration, setTriggerRegistration] = useState<
    AttributionReportingContextType['state']['triggerRegistration']
  >([]);

  const [filter, setFiltering] = useState({
    activeSources: true,
    sourcesRegistration: true,
    triggerRegistration: false,
  });

  const updateFilter = useCallback((_filter: string, booleanValue: boolean) => {
    setFiltering((prevState) => ({ ...prevState, [_filter]: booleanValue }));
  }, []);

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: number;
        sourcesRegistration: AttributionReportingContextType['state']['sourcesRegistration'];
        triggerRegistration: AttributionReportingContextType['state']['triggerRegistration'];
      };
    }) => {
      if (!['ARA_EVENTS'].includes(message.type)) {
        return;
      }

      if (!message.type) {
        return;
      }

      const incomingMessageType = message.type;

      if (incomingMessageType === 'ARA_EVENTS') {
        if (message.payload.sourcesRegistration) {
          setSourcesRegistration((prevState) => {
            if (isEqual(prevState, message.payload.sourcesRegistration)) {
              return prevState;
            }

            return message.payload.sourcesRegistration;
          });
        }

        if (message.payload.triggerRegistration) {
          setTriggerRegistration((prevState) => {
            if (isEqual(prevState, message.payload.triggerRegistration)) {
              return prevState;
            }

            return message.payload.triggerRegistration;
          });
        }
      }
    },
    []
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messagePassingListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messagePassingListener);
    };
  }, [messagePassingListener]);

  const memoisedValue: AttributionReportingContextType = useMemo(() => {
    return {
      state: {
        triggerRegistration,
        sourcesRegistration,
        filter,
      },
      actions: {
        updateFilter,
      },
    };
  }, [triggerRegistration, sourcesRegistration, updateFilter, filter]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
