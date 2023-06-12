/**
 * Internal dependencies.
 */
import { BounceTrackingTab } from './BounceTrackingTab';
import { CookieTab } from './CookieTab';
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
