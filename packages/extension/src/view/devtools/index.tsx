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
} from '@google-psat/design-system';
import { LibraryDetectionProvider } from '@google-psat/library-detection';
// eslint-disable-next-line import/no-relative-packages -- Relative import is necessary, because package doesn't export css file.
import './prettyJson.css';

/**
 * Internal dependencies.
 */
import App from './app';
import {
  CookieProvider,
  SettingsProvider,
  AllowedListProvider,
  ProtectedAudienceContextProvider,
  WebStoriesProvider,
  AttributionReportingProvider,
} from './stateProviders';

const isDarkMode = chrome.devtools.panels.themeName === 'dark';
// dark-mode class is added to body to apply pretty-print-json dark theme.
const classes = isDarkMode ? ['dark', 'dark-mode'] : ['light'];
document.body.classList.add(...classes);

const root = document.getElementById('root');

//@ts-ignore Disable DeviceMotionEvent and DeviceOrientationEvent to prevent console errors.
window.DeviceMotionEvent = null;
//@ts-ignore Disable DeviceMotionEvent and DeviceOrientationEvent to prevent console errors.
window.DeviceOrientationEvent = null;

if (root) {
  createRoot(root).render(
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <SettingsProvider>
        <CookieProvider>
          <ProtectedAudienceContextProvider>
            <TablePersistentSettingsProvider>
              <LibraryDetectionProvider>
                <AllowedListProvider>
                  <WebStoriesProvider>
                    <AttributionReportingProvider>
                      <App />
                    </AttributionReportingProvider>
                  </WebStoriesProvider>
                </AllowedListProvider>
              </LibraryDetectionProvider>
            </TablePersistentSettingsProvider>
          </ProtectedAudienceContextProvider>
        </CookieProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
