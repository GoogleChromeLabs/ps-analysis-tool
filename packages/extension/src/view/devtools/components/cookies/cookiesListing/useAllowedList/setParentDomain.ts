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
 * Internal dependencies.
 */
import { CookieStore } from '../../../../../../localStore';

const setParentDomain = async (
  domain: string,
  setter: (prev: (prevState: string) => string) => void
) => {
  const allowListSessionStorage = await CookieStore.getDomainsInAllowList();

  let parentDomainValue = '';

  if (!allowListSessionStorage || allowListSessionStorage?.length === 0) {
    return;
  }

  allowListSessionStorage.some((storedAllowedDomain) => {
    const storedDomain = storedAllowedDomain.primaryDomain;

    // For example xyz.bbc.com and .bbc.com
    if (domain.endsWith(storedDomain) && domain !== storedDomain) {
      parentDomainValue = storedDomain;

      return true;
    }

    return false;
  });

  // For example .bbc.com will be parent domain of xyz.bbc.com
  setter((prev) => {
    if (prev !== parentDomainValue) {
      return parentDomainValue;
    }

    return prev;
  });
};

export default setParentDomain;
