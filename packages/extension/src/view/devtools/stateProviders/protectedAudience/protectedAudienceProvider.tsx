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
import shouldUpdateState from '../../../../utils/shouldUpdateState';
import {
  computeInterestGroupDetails,
  computeReceivedBidsAndNoBids,
} from './utils';

const Provider = ({ children }: PropsWithChildren) => {
  const [auctionEvents, setAuctionEvents] =
    useState<ProtectedAudienceContextType['state']['auctionEvents']>(null);

  const [isMultiSellerAuction, setIsMultiSellerAuction] =
    useState<boolean>(false);

  const globalEvents = useRef<singleAuctionEvent[] | null>([]);

  const [interestGroupDetails, setInterestGroupDetails] = useState<
    ProtectedAudienceContextType['state']['interestGroupDetails']
  >([]);

  const [receivedBids, setReceivedBids] = useState<
    ProtectedAudienceContextType['state']['receivedBids']
  >([]);

  const [noBids, setNoBids] = useState<
    ProtectedAudienceContextType['state']['noBids']
  >({});

  const [adsAndBidders, setAdsAndBidders] = useState<
    ProtectedAudienceContextType['state']['adsAndBidders']
  >({});

  const sessionStorageListener = useCallback(
    // eslint-disable-next-line complexity
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      let didAuctionEventsChange = false;

      if (!changes) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (changes?.protectedAudience?.newValue[tabId]) {
        const {
          multiSellerAuction,
          auctionEvents: _auctionEvents,
          globalEvents: _globalEvents,
          refreshTabData,
        } = changes?.protectedAudience?.newValue[tabId] ?? {};

        setIsMultiSellerAuction(multiSellerAuction);

        setAuctionEvents((prevState) => {
          if (!prevState && _auctionEvents) {
            didAuctionEventsChange = true;
            return _auctionEvents;
          }

          if (
            prevState &&
            _auctionEvents &&
            shouldUpdateState(prevState, _auctionEvents)
          ) {
            didAuctionEventsChange = true;
            return _auctionEvents;
          }

          return prevState;
        });

        if (
          !didAuctionEventsChange &&
          !shouldUpdateState(globalEvents.current, _globalEvents)
        ) {
          return;
        }

        let shapedInterestGroupDetails: ProtectedAudienceContextType['state']['interestGroupDetails'] =
          [];

        shapedInterestGroupDetails = await computeInterestGroupDetails(
          _globalEvents
        );

        globalEvents.current = _globalEvents;

        const computedBids: {
          receivedBids: ReceivedBids[];
          noBids: NoBidsType;
        } | null = computeReceivedBidsAndNoBids(
          _auctionEvents,
          multiSellerAuction,
          refreshTabData
        );

        if (computedBids) {
          const adUnitCodeToBidders: ProtectedAudienceContextType['state']['adsAndBidders'] =
            {};

          computedBids.receivedBids.forEach(
            ({ adUnitCode, ownerOrigin, mediaContainerSize }) => {
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
                      ...(adUnitCodeToBidders[adUnitCode]?.mediaContainerSize ??
                        []),
                      mediaContainerSize
                    )
                  ),
                ],
              };
            }
          );

          setAdsAndBidders((prevState) => {
            return shouldUpdateState(prevState, adUnitCodeToBidders)
              ? adUnitCodeToBidders
              : prevState;
          });

          setReceivedBids((prevState) => {
            return shouldUpdateState(prevState, computedBids.receivedBids)
              ? computedBids.receivedBids
              : prevState;
          });

          setNoBids((prevState) => {
            return shouldUpdateState(prevState, computedBids.noBids)
              ? computedBids.noBids
              : prevState;
          });
        }

        setInterestGroupDetails((prevState) => {
          return shouldUpdateState(prevState, shapedInterestGroupDetails)
            ? shapedInterestGroupDetails
            : prevState;
        });
      }
    },
    []
  );

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(sessionStorageListener);

    return () => {
      chrome.storage.session.onChanged.removeListener(sessionStorageListener);
    };
  }, [sessionStorageListener]);

  const memoisedValue: ProtectedAudienceContextType = useMemo(() => {
    return {
      state: {
        auctionEvents,
        interestGroupDetails,
        isMultiSellerAuction,
        receivedBids,
        noBids,
        adsAndBidders,
      },
    };
  }, [
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
