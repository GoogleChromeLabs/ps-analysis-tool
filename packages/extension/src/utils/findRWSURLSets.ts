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
import { getDomain } from 'tldts';

/**
 * Internal dependencies.
 */
import type { RelatedWebsiteSetType } from '../@types';

export type RWSSetOutputType = RelatedWebsiteSetType & {
  ccTLDParent?: string;
};

const findRWSURLSets = (
  domain: string | null,
  rwsSets: RelatedWebsiteSetType[]
): RWSSetOutputType | undefined => {
  if (!domain) {
    return undefined;
  }

  let ccTLDParentURL = '';

  const res: RWSSetOutputType | undefined = rwsSets.find(
    (rws: RelatedWebsiteSetType) => {
      if (domain === getDomain(rws.primary)) {
        return true;
      }

      const rwsDomains: string[] = Object.keys(rws.rationaleBySite || {}).map(
        (_url) => getDomain(_url) || ''
      );

      if (rwsDomains.includes(domain)) {
        return true;
      }

      const ccTLDs = Object.entries(rws.ccTLDs || {}).reduce(
        (acc, [ccTLDParent, _ccTLDs]: [string, string[]]) => {
          const ccTLDsObj = _ccTLDs.reduce(
            (ccTLDAcc, ccTLD) => {
              const ccTLDDomain = getDomain(ccTLD) || '';

              if (ccTLDDomain) {
                ccTLDAcc[ccTLDDomain] = ccTLDParent;
              }

              return ccTLDAcc;
            },
            {} as {
              [ccTLD: string]: string;
            }
          );

          return { ...acc, ...ccTLDsObj };
        },
        {} as {
          [ccTLD: string]: string;
        }
      );

      if (ccTLDs[domain]) {
        ccTLDParentURL = ccTLDs[domain];
        return true;
      }

      return false;
    }
  );

  if (ccTLDParentURL && res) {
    res.ccTLDParent = ccTLDParentURL;
  }

  return res;
};

export default findRWSURLSets;
