/*
 * Copyright 2023 Google LLC
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
 * Internal dependencies
 */
import {
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
} from '../../../constants';
import { decycle } from '../../utils/decycle';
import PrebidInterface from '../prebidInterface';

describe('PrebidInterface', () => {
  let prebidInterface: PrebidInterface;

  beforeEach(() => {
    prebidInterface = new PrebidInterface();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    expect(prebidInterface.tabId).toBeNull();
    expect(prebidInterface.prebidExists).toBeNull();
    expect(prebidInterface.prebidInterface).toBeNull();
    expect(prebidInterface.prebidData).toEqual({
      adUnits: {},
      noBids: {},
      versionInfo: '',
      installedModules: [],
      config: {},
      receivedBids: [],
      errorEvents: [],
      auctionEvents: {},
    });
    expect(prebidInterface.updateCounter).toBe(0);
    expect(prebidInterface.setIntervalValue).not.toBeNull();
    expect(prebidInterface.scanningStatus).toBe(false);
  });

  it('should listen to connection messages', () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.top.postMessage = mockPostMessage;

    const mockEvent = {
      data: {
        type: SCRIPT_PREBID_INITIAL_SYNC,
        tabId: 123,
      },
    };

    prebidInterface.scanningStatus = true;
    //@ts-ignore
    window.onmessage(mockEvent as MessageEvent);

    expect(prebidInterface.tabId).toBe(123);
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: 123,
      prebidData: JSON.parse(decycle(prebidInterface.prebidData)),
    });
  });

  it('should send initial data', () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.top.postMessage = mockPostMessage;

    prebidInterface.tabId = 123;
    prebidInterface.sendInitialData();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: 123,
      prebidData: JSON.parse(decycle(prebidInterface.prebidData)),
    });
  });

  it('should process prebid data if property exists', async () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.top.postMessage = mockPostMessage;

    prebidInterface.prebidExists = true;
    prebidInterface.prebidInterface = {
      getConfig: jest.fn().mockResolvedValue({ test: 'data' }),
    } as any;

    await prebidInterface.getAndProcessPrebidData('getConfig');

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: null,
      prebidData: JSON.parse(decycle({ test: 'data' })),
    });
  });

  it('should not process prebid data if property does not exist', async () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.top.postMessage = mockPostMessage;

    prebidInterface.prebidExists = true;
    prebidInterface.prebidInterface = {} as any;

    await prebidInterface.getAndProcessPrebidData('nonExistentProperty');

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should calculate bid response correctly', () => {
    const bid = {
      auctionId: '123',
      adUnitCode: 'adUnit1',
      responseTimestamp: 1672531200000,
      price: 5.0,
      currency: 'USD',
      bidder: 'bidder1',
    };

    prebidInterface.calculateBidResponse(bid as any);

    expect(prebidInterface.prebidData.receivedBids).toEqual([
      {
        bidCurrency: 'USD',
        uniqueAuctionId: '123',
        index: 0,
        bid: 5.0,
        ownerOrigin: 'bidder1',
        time: 1672531200000,
        formattedTime: '2023-01-01T00:00:00.000Z',
        adUnitCode: 'adUnit1',
        type: '',
        eventType: 'BidAvailable',
      },
    ]);
  });

  it('should calculate no bid correctly', () => {
    const noBid = {
      auctionId: '123',
      adUnitCode: 'adUnit1',
      sizes: [[300, 250]],
      bidder: 'bidder1',
    };

    prebidInterface.calculateNoBid(noBid as any);

    expect(prebidInterface.prebidData.noBids).toEqual({
      '123': {
        uniqueAuctionId: '123',
        adUnitCode: 'adUnit1',
        mediaContainerSize: [[300, 250]],
        bidder: ['bidder1'],
      },
    });
  });

  it('should calculate ad unit correctly', () => {
    const bid = {
      adUnitCode: 'adUnit1',
      cpm: 5.0,
      currency: 'USD',
      bidder: 'bidder1',
    };

    prebidInterface.calculateAdUnit(bid as any);

    expect(prebidInterface.prebidData.adUnits).toEqual({
      adUnit1: {
        winningBid: 5.0,
        bidCurrency: 'USD',
        winningBidder: 'bidder1',
      },
    });
  });
});
