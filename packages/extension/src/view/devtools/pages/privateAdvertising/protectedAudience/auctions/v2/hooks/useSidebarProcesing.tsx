/*
 * Copyright 2025 Google LLC
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
import type { SidebarItems } from '@google-psat/design-system';
import AdUnits from '../../../adUnits';
import { useEffect, useState } from 'react';
import useDataProcessing from './useDataProcessing';
import AdunitPanel from '../../components/adunitPanel';
import PrebidTable from '../prebidTable';
import AuctionTable from '../../components/table';

const useSidebarProcessing = () => {
  const [sidebarData, setSidebarData] = useState<SidebarItems>({
    adunits: {
      title: 'Ad Units',
      panel: {
        Element: AdUnits,
        props: {},
      },
      children: {},
      dropdownOpen: true,
    },
  });

  const {
    adUnits,
    adUnitsAuctionId,
    adUnitsMediaContainerSize,
    adUnitsBidsCount,
    adUnitsNoBidsCount,
    adUnitsBidders,
    adUnitsTimestamp,
    getPAData,
    getPrebidData,
  } = useDataProcessing();

  useEffect(() => {
    setSidebarData((prevSidebarData) => {
      const newSidebarData = { ...prevSidebarData };

      const adUnitContainerChildren = { ...newSidebarData.adunits.children };

      adUnits.forEach((adUnit) => {
        const mediaContainerSize = adUnitsMediaContainerSize?.[adUnit] || [];
        const bidders = adUnitsBidders?.[adUnit] || [];
        const biddersCount = bidders.length;
        const bidsCount = adUnitsBidsCount?.[adUnit] || 0;
        const noBidsCount = adUnitsNoBidsCount[adUnit] || 0;

        adUnitContainerChildren[adUnit] = {
          title: adUnit,
          panel: {
            Element: AdunitPanel,
            props: {
              adunit: adUnit,
              mediaContainerSize,
              bidders,
              biddersCount,
              bidsCount,
              noBidsCount,
            },
          },
          children: {},
          dropdownOpen: true,
        };

        const adUnitChildren = { ...adUnitContainerChildren[adUnit].children };

        adUnitsTimestamp[adUnit]?.forEach((time) => {
          adUnitChildren[`${time}||${adUnit}`] = {
            title: time,
            children: {},
          };

          const timeChildren = {
            ...adUnitChildren[`${time}||${adUnit}`].children,
          };

          timeChildren[`${time}||${adUnit} Prebid`] = {
            title: 'Prebid',
            panel: {
              Element: PrebidTable,
              props: {
                auctionEvents: getPrebidData(adUnit, time),
                adUnit,
              },
            },
            children: {},
          };

          timeChildren[`${time}||${adUnit} Adserver`] = {
            title: 'Adserver',
            children: {},
            isBlurred: true,
          };

          const parentAuctionId = adUnitsAuctionId?.[adUnit]?.[time] || '';
          const PAData = getPAData(adUnit, time, parentAuctionId);

          const key = `${time}||${parentAuctionId}||${adUnit}`;

          timeChildren[key] = {
            title: 'PAAPI',
            panel: {
              Element: AuctionTable,
              props: {
                auctionEvents: PAData[key].auctionEvents,
                parentOrigin: PAData[key].parentOrigin,
                startDate: PAData[key].startDate,
              },
            },
            isBlurred: PAData[key].isBlurred,
            children: {
              ...Object.entries(PAData[key].children).reduce(
                (acc, [childKey, childValue]: [string, any]) => {
                  acc[childKey] = {
                    title: childValue.title,
                    panel: {
                      Element: AuctionTable,
                      props: {
                        auctionEvents: childValue.auctionEvents,
                        parentOrigin: childValue.parentOrigin,
                        startDate: childValue.startDate,
                        isBlurred: childValue.isBlurred,
                      },
                    },
                    children: {},
                  };
                  return acc;
                },
                {} as SidebarItems
              ),
            },
          };

          adUnitChildren[`${time}||${adUnit}`].children = {
            ...timeChildren,
          };
        });

        adUnitContainerChildren[adUnit].children = {
          ...adUnitChildren,
        };
      });

      newSidebarData.adunits.children = {
        ...adUnitContainerChildren,
      };

      return newSidebarData;
    });
  }, [
    adUnits,
    adUnitsAuctionId,
    adUnitsBidders,
    adUnitsBidsCount,
    adUnitsMediaContainerSize,
    adUnitsNoBidsCount,
    adUnitsTimestamp,
    getPAData,
    getPrebidData,
  ]);

  return {
    sidebarData,
  };
};

export default useSidebarProcessing;
