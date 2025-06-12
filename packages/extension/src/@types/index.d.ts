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

import type p5 from 'p5';

declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare global {
  interface Window {
    p5: typeof p5;
  }
}

declare module '*.png' {
  const value: string;

  export default value;
}

export type RelatedWebsiteSetType = {
  primary: string;
  contact: string;
  associatedSites?: string[];
  serviceSites?: string[];
  ccTLDs?: {
    [site: string]: string[];
  };
  rationaleBySite?: {
    [url: string]: string;
  };
};
