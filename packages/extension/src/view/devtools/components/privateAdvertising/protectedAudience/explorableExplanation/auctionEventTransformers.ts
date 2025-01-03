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

  eventAuctionConfig.decisionLogicURL.replace(
    'privacysandboxdemos-seller.domain-aaa',
    seller
  );

  eventAuctionConfig.seller.replace(
    'privacysandboxdemos-seller.domain-aaa',
    seller
  );

  eventAuctionConfig.trustedScoringSignalsURL.replace(
    'privacysandboxdemos-seller.domain-aaa',
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

      eventToModify.eventType = 'interestGroupAuctionNetworkRequestCompleted';

      fetchEventsToBeReturned.push(eventToModify);
    });

    return fetchEventsToBeReturned;
  } else {
    advertisers.forEach(() => {
      const eventToModify: singleAuctionEvent = structuredClone(
        SYNTHETIC_AUCTION_EVENT_BIDDERJS
      ) as singleAuctionEvent;

      eventToModify.type = 'Start Fetch ' + eventName;

      eventToModify.eventType = 'interestGroupAuctionNetworkRequestCreated';

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
      eventType: 'interestGroupAccessed',
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
