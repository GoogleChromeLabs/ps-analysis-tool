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
 * External dependencies
 */
import type {
  AdsAndBiddersType,
  ReceivedBids,
  singleAuctionEvent,
  AdsAndBiddersTypeData,
  NoBidsType,
} from '@google-psat/common';
import {
  publisherData,
  SINGLE_SELLER_CONFIG,
  MULTI_SELLER_CONFIG,
  app,
} from '@google-psat/explorable-explanations';
/**
 * Internal dependencies
 */
import {
  SYNTHETIC_AUCTION_CONFIG,
  SYNTHETIC_AUCTION_EVENT_BIDDERJS,
  SYNTHETIC_AUCTION_EVENT_CONFIG_RESOLVED,
  SYNTHETIC_AUCTION_EVENT_LOADED,
  SYNTHETIC_AUCTION_EVENT_STARTED,
  SYNTHETIC_AUCTION_EVENTS_BID,
} from './constants';
import formatTime from '../../../../../../store/utils/formatTime';
import type { AuctionEventsType } from '../../../../stateProviders/protectedAudience/context';

export interface StepType {
  title: string;
  description: string;
  ssp: string;
}

export interface CurrentSiteData {
  type: 'advertiser' | 'publisher';
  website: string;
  datetime: string;
  igGroupsCount: number;
  interestGroups: string[];
  visited: boolean;
  visitedIndex: boolean;
}

export type IGType = {
  interestGroupName: string;
  ownerOrigin: string;
};

export type IGWithcComponentSeller = {
  interestGroupName: string;
  ownerOrigin: string;
  componentSellerOrigin: string;
};

