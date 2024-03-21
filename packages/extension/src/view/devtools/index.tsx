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
 * External dependencies.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ErrorFallback,
  Provider as TablePersistentSettingsProvider,
} from '@ps-analysis-tool/design-system';
import { LibraryDetectionProvider } from '@ps-analysis-tool/library-detection';
import { Provider as I18nProvider } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import App from './app';
import { Provider as ExternalStoreProvider } from './stateProviders/syncCookieStore';
import { Provider as SettingsStoreProvider } from './stateProviders/syncSettingsStore';
import { Provider as AllowedListProvider } from './stateProviders/useAllowedList';

const isDarkMode = chrome.devtools.panels.themeName === 'dark';
document.body.classList.add(isDarkMode ? 'dark' : 'light');

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <I18nProvider>
        <SettingsStoreProvider>
          <ExternalStoreProvider>
            <TablePersistentSettingsProvider>
              <LibraryDetectionProvider>
                <AllowedListProvider>
                  <App />
                </AllowedListProvider>
              </LibraryDetectionProvider>
            </TablePersistentSettingsProvider>
          </ExternalStoreProvider>
        </SettingsStoreProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
