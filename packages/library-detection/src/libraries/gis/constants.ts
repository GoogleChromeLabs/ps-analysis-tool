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
export const GIS_SIGNATURE_WEAK_MATCHES = [
  {
    signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
    helpUrl: '',
  },
  {
    signature: 'isDisplayMomment(',
    helpUrl: '',
  },
  {
    signature: 'isDisplayed(',
    helpUrl: '',
  },
  {
    signature: 'isNotDisplayed(',
    helpUrl: '',
  },
  {
    signature: 'getNotDisplayedReason(',
    helpUrl: '',
  },
  {
    signature: 'PromptMomentNotification',
    helpUrl: '',
  },
  {
    signature: 'opt_out_or_no_session',
    helpUrl: '',
  },
];

export const GIS_SIGNATURE_STRONG_MATCHES = [];

export const GIS_HELP_URL =
  'https://developers.google.com/identity/gsi/web/guides/migration';

export const GIS_DOMAINS_TO_SKIP = ['accounts.google.com', 'gstatic.com'];
