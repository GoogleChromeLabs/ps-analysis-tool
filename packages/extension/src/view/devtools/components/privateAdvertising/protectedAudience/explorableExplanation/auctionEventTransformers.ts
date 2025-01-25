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
import type { ReceivedBids, singleAuctionEvent } from '@google-psat/common';
import { publisherData } from '@google-psat/explorable-explanations';
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

export interface CurrentSiteData {
  type: 'advertiser' | 'publisher';
  website: string;
  datetime: string;
  igGroupsCount: number;
  interestGroups: string[];
  visited: boolean;
  visitedIndex: boolean;
}

export type AdUnitLiteral = 'div-200-1' | 'div-200-2' | 'div-200-3';

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

export const transformLoadedEvent = (
  interestGroups: {
    interestGroupName: string;
    ownerOrigin: string;
  }[]
) => {
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
  interestGroups: {
    interestGroupName: string;
    ownerOrigin: string;
  }[],
  isTopLevel: boolean
) => {
  const bidEventsToBeReturned: singleAuctionEvent[] = [];

  interestGroups.forEach(({ interestGroupName, ownerOrigin }) => {
    const eventToModify: singleAuctionEvent = structuredClone(
      SYNTHETIC_AUCTION_EVENTS_BID
    ) as singleAuctionEvent;

    eventToModify.ownerOrigin = ownerOrigin;
    eventToModify.name = interestGroupName;
    eventToModify.bid = randomIntFromInterval(1, 100);

    if (isTopLevel) {
      eventToModify.type = 'topLevelBid';
    }

    bidEventsToBeReturned.push(eventToModify);
  });

  return bidEventsToBeReturned;
};

export const createAuctionEvents = (
  interestGroups: {
    interestGroupName: string;
    ownerOrigin: string;
  }[],
  seller: string,
  advertisers: string[],
  eventStartTime: number,
  isTopLevelBid: boolean
) => {
  const bidEvents = transformBidEvent(interestGroups, isTopLevelBid);

  bidEvents.sort((a, b) => (a?.bid ?? 0) - (b?.bid ?? 0));

  const events = [
    transformStartedEvent(seller),
    transformConfigResolvedEvent(seller),
    transformLoadedEvent(interestGroups),
    transformFetchingEvents(
      advertisers,
      'start',
      seller,
      'bidderTrustedSignals'
    ),
    transformFetchingEvents(advertisers, 'start', seller, 'bidderJS'),
    transformFetchingEvents(advertisers, 'start', seller, 'sellerJS'),
    transformFetchingEvents(advertisers, 'finish', seller, 'bidderJS'),
    transformFetchingEvents(
      advertisers,
      'start',
      seller,
      'sellerTrustedSignals'
    ),
    bidEvents,
    transformFetchingEvents(
      advertisers,
      'finish',
      seller,
      'sellerTrustedSignals'
    ),
    {
      formattedTime: '',
      uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
      name: bidEvents[bidEvents.length - 1].name,
      ownerOrigin: bidEvents[bidEvents.length - 1].ownerOrigin,
      type: 'win',
      time: 1734076670.129756,
      bid: bidEvents[bidEvents.length - 1].bid,
      bidCurrency: bidEvents[bidEvents.length - 1].bidCurrency,
      eventType: 'interestGroupAccessed' as singleAuctionEvent['eventType'],
    },
    transformFetchingEvents(
      advertisers,
      'finish',
      seller,
      'bidderTrustedSignals'
    ),
  ];

  const flattenedEvents = events.flat();

  const randomNumbers = getRandomisedNumbers(flattenedEvents.length, 0, 1000);

  flattenedEvents.map((event, index) => {
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
      auctionData[seller]?.filter((event) => event.type === 'bid') ?? [];

    bidsArray.push(
      ...filteredBidEvents.map((event) => {
        return {
          ...event,
          adUnitCode,
          adContainerSize: [[320, 320]],
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
  interestGroups: {
    interestGroupName: string;
    ownerOrigin: string;
  }[],
  advertisers: string[],
  isMultiSeller: boolean
) => {
  const events: { [key: string]: singleAuctionEvent[] } = {};
  const host = new URL(`https://www.${currentSiteData?.website}`).host;

  sellersArray.forEach((seller) => {
    events[seller] = createAuctionEvents(
      interestGroups,
      new URL(seller).host,
      advertisers,
      new Date(currentSiteData?.datetime).getTime(),
      new URL(seller).host === host && isMultiSeller
    );
  });

  return events;
};

export const configuredAuctionEvents = (
  interestGroups: {
    interestGroupName: string;
    ownerOrigin: string;
  }[],
  advertisers: string[],
  isMultiSeller: boolean,
  currentSiteData: CurrentSiteData
) => {
  const websiteString = `https://www.${currentSiteData?.website}`;
  const sellersArray = [];

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

  const adunits = publisherData[currentSiteData?.website].adunits;
  const dates = publisherData[currentSiteData?.website].branches.map(
    (branch: { date: string; time: string }) => branch.date + ' ' + branch.time
  );

  const auctionData = {
    [adunits[0]]: {
      [dates[0]]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers,
          isMultiSeller
        ),
      },
    },
    [adunits[1]]: {
      [dates[1]]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers,
          isMultiSeller
        ),
      },
    },
    [adunits[2]]: {
      [dates[2]]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers,
          isMultiSeller
        ),
      },
    },
  };

  const receivedBids = {
    [adunits[0]]: getBidData(
      auctionData[adunits[0]]?.[dates[0]]?.[websiteString],
      sellersArray,
      adunits[0]
    ),
    [adunits[1]]: getBidData(
      auctionData[adunits[1]]?.[dates[1]]?.[websiteString],
      sellersArray,
      adunits[1]
    ),
    [adunits[2]]: getBidData(
      auctionData[adunits[2]]?.[dates[2]]?.[websiteString],
      sellersArray,
      adunits[2]
    ),
  };

  const adsAndBidders = {
    [adunits[0]]: {
      adUnitCode: adunits[0],
      bidders: sellersArray,
      mediaContainerSize: [[320, 320]],
      winningBid: getBidData(
        auctionData[adunits[0]]?.[dates[0]]?.[websiteString],
        sellersArray,
        adunits[0]
      ).filter(({ type }) => type === 'win')?.[0]?.bid,
      bidCurrency: 'USD',
      winningBidder: 'DSP 1',
    },
    [adunits[1]]: {
      adUnitCode: adunits[1],
      bidders: sellersArray,
      mediaContainerSize: [[320, 320]],
      winningBid: getBidData(
        auctionData[adunits[1]]?.[dates[1]]?.[websiteString],
        sellersArray,
        adunits[1]
      ).filter(({ type }) => type === 'win')?.[0]?.bid,
      bidCurrency: 'USD',
      winningBidder: 'DSP 1',
    },
    [adunits[2]]: {
      adUnitCode: adunits[2],
      bidders: sellersArray,
      mediaContainerSize: [[320, 320]],
      winningBid: getBidData(
        auctionData[adunits[2]]?.[dates[2]]?.[websiteString],
        sellersArray,
        adunits[2]
      ).filter(({ type }) => type === 'win')?.[0]?.bid,
      bidCurrency: 'USD',
      winningBidder: 'DSP 1',
    },
  };

  return {
    auctionData,
    receivedBids,
    adsAndBidders,
  };
};
