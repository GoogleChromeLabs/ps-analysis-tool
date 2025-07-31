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
import { I18n } from '@google-psat/i18n';

export const WEBPAGE_PORT_NAME = 'psat-webpage';
export const SERVICE_WORKER_PORT_NAME = 'psat-serviceworker';

export const SETTING_PAGE_CONTROLS = [
  {
    id: 'enableCDP',
    heading: () => I18n.getMessage('enableCDP'),
    description: () => I18n.getMessage('enableCDPNote', [`<a>`, '</a>']),
  },
];

export const CDP_WARNING_MESSAGE =
  'Enabling CDP with more than 5 tabs open will impact your browser performance and all tabs will be reloaded. Are you sure you want to enable CDP?';
export const RELOAD_WARNING_MESSAGE =
  'Settings changed, reload all tabs to apply changes?';
export const STORE_RULES_TOGGLE = 'globalPersistDebuggingRules';

export const DEVTOOLS_CLOSE = 'DEVTOOLS_STATE_CLOSE';
export const DEVTOOLS_OPEN = 'DEVTOOLS_STATE_OPEN';
export const POPUP_CLOSE = 'POPUP_STATE_CLOSE';
export const POPUP_OPEN = 'POPUP_STATE_OPEN';
export const DEVTOOLS_SET_JAVASCSCRIPT_COOKIE =
  'DevTools::SET_JAVASCRIPT_COOKIE';
export const CHANGE_CDP_SETTING = 'CHANGE_CDP_SETTING';
export const INITIAL_SYNC = 'INITIAL_SYNC';
export const NEW_COOKIE_DATA = 'NEW_COOKIE_DATA';
export const TAB_TOKEN_DATA = 'TAB_TOKEN_DATA';
export const SERVICE_WORKER_RELOAD_MESSAGE = 'ServiceWorker::TABS_RELOADED';
export const SERVICE_WORKER_TABS_RELOAD_COMMAND =
  'ServiceWorker::REOLAD_ALL_TABS';
export const GET_JS_COOKIES = 'DEVTOOL::WEBPAGE::GET_JS_COOKIES';
export const TABID_STORAGE = 'SERVICEWORKER::WEBPAGE::TABID_STORAGE';
export const SCRIPT_GET_PREBID_DATA_RESPONSE =
  'SCRIPT:CS:GET_PREBID_DATA_RESPONSE';
export const CS_GET_PREBID_DATA_RESPONSE = 'CS:DEVTOOLS:GET_PREBID_DATA';
export const SCRIPT_PREBID_INITIAL_SYNC = 'SCRIPT_PREBID_INITIAL_SYNC';
export const CONTENT_SCRIPT_PREBID_INITIAL_SYNC = 'SCRIPT_PREBID_INITIAL_SYNC';
export const PREBID_SCANNING_STATUS = 'PREBID_SCANNING_STATUS';
export const PREBID_EVENTS = 'PREBID_EVENTS';
export const AUCTION_EVENTS = 'AUCTION_EVENTS';
