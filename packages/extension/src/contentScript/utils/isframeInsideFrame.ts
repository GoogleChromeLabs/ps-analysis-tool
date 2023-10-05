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
import compareFrameSource from './compareFrameSource';

const isFrameInsideFrame = (
  frame: HTMLIFrameElement,
  selectedOrigin: string
) => {
  if (!frame.contentDocument) {
    return false;
  }

  const iframes = frame.contentDocument.querySelectorAll('iframe');

  // Iterate internal frames.
  for (const iframe of iframes) {
    const src = iframe.getAttribute('src');

    if (src && compareFrameSource(selectedOrigin, src)) {
      frame.dataset.psatInsideFrame = src;

      // let's not go through all the frames as we will only highlight parent frame.
      return true;
    }
  }

  return false;
};

export default isFrameInsideFrame;
