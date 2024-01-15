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
export interface SignaturesConfigItem {
  signature: string;
  helpUrl: string;
}

export interface SignaturesConfig {
  strongMatches: SignaturesConfigItem[];
  weakMatches: SignaturesConfigItem[];
}

export interface Config {
  component?: React.FC;
  name?: string;
  signatures: SignaturesConfig[];
  domainsToSkip: string[];
  helpUrl: string;
}

export type NetworkCallData = {
  documentId?: string;
  documentLifeCycle?: string;
  frameId: number;
  frameType?: string;
  fromCache?: boolean;
  initiator?: string | undefined;
  ip?: string | undefined;
  method: string;
  parentFrameId: number;
  requestId: string;
  responseHeaders?: chrome.webRequest.HttpHeader[] | undefined;
  statusCode?: number;
  statusLine?: string;
  tabId: number;
  timeStamp: number;
  type: string;
  url: string;
};

export type ScriptTagUnderCheck = {
  origin: string | null;
  content: string;
};

export type DetectedSignature = {
  feature: {
    type: 'link';
    text: string;
    /* Link to the migration guide for all features instead of linking to individual
     * pages as the instructions to update the codebase are short and simple.
     */
    url: string;
  };
  subItems: {
    type: 'subitems';
    items: {
      sourceLocation: string;
      snippet: string;
    }[];
  };
};

export type DeprecatedSignatureDetectedReportItem = {
  title: string;
  accordion: AccordionItem[];
};

export type AccordionItem = {
  count: number;
  isAffected: boolean;
  title: string;
  superTitle: string;
  superTitleDescription: string;
  helpUrl?: string;
  description: string; // Description for Google service
  table: {
    headers: string[];
    rows: unknown[];
  };
};

export type LibraryData = {
  gis: {
    signatureMatches: number;
    matches: DetectedSignature[];
  };
  gsiV2: {
    signatureMatches: number;
    moduleMatch: number;
    matches: DetectedSignature[];
  };
};

export type ResourceTreeItem = {
  url: string;
  getContent: (callback: (content: string) => void) => void;
  type?: string;
};
