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
import removeTrailingSlash from './removeTrailingSlash';

/**
 * Compares the origin of a frame with a frame source URL.
 * @param {string} frameOrigin - The origin to compare.
 * @param {string} frameSrc - The source URL of the frame.
 * @returns {boolean} Returns `true` if the frame source URL includes the clean origin; otherwise, `false`.
 */
const compareFrameSource = (frameOrigin: string, frameSrc: string) => {
  const cleanOrigin = removeTrailingSlash(frameOrigin).replace(
    /(www\.|https?:\/\/)/g,
    ''
  );

  if (frameSrc && !cleanOrigin) {
    return false;
  }

  return frameSrc.includes(cleanOrigin);
};

export default compareFrameSource;
