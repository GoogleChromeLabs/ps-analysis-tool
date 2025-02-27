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

export type ContactEmailType = {
  email: string;
  emailError: string;
};

type Url = {
  url: string;
  urlError: string;
};

export type PrimaryDomainType = Url;

type Rationale = {
  rationale: string;
  rationaleError: string;
};

export type AssociatedSiteType = Url & Rationale;

export type ServiceSiteType = Url & Rationale;

export type CountrySiteType = {
  site: string;
  cctld: string;
  siteError: string;
  cctldError: string;
};

export type PrimaryWellKnownOutputType = {
  contact: string;
  primary: string;
  associatedSites?: string[];
  serviceSites?: string[];
  rationaleBySite?: { [key: string]: string };
  ccTLDs?: { [key: string]: string[] };
};

export type OtherWellKnownOutputType = {
  primary: string;
};
