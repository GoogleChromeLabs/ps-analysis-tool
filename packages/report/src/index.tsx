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
 * External dependencies
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LibraryDetectionProvider } from '@ps-analysis-tool/library-detection';
import { noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import App from './app';
import { DataProvider } from './stateProviders/data';

//@ts-ignore this global mock is needed for the provider LibraryDetectionProvider and the component LibraryDetection to work
chrome = {
  tabs: {
    get: noop,
    onUpdated: {
      addListener: noop,
      removeListener: noop,
    },
    get: noop,
  },
  devtools: {
    inspectedWindow: {
      onResourceAdded: {
        addListener: noop,
        removeListener: noop,
      },
      getResources: noop,
    },
  },
  webNavigation: {
    onErrorOccurred: {
      addListener: noop,
      removeListener: noop,
    },
    onBeforeNavigate: {
      addListener: noop,
      removeListener: noop,
    },
    onCompleted: {
      addListener: noop,
      removeListener: noop,
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');

  if (root) {
    createRoot(root).render(
      <LibraryDetectionProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </LibraryDetectionProvider>
    );
  }
});
