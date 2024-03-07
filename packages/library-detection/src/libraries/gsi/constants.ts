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
import type { ExceptionUrls, SignaturesConfigItem } from '../../types';

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
export const GSI_V2_SIGNATURE_WEAK_MATCHES: SignaturesConfigItem[] = [
  /* These signatures indicate use of OpenID Connect ID token for user sign-in,
   * link to the user authentication migration guide for user sign-in. */
  {
    signature: 'gapi.load(',
    helpUrl: 'https://developers.google.com/identity/gsi/web/guides/migration',
  },
  {
    signature: 'SignInOptions',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.ClientConfig(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.SigninOptionsBuilder(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.getAuthInstance(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: 'GoogleAuth',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.attachClickHandler(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#session_state_and_listeners',
  },
  {
    signature: '.currentUser.get(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#token_response',
  },
  {
    signature: '.currentUser.listen(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#session_state_and_listeners',
  },
  {
    signature: '.isSignedIn.get(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#session_state_and_listeners',
  },
  {
    signature: '.isSignedIn.listen(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#session_state_and_listeners',
  },
  {
    signature: '.isSignedIn(',
    helpUrl: 'https://developers.google.com/identity/gsi/web/guides/migration',
  },
  {
    signature: '.signIn(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.signOut(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#user_consent_and_revoking_permission',
  },
  {
    signature: 'GoogleUser',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#token_response',
  },
  {
    signature: '.getBasicProfile(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#token_response',
  },
  {
    signature: '.getHostedDomain(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.grant(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: '.reloadAuthResponse(',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  {
    signature: 'gapi.signin2',
    helpUrl:
      'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
  },
  /* These signatures indicate the use of OAuth 2.0 access token or authorization code flows,
   * link to the user authorization migration guide for data sharing. */
  {
    signature: 'AuthorizeConfig',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#client_configuration',
  },
  {
    signature: 'AuthorizeResponse',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#token_and_consent_response',
  },
  {
    signature: 'OfflineAccessOptions',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#authorization_code_flow_examples',
  },
  {
    signature: '.authorize(',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit-flow_3',
  },
  {
    signature: '.getGrantedScopes(',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit-flow_4',
  },
  {
    signature: '.grantOfflineAccess(',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#library_quick_reference',
  },
  {
    signature: '.hasGrantedScopes(',
    helpUrl:
      'https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit-flow_4',
  },
];

export const GSI_V2_SIGNATURE_STRONG_MATCHES: SignaturesConfigItem[] = [
  {
    signature: 'gapi.auth2',
    helpUrl: 'https://developers.google.com/identity/gsi/web/guides/migration',
  },
];

export const GSI_HELP_URL =
  'https://developers.google.com/identity/gsi/web/guides/migration';

export const GSI_V2_DOMAINS_TO_SKIP = ['accounts.google.com', 'gstatic.com'];

export const GSIV2_EXCEPTIONS: ExceptionUrls = {};
