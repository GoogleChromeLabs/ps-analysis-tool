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
import type { singleAuctionEvent } from '@google-psat/common';
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
  }[]
) => {
  const bidEventsToBeReturned: singleAuctionEvent[] = [];

  interestGroups.forEach(({ interestGroupName, ownerOrigin }) => {
    const eventToModify: singleAuctionEvent = structuredClone(
      SYNTHETIC_AUCTION_EVENTS_BID
    ) as singleAuctionEvent;

    eventToModify.ownerOrigin = ownerOrigin;
    eventToModify.name = interestGroupName;
    eventToModify.bid = randomIntFromInterval(1, 100);

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
  eventStartTime: number
) => {
  const bidEvents = transformBidEvent(interestGroups);

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
  sellers: string[]
) => {
  const bidsArray: singleAuctionEvent[] = [];

  sellers.forEach((seller) => {
    bidsArray.push(
      ...(auctionData[seller]?.filter((event) => event.type === 'bid') ?? [])
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
  advertisers: string[]
) => {
  const events: { [key: string]: singleAuctionEvent[] } = {};

  sellersArray.forEach((seller) => {
    events[seller] = createAuctionEvents(
      interestGroups,
      seller,
      advertisers,
      new Date(currentSiteData?.datetime).getTime()
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
  const dateTimeString = new Date(currentSiteData?.datetime).toUTCString();
  const websiteString = `https://www.${currentSiteData?.website}`;
  const sellersArray = [];

  if (isMultiSeller) {
    sellersArray.push(
      'https://ssp-a.com',
      'https://ssp-b.com',
      'https://ssp-c.com'
    );
  } else {
    sellersArray.push(websiteString);
  }

  const auctionData = {
    'div-200-1': {
      [dateTimeString]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers
        ),
      },
    },
    'div-200-2': {
      [dateTimeString]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers
        ),
      },
    },
    'div-200-3': {
      [dateTimeString]: {
        [websiteString]: getFlattenedAuctionEvents(
          sellersArray,
          currentSiteData,
          interestGroups,
          advertisers
        ),
      },
    },
  };

  const receivedBids = {
    'div-200-1': getBidData(
      auctionData['div-200-1']?.[dateTimeString]?.[websiteString],
      sellersArray
    ),
    'div-200-2': getBidData(
      auctionData['div-200-2']?.[dateTimeString]?.[websiteString],
      sellersArray
    ),
    'div-200-3': getBidData(
      auctionData['div-200-3']?.[dateTimeString]?.[websiteString],
      sellersArray
    ),
  };

  const winningBids = {};

  return {
    auctionData,
    receivedBids,
    winningBids,
  };
};
