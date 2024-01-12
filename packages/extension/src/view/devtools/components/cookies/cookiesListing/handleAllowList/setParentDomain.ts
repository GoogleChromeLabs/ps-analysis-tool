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

import { CookieStore } from '../../../../../../localStore';

const setParentDomain = async (
  domain: string,
  setter: (
    prev: (prevState: { exist: boolean; value: string }) => {
      exist: boolean;
      value: string;
    }
  ) => void
) => {
  const allowListSessionStorage = await CookieStore.getDomainsInAllowList();

  let parentDomainExist = false;
  let parentDomainValue = '';
  const numberOfDomainsInAllowList = allowListSessionStorage
    ? allowListSessionStorage.length
    : 0;

  for (let i = 0; i < numberOfDomainsInAllowList; i++) {
    if (
      domain.endsWith(allowListSessionStorage[i].primaryDomain) &&
      domain !== allowListSessionStorage[i].primaryDomain
    ) {
      parentDomainExist = true;
      parentDomainValue = allowListSessionStorage[i].primaryDomain;
      break;
    }
  }

  setter((prev: { exist: boolean; value: string }) => {
    if (prev.value !== parentDomainValue || prev.exist !== parentDomainExist) {
      return { exist: parentDomainExist, value: parentDomainValue };
    }

    return prev;
  });
};

export default setParentDomain;
