/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import { type CookieData } from '@google-psat/common';
import { isEqual } from 'lodash-es';

const shouldUpdateCounter = (
  oldCookieObj: CookieData,
  newCookieObj: CookieData
) => {
  if (!oldCookieObj) {
    return true;
  }
  let blockedReasonUpdated = false,
    analyticsUpdated = false,
    parsedCookieUpdated = false,
    frameIdListUpdated = false,
    exemptionReasonUpdated = false,
    isFirstPartyUpdated = false;
  if (newCookieObj?.blockedReasons && newCookieObj.blockedReasons?.length > 0) {
    blockedReasonUpdated = !newCookieObj?.blockedReasons?.every((val) =>
      oldCookieObj?.blockedReasons?.includes(val)
    );
  }
  analyticsUpdated = !isEqual(newCookieObj.analytics, oldCookieObj.analytics);
  parsedCookieUpdated = !isEqual(
    newCookieObj.parsedCookie,
    oldCookieObj.parsedCookie
  );
  if (newCookieObj?.frameIdList && newCookieObj.frameIdList?.length > 0) {
    frameIdListUpdated = !newCookieObj?.frameIdList?.every((val) =>
      oldCookieObj?.frameIdList?.includes(val)
    );
  }
  if (newCookieObj.exemptionReason) {
    exemptionReasonUpdated =
      newCookieObj.exemptionReason !== oldCookieObj.exemptionReason;
  }
  if (Object.keys(newCookieObj).includes('isFirstParty')) {
    isFirstPartyUpdated =
      newCookieObj.exemptionReason !== oldCookieObj.exemptionReason;
  }
  return (
    blockedReasonUpdated ||
    analyticsUpdated ||
    parsedCookieUpdated ||
    frameIdListUpdated ||
    exemptionReasonUpdated ||
    isFirstPartyUpdated
  );
};
export default shouldUpdateCounter;
