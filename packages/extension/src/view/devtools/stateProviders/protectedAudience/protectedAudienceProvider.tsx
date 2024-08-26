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
import type {
  MultiSellerAuction,
  NoBidsType,
  singleAuctionEvent,
  SingleSellerAuction,
} from '@google-psat/common';
import { diff } from 'deep-object-diff';
/**
 * Internal dependencies.
 */
import Context, { type ProtectedAudienceContextType } from './context';

const BIDDING_TYPES = [
  'bid',
  'additionalBid',
  'topLevelBid',
  'topLevelAdditionalBid',
];

const Provider = ({ children }: PropsWithChildren) => {
  const [auctionEvents, setAuctionEvents] =
    useState<ProtectedAudienceContextType['state']['auctionEvents']>(null);

  const [isMultiSellerAuction, setIsMultiSellerAuction] =
    useState<boolean>(false);

  const [interestGroupDetails, setInterestGroupDetails] = useState<
    ProtectedAudienceContextType['state']['interestGroupDetails']
  >([]);

  const [receivedBids, setReceivedBids] = useState<
    ProtectedAudienceContextType['state']['receivedBids']
  >([]);

  const [noBids, setNoBids] = useState<
    ProtectedAudienceContextType['state']['noBids']
  >({});

  const computeBids = useCallback(
    (
      _auctionEvents: ProtectedAudienceContextType['state']['auctionEvents'],
      _isMultiSellerAuction: boolean
    ) => {
      if (
        !_auctionEvents ||
        (_auctionEvents && Object.keys(_auctionEvents).length === 0)
      ) {
        return null;
      }

      const _receivedBids: singleAuctionEvent[] = [];
      const _noBids: NoBidsType = {};

      const _interestGroupBuyers = new Set<string>();

      if (_isMultiSellerAuction) {
        const multisellerAuctionEvents = _auctionEvents as MultiSellerAuction;

        Object.keys(multisellerAuctionEvents).forEach((parentAuctionId) => {
          Object.keys(multisellerAuctionEvents[parentAuctionId]).forEach(
            (uniqueAuctionId) => {
              if ('globalEvents' === uniqueAuctionId) {
                return;
              }

              const { auctionConfig, uniqueAuctionId: _uniqueAuctionId } =
                multisellerAuctionEvents[parentAuctionId]?.[
                  uniqueAuctionId
                ]?.filter(
                  ({ type }) => type && type === 'configResolved'
                )?.[0] ?? {};

              const { name } =
                multisellerAuctionEvents[parentAuctionId]?.[
                  uniqueAuctionId
                ]?.find(
                  (event) => event?.eventType === 'interestGroupAccessed'
                ) ?? {};

              //@ts-ignore
              auctionConfig?.interestGroupBuyers?.forEach((element) => {
                _interestGroupBuyers.add(element);
              });

              _receivedBids.push(
                ...multisellerAuctionEvents[parentAuctionId][uniqueAuctionId]
                  .filter(
                    (event) =>
                      event.eventType === 'interestGroupAccessed' &&
                      BIDDING_TYPES.includes(event.type)
                  )
                  .map((event) => {
                    return {
                      ...event,
                      //@ts-ignore -- since auction config is of type object but we know what data is being passed in this.
                      adUnitCode: JSON.parse(auctionConfig?.sellerSignals.value)
                        ?.divId,
                    };
                  })
              );

              if (_interestGroupBuyers.size > 0) {
                const buyersWhoBid = new Set<string>();

                _receivedBids.forEach((event) => {
                  if (event.ownerOrigin) {
                    buyersWhoBid.add(event.ownerOrigin);
                  }
                });

                Array.from(
                  _interestGroupBuyers.difference(buyersWhoBid)
                ).forEach((buyer) => {
                  const auctionId =
                    uniqueAuctionId === '0'
                      ? _uniqueAuctionId
                      : uniqueAuctionId;

                  if (!auctionId) {
                    return;
                  }

                  _noBids[auctionId] = {
                    ownerOrigin: buyer,
                    name: name ?? '',
                    uniqueAuctionId: auctionId,
                    //@ts-ignore -- since auction config is of type object but we know what data is being passed in this.
                    adUnitCode: JSON.parse(auctionConfig?.sellerSignals.value)
                      ?.divId,
                  };
                });
              }
            }
          );
        });
      } else {
        const singleSellerAuctionEvents = _auctionEvents as SingleSellerAuction;

        Object.keys(singleSellerAuctionEvents).forEach((uniqueAuctionId) => {
          if ('globalEvents' === uniqueAuctionId) {
            return;
          }

          _receivedBids.push(
            ...singleSellerAuctionEvents[uniqueAuctionId].filter(
              (event) =>
                event.eventType === 'interestGroupAccessed' &&
                BIDDING_TYPES.includes(event.type)
            )
          );

          const { auctionConfig } =
            singleSellerAuctionEvents[uniqueAuctionId]?.[1] ?? {};

          const { name } =
            singleSellerAuctionEvents[uniqueAuctionId]?.find(
              (event) => event?.eventType === 'interestGroupAccessed'
            ) ?? {};

          if (_interestGroupBuyers.size > 0) {
            const buyersWhoBid = new Set<string>();

            _receivedBids.forEach((event) => {
              if (event.ownerOrigin) {
                buyersWhoBid.add(event.ownerOrigin);
              }
            });

            Array.from(_interestGroupBuyers.difference(buyersWhoBid)).forEach(
              (buyer) => {
                _noBids[uniqueAuctionId] = {
                  ownerOrigin: buyer,
                  name: name ?? '',
                  //@ts-ignore -- since auction config is of type object but we know what data is being passed in this.
                  adUnitCode: JSON.parse(auctionConfig?.sellerSignals)?.divId,
                  uniqueAuctionId,
                };
              }
            );
          }
        });
      }
      return { receivedBids: _receivedBids, noBids: _noBids };
    },
    []
  );

  const computeInterestGroupDetails = useCallback(
    (auctionEventsToBeParsed: singleAuctionEvent[]) => {
      if (!auctionEventsToBeParsed) {
        return [];
      }

      return Promise.all(
        auctionEventsToBeParsed
          .filter((event) => event.eventType === 'interestGroupAccessed')
          .map(async (event) => {
            if (!event?.name && !event?.ownerOrigin) {
              return {
                ...event,
                details: {},
              };
            }

            const result = (await chrome.debugger.sendCommand(
              { tabId: chrome.devtools.inspectedWindow.tabId },
              'Storage.getInterestGroupDetails',
              {
                name: event?.name,
                ownerOrigin: event?.ownerOrigin,
              }
            )) as Protocol.Storage.GetInterestGroupDetailsResponse;

            return {
              ...event,
              details: {
                ...result.details,
              },
            };
          })
      );
    },
    []
  );

  const messagePassingListener = useCallback(
    // eslint-disable-next-line complexity
    async (message: {
      type: string;
      payload: {
        tabId: number;
        auctionEvents: ProtectedAudienceContextType['state']['auctionEvents'];
        multiSellerAuction: boolean;
        globalEvents: singleAuctionEvent[];
      };
    }) => {
      if (!message.type) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;

      if (
        incomingMessageType === 'AUCTION_EVENTS' &&
        message.payload.auctionEvents
      ) {
        if (message.payload.tabId === tabId) {
          setIsMultiSellerAuction(message.payload.multiSellerAuction);

          setAuctionEvents((prevState) => {
            if (!prevState && message.payload.auctionEvents) {
              return message.payload.auctionEvents;
            }
            if (
              prevState &&
              message.payload.auctionEvents &&
              Object.keys(diff(prevState, message.payload.auctionEvents))
                .length > 0
            ) {
              return message.payload.auctionEvents;
            }
            return prevState;
          });

          let shapedInterestGroupDetails: ProtectedAudienceContextType['state']['interestGroupDetails'] =
            [];

          shapedInterestGroupDetails = await computeInterestGroupDetails(
            message.payload.globalEvents
          );

          const computedBids: {
            receivedBids: singleAuctionEvent[];
            noBids: NoBidsType;
          } | null = computeBids(
            message.payload.auctionEvents,
            message.payload.multiSellerAuction
          );

          if (computedBids) {
            setReceivedBids((prevState) => {
              if (
                Object.keys(diff(prevState, computedBids.receivedBids)).length >
                0
              ) {
                return computedBids.receivedBids;
              }

              return prevState;
            });

            setNoBids((prevState) => {
              if (
                Object.keys(diff(prevState, computedBids.noBids)).length > 0
              ) {
                return computedBids.noBids;
              }

              return prevState;
            });
          }

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
    [computeBids, computeInterestGroupDetails]
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
        isMultiSellerAuction,
        receivedBids,
        noBids,
      },
    };
  }, [
    auctionEvents,
    interestGroupDetails,
    isMultiSellerAuction,
    noBids,
    receivedBids,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
