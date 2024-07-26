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
import { onBeforeSendHeadersListener } from './beforeSendHeadersListener';
import { onResponseStartedListener } from './onResponseStartedListener';
import { onStartUpListener } from './runtimeStartUpListener';
import { runtimeOnInstalledListener } from './runtimeOnInstalledListener';
import { runtimeOnMessageListener } from './runtimeOnMessageListener';
import {
  onSyncStorageChangedListenerForMultiTab,
  onSyncStorageChangedListenerForCDP,
} from './syncStorageOnChangedListener';
import { onTabCreatedListener } from './tabOnCreatedListener';
import { onTabRemovedListener } from './tabOnRemovedListener';
import { onTabUpdatedListener } from './tabsOnUpdatedListener';
import { windowsOnRemovedListener } from './windowsOnRemovedListener';
import { windowsOnCreatedListener } from './windowsOnCreatedListener';

/**
 * Fires before sending an HTTP request, once the request headers are available.
 * @see https://developer.chrome.com/docs/extensions/reference/api/webRequest#event-onBeforeSendHeaders
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  onBeforeSendHeadersListener,
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/api/webRequest
 */
chrome?.webRequest?.onResponseStarted?.addListener(
  onResponseStartedListener,
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

chrome.tabs.onCreated.addListener(onTabCreatedListener);

/**
 * Fires when a profile with extension is started.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup
 */
chrome.runtime.onStartup.addListener(onStartUpListener);

/**
 * Fires when the extension is first installed,
 * when clicked on the extension refresh button from chrome://extensions/
 * when the extension is updated to a new version,
 * when Chrome is updated to a new version.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled
 */
chrome.runtime.onInstalled.addListener(runtimeOnInstalledListener);

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
chrome.runtime.onMessage.addListener(runtimeOnMessageListener);

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved
 */
chrome.tabs.onRemoved.addListener(onTabRemovedListener);

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated
 */
chrome.tabs.onUpdated.addListener(onTabUpdatedListener);

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved
 */
chrome.windows.onRemoved.addListener(windowsOnRemovedListener);

/**
 * Fires when the browser window is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onCreated
 */
chrome.windows.onCreated.addListener(windowsOnCreatedListener);

chrome.storage.sync.onChanged.addListener(onSyncStorageChangedListenerForCDP);
chrome.storage.sync.onChanged.addListener(
  onSyncStorageChangedListenerForMultiTab
);
