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
import { BounceTrackingTab } from './BounceTrackingTab';
import { CookieTab } from './CookiesTab';
import { FingerprintingTab } from './FingerprintingTab';

export enum TAB_ENUM {
  COOKIE_TAB = 'COOKIE_TAB',
  BOUNCE_TRACKING_TAB = 'BOUNCE_TRACKING_TAB',
  FINGERPRINTING_TAB = 'FINGERPRINTING_TAB',
}

export const TABS = {
  [TAB_ENUM.COOKIE_TAB]: { display_name: 'Cookies', Component: CookieTab },
  [TAB_ENUM.BOUNCE_TRACKING_TAB]: {
    display_name: 'Bounce Tracking',
    Component: BounceTrackingTab,
  },
  [TAB_ENUM.FINGERPRINTING_TAB]: {
    display_name: 'Fingerprinting',
    Component: FingerprintingTab,
  },
};
