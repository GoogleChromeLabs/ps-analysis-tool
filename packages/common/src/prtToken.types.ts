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
export interface ProbablisticRevealToken {
  version: number;
  u: Uint8Array<any>;
  e: Uint8Array<any>;
  epochId: Uint8Array<any>;
  prtHeader: string;
  epochIdBase64: string;
}

interface DecryptedToken {
  plainText: Uint8Array<any>;
  hmacSecret: Uint8Array<ArrayBuffer>;
}

interface PlaintTextToken {
  uint8Signal: Uint8Array<any>;
  humanReadableSignal: string;
  ordinal: Uint8Array<any>;
  version: number;
  hmacValid: boolean;
}

export interface PRTMetadata {
  origin: string;
  humanReadableSignal: string;
  decryptionKeyAvailable: boolean;
  prtHeader: string;
}

export type UniquePlainTextToken = PlaintTextToken & {
  prtHeader?: string;
};

export type UniqueDecryptedToken = DecryptedToken & {
  prtHeader?: string;
};
