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
import { addUTMParams } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import type { SignaturesConfigItem } from '../types';

/**
 * Retrieves the help URL for a given signature from a list of signature configuration items.
 * If a matching signature is found, the corresponding help URL is returned.
 * If no matching signature is found, an empty string is returned.
 * @param signature - The signature to search for.
 * @param helpUrls - The list of signature configuration items.
 * @returns The help URL for the matching signature, or an empty string if no match is found.
 */
const getHelpUrl = (signature: string, helpUrls: SignaturesConfigItem[]) => {
  const matchingSignatureItem = helpUrls.find(
    (item) => item.signature === signature
  );

  return matchingSignatureItem
    ? addUTMParams(matchingSignatureItem.helpUrl)
    : '';
};

export default getHelpUrl;
