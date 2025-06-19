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
  PREBID_SCANNING_STATUS,
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
} from '../../../constants';
import { decycle } from '../../utils';
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

  it('should post message if Prebid not found after timeout', () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.postMessage = mockPostMessage;
    PrebidInterface.doesPrebidExist();

    jest.advanceTimersByTime(60000);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: PREBID_SCANNING_STATUS,
      prebidExists: false,
    });
  });

  it('should detect Prebid when present', () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.postMessage = mockPostMessage;
    //@ts-ignore
    window._pbjsGlobals = ['pbjs'];
    //@ts-ignore
    window.pbjs = {
      version: '1.0.0',
      installedModules: ['module1', 'module2'],
      bidderSettings: {},
      getConfig: () => ({}),
      getUserIdsAsEids: () => [],
    };

    PrebidInterface.doesPrebidExist();

    jest.advanceTimersByTime(1000);

    // Prebid should be detected before timeout
    expect(mockPostMessage).not.toHaveBeenCalledWith({
      type: PREBID_SCANNING_STATUS,
      prebidExists: false,
    });
  });

  it('should initialize with default values', () => {
    expect(prebidInterface.prebidData.prebidExists).toBeNull();
    expect(prebidInterface.prebidInterface).toBeNull();
    expect(prebidInterface.prebidData).toEqual({
      adUnits: {},
      noBids: {},
      versionInfo: '',
      installedModules: [],
      config: {},
      pbjsNamespace: '',
      receivedBids: [],
      errorEvents: [],
      prebidExists: null,
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
      },
    };

    prebidInterface.scanningStatus = true;
    prebidInterface.prebidData.prebidExists = true;
    //@ts-ignore
    window.onmessage(mockEvent as MessageEvent);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      prebidData: JSON.parse(decycle(prebidInterface.prebidData)),
    });
  });

  it('should send initial data', () => {
    const mockPostMessage = jest.fn();
    //@ts-ignore
    window.postMessage = mockPostMessage;

    prebidInterface.prebidData.prebidExists = true;
    prebidInterface.sendInitialData();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      prebidData: JSON.parse(decycle(prebidInterface.prebidData)),
    });
  });
});
