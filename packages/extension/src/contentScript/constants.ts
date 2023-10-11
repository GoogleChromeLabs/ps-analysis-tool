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

// @todo Remove hard coded string and use add "more" link/button instead.
export const ALL_ALLOWED_FEATURES =
  'accelerometer, attribution-reporting, autoplay, bluetooth, browsing-topics, camera, ch-device-memory, ch-downlink, ch-dpr, ch-ect, ch-prefers-color-scheme, ch-prefers-reduced-motion, ch-rtt, ch-save-data, ch-ua, ch-ua-arch, ch-ua-bitness, ch-ua-form-factor, ch-ua-full-version, ch-ua-full-version-list, ch-ua-mobile, ch-ua-model, ch-ua-platform, ch-ua-platform-version, ch-ua-wow64, ch-viewport-height, ch-viewport-width, ch-width, clipboard-read, clipboard-write, cross-origin-isolated, display-capture, encrypted-media, fullscreen, gamepad, geolocation, gyroscope, hid, identity-credentials-get, idle-detection, interest-cohort, join-ad-interest-group, keyboard-map, local-fonts, magnetometer, microphone, midi, otp-credentials, payment, picture-in-picture, private-aggregation, private-state-token-issuance, private-state-token-redemption, publickey-credentials-get, run-ad-auction, screen-wake-lock, serial, shared-storage, shared-storage-select-url, storage-access, sync-xhr, unload, usb, window-placement, xr-spatial-tracking';

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
