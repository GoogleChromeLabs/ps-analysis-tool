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
 * External dependencies.
 */
import React, { useEffect, useState, lazy, Suspense, memo } from 'react';
import type { ReactJsonViewProps } from '@microlink/react-json-view';
// must be lazy loaded to avoid issue with puppeteer and service worker
// https://github.com/mac-s-g/react-json-view/issues/296
const LazyReactJson = lazy(() => import('@microlink/react-json-view'));

/**
 * Internal dependencies.
 */
import { darkTheme, lightTheme } from './jsonTheme';

/**
 * JsonView component.
 * ReactJsonView wrapper component to provide a consistent theme for the JSON view.
 * @param {ReactJsonViewProps} props - The props for the JsonView component.
 * @returns {React.ReactElement} The JsonView component.
 */
const JsonView = (props: ReactJsonViewProps): React.ReactElement => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyReactJson
        theme={isDarkMode ? darkTheme : lightTheme}
        iconStyle="triangle"
        enableClipboard={false}
        displayDataTypes={false}
        displayObjectSize={false}
        shouldCollapse={(object) => object.name !== 'root'}
        {...props}
      />
    </Suspense>
  );
};

export default memo(JsonView);
