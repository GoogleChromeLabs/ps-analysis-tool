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
import { useTabs, type SidebarItems } from '@google-psat/design-system';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import AdUnits from '../../adUnits';
import useDataProcessing from './useDataProcessing';
import AdunitPanel from '../components/adunitPanel';
import PrebidTable from '../prebidTable';
import AuctionTable from '../components/table';

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
    adUnitsTimestamp,
    adUnitsMediaContainerSize,
    adUnitsBidsCount,
    adUnitsNoBidsCount,
    adUnitsBidders,
    adUnitsWinnerBid,
    adUnitsWinnerContainerSize,
    getPAData,
    getPrebidData,
  } = useDataProcessing();

  useEffect(() => {
    setSidebarData((prevSidebarData) => {
      const newSidebarData = { ...prevSidebarData };

      const adUnitContainerChildren = { ...newSidebarData.adunits.children };

      adUnits.forEach((adUnit) => {
        const mediaContainerSize = adUnitsMediaContainerSize?.[adUnit] || {
          prebid: [],
          paapi: [],
        };

        const bidders = adUnitsBidders?.[adUnit] || {
          prebid: [],
          paapi: [],
        };
        const biddersCount = {
          prebid: bidders?.prebid?.length || 0,
          paapi: bidders?.paapi?.length || 0,
        };
        const bidsCount = adUnitsBidsCount?.[adUnit] || {
          prebid: 0,
          paapi: 0,
        };
        const noBidsCount = adUnitsNoBidsCount[adUnit] || {
          prebid: 0,
          paapi: 0,
        };

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
              winnerBid: adUnitsWinnerBid?.[adUnit] || null,
              winningMediaContainer: adUnitsWinnerContainerSize?.[adUnit] || [],
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

          const auctionEvents = getPrebidData(adUnit, time);

          timeChildren[`${time}||${adUnit} Prebid`] = {
            title: 'Prebid',
            panel: {
              Element: PrebidTable,
              props: {
                auctionEvents,
                adUnit,
              },
            },
            isBlurred: Object.keys(auctionEvents || {}).length === 0,
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
    adUnitsWinnerBid,
    adUnitsWinnerContainerSize,
    getPAData,
    getPrebidData,
  ]);

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const storageRef = useRef<string>(storage[5] || '');

  const defaultSelectedItemKey = useMemo(() => {
    let key = '';

    adUnits.forEach((adUnit) => {
      adUnitsTimestamp[adUnit]?.forEach((timestamp) => {
        const auctionEvents = getPrebidData(adUnit, timestamp);

        if (storageRef.current === auctionEvents?.[0]) {
          key = `${timestamp}||${adUnit} Prebid`;
        }
      });
    });

    setStorage('', 5);

    return key;
  }, [adUnits, adUnitsTimestamp, getPrebidData, setStorage]);

  return {
    sidebarData,
    defaultSelectedItemKey: defaultSelectedItemKey || 'adunits',
  };
};

export default useSidebarProcessing;