const getRandomisedNumbers = (count: number, min: number, max: number) => {
  const randomNumbers = Array.from(
    { length: count },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  randomNumbers.sort((a, b) => a - b);

  return randomNumbers;
};

export const transformAuctionConfig = (seller: string) => {
  //Using structured clone since it was seen while using normal assignment it didnt change the object properties.
  const eventAuctionConfig = structuredClone(SYNTHETIC_AUCTION_CONFIG);

  eventAuctionConfig.decisionLogicURL =
    eventAuctionConfig.decisionLogicURL.replace(
      'privacysandboxdemos-seller.domain-aaa.com',
      seller
    );

  eventAuctionConfig.trustedScoringSignalsURL =
    eventAuctionConfig.trustedScoringSignalsURL.replace(
      'privacysandboxdemos-seller.domain-aaa.com',
      seller
    );

  eventAuctionConfig.seller = eventAuctionConfig.seller.replace(
    'privacysandboxdemos-seller.domain-aaa.com',
    seller
  );

  eventAuctionConfig.trustedScoringSignalsURL =
    eventAuctionConfig.trustedScoringSignalsURL.replace(
      'privacysandboxdemos-seller.domain-aaa.com',
      seller
    );

  return eventAuctionConfig;
};

export const transformFetchingEvents = (
  advertisers: string[],
  type: 'finish' | 'start',
  seller: string,
  eventName:
    | 'bidderTrustedSignals'
    | 'sellerJS'
    | 'bidderJS'
    | 'sellerTrustedSignals'
) => {
  const fetchEventsToBeReturned: singleAuctionEvent[] = [];

  if (type === 'finish') {
    advertisers.forEach(() => {
      const eventToModify: singleAuctionEvent = structuredClone(
        SYNTHETIC_AUCTION_EVENT_BIDDERJS
      ) as singleAuctionEvent;

      eventToModify.type = 'Finished Fetch ' + eventName;
      eventToModify.auctionConfig = transformAuctionConfig(seller);

      eventToModify.eventType =
        'interestGroupAuctionNetworkRequestCompleted' as singleAuctionEvent['eventType'];

      fetchEventsToBeReturned.push(eventToModify);
    });

    return fetchEventsToBeReturned;
  } else {
    advertisers.forEach(() => {
      const eventToModify: singleAuctionEvent = structuredClone(
        SYNTHETIC_AUCTION_EVENT_BIDDERJS
      ) as singleAuctionEvent;

      eventToModify.type = 'Start Fetch ' + eventName;

      eventToModify.eventType =
        'interestGroupAuctionNetworkRequestCreated' as singleAuctionEvent['eventType'];

      fetchEventsToBeReturned.push(eventToModify);
    });

    return fetchEventsToBeReturned;
  }
};

export const transformStartedEvent = (seller: string) => {
  return {
    ...SYNTHETIC_AUCTION_EVENT_STARTED,
    auctionConfig: transformAuctionConfig(seller),
  };
};

export const transformConfigResolvedEvent = (seller: string) => {
  return {
    ...SYNTHETIC_AUCTION_EVENT_CONFIG_RESOLVED,
    auctionConfig: transformAuctionConfig(seller),
  };
};

export const transformLoadedEvent = (interestGroups: IGType[]) => {
  const interestGroupEvents: singleAuctionEvent[] = [];

  interestGroups.forEach(({ interestGroupName, ownerOrigin }) => {
    const eventToModify: singleAuctionEvent = structuredClone(
      SYNTHETIC_AUCTION_EVENT_LOADED
    ) as singleAuctionEvent;

    eventToModify.ownerOrigin = ownerOrigin;
    eventToModify.name = interestGroupName;

    interestGroupEvents.push(eventToModify);
  });

  return interestGroupEvents;
};

export const transformBidEvent = (
  interestGroups: IGType[],
  isTopLevel: boolean,
  currentStep: StepType | null,
  previousEvents: { [key: string]: singleAuctionEvent[] },
  seller: string
) => {
  const bidEventsToBeReturned: singleAuctionEvent[] = [];

  if (interestGroups.length === 0) {
    return bidEventsToBeReturned;
  }

  const uniqueOwnerOrigins = new Set<string>();
  interestGroups.forEach((interestGroup) => {
    uniqueOwnerOrigins.add(interestGroup.ownerOrigin);
  });

  const randomIndex = !isTopLevel
    ? randomIntFromInterval(0, interestGroups.length - 1)
    : -1;

  const interestGroupToProcess: IGType[] | IGWithcComponentSeller[] = isTopLevel
    ? (Object.keys(previousEvents)
        .map((key) => {
          if (seller === new URL(key).host) {
            return {
              interestGroupName: null,
              ownerOrigin: null,
              componentSellerOrigin: null,
            };
          }

          const _previousEvents = previousEvents[key];
          const bidEvents = _previousEvents.filter(
            (event) => event.type === 'win'
          )[0];

          return {
            interestGroupName: bidEvents.name as string,
            ownerOrigin: bidEvents.ownerOrigin as string,
            componentSellerOrigin: key,
          };
        })
        .filter((ig) =>
          Boolean(ig?.componentSellerOrigin)
        ) as unknown as IGWithcComponentSeller[])
    : interestGroups;

  const ownerOriginToSkip =
    currentStep?.title === SINGLE_SELLER_CONFIG.GENERATE_BID.title
      ? interestGroups[randomIndex].ownerOrigin
      : '';

  interestGroupToProcess.forEach(
    ({ interestGroupName, ownerOrigin }, index) => {
      if (
        !isTopLevel &&
        ownerOriginToSkip === ownerOrigin &&
        uniqueOwnerOrigins.size > 1
      ) {
        return;
      }

      const eventToModify: singleAuctionEvent = structuredClone(
        SYNTHETIC_AUCTION_EVENTS_BID
      ) as singleAuctionEvent;

      eventToModify.ownerOrigin = ownerOrigin;
      eventToModify.name = interestGroupName;
      eventToModify.bid = randomIntFromInterval(1, 100);

      if (isTopLevel) {
        eventToModify.type = 'topLevelBid';
        eventToModify.componentSellerOrigin =
          //@ts-ignore -- Since we are processing interest groups above which will have this information if its a top level bid.
          interestGroupToProcess[index].componentSellerOrigin;
      }

      bidEventsToBeReturned.push(eventToModify);
    }
  );

  return bidEventsToBeReturned;
};

export const createAuctionEvents = (
  interestGroups: IGType[],
  seller: string,
  advertisers: string[],
  eventStartTime: number,
  isTopLevelBid: boolean,
  currentStep: StepType | null,
  previousEvents: singleAuctionEvent[] | null,
  completeAuctionEvents: { [key: string]: singleAuctionEvent[] },
  isMultiSeller = false
) => {
  const bidEvents = transformBidEvent(
    interestGroups,
    isTopLevelBid,
    currentStep,
    completeAuctionEvents,
    seller
  );

  bidEvents.sort((a, b) => (a?.bid ?? 0) - (b?.bid ?? 0));
  const events: singleAuctionEvent[] = [...(previousEvents ?? [])];

  switch (currentStep?.title) {
    case SINGLE_SELLER_CONFIG.RUN_AD_AUCTION.title:
      events.push(
        transformStartedEvent(seller),
        transformConfigResolvedEvent(seller)
      );
      break;
    case SINGLE_SELLER_CONFIG.LOAD_INTEREST_GROUP.title:
      if (!isMultiSeller) {
        events.push(...transformLoadedEvent(interestGroups));
      }
      break;
    case SINGLE_SELLER_CONFIG.KEY_VALUE_DSP_SERVER.title:
      if (
        currentStep.description ===
        SINGLE_SELLER_CONFIG.KEY_VALUE_DSP_SERVER.description
      ) {
        events.push(
          ...transformFetchingEvents(
            advertisers,
            'start',
            seller,
            'bidderTrustedSignals'
          ),
          ...transformFetchingEvents(advertisers, 'start', seller, 'bidderJS'),
          ...transformFetchingEvents(advertisers, 'finish', seller, 'bidderJS'),
          ...transformFetchingEvents(
            advertisers,
            'finish',
            seller,
            'bidderTrustedSignals'
          )
        );
      } else {
        events.push(
          ...transformFetchingEvents(advertisers, 'start', seller, 'sellerJS'),
          ...transformFetchingEvents(
            advertisers,
            'start',
            seller,
            'sellerTrustedSignals'
          ),
          ...transformFetchingEvents(
            advertisers,
            'finish',
            seller,
            'sellerTrustedSignals'
          ),
          ...transformFetchingEvents(advertisers, 'finish', seller, 'sellerJS')
        );
      }
      break;
    case SINGLE_SELLER_CONFIG.GENERATE_BID.title:
      events.push(...bidEvents);
      break;
    case SINGLE_SELLER_CONFIG.SCORE_AD.title:
      if (bidEvents.length > 0) {
        events.push({
          formattedTime: '',
          uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
          name: bidEvents[bidEvents.length - 1].name,
          ownerOrigin: bidEvents[bidEvents.length - 1].ownerOrigin,
          type: 'win',
          time: -1734076670.129756,
          bid: bidEvents[bidEvents.length - 1].bid,
          bidCurrency: bidEvents[bidEvents.length - 1].bidCurrency,
          eventType: 'interestGroupAccessed' as singleAuctionEvent['eventType'],
        });
      }
      break;
    case MULTI_SELLER_CONFIG.SCORE_AD.title:
      events.push(
        transformStartedEvent(seller),
        transformConfigResolvedEvent(seller),
        ...transformFetchingEvents(advertisers, 'start', seller, 'sellerJS'),
        ...transformFetchingEvents(
          advertisers,
          'start',
          seller,
          'sellerTrustedSignals'
        ),
        ...transformFetchingEvents(
          advertisers,
          'finish',
          seller,
          'sellerTrustedSignals'
        ),
        ...transformFetchingEvents(advertisers, 'finish', seller, 'sellerJS'),
        ...transformFetchingEvents(advertisers, 'start', seller, 'bidderJS'),
        ...transformFetchingEvents(advertisers, 'finish', seller, 'bidderJS'),
        ...bidEvents,
        {
          formattedTime: '',
          uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
          name: bidEvents[bidEvents.length - 1].name,
          ownerOrigin: bidEvents[bidEvents.length - 1].ownerOrigin,
          type: 'win',
          time: -1734076670.129756,
          bid: bidEvents[bidEvents.length - 1].bid,
          bidCurrency: bidEvents[bidEvents.length - 1].bidCurrency,
          eventType: 'interestGroupAccessed' as singleAuctionEvent['eventType'],
        }
      );
      break;
    default:
      break;
  }

  const flattenedEvents = events.flat();
  const minValue = Number(
    previousEvents?.[previousEvents?.length - 1]?.formattedTime
      ?.toString()
      ?.slice(0, -2) ?? '0'
  );

  const randomNumbers = getRandomisedNumbers(1000, minValue, 2500);

  flattenedEvents.map((event, index) => {
    if (!event?.formattedTime.toString().startsWith('-') && event?.time > 0) {
      return event;
    }

    event.formattedTime = formatTime(
      eventStartTime,
      eventStartTime + randomNumbers[index] / 1000
    );

    event.time = eventStartTime + randomNumbers[index];

    return event;
  });

  flattenedEvents.sort((a, b) => a.time - b.time);

  return flattenedEvents;
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getBidData = (
  auctionData: { [key: string]: singleAuctionEvent[] },
  sellers: string[],
  adUnitCode: string
) => {
  const bidsArray: ReceivedBids[] = [];

  sellers.forEach((seller) => {
    const filteredBidEvents =
      auctionData?.[seller]?.filter((event) => event.type === 'bid') ?? [];

    bidsArray.push(
      ...filteredBidEvents.map((event) => {
        return {
          ...event,
          adUnitCode,
          mediaContainerSize: [[320, 320]],
          mediaType: 'video',
        };
      })
    );
  });

  return bidsArray;
};

const getFlattenedAuctionEvents = (
  sellersArray: string[],
  currentSiteData: CurrentSiteData,
  interestGroups: IGType[],
  advertisers: string[],
  isMultiSeller: boolean,
  currentStep: StepType | null,
  previousEvents: { [key: string]: singleAuctionEvent[] } | null
) => {
  const events: { [key: string]: singleAuctionEvent[] } = {};

  const host = new URL(`https://www.${currentSiteData?.website}`).host;

  if (isMultiSeller) {
    const [firstElement, ...restOfArray] = sellersArray;
    const newSellersArray = [...restOfArray, firstElement];
    const sellerIndexToBeProcessed = newSellersArray.indexOf(
      currentStep?.ssp ?? ''
    );

    newSellersArray.forEach((seller, index) => {
      if (index === sellerIndexToBeProcessed) {
        events[seller] = createAuctionEvents(
          interestGroups,
          new URL(seller).host,
          advertisers,
          new Date(currentSiteData?.datetime).getTime(),
          new URL(seller).host === host && isMultiSeller,
          currentStep,
          previousEvents?.[seller] ?? [],
          previousEvents ?? {},
          isMultiSeller
        );
      }

      if (index < sellerIndexToBeProcessed) {
        events[seller] = previousEvents?.[seller] ?? [];
      }
    });

    if (!events?.[`https://www.${currentSiteData?.website}`]) {
      events[`https://www.${currentSiteData?.website}`] = [];
    }
  } else {
    sellersArray.forEach((seller) => {
      events[seller] = createAuctionEvents(
        interestGroups,
        new URL(seller).host,
        advertisers,
        new Date(currentSiteData?.datetime).getTime(),
        new URL(seller).host === host && isMultiSeller,
        currentStep,
        previousEvents?.[seller] ?? [],
        {}
      );
    });
  }

  return events;
};

export const configuredAuctionEvents = (
  interestGroups: IGType[],
  advertisers: string[],
  isMultiSeller: boolean,
  currentSiteData: CurrentSiteData,
  currentStep: StepType | null,
  previousEvents: AuctionEventsType | null,
  selectedAdUnit: string | null,
  selectedDateTime: string | null
) => {
  const websiteString = `https://www.${currentSiteData?.website}`;
  const sellersArray = [];

  const isInteractiveModeLastStep =
    currentStep?.title === SINGLE_SELLER_CONFIG.SHOW_WINNING_AD.title &&
    (app.isInteractiveMode || app.isRevisitingNodeInInteractiveMode);

  if (isMultiSeller) {
    sellersArray.push(
      websiteString,
      ...publisherData[currentSiteData?.website].ssps.map(
        (data: string[]) => data[1]
      )
    );
  } else {
    sellersArray.push(websiteString);
  }

  const adunits = publisherData[currentSiteData?.website].adunits as string[];
  const dates = publisherData[currentSiteData?.website].branches.map(
    (branch: { date: string; time: string }) => branch.date + ' ' + branch.time
  ) as string[];

  let auctionData: AuctionEventsType = {
    [adunits[0]]: {
      [dates[0]]: {
        [websiteString]: {
          [websiteString]: [],
        },
      },
    },
    [adunits[1]]: {
      [dates[1]]: {
        [websiteString]: {
          [websiteString]: [],
        },
      },
    },
    [adunits[2]]: {
      [dates[2]]: {
        [websiteString]: {
          [websiteString]: [],
        },
      },
    },
  };

  if (!selectedAdUnit) {
    return {
      auctionData: null,
      receivedBids: null,
      adsAndBidders: null,
    };
  }

  if (!adunits.find((adUnit) => adUnit === selectedAdUnit)) {
    return {
      auctionData: null,
      receivedBids: null,
      adsAndBidders: null,
    };
  }

  auctionData[selectedAdUnit] = {};

  if (!selectedDateTime) {
    return {
      auctionData: auctionData,
      receivedBids: null,
      adsAndBidders: null,
    };
  }

  if (!dates.find((date) => date === selectedDateTime)) {
    return {
      auctionData: auctionData,
      receivedBids: null,
      adsAndBidders: null,
    };
  }

  auctionData[selectedAdUnit][selectedDateTime] = {
    [websiteString]: {
      [websiteString]: [],
    },
  };

  auctionData[selectedAdUnit][selectedDateTime][websiteString] =
    getFlattenedAuctionEvents(
      sellersArray,
      currentSiteData,
      interestGroups,
      advertisers,
      isMultiSeller,
      currentStep,
      previousEvents?.[selectedAdUnit]?.[selectedDateTime]?.[websiteString] ??
        {}
    );

  if (isInteractiveModeLastStep) {
    auctionData = previousEvents as AuctionEventsType;
  }
  const receivedBids: { [key: string]: ReceivedBids[] } = {
    [adunits[0]]: [] as ReceivedBids[],
    [adunits[1]]: [] as ReceivedBids[],
    [adunits[2]]: [] as ReceivedBids[],
  };

  receivedBids[selectedAdUnit] = getBidData(
    auctionData[selectedAdUnit]?.[selectedDateTime]?.[websiteString],
    sellersArray,
    selectedAdUnit
  );

  const bidderData = getBidData(
    auctionData[selectedAdUnit]?.[selectedDateTime]?.[websiteString],
    sellersArray,
    selectedAdUnit
  );

  const noBidders: IGType[] = [];

  const biddingOwners = new Set<string>();

  bidderData.forEach((bidder) => {
    biddingOwners.add(bidder.ownerOrigin ?? '');
  });

  interestGroups.forEach(({ ownerOrigin, interestGroupName }) => {
    if (!biddingOwners.has(ownerOrigin)) {
      noBidders.push({ ownerOrigin: ownerOrigin, interestGroupName });
    }
  });

  const noBids: NoBidsType = {};
  if (receivedBids[selectedAdUnit].length !== 0) {
    noBidders.forEach((bidder) => {
      noBids['27A93A016A30D0A5FB7B8C8779D98AF8'] = {
        uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
        adUnitCode: selectedAdUnit,
        mediaContainerSize: [[320, 320]],
        name: bidder.interestGroupName,
        ownerOrigin: bidder.ownerOrigin,
      };
    });
  }

  const adsAndBidders: AdsAndBiddersType = {
    [adunits[0]]: {
      adUnitCode: adunits[0],
      bidders: [] as string[],
      mediaContainerSize: [[320, 320]],
    } as AdsAndBiddersTypeData,
    [adunits[1]]: {
      adUnitCode: adunits[1],
      bidders: [] as string[],
      mediaContainerSize: [[320, 320]],
    } as AdsAndBiddersTypeData,
    [adunits[2]]: {
      adUnitCode: adunits[2],
      bidders: [] as string[],
      mediaContainerSize: [[320, 320]],
    } as AdsAndBiddersTypeData,
  };

  adsAndBidders[selectedAdUnit] = {
    adUnitCode: selectedAdUnit,
    bidders: sellersArray,
    mediaContainerSize: [[320, 320]],
    winningBid: getBidData(
      auctionData[selectedAdUnit]?.[selectedDateTime]?.[websiteString],
      sellersArray,
      selectedAdUnit
    ).filter(({ type }) => type === 'win')?.[0]?.bid,
    bidCurrency: 'USD',
    winningBidder: 'DSP 1',
  } as AdsAndBiddersTypeData;

  return {
    auctionData,
    receivedBids,
    adsAndBidders,
    noBids,
  };
};
