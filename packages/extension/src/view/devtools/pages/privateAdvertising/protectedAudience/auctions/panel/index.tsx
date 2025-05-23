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
import { Resizable } from 're-resizable';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
} from '@google-psat/design-system';
import type {
  AdsAndBiddersType,
  NoBidsType,
  ReceivedBids,
  singleAuctionEvent,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import type { AuctionEventsType } from '../../../../../stateProviders/protectedAudience/context';
import AuctionTable from '../table';
import AdunitPanel from '../adunitPanel';
import AdunitSubPanel from '../adunitPanel/panel';

interface AuctionPanelProps {
  auctionEvents: {
    auctionData: AuctionEventsType;
    receivedBids?: Record<string, singleAuctionEvent[]> | ReceivedBids[];
    noBids: NoBidsType;
  };
  isEE?: boolean;
  customAdsAndBidders?: AdsAndBiddersType;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
  isMultiSeller?: boolean;
  selectedAdUnit?: string;
  selectedDateTime?: string;
}

const AuctionPanel = ({
  auctionEvents,
  setSidebarData,
  customAdsAndBidders,
  isMultiSeller = false,
  selectedAdUnit,
  selectedDateTime,
  isEE = true,
}: AuctionPanelProps) => {
  useEffect(() => {
    const Panel = customAdsAndBidders ? AdunitSubPanel : AdunitPanel;

    setSidebarData((prev) => {
      const newData = { ...prev } as SidebarItems;
      const data = newData['adunits']?.children ?? {};
      const auctionEventsData = auctionEvents?.auctionData ?? {};
      Object.keys(auctionEventsData).forEach((adUnit) => {
        const adUnitChildren = {
          ...data[adUnit]?.children,
        } as SidebarItems;

        Object.keys(auctionEventsData[adUnit]).forEach((time) => {
          const actualTime = time.split('||')[0];
          const parentAuctionId = time.split('||')[1];

          if (
            data[adUnit] &&
            data[adUnit].children &&
            data[adUnit].children[time]
          ) {
            return;
          }

          let children = {
            ...adUnitChildren[time]?.children,
          } as SidebarItems;

          const sellerUrl = Object.keys(auctionEventsData[adUnit][time])[0];

          const nonSplittedSellerUrl = Object.keys(
            auctionEventsData[adUnit][time][sellerUrl]
          )[0];

          const entries = Object.entries(
            auctionEventsData[adUnit][time][sellerUrl]
          )
            .filter(([url]) => {
              const splittedUrl = url.split('||');

              if (isMultiSeller) {
                return !(
                  splittedUrl[0] === sellerUrl &&
                  splittedUrl[1] === parentAuctionId
                );
              }
              return splittedUrl[0] !== sellerUrl;
            })
            .reduce<SidebarItems>((acc, [url, events]) => {
              acc[url.split('||')[0] + actualTime + adUnit] = {
                title: events[0]?.auctionConfig?.seller ?? url.split('||')[0],
                panel: {
                  Element: AuctionTable,
                  props: {
                    auctionEvents: events,
                    parentOrigin: events[0]?.auctionConfig?.seller,
                    startDate: actualTime,
                    isBlurred: events.length === 0,
                  },
                },
                children: {},
                dropdownOpen: false,
              };

              return acc;
            }, {});

          children = {
            ...children,
            ...entries,
          };

          let shouldBeBlurred = true;

          if (isMultiSeller) {
            shouldBeBlurred = isEE
              ? !(
                  selectedAdUnit === adUnit &&
                  selectedDateTime === selectedDateTime
                )
              : Object.keys(auctionEventsData[adUnit][time][sellerUrl])
                  .length === 0;
          } else {
            shouldBeBlurred =
              auctionEventsData[adUnit][time][sellerUrl][sellerUrl].length ===
              0;
          }

          adUnitChildren[time + adUnit] = {
            title: actualTime,
            panel: {
              Element: AuctionTable,
              props: {
                auctionEvents:
                  auctionEventsData[adUnit][time][sellerUrl][
                    nonSplittedSellerUrl
                  ],
                parentOrigin:
                  auctionEventsData[adUnit][time][sellerUrl][
                    nonSplittedSellerUrl
                  ][0]?.auctionConfig?.seller,
                startDate: actualTime,
              },
            },
            children,
            dropdownOpen: isMultiSeller,
            isBlurred: shouldBeBlurred,
          };
        });

        data[adUnit] = {
          title: adUnit,
          panel: {
            Element: Panel,
            props: {
              adunit: adUnit,
              adsAndBidders: customAdsAndBidders,
              receivedBids: auctionEvents?.receivedBids ?? {},
              noBids: auctionEvents?.noBids ?? {},
            },
          },
          children: adUnitChildren,
          dropdownOpen: true,
        };
      });

      newData['adunits'].children = data;

      return newData;
    });
  }, [
    isEE,
    auctionEvents,
    setSidebarData,
    customAdsAndBidders,
    isMultiSeller,
    selectedAdUnit,
    selectedDateTime,
  ]);

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

export default AuctionPanel;
