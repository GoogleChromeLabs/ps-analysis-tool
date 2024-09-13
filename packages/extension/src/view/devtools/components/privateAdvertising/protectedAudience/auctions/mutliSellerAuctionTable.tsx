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
import React from 'react';
import type { singleAuctionEvent } from '@google-psat/common';
import AuctionTable from './auctionTable';

interface MultiSellerAuctionTableProps {
  selectedJSON: singleAuctionEvent | null;
  setSelectedJSON: React.Dispatch<
    React.SetStateAction<singleAuctionEvent | null>
  >;
  auctionEvents: {
    [uniqueAuctionId: string]: singleAuctionEvent[];
  };
}

const MultiSellerAuctionTable = ({
  selectedJSON,
  setSelectedJSON,
  auctionEvents,
}: MultiSellerAuctionTableProps) => {
  // @ts-ignore - seller is present in auctionConfig
  const parentOrigin = auctionEvents['0']?.[0]?.auctionConfig?.seller;

  return (
    <div className="max-w-full h-fit flex flex-col border border-chinese-silver dark:border-quartz m-4 p-4">
      <h1 className="text-sm text-raisin-black dark:text-bright-gray">
        Auction started by <i>{parentOrigin}</i>
      </h1>
      <div className="flex-1 flex flex-col gap-4 divide-y divide-american-silver">
        {Object.entries(auctionEvents).map(([uniqueAuctionId, events]) => {
          if (uniqueAuctionId === '0') {
            return null;
          }

          return (
            <AuctionTable
              key={uniqueAuctionId}
              selectedJSON={selectedJSON}
              setSelectedJSON={setSelectedJSON}
              auctionEvents={events}
              parentOrigin={parentOrigin}
            />
          );
        })}
        <AuctionTable
          key={'0'}
          selectedJSON={selectedJSON}
          setSelectedJSON={setSelectedJSON}
          auctionEvents={auctionEvents['0']}
        />
      </div>
    </div>
  );
};

export default MultiSellerAuctionTable;
