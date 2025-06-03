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
import { compareFrameSource, isFrameInsideFrame } from '../utils';

const findSelectedFrameElements = (selectedOrigin: string) => {
  if (!selectedOrigin) {
    return [];
  }

  if (selectedOrigin === document.location.origin) {
    return [document.body]; // main frame
  }

  const iframes = document.querySelectorAll('iframe');
  const elements = [];

  for (const iframe of iframes) {
    const src = iframe.getAttribute('src');

    if (!src) {
      continue;
    }

    if (
      compareFrameSource(selectedOrigin, src) ||
      isFrameInsideFrame(iframe, selectedOrigin)
    ) {
      elements.push(iframe);
    }
  }

  return elements;
};

export default findSelectedFrameElements;
