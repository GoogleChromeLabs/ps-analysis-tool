/*
 * Copyright 2024 Google LLC
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
const enableDomainsAndGetDocument = async (
  returnRoot = false
): Promise<null | number> => {
  await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'DOM.enable'
  );
  await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'Overlay.enable'
  );
  await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'Overlay.hideHighlight'
  );

  if (!returnRoot) {
    return Promise.resolve(null);
  }

  const { root } = await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'DOM.getDocument'
  );

  return root;
};

export const highlightNode = async (
  selectedFrame: string | null,
  tabUrl: string | null
) => {
  const root = enableDomainsAndGetDocument(true);

  if (!selectedFrame || !tabUrl) {
    await chrome.debugger.sendCommand(
      { tabId: chrome.devtools.inspectedWindow.tabId },
      'Overlay.hideHighlight'
    );
    return;
  }

  const selectedFrameUrl = new URL(selectedFrame);
  const tabUrlObj = new URL(tabUrl);

  const { nodeIds } = await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'DOM.querySelectorAll',
    {
      nodeId: root.nodeId,
      selector: `iframe[src^="${selectedFrame}"]`,
    }
  );

  if (tabUrlObj.hostname === selectedFrameUrl.hostname) {
    await chrome.debugger.sendCommand(
      { tabId: chrome.devtools.inspectedWindow.tabId },
      'Overlay.highlightNode',
      {
        highlightConfig: {
          contentColor: { r: 9, g: 88, b: 230, a: 0.5 },
        },
        nodeId: root.nodeId,
      }
    );
    return;
  }

  await Promise.all(
    nodeIds.map(async (id: number) => {
      await chrome.debugger.sendCommand(
        { tabId: chrome.devtools.inspectedWindow.tabId },
        'Overlay.highlightNode',
        {
          highlightConfig: {
            contentColor: { r: 9, g: 88, b: 230, a: 0.5 },
          },
          nodeId: id,
          selector: `iframe[src^="${selectedFrame}"]`,
        }
      );
    })
  );
};

export const highlightNodeWithCoordinates = async (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  await enableDomainsAndGetDocument();

  await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'Overlay.highlightRect',
    {
      color: { r: 9, g: 88, b: 230, a: 0.5 },
      x,
      y,
      width,
      height,
    }
  );
};

export const highlightAdUnit = async (adUnit: string | null) => {
  const root = await enableDomainsAndGetDocument(true);

  const { nodeIds } = await chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'DOM.querySelectorAll',
    {
      nodeId: root.nodeId,
      selector: `div[id="${adUnit}"]`,
    }
  );

  await Promise.all(
    nodeIds.map(async (id: number) => {
      await chrome.debugger.sendCommand(
        { tabId: chrome.devtools.inspectedWindow.tabId },
        'Overlay.highlightNode',
        {
          highlightConfig: {
            contentColor: { r: 9, g: 88, b: 230, a: 0.5 },
          },
          nodeId: id,
          selector: `div[id="${adUnit}"]`,
        }
      );
    })
  );
};
export default highlightNode;
