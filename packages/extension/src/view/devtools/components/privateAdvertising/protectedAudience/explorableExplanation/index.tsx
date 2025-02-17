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
import { TabsProvider, type TabItems } from '@google-psat/design-system';
import {
  type AdsAndBiddersType,
  type NoBidsType,
  type ReceivedBids,
  type InterestGroups,
  updateSessionStorage,
  getSessionStorage,
} from '@google-psat/common';
import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { app, config } from '@google-psat/explorable-explanations';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import IGTable from '../interestGroups/table';
import { SYNTHETIC_INTEREST_GROUPS } from './constants';
import Info from './tableTabPanels/info';
import {
  configuredAuctionEvents,
  type CurrentSiteData,
  type StepType,
} from './auctionEventTransformers';
import BidsPanel from '../bids/panel';
import type { AuctionEventsType } from '../../../../stateProviders/protectedAudience/context';
import Auctions from './tableTabPanels/auctions';
import Legend from './tableTabPanels/legend';
import { transformInterestGroup } from './interestGroupTransformer';

const STORAGE_KEY = 'paExplorableExplanation';
const DEFAULT_SETTINGS = {
  isInteractiveMode: false,
  isMultiSeller: false,
};
const INIT_STATE = {
  auctionData: {},
  receivedBids: {},
  adsAndBidders: {},
  noBids: {},
};

