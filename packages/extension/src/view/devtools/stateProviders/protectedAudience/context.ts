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
import React from 'react';
import {
  createContext,
  type AuctionEventsType,
  type InterestGroups,
  type ReceivedBids,
  type NoBidsType,
  type AdsAndBiddersType,
  noop,
} from '@google-psat/common';

export interface ProtectedAudienceContextType {
  state: {
    auctionEvents: AuctionEventsType;
    interestGroupDetails: InterestGroups[];
    isMultiSellerAuction: boolean;
    receivedBids: ReceivedBids[];
    noBids: NoBidsType;
    adsAndBidders: AdsAndBiddersType;
    selectedAdUnit: string | null;
  };
  actions: {
    setSelectedAdUnit: React.Dispatch<React.SetStateAction<string | null>>;
  };
}

const initialState: ProtectedAudienceContextType = {
  state: {
    auctionEvents: null,
    interestGroupDetails: [],
    isMultiSellerAuction: false,
    receivedBids: [],
    noBids: {},
    adsAndBidders: {},
    selectedAdUnit: null,
  },
  actions: {
    setSelectedAdUnit: noop,
  },
};

export default createContext<ProtectedAudienceContextType>(initialState);
