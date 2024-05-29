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
const tabFrames = [
  {
    processId: 1,
    frameId: 0,
    url: 'https://edition.cnn.com?refresh=1',
    documentId: '40245632AWDER',
    documentLifecycle: 'active',
    errorOccurred: false,
    frameType: 'outermost_frame',
    parentFrameId: 0,
  },
  {
    processId: 1,
    frameId: 2,
    url: 'https://crxd.net',
    documentId: '40245632WADER',
    documentLifecycle: 'active',
    errorOccurred: false,
    frameType: 'sub_frame',
    parentFrameId: 0,
  },
  {
    processId: 1,
    frameId: 3,
    url: 'https://crxd.net',
    documentId: '40245632AWDER',
    documentLifecycle: 'active',
    errorOccurred: false,
    frameType: 'outermost_frame',
    parentFrameId: 0,
  },
];

export const targetInfo = [
  {
    type: 'page',
    id: 'SADASQ5546SDT45673',
    url: 'https://edition.cnn.com?refresh=1',
    tabId: 40245632,
    attached: true,
    title: 'CNN',
  },
  {
    type: 'other',
    id: 'ASFGHSD2453465645568679FR',
    attached: true,
    title: 'https://crxd.net',
    url: 'https://crxd.net',
  },
  {
    type: 'other',
    id: 'ADFSDGRW4365663SDGF',
    attached: true,
    title: 'https://crxd.net',
    url: 'https://crxd.net',
  },
];
export default tabFrames;
