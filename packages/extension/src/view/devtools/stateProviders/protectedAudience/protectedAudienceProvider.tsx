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
import isEqual from 'lodash/isEqual';

/**
 * Internal dependencies.
 */
import Context, { type ProtectedAudienceContextType } from './context';
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

  const getParseAndUpdateStates = useCallback(
    async (
      multiSellerAuction: boolean,
      _auctionEvents: ProtectedAudienceContextType['state']['auctionEvents'],
      _globalEvents: singleAuctionEvent[],
      refreshTabData: boolean
    ) => {
      let didAuctionEventsChange = false;
      setIsMultiSellerAuction(multiSellerAuction);

      setAuctionEvents((prevState) => {
        if (!prevState && _auctionEvents) {
          didAuctionEventsChange = true;
          return _auctionEvents;
        }

        if (
          prevState &&
          _auctionEvents &&
          !isEqual(prevState, _auctionEvents)
        ) {
          didAuctionEventsChange = true;
          return _auctionEvents;
        }

        return prevState;
      });

      if (
        !didAuctionEventsChange &&
        isEqual(globalEvents.current, _globalEvents)
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
    },
    []
  );

  /**
   * Sets the auction events protected audience events etc for initial state.
   */
  const intitialSync = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const { protectedAudience } = await chrome.storage.session.get(
      'protectedAudience'
    );

    const {
      multiSellerAuction,
      auctionEvents: _auctionEvents,
      globalEvents: _globalEvents,
      refreshTabData,
    } = protectedAudience?.[tabId] ?? {};

    await getParseAndUpdateStates(
      multiSellerAuction,
      _auctionEvents,
      _globalEvents,
      refreshTabData
    );
  }, [getParseAndUpdateStates]);

  const sessionStorageListener = useCallback(
    // eslint-disable-next-line complexity
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
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

        await getParseAndUpdateStates(
          multiSellerAuction,
          _auctionEvents,
          _globalEvents,
          refreshTabData
        );
      }
    },
    [getParseAndUpdateStates]
  );

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(sessionStorageListener);

    return () => {
      chrome.storage.session.onChanged.removeListener(sessionStorageListener);
    };
  }, [sessionStorageListener]);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

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
