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
import React, { useEffect, useState } from 'react';
import ReactJsonView, { ReactJsonViewProps } from '@microlink/react-json-view';

/**
 * Internal dependencies.
 */
import { darkTheme, lightTheme } from './theme';

type JsonViewProps = ReactJsonViewProps;

/**
 * JsonView component.
 * ReactJsonView wrapper component to provide a consistent theme for the JSON view.
 * @param {JsonViewProps} props - The props for the JsonView component.
 * @returns {React.ReactElement} The JsonView component.
 */
const JsonView = (props: JsonViewProps): React.ReactElement => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <ReactJsonView
      theme={isDarkMode ? darkTheme : lightTheme}
      iconStyle="triangle"
      enableClipboard={false}
      displayDataTypes={false}
      displayObjectSize={false}
      {...props}
    />
  );
};

export default JsonView;
