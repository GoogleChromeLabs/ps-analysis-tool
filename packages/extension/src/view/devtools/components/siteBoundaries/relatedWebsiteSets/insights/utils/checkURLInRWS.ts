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
import fetchRWSInfo from '../../../../../../../utils/fetchRWSInfo';
import getInspectedTabDomain from './getInspectedTabDomain';
import findRWSURLSets, {
  type RWSSetOutputType,
} from '../../../../../../../utils/findRWSURLSets';

export type CheckURLInRWSOutputType = {
  isURLInRWS: boolean;
  primary?: boolean;
  domain?: string;
  isccTLD?: boolean;
  relatedWebsiteSet?: RWSSetOutputType;
};

const checkURLInRWS = async () => {
  const tabDomain = (await getInspectedTabDomain()) || '';
  const rwsSets: RWSSetOutputType[] = (await fetchRWSInfo()).sets || [];

  const urlInRWS: RWSSetOutputType | undefined = findRWSURLSets(
    tabDomain,
    rwsSets
  );

  if (!urlInRWS) {
    return {
      isURLInRWS: false,
    } as CheckURLInRWSOutputType;
  }

  if (getDomain(urlInRWS.primary) === tabDomain) {
    return {
      isURLInRWS: true,
      primary: true,
      domain: tabDomain,
      relatedWebsiteSet: urlInRWS,
    } as CheckURLInRWSOutputType;
  }

  if (urlInRWS.ccTLDParent) {
    return {
      isURLInRWS: true,
      isccTLD: true,
      domain: tabDomain,
      relatedWebsiteSet: urlInRWS,
    } as CheckURLInRWSOutputType;
  }

  return {
    isURLInRWS: true,
    primary: false,
    domain: tabDomain,
    relatedWebsiteSet: urlInRWS,
  } as CheckURLInRWSOutputType;
};

export default checkURLInRWS;
