/*
 * Copyright 2024 Google LLC
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
import React, { useState } from 'react';
import type {
  MultiSellerAuction,
  singleAuctionEvent,
} from '@google-psat/common';

import { SidebarProvider } from '@google-psat/design-system';
/**
 * Internal dependencies.
 */
import Breakpoints from './breakpoints';
import AuctionTable from './auctionTable';
import MultiSellerAuctionTable from './mutliSellerAuctionTable';
import { useProtectedAudience } from '../../../../stateProviders';

const Auctions = () => {
  const [sidebarData, setSidebarData] = useState({});

  const { auctionEvents, isMultiSellerAuction } = useProtectedAudience(
    ({ state }) => ({
      auctionEvents: state.auctionEvents ?? {},
      isMultiSellerAuction: state.isMultiSellerAuction,
    })
  );

  if (!auctionEvents || Object.keys(auctionEvents).length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          No auction events were recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Breakpoints />
      <div className="overflow-auto flex-1">
        {!isMultiSellerAuction ? (
          <div className="p-4 pt-0">
            <AuctionTable
              auctionEvents={
                (Object.values(auctionEvents ?? {})?.[0] ??
                  []) as singleAuctionEvent[]
              }
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <SidebarProvider data={sidebarData}>
              <MultiSellerAuctionTable
                auctionEvents={auctionEvents as MultiSellerAuction}
                setSidebarData={setSidebarData}
              />
            </SidebarProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
