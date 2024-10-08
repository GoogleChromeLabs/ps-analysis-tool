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

  const messagePassingListener = useCallback(
    // eslint-disable-next-line complexity
    async (message: {
      type: string;
      payload: {
        tabId: number;
        auctionEvents: ProtectedAudienceContextType['state']['auctionEvents'];
        multiSellerAuction: boolean;
        globalEvents: singleAuctionEvent[];
        refreshTabData: boolean;
      };
    }) => {
      let didAuctionEventsChange = false;

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
              didAuctionEventsChange = true;
              return message.payload.auctionEvents;
            }

            if (
              prevState &&
              message.payload.auctionEvents &&
              !isEqual(prevState, message.payload.auctionEvents)
            ) {
              didAuctionEventsChange = true;
              return message.payload.auctionEvents;
            }

            return prevState;
          });

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
            message.payload.multiSellerAuction,
            message.payload.refreshTabData
          );

          if (computedBids) {
            const adUnitCodeToBidders: ProtectedAudienceContextType['state']['adsAndBidders'] =
              {};

            computedBids.receivedBids.forEach(
              ({
                adUnitCode,
                ownerOrigin,
                mediaContainerSize,
                bid,
                bidCurrency,
              }) => {
                if (!adUnitCode) {
                  return;
                }

                let winningBid = bid ?? 0;
                let winningBidder = ownerOrigin ?? '';

                if (
                  winningBid &&
                  winningBid < adUnitCodeToBidders[adUnitCode]?.winningBid
                ) {
                  winningBid = adUnitCodeToBidders[adUnitCode]?.winningBid;
                  winningBidder =
                    adUnitCodeToBidders[adUnitCode]?.winningBidder;
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
                  winningBid,
                  winningBidder,
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
