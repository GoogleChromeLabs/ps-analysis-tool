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
import type { DetectedSignature } from '@ps-analysis-tool/common';

export type { LibraryData, DetectedSignature } from '@ps-analysis-tool/common';

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

export type ResourceTreeItem = {
  url: string;
  getContent: (callback: (content: string) => void) => void;
  type?: string;
};

export type AccordionProps = {
  matches?: DetectedSignature[];
  domQueryMatches?: string[] | null;
};

export type DomainPaths = {
  [domain: string]: string[];
};

export type DetectionFunctions = {
  [key: string]: (
    arg0: ScriptTagUnderCheck,
    arg1: DetectedSignature[] | undefined,
    arg2: number | undefined,
    arg3?: number | undefined
  ) => {
    signatureMatches: number;
    matches: DetectedSignature[];
    moduleMatch?: number;
  };
};

export type DetectionAuditFunctions = {
  [key: string]: (
    arg1: number,
    arg2: DetectedSignature[],
    arg3: number
  ) => DetectedSignature[];
};

export type TabLoadingStatus = 'loading' | 'complete';
