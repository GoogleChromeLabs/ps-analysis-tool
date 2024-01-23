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
export type SignaturesConfigItem = {
  signature: string;
  helpUrl: string;
};

export type SignaturesConfig = {
  strongMatches: SignaturesConfigItem[];
  weakMatches: SignaturesConfigItem[];
};

export type Config = {
  component?: React.FC;
  name?: string;
  signatures: SignaturesConfig[];
  domainsToSkip: string[];
  helpUrl: string;
};

export type ScriptTagUnderCheck = {
  origin: string | null;
  content: string;
  type?: string;
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
    moduleMatch?: number;
    matches: DetectedSignature[];
  };
  gsiV2: {
    signatureMatches: number;
    moduleMatch?: number;
    matches: DetectedSignature[];
  };
};

export type ResourceTreeItem = {
  url: string;
  getContent: (callback: (content: string) => void) => void;
  type?: string;
};

export type AccordionProps = {
  matches: DetectedSignature[];
};

export type DomainPaths = {
  [domain: string]: string[];
};

export type DetectionSubFunctions = {
  gis: (
    arg0: ScriptTagUnderCheck,
    arg1: DetectedSignature[],
    arg2: number
  ) => {
    signatureMatches: number;
    matches: DetectedSignature[];
  };
  gsiV2: (
    arg0: ScriptTagUnderCheck,
    arg1: DetectedSignature[],
    arg2: number,
    arg3: number
  ) => {
    signatureMatches: number;
    matches: DetectedSignature[];
    moduleMatch: number;
  };
};
