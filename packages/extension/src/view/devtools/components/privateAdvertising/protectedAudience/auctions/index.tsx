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
import type { singleAuctionEvent } from '@google-psat/common';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Breakpoints from './breakpoints';
import AuctionTable from './auctionTable';
import BottomTray from './bottomTray';
import MultiSellerAuctionTable from './mutliSellerAuctionTable';
import { useProtectedAudience } from '../../../../stateProviders';

const Auctions = () => {
  const [selectedJSON, setSelectedJSON] = useState<singleAuctionEvent | null>(
    null
  );

  const { auctionEvents, isMultiSellerAuction } = useProtectedAudience(
    ({ state }) => ({
      auctionEvents: state.auctionEvents ?? {},
      isMultiSellerAuction: state.isMultiSellerAuction,
    })
  );

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '75%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="20%"
        maxHeight="80%"
        className="overflow-auto"
      >
        <Breakpoints />
        {!isMultiSellerAuction ? (
          <div className="p-4 pt-0">
            <AuctionTable
              selectedJSON={selectedJSON}
              setSelectedJSON={setSelectedJSON}
              auctionEvents={
                (Object.values(auctionEvents ?? {})?.[0] ??
                  []) as singleAuctionEvent[]
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.keys(auctionEvents ?? {}).map((parentAuctionId) => (
              <MultiSellerAuctionTable
                key={parentAuctionId}
                selectedJSON={selectedJSON}
                setSelectedJSON={setSelectedJSON}
                auctionEvents={
                  (auctionEvents[parentAuctionId] || {}) as {
                    [uniqueAuctionId: string]: singleAuctionEvent[];
                  }
                }
              />
            ))}
          </div>
        )}
      </Resizable>
      <BottomTray selectedJSON={selectedJSON} />
    </div>
  );
};

export default Auctions;
