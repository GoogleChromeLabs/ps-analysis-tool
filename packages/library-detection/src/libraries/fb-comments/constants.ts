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
import type { ExceptionUrls } from '../../types';

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
export const FB_COMMENTS_SIGNATURE_WEAK_MATCHES = [
  {
    signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
    helpUrl: '',
  },
];

export const FB_COMMENTS_SIGNATURE_STRONG_MATCHES = [];

export const FB_COMMENTS_HELP_URL =
  'https://developers.google.com/identity/gsi/web/guides/migration';

export const FB_COMMENTS_DOMAINS_TO_SKIP = [];

export const FB_COMMENTS_EXCEPTIONS: ExceptionUrls = {};
