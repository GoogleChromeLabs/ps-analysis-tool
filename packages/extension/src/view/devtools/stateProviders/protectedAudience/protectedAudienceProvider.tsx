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
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import Context, {
  type InterestGroups,
  type ProtectedAudienceContextType,
} from './context';
import type { singleAuctionEvent } from '../../../../store/dataStore';
import { diff } from 'deep-object-diff';

const Provider = ({ children }: PropsWithChildren) => {
  const [auctionEvents, setAuctionEvents] = useState<singleAuctionEvent[]>([]);
  const [interestGroupDetails, setInterestGroupDetails] = useState<
    InterestGroups[]
  >([]);

  const messagePassingListener = useCallback(
    // eslint-disable-next-line complexity
    async (message: {
      type: string;
      payload: {
        tabId?: number;
        auctionEvents?: singleAuctionEvent[];
      };
    }) => {
      if (!message.type) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;

      if (
        incomingMessageType === 'AUCTION_EVENTS' &&
        message.payload.auctionEvents &&
        message.payload.auctionEvents?.length > 0
      ) {
        if (message.payload.tabId === tabId) {
          setAuctionEvents((prevState) => {
            if (
              message.payload.auctionEvents &&
              Object.keys(diff(prevState, message.payload.auctionEvents))
                .length > 0
            ) {
              return message.payload.auctionEvents;
            }
            return prevState;
          });
          const shapedInterestGroupDetails = await Promise.all(
            message.payload.auctionEvents
              .filter((event) => event.eventType === 'interestGroupAccessed')
              .map(async (event) => {
                if (!event?.name && !event?.ownerOrigin) {
                  return {
                    ...event,
                    details: {},
                  };
                }

                const result = (await chrome.debugger.sendCommand(
                  { tabId },
                  'Storage.getInterestGroupDetails',
                  {
                    name: event?.name,
                    ownerOrigin: event?.ownerOrigin,
                  }
                )) as Protocol.Storage.GetInterestGroupDetailsResponse;

                return {
                  ...event,
                  details: result,
                };
              })
          );
          setInterestGroupDetails((prevState) => {
            if (
              Object.keys(diff(prevState, shapedInterestGroupDetails)).length >
              0
            ) {
              return shapedInterestGroupDetails;
            }
            return prevState;
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

  const memoisedValue: ProtectedAudienceContextType = useMemo(() => {
    return {
      state: {
        auctionEvents,
        interestGroupDetails,
      },
    };
  }, [auctionEvents, interestGroupDetails]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
