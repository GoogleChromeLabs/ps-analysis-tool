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

export type ScriptBlockingData = {
  [origin: string]: {
    domain: string;
    owner: string;
    scriptBlocking: string;
  };
};

export interface IPProxyContextType {
  state: {
    plainTextTokens: UniquePlainTextToken[];
    decryptedTokens: UniqueDecryptedToken[];
    prtTokens: ProbablisticRevealToken[];
    perTokenMetadata: PRTMetadata[];
    scriptBlockingData: ScriptBlockingData;
    uniqueResponseDomains: string[];
  };
}

const initialState: IPProxyContextType = {
  state: {
    plainTextTokens: [],
    decryptedTokens: [],
    prtTokens: [],
    perTokenMetadata: [],
    scriptBlockingData: {},
    uniqueResponseDomains: [],
  },
};

export default createContext<IPProxyContextType>(initialState);
