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
  useRef,
} from 'react';
import type {
  NoBidsType,
  singleAuctionEvent,
  ReceivedBids,
  SingleSellerAuction,
  MultiSellerAuction,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Context, { type ProtectedAudienceContextType } from './context';
import {
  computeInterestGroupDetails,
  computeReceivedBidsAndNoBids,
} from './utils';
import { isEqual } from 'lodash-es';

const Provider = ({ children }: PropsWithChildren) => {
  const [auctionEvents, setAuctionEvents] =
    useState<ProtectedAudienceContextType['state']['auctionEvents']>(null);

  const [isMultiSellerAuction, setIsMultiSellerAuction] =
    useState<boolean>(false);

  const globalEvents = useRef<singleAuctionEvent[] | null>([]);

  const [interestGroupDetails, setInterestGroupDetails] = useState<
    ProtectedAudienceContextType['state']['interestGroupDetails']
  >([]);

  const [selectedAdUnit, setSelectedAdUnit] = useState<string | null>(null);

  const [receivedBids, setReceivedBids] = useState<
    ProtectedAudienceContextType['state']['receivedBids']
  >([]);

  const [noBids, setNoBids] = useState<
    ProtectedAudienceContextType['state']['noBids']
  >({});

  const [adsAndBidders, setAdsAndBidders] = useState<
    ProtectedAudienceContextType['state']['adsAndBidders']
  >({});

  const reshapeAuctionEvents = useCallback(
    (
      auctionEventsToBeParsed: SingleSellerAuction | MultiSellerAuction | null,
      isMultiSeller: boolean
    ) => {
      let didAuctionEventsChange = false;

      const reshapeSingleSeller = (prevState: typeof auctionEvents) => {
        const reshapedAuctionEvents: ProtectedAudienceContextType['state']['auctionEvents'] =
          {
            ...prevState,
          };

        if (!auctionEventsToBeParsed) {
          return null;
        }

        Object.values(auctionEventsToBeParsed as SingleSellerAuction).forEach(
          (events) => {
            const configResolvedEvent = events.filter(
              (event) => event.type === 'configResolved'
            )?.[0];

            const adUnitCode = JSON.parse(
              // @ts-ignore - sellerSignals is not defined in type, but it is in the data
              configResolvedEvent?.auctionConfig?.sellerSignals?.value ?? '{}'
            ).divId;

            if (!adUnitCode) {
              return;
            }

            const time = new Date(events?.[0]?.time * 1000).toUTCString();

            reshapedAuctionEvents[adUnitCode] = {
              ...reshapedAuctionEvents[adUnitCode],
              [time + '||' + events?.[0]?.uniqueAuctionId]: {
                // @ts-ignore - seller is not defined in type, but it is in the data
                [configResolvedEvent.auctionConfig?.seller ?? '']: {
                  // @ts-ignore - seller is not defined in type, but it is in the data
                  [configResolvedEvent.auctionConfig?.seller ?? '']: events,
                },
              },
            };
          }
        );

        return reshapedAuctionEvents;
      };

      const reshapeMultiSeller = (prevState: typeof auctionEvents) => {
        const reshapedAuctionEvents: ProtectedAudienceContextType['state']['auctionEvents'] =
          { ...prevState };

        if (!auctionEventsToBeParsed) {
          return null;
        }

        Object.values(auctionEventsToBeParsed as MultiSellerAuction).forEach(
          (events) => {
            let adUnit = '';

            Object.values(events).forEach((event) => {
              if (adUnit) {
                return;
              }

              const configResolvedEvent = event.filter(
                (_event) => _event.type === 'configResolved'
              )?.[0];

              adUnit = JSON.parse(
                // @ts-ignore - sellerSignals is not defined in type, but it is in the data
                configResolvedEvent?.auctionConfig?.sellerSignals?.value ?? '{}'
              ).divId;
            });

            if (!adUnit) {
              return;
            }

            const time = new Date(
              events?.['0']?.[0]?.time * 1000
            ).toUTCString();

            const sspEvents = Object.values(events).reduce((acc, event) => {
              // @ts-ignore
              const seller = event?.[0]?.auctionConfig?.seller ?? '';

              acc[seller] = event;

              return acc;
            }, {} as Record<string, singleAuctionEvent[]>);

            reshapedAuctionEvents[adUnit] = {
              ...reshapedAuctionEvents[adUnit],
              // @ts-ignore
              [time + '||' + events?.['0']?.[0].uniqueAuctionId]: {
                // @ts-ignore
                [events?.['0']?.[0]?.auctionConfig?.seller ?? '']: {
                  ...sspEvents,
                },
              },
            };
          }
        );

        return reshapedAuctionEvents;
      };

      setAuctionEvents((prevState) => {
        if (
          auctionEventsToBeParsed &&
          !isEqual(prevState || {}, auctionEventsToBeParsed)
        ) {
          didAuctionEventsChange = true;
          const data = isMultiSeller
            ? reshapeMultiSeller(prevState)
            : reshapeSingleSeller(prevState);

          return data;
        }

        return prevState;
      });

      return didAuctionEventsChange;
    },
    []
  );

  const messagePassingListener = useCallback(
    // eslint-disable-next-line complexity
    async (message: {
      type: string;
      payload: {
        tabId: number;
        auctionEvents: SingleSellerAuction | MultiSellerAuction | null;
        multiSellerAuction: boolean;
        globalEvents: singleAuctionEvent[];
        refreshTabData: boolean;
      };
    }) => {
      let didAuctionEventsChange = false;

      if (!['AUCTION_EVENTS'].includes(message.type)) {
        return;
      }

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

          didAuctionEventsChange = reshapeAuctionEvents(
            message.payload.auctionEvents,
            message.payload.multiSellerAuction
          );

          if (
            !didAuctionEventsChange &&
            isEqual(globalEvents.current, message.payload.globalEvents)
          ) {
            return;
          }

          let shapedInterestGroupDetails: ProtectedAudienceContextType['state']['interestGroupDetails'] =
            [];

          shapedInterestGroupDetails = await computeInterestGroupDetails(
            message.payload.globalEvents
          );

          globalEvents.current = message.payload.globalEvents;

          const computedBids: {
            receivedBids: ReceivedBids[];
            noBids: NoBidsType;
          } | null = computeReceivedBidsAndNoBids(
            message.payload.auctionEvents,
            message.payload.multiSellerAuction
          );

          const keys = Object.keys(message.payload.auctionEvents ?? {});
          const latestAuctionId = keys[keys.length - 1];

          if (computedBids) {
            const adUnitCodeToBidders: ProtectedAudienceContextType['state']['adsAndBidders'] =
              {};
            const uniqueAuctionIDToBids: { [key: string]: ReceivedBids[] } = {};

            computedBids.receivedBids.forEach((bids) => {
              const { uniqueAuctionId } = bids;

              if (!uniqueAuctionId) {
                return;
              }

              if (!uniqueAuctionIDToBids[uniqueAuctionId]) {
                uniqueAuctionIDToBids[uniqueAuctionId] = [bids];
              } else {
                uniqueAuctionIDToBids[uniqueAuctionId].push(bids);
              }

              uniqueAuctionIDToBids[uniqueAuctionId].sort((a, b) => {
                if (!a?.bid || !b?.bid) {
                  return 0;
                }
                return b.bid - a.bid;
              });
            });

            const highestBidData = uniqueAuctionIDToBids[latestAuctionId]?.[0];
            computedBids.receivedBids.forEach(
              ({
                adUnitCode,
                ownerOrigin,
                mediaContainerSize,
                bidCurrency,
              }) => {
                if (!adUnitCode) {
                  return;
                }

                adUnitCodeToBidders[adUnitCode] = {
                  adUnitCode:
                    adUnitCodeToBidders[adUnitCode]?.adUnitCode ?? adUnitCode,
                  bidders: [
                    ...new Set<string>([
                      ...(adUnitCodeToBidders[adUnitCode]?.bidders ?? []),
                      ...(ownerOrigin ? [ownerOrigin] : []),
                    ]),
                  ],
                  mediaContainerSize: [
                    Array.from(
                      new Set(
                        ...(adUnitCodeToBidders[adUnitCode]
                          ?.mediaContainerSize ?? []),
                        mediaContainerSize
                      )
                    ),
                  ],
                  bidCurrency: bidCurrency ?? '',
                  winningBid: highestBidData?.bid ?? 0,
                  winningBidder: highestBidData?.ownerOrigin ?? '',
                };
              }
            );

            setAdsAndBidders((prevState) => {
              return !isEqual(prevState, adUnitCodeToBidders)
                ? adUnitCodeToBidders
                : prevState;
            });

            setReceivedBids((prevState) => {
              return !isEqual(prevState, computedBids.receivedBids)
                ? computedBids.receivedBids
                : prevState;
            });

            setNoBids((prevState) => {
              return !isEqual(prevState, computedBids.noBids)
                ? computedBids.noBids
                : prevState;
            });
          }

          setInterestGroupDetails((prevState) => {
            return !isEqual(prevState, shapedInterestGroupDetails)
              ? shapedInterestGroupDetails
              : prevState;
          });
        }
      }
    },
    [reshapeAuctionEvents]
  );
  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        (frameType !== 'outermost_frame' && frameId !== 0) ||
        tabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      setNoBids({});
      setReceivedBids([]);
      setAdsAndBidders({});
      setAuctionEvents({});
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

  const memoisedValue: ProtectedAudienceContextType = useMemo(() => {
    return {
      state: {
        auctionEvents,
        interestGroupDetails,
        isMultiSellerAuction,
        receivedBids,
        noBids,
        adsAndBidders,
        selectedAdUnit,
      },
      actions: {
        setSelectedAdUnit,
      },
    };
  }, [
    selectedAdUnit,
    auctionEvents,
    interestGroupDetails,
    isMultiSellerAuction,
    noBids,
    receivedBids,
    adsAndBidders,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
