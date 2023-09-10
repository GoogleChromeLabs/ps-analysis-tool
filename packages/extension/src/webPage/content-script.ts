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
import addFrameOverlay from './addFrameOverlay';
import getFrameAttributes from './getFrameAttributes';

const port = chrome.runtime.connect({ name: 'psat-tool' });

port.onMessage.addListener((response) => {
  if (response?.selectedFrame) {
    addFrameOverlay(response.selectedFrame);
  }
  console.log(response);
});

const handleMouseEvent = (event: MouseEvent): void => {
  if ((event.target as HTMLElement).tagName === 'IFRAME') {
    const payload = {
      hover: event?.type === 'mouseover',
      attributes: getFrameAttributes(event.target as HTMLIFrameElement),
    };

    port.postMessage(payload);
  }
};

document.addEventListener('mouseover', handleMouseEvent);
document.addEventListener('mouseout', handleMouseEvent);
