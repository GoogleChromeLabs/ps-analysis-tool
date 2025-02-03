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
 * Internal dependencies.
 */
import {
  updateSessionStorage,
  getSessionStorage,
  SessionData,
} from '../sessionStorage';

// Mock Chrome API
global.chrome = {
  storage: {
    session: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  devtools: {
    inspectedWindow: {
      tabId: 123,
    },
  },
} as unknown as typeof chrome;

describe('Session Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updateSessionStorage should store data with tab-specific keys', async () => {
    const mockStorageData: SessionData = {
      theme: 'dark',
      sidebar: 'open',
      selectedSidebarItem:
        'privacy-sandbox#private-advertising#protected-audience',
    };

    (chrome.storage.session.get as jest.Mock).mockResolvedValue({});

    await updateSessionStorage(mockStorageData, 'persistentSetting');

    expect(chrome.storage.session.set).toHaveBeenCalledWith({
      '123-persistentSetting-theme': 'dark',
      '123-persistentSetting-sidebar': 'open',
      '123-persistentSetting-selectedSidebarItem':
        'privacy-sandbox#private-advertising#protected-audience',
    });
  });

  test('updateSessionStorage should return updated data', async () => {
    const mockStorageData: SessionData = { language: 'en' };
    (chrome.storage.session.get as jest.Mock).mockResolvedValue({});

    const result = await updateSessionStorage(
      mockStorageData,
      'persistentSetting'
    );

    expect(result).toEqual({
      '123-persistentSetting-language': 'en',
    });
  });

  test('getSessionStorage should retrieve grouped data for the current tab', async () => {
    (chrome.storage.session.get as jest.Mock).mockResolvedValue({
      '123-persistentSetting-theme': 'dark',
      '123-persistentSetting-sidebar': 'open',
      '123-persistentSetting-selectedSidebarItem':
        'privacy-sandbox#private-advertising#protected-audience',
      globalSetting: 'enabled',
    });

    const result = await getSessionStorage('persistentSetting');

    expect(result).toEqual({
      theme: 'dark',
      sidebar: 'open',
      selectedSidebarItem:
        'privacy-sandbox#private-advertising#protected-audience',
    });
  });

  test('getSessionStorage should return an empty object if no tab ID is found', async () => {
    (chrome.devtools.inspectedWindow.tabId as unknown) = undefined;
    (chrome.storage.session.get as jest.Mock).mockResolvedValue({
      '123-persistentSetting-theme': 'dark',
    });

    const result = await getSessionStorage('persistentSetting');

    expect(result).toEqual({});
  });
});
