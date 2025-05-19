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
 * Internal dependencies
 */
import doesPrebidExist from '../doesPrebidExist';

describe('doesPrebidExist', () => {
  let mockClassInstance: any;
  let mockClassToInstantiate: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockClassInstance = {
      scanningStatus: false,
      prebidInterface: null,
      prebidExists: false,
      sendInitialData: jest.fn(),
      initPrebidListener: jest.fn(),
    };
    mockClassToInstantiate = jest.fn(() => mockClassInstance);
    (global as any).window = {};
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('should set scanningStatus to true after timeout', () => {
    doesPrebidExist(mockClassToInstantiate);

    jest.advanceTimersByTime(60000);

    expect(mockClassInstance.scanningStatus).toBe(true);
  });

  it('should detect Prebid on the page and initialize it', () => {
    (window as any)._pbjsGlobals = ['pbjs'];
    (window as any).pbjs = { someKey: 'someValue' };

    doesPrebidExist(mockClassToInstantiate);

    jest.advanceTimersByTime(1000);

    expect(mockClassInstance.prebidInterface).toEqual((window as any).pbjs);
    expect(mockClassInstance.prebidExists).toBe(true);
    expect(mockClassInstance.scanningStatus).toBe(true);
    expect(mockClassInstance.sendInitialData).toHaveBeenCalled();
    expect(mockClassInstance.initPrebidListener).toHaveBeenCalled();
  });

  it('should keep checking for Prebid until found or timeout', () => {
    (window as any)._pbjsGlobals = [];
    doesPrebidExist(mockClassToInstantiate);

    jest.advanceTimersByTime(1000);
    expect(mockClassInstance.prebidExists).toBe(false);

    (window as any)._pbjsGlobals = ['pbjs'];
    (window as any).pbjs = { someKey: 'someValue' };

    jest.advanceTimersByTime(1000);

    expect(mockClassInstance.prebidInterface).toEqual((window as any).pbjs);
    expect(mockClassInstance.prebidExists).toBe(true);
  });

  it('should stop checking for Prebid after timeout', () => {
    (window as any)._pbjsGlobals = [];
    doesPrebidExist(mockClassToInstantiate);

    jest.advanceTimersByTime(60000);

    expect(mockClassInstance.scanningStatus).toBe(true);
    expect(mockClassInstance.prebidExists).toBe(false);
  });
});
