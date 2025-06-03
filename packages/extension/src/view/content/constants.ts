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
export const OVERLAY_CLASS = 'ps-overlay';
export const TOOLTIP_CLASS = 'ps-tooltip';

// Enable if data on tooltip is large.
export const DISPLAY_SHOW_MORE_BUTTON = false;

export const NUMBER_OF_ALLOWED_FEATURES_IN_COMPACT_VIEW = 5;

export const PS_RELATED_ALLOWED_FEATURES = [
  'attribution-reporting', // For ad click attribution.
  'browsing-topics', // Relates to topic-based browsing.
  'interest-cohort', // For cohort-based advertising.
  'join-ad-interest-group', // Part of the FLEDGE API for interest-based advertising.
  'private-aggregation', // For aggregating data privately.
  'private-state-token-issuance', // For issuing and redeeming privacy-preserving tokens.
  'private-state-token-redemption', // For issuing and redeeming privacy-preserving tokens.
  'run-ad-auction', // Part of the FLEDGE API for conducting ad auctions.
  'shared-storage', // For privacy-preserving shared storage.
  'shared-storage-select-url', // For privacy-preserving shared storage.
];
