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
import {
  createContext,
  type ReceivedBids,
  type AdsAndBiddersType,
  type PrebidNoBidsType,
} from '@google-psat/common';
/**
 * Internal dependencies.
 */
import type { PrebidWarningTypes } from '../../../../store';

export interface PrebidContextType {
  state: {
    prebidAuctionEvents: { [auctionId: string]: any[] };
    errorEvents: {
      type: PrebidWarningTypes;
      message: string[];
      time: string;
    }[];
    versionInfo: string;
    prebidAdUnits: AdsAndBiddersType;
    prebidReceivedBids: ReceivedBids[];
    prebidNoBids: PrebidNoBidsType;
    installedModules: string[];
    config: PrebidConfig;
    pbjsNamespace: string;
    prebidExists: boolean | null;
  };
  actions: Record<string, never>;
}

export const initialState: PrebidContextType = {
  state: {
    prebidAdUnits: {},
    prebidNoBids: {},
    versionInfo: '',
    installedModules: [],
    config: {},
    prebidReceivedBids: [],
    errorEvents: [],
    prebidAuctionEvents: {},
    pbjsNamespace: '',
    prebidExists: null,
  },
  actions: {},
};

export default createContext<PrebidContextType>(initialState);
