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
  type UniqueDecryptedToken,
  type UniquePlainTextToken,
  type ProbablisticRevealToken,
  type PRTMetadata,
} from '@google-psat/common';

type PRTStatistics = {
  globalView: {
    totalTokens: number;
    nonZeroSignal: number;
    mdl: number;
    domains: number;
  };
  localView: {
    totalTokens: number;
    nonZeroSignal: number;
  };
};

export interface ProbabilisticRevealTokensContextType {
  state: {
    plainTextTokens: UniquePlainTextToken[];
    decryptedTokens: UniqueDecryptedToken[];
    prtTokens: ProbablisticRevealToken[];
    perTokenMetadata: PRTMetadata[];
    statistics: PRTStatistics;
  };
}

export const initialState: ProbabilisticRevealTokensContextType = {
  state: {
    plainTextTokens: [],
    decryptedTokens: [],
    prtTokens: [],
    perTokenMetadata: [],
    statistics: {
      localView: {
        totalTokens: 0,
        nonZeroSignal: 0,
      },
      globalView: {
        totalTokens: 0,
        nonZeroSignal: 0,
        mdl: 0,
        domains: 0,
      },
    },
  },
};

export default createContext<IPProxyContextType>(initialState);