const ExplorableExplanation = () => {
  const [currentSiteData, setCurrentSiteData] =
    useState<CurrentSiteData | null>(null);
  const [hasLastNodeVisited, setHasLastNodeVisited] = useState(false);

  const [isMultiSeller, setIsMultiSeller] = useState(false);
  const [selectedAdUnit, setSelectedAdUnit] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const previousAuctionData = useRef<AuctionEventsType | null>(null);

  const [interestGroupsData, setInterestGroupsData] = useState<
    InterestGroups[]
  >([]);
  const [currentStep, setCurrentStep] = useState<StepType>({} as StepType);
  const [sitesVisited, setSitesVisited] = useState<string[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const hasDataBeenFetchedFromSessionStorage = useRef<boolean>(false);

  const [interactiveMode, _setInteractiveMode] = useState(false);

  const [interestGroupUpdateIndicator, setInterestGroupUpdateIndicator] =
    useState(-1);
  const [auctionUpdateIndicator, setAuctionUpdateIndicator] = useState(-1);
  const [bidsUpdateIndicator, setBidsUpdateIndicator] = useState(-1);

  const setInteractiveMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSitesVisited([]);
      _setInteractiveMode(event.target.checked);
      setHasLastNodeVisited(false);
      setCurrentSiteData(null);
    },
    []
  );

  useEffect(() => {
    (async () => {
      if (!hasDataBeenFetchedFromSessionStorage.current) {
        return;
      }

      await updateSessionStorage(
        { interactiveMode, isMultiSeller },
        STORAGE_KEY
      );
    })();
  }, [interactiveMode, isMultiSeller]);

  useEffect(() => {
    if (currentSiteData === null || hasLastNodeVisited) {
      setInterestGroupUpdateIndicator(-1);
      setAuctionUpdateIndicator(-1);
      setBidsUpdateIndicator(-1);
    }
  }, [currentSiteData, hasLastNodeVisited]);

  useEffect(() => {
    if (!hasDataBeenFetchedFromSessionStorage.current) {
      return;
    }

    app.toggleInteractiveMode();
    setSitesVisited([]);
  }, [interactiveMode]);

  useEffect(() => {
    if (!hasDataBeenFetchedFromSessionStorage.current) {
      return;
    }

    setTimeout(() => {
      app.reset();
    }, 100);

    setTimeout(() => {
      app.play(true);
    }, 300);

    setSitesVisited([]);
  }, [isMultiSeller]);

  useEffect(() => {
    (async () => {
      const data = (await getSessionStorage(STORAGE_KEY)) || {};
      if (Object.prototype.hasOwnProperty.call(data, 'interactiveMode')) {
        _setInteractiveMode(data.interactiveMode);
      }

      if (Object.prototype.hasOwnProperty.call(data, 'isMultiSeller')) {
        setIsMultiSeller(data.isMultiSeller);
      }

      hasDataBeenFetchedFromSessionStorage.current = true;
    })();

    return () => {
      app.isInteractiveMode = DEFAULT_SETTINGS.isInteractiveMode;
      app.isMultiSeller = DEFAULT_SETTINGS.isMultiSeller;
    };
  }, []);

  const getInterestGroupData = useCallback(
    (
      siteData: typeof currentSiteData,
      prevInterestGroupsData: InterestGroups[]
    ) => {
      if (!siteData) {
        return [];
      }

      if (app.isInteractiveMode) {
        const _sitesVisited: string[] = [];
        const requiredIG: InterestGroups[] = [];

        app.visitedIndexOrder.forEach((index: number) => {
          const website = config.timeline.circles[index].website;
          _sitesVisited.push(website);
          requiredIG.push(...transformInterestGroup(website));
        });

        setSitesVisited(() => _sitesVisited);

        if (requiredIG.length > prevInterestGroupsData.length) {
          setInterestGroupUpdateIndicator(
            (prev) => (prev === -1 ? 0 : prev) ^ 1
          );
        }

        return requiredIG;
      }

      let hasReached = -1;
      const requiredIG = Object.keys(SYNTHETIC_INTEREST_GROUPS)
        .map((site, index) => {
          if (hasReached !== -1) {
            return null;
          }

          if (site === siteData?.website) {
            hasReached = index;
          }

          return transformInterestGroup(site);
        })
        .filter((_data) => _data !== null)
        .flat();

      setSitesVisited(() =>
        Object.keys(SYNTHETIC_INTEREST_GROUPS).slice(0, hasReached + 1)
      );

      if (siteData?.type !== 'publisher') {
        if (requiredIG.length > prevInterestGroupsData.length) {
          setInterestGroupUpdateIndicator(
            (prev) => (prev === -1 ? 0 : prev) ^ 1
          );
        }
      }

      return requiredIG;
    },
    []
  );

  const lastVisitedNode = useRef<string | undefined>(undefined);

  const _setCurrentSiteData = useCallback(
    (siteData: typeof currentSiteData) => {
      previousAuctionData.current = null;
      setCurrentStep({} as StepType);
      setSelectedAdUnit(null);
      setSelectedDateTime(null);
      setCurrentSiteData((prev) => {
        lastVisitedNode.current = prev?.website;

        return siteData;
      });
      setInterestGroupsData((prev) => getInterestGroupData(siteData, prev));
    },
    [getInterestGroupData]
  );

  const [auctionsData, setAuctionsData] = useState<{
    auctionData: AuctionEventsType | null;
    receivedBids: Record<string, ReceivedBids[]> | null;
    adsAndBidders: AdsAndBiddersType | null;
    noBids?: NoBidsType;
  } | null>(INIT_STATE);

  useEffect(() => {
    setAuctionsData((prevData) => {
      if (!currentSiteData || currentSiteData?.type === 'advertiser') {
        previousAuctionData.current = null;
        setAuctionUpdateIndicator(-1);
        setBidsUpdateIndicator(-1);
        return INIT_STATE;
      }

      if (lastVisitedNode.current !== currentSiteData.website) {
        setAuctionUpdateIndicator(-1);
        setBidsUpdateIndicator(-1);
        lastVisitedNode.current = currentSiteData.website;
      }

      const advertiserSet = sitesVisited.filter(
        (site) => Object.keys(SYNTHETIC_INTEREST_GROUPS[site]).length > 0
      );

      const interestGroups = advertiserSet.map((advertiser) => {
        return SYNTHETIC_INTEREST_GROUPS[advertiser].map((interestGroup) => {
          return {
            interestGroupName: interestGroup.name as string,
            ownerOrigin: interestGroup.ownerOrigin as string,
          };
        });
      });

      const { auctionData, receivedBids, adsAndBidders, noBids } =
        configuredAuctionEvents(
          interestGroups.flat(),
          Array.from(advertiserSet),
          isMultiSeller,
          currentSiteData,
          currentStep,
          previousAuctionData.current,
          selectedAdUnit,
          selectedDateTime
        );

      previousAuctionData.current = auctionData;

      if (auctionData) {
        const isDataEqual = isEqual(auctionData, prevData?.auctionData);

        if (!isDataEqual) {
          setAuctionUpdateIndicator((prev) => (prev === -1 ? 0 : prev) ^ 1);
        }
      }

      if (receivedBids || noBids) {
        const isDataEqual = isEqual(
          { receivedBids, noBids },
          {
            receivedBids: prevData?.receivedBids,
            noBids: prevData?.noBids,
          }
        );

        if (!isDataEqual) {
          setBidsUpdateIndicator((prev) => (prev === -1 ? 0 : prev) ^ 1);
        }
      }

      return {
        auctionData: auctionData ?? {},
        receivedBids: receivedBids ?? {},
        adsAndBidders: adsAndBidders ?? {},
        noBids: noBids ?? {},
      };
    });
  }, [
    currentSiteData,
    sitesVisited,
    isMultiSeller,
    currentStep,
    selectedAdUnit,
    selectedDateTime,
  ]);

  const [highlightedInterestGroup, setHighlightedInterestGroup] = useState<{
    interestGroupName: string;
    interestGroupOwner: string;
    color: string;
  } | null>(null);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: IGTable,
          props: {
            interestGroupDetails: [...(interestGroupsData as InterestGroups[])],
            highlightedInterestGroup,
            isEE: true,
          },
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
          props: {
            auctionEvents: auctionsData,
            noBids: auctionsData?.noBids ?? {},
            customAdsAndBidders: auctionsData?.adsAndBidders,
            isMultiSeller,
            selectedAdUnit,
            selectedDateTime,
          },
        },
      },
      {
        title: 'Bids',
        content: {
          Element: BidsPanel,
          props: {
            receivedBids: Object.keys(auctionsData?.receivedBids ?? {})
              .map((key: string) => auctionsData?.receivedBids?.[key] ?? [])
              .flat(),
            noBids: auctionsData?.noBids ?? {},
            eeAnimatedTab: true,
          },
        },
      },
      {
        title: 'Info',
        content: {
          Element: Info,
          props: {
            data: info,
          },
        },
      },
      {
        title: 'Legend',
        content: {
          Element: Legend,
        },
      },
    ],
    [
      interestGroupsData,
      highlightedInterestGroup,
      auctionsData,
      isMultiSeller,
      info,
    ]
  );

  return (
    <TabsProvider items={tabItems} name="explorableExplanation">
      <Panel
        currentSiteData={currentSiteData}
        setCurrentSite={_setCurrentSiteData}
        setInteractiveMode={setInteractiveMode}
        interactiveMode={interactiveMode}
        info={info}
        setInfo={setInfo}
        highlightedInterestGroup={highlightedInterestGroup}
        setHighlightedInterestGroup={setHighlightedInterestGroup}
        isMultiSeller={isMultiSeller}
        setIsMultiSeller={setIsMultiSeller}
        setCurrentStep={setCurrentStep}
        setSelectedAdUnit={setSelectedAdUnit}
        setSelectedDateTime={setSelectedDateTime}
        interestGroupUpdateIndicator={interestGroupUpdateIndicator}
        auctionUpdateIndicator={auctionUpdateIndicator}
        bidsUpdateIndicator={bidsUpdateIndicator}
        setHasLastNodeVisited={setHasLastNodeVisited}
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
