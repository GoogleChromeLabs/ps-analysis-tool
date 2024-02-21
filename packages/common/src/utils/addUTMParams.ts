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

type MediumType = 'extension' | 'cli';

const addUTMParams = (
  url: string,
  medium: MediumType = 'extension'
): string => {
  if (!url) {
    return url;
  }

  const urlParts = url.split('#');
  const base = urlParts[0];
  const hash = urlParts[1] ? `#${urlParts[1]}` : '';
  const separator = base.includes('?') ? '&' : '?';

  return `${base}${separator}utm_source=psat&utm_medium=${medium}${hash}`;
};

export default addUTMParams;
