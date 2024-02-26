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
//For source see https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/front_end/core/sdk/NetworkRequest.ts
const CookieExemptionReason = {
  UserSetting: 'This cookie is allowed by user preference.',
  TPCDMetadata:
    'This cookie is allowed by a third-party cookie deprecation trial grace period.',
  TPCDDeprecationTrial:
    'This cookie is allowed by third-party cookie phaseout deprecation trial.',
  TPCDHeuristics:
    'This cookie is allowed by third-party cookie phaseout heuristics.',
  EnterprisePolicy: 'This cookie is allowed by Chrome Enterprise policy.',
  StorageAccessAPI: 'This cookie is allowed by the Storage Access API.',
  TopLevelStorageAccessAPI:
    'This cookie is allowed by the top-level Storage Access API.',
  CorsOptIn: 'This cookie is allowed by CORS opt-in',
};

export default CookieExemptionReason;
