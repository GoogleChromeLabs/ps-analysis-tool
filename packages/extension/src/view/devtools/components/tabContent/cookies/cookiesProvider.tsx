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
import React, { type ReactNode } from 'react';

/**
 * Internal dependencies.
 */
import CookiesContext from './context';

interface CookiesProviderProps {
  children: ReactNode;
}

const CookiesProvider: React.FC<CookiesProviderProps> = ({ children }) => {
  const value = {
    state: {},
    actions: {},
  };

  return (
    <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>
  );
};

export default CookiesProvider;
