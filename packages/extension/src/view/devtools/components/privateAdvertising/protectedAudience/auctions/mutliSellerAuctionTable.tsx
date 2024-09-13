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
import React, { useEffect } from 'react';
import type { MultiSellerAuction } from '@google-psat/common';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import AuctionTable from './auctionTable';

interface MultiSellerAuctionTableProps {
  auctionEvents: MultiSellerAuction;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const MultiSellerAuctionTable = ({
  auctionEvents,
  setSidebarData,
}: MultiSellerAuctionTableProps) => {
  useEffect(() => {
    const data = Object.keys(auctionEvents).reduce<SidebarItems>(
      (acc, parentAuctionId) => {
        const singleAuctionEvents = auctionEvents[parentAuctionId];
        const children = Object.entries(
          singleAuctionEvents
        ).reduce<SidebarItems>((childrenAcc, [uniqueAuctionId, events]) => {
          if (uniqueAuctionId === '0') {
            return childrenAcc;
          }

          childrenAcc[uniqueAuctionId] = {
            title: events?.[0]?.auctionConfig?.seller,
            panel: {
              Element: AuctionTable,
              props: {
                auctionEvents: events,
                parentOrigin: events?.[0]?.auctionConfig?.seller,
              },
            },
            children: {},
          };

          return childrenAcc;
        }, {});

        acc[parentAuctionId] = {
          title: singleAuctionEvents['0']?.[0]?.auctionConfig?.seller,
          panel: {
            Element: AuctionTable,
            props: {
              auctionEvents: Object.values(singleAuctionEvents)[0],
              parentOrigin:
                singleAuctionEvents['0']?.[0]?.auctionConfig?.seller,
            },
          },
          children,
        };

        return acc;
      },
      {}
    );

    setSidebarData(data);
  }, [auctionEvents, setSidebarData]);

  const { activePanel } = useSidebar(({ state }) => ({
    activePanel: state.activePanel,
  }));

  const { Element, props } = activePanel.panel;

  return (
    <div className="w-full h-full flex border-t border-chinese-silver dark:border-quartz">
      <Resizable
        defaultSize={{
          width: 200,
          height: '100%',
        }}
        minWidth={100}
        maxWidth={800}
        enable={{
          right: true,
        }}
      >
        <Sidebar />
      </Resizable>
      <div className="flex-1 h-full flex flex-col overflow-auto">
        {Element && <Element {...props} />}
      </div>
    </div>
  );
};

export default MultiSellerAuctionTable;
