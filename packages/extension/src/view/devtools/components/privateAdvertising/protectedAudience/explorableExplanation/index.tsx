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
import { isEqual } from 'lodash-es';

const STORAGE_KEY = 'paExplorableExplanation';
const DEFAULT_SETTINGS = {
  isInteractiveMode: false,
  isMultiSeller: false,
};

const ExplorableExplanation = () => {
  const [currentSiteData, setCurrentSiteData] =
    useState<CurrentSiteData | null>(null);

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
      app.toggleInteractiveMode();
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
    if (currentSiteData === null) {
      setInterestGroupUpdateIndicator(-1);
      setAuctionUpdateIndicator(-1);
      setBidsUpdateIndicator(-1);
    }
  }, [currentSiteData]);

  useEffect(() => {
    if (interactiveMode !== app.isInteractiveMode) {
      app.toggleInteractiveMode();
      setSitesVisited([]);
    }
  }, [interactiveMode]);

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
          requiredIG.push(...SYNTHETIC_INTEREST_GROUPS[website]);
        });

        setSitesVisited(() => _sitesVisited);
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

          return SYNTHETIC_INTEREST_GROUPS[site];
        })
        .filter((_data) => _data !== null)
        .flat();

      setSitesVisited(() =>
        Object.keys(SYNTHETIC_INTEREST_GROUPS).slice(0, hasReached + 1)
      );

      if (siteData?.type !== 'publisher') {
        const isDataEqual = isEqual(requiredIG, prevInterestGroupsData);

        if (!isDataEqual) {
          setInterestGroupUpdateIndicator(
            (prev) => (prev === -1 ? 0 : prev) ^ 1
          );
        }
      }

      return requiredIG;
    },
    []
  );

  const _setCurrentSiteData = useCallback(
    (siteData: typeof currentSiteData) => {
      previousAuctionData.current = null;
      setCurrentStep({} as StepType);
      setSelectedAdUnit(null);
      setSelectedDateTime(null);
      setCurrentSiteData(() => siteData);
      setInterestGroupsData((prev) => getInterestGroupData(siteData, prev));
    },
    [getInterestGroupData]
  );

  const [auctionsData, setAuctionsData] = useState<{
    auctionData: AuctionEventsType | null;
    receivedBids: Record<string, ReceivedBids[]> | null;
    adsAndBidders: AdsAndBiddersType | null;
    noBids?: NoBidsType;
  } | null>(null);

  useEffect(() => {
    setAuctionsData((prevData) => {
      if (!currentSiteData || currentSiteData?.type === 'advertiser') {
        previousAuctionData.current = null;
        return null;
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
        auctionData,
        receivedBids,
        adsAndBidders,
        noBids,
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
            customAdsAndBidders: auctionsData?.adsAndBidders,
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
    ],
    [auctionsData, highlightedInterestGroup, interestGroupsData, info]
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
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
