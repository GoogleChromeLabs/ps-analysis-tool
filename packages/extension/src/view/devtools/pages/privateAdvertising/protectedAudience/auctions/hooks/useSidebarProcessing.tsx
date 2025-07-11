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
import {
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  useTabs,
  type SidebarItems,
} from '@google-psat/design-system';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import AdUnits from '../../adUnits';
import useDataProcessing from './useDataProcessing';
import AdunitPanel from '../components/adunitPanel';
import PrebidTable from '../prebidTable';
import AuctionTable from '../components/table';
import Placeholder from '../components/placeholder';
import SortButton from '../components/sortButton';
import { usePrebid, useProtectedAudience } from '../../../../../stateProviders';

const useSidebarProcessing = () => {
  const { sortOrder, setSortOrder, _paAuctionEvents } = useProtectedAudience(
    ({ state, actions }) => ({
      sortOrder: state.sortOrder,
      setSortOrder: actions.setSortOrder,
      _paAuctionEvents: state.auctionEvents,
    })
  );

  const { _prebidAuctionEvents } = usePrebid(({ state }) => ({
    _prebidAuctionEvents: state.prebidData?.auctionEvents || {},
  }));

  const changedValue = useRef({ oldAuctionEvents: {}, oldSortOrder: '' });

  const { updateSelectedItemKey, isSidebarFocused, isKeySelected } = useSidebar(
    ({ state, actions }) => ({
      updateSelectedItemKey: actions.updateSelectedItemKey,
      isSidebarFocused: state.isSidebarFocused,
      isKeySelected: actions.isKeySelected,
    })
  );

  const [sidebarData, setSidebarData] = useState<SidebarItems>({
    adunits: {
      title: 'Ad Units',
      panel: {
        Element: AdUnits,
        props: {
          navigateToSettings: () => {
            updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
          },
        },
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
    receivedBids: processedReceivedBids,
    adUnitsWinnerBid,
    adUnitsWinnerContainerSize,
    getPAData,
    getPrebidData,
  } = useDataProcessing();

  useEffect(() => {
    return () => {
      changedValue.current = {
        oldAuctionEvents: {
          _prebidAuctionEvents,
          _paAuctionEvents,
        },
        oldSortOrder: sortOrder ?? '',
      };
    };
  }, [_paAuctionEvents, _prebidAuctionEvents, sortOrder]);

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
        const receivedBids = processedReceivedBids || {
          prebid: [],
          paapi: [],
        };

        adUnitContainerChildren[adUnit] = {
          title: adUnit,
          panel: {
            Element: AdunitPanel,
            props: {
              adunit: adUnit,
              mediaContainerSize,
              receivedBids,
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
            panel: {
              Element: Placeholder,
            },
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
                componentAuctionCount: Object.keys(PAData[key].children).length,
                auctionEvents: PAData[key].auctionEvents,
                parentOrigin: PAData[key].parentOrigin,
                startDate: PAData[key].startDate,
                updateSelectedItemKey,
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
                        updateSelectedItemKey,
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
        adUnitContainerChildren[adUnit].extraInterfaceToTitle = {
          Element: SortButton,
          props: {
            setSortOrder,
            sortOrder,
            isSidebarFocused: isSidebarFocused && isKeySelected(adUnit),
          },
        };
      });

      if (adUnits.length === 0) {
        newSidebarData.adunits.children = {};
      } else {
        newSidebarData.adunits.children = {
          ...adUnitContainerChildren,
        };
        if (sortOrder === 'asc') {
          Object.keys(newSidebarData['adunits'].children).forEach((adUnit) => {
            const sortedKeys = Object.keys(
              newSidebarData['adunits'].children[adUnit].children
            ).sort((a, b) => {
              return (
                new Date(a.split('||')[0]).getTime() -
                new Date(b.split('||')[0]).getTime()
              );
            });
            newSidebarData['adunits'].children[adUnit].children =
              sortedKeys.reduce((acc, key) => {
                acc[key] =
                  newSidebarData['adunits'].children[adUnit].children[key];
                return acc;
              }, {} as SidebarItems);
          });
        } else {
          Object.keys(newSidebarData['adunits'].children).forEach((adUnit) => {
            const sortedKeys = Object.keys(
              newSidebarData['adunits'].children[adUnit].children
            ).sort((a, b) => {
              return (
                new Date(b.split('||')[0]).getTime() -
                new Date(a.split('||')[0]).getTime()
              );
            });

            newSidebarData['adunits'].children[adUnit].children =
              sortedKeys.reduce((acc, key) => {
                acc[key] =
                  newSidebarData['adunits'].children[adUnit].children[key];
                return acc;
              }, {} as SidebarItems);
          });
        }
      }

      return newSidebarData;
    });
  }, [
    processedReceivedBids,
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
    updateSelectedItemKey,
    setSortOrder,
    sortOrder,
    isSidebarFocused,
    isKeySelected,
  ]);

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const storageRef = useRef<string>(storage[5] || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultSelectedItemKey = useMemo(() => {
    let key = '';

    adUnits.forEach((adUnit) => {
      if (key) {
        return;
      }

      adUnitsTimestamp[adUnit]?.forEach((timestamp) => {
        if (key) {
          return;
        }

        const prebidAuctionEvents = getPrebidData(adUnit, timestamp);

        if (storageRef.current === prebidAuctionEvents?.[0]) {
          key = `${timestamp}||${adUnit} Prebid`;
        }

        if (key) {
          return;
        }

        const paAuctionEvents =
          Object.values(
            getPAData(
              adUnit,
              timestamp,
              adUnitsAuctionId?.[adUnit]?.[timestamp] || ''
            )
          )?.[0]?.auctionEvents || [];

        if (
          paAuctionEvents?.length &&
          storageRef.current === paAuctionEvents?.[0]?.uniqueAuctionId
        ) {
          key = `${timestamp}||${
            adUnitsAuctionId?.[adUnit]?.[timestamp] || ''
          }||${adUnit}`;
        }
      });
    });

    timeoutRef.current = setTimeout(() => {
      setStorage('', 5);
    });

    return key;
  }, [
    adUnits,
    adUnitsAuctionId,
    adUnitsTimestamp,
    getPAData,
    getPrebidData,
    setStorage,
  ]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    sidebarData,
    defaultSelectedItemKey: defaultSelectedItemKey || 'adunits',
    hasData: Object.keys(sidebarData.adunits.children).length > 0,
  };
};

export default useSidebarProcessing;
