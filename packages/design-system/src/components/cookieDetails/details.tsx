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
 * External dependencies.
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import {
  cookieIssueDetails,
  type CookieTableData,
} from '@ps-analysis-tool/common';

export interface DetailsProps {
  selectedCookie: CookieTableData;
}

const Details = ({ selectedCookie }: DetailsProps) => {
  const [showUrlDecoded, setShowUrlDecoded] = useState(false);
  let reasons = '';
  {
    selectedCookie?.blockedReasons?.map((reason) => {
      const cookieExclusionReason =
        cookieIssueDetails.CookieExclusionReason[reason];
      const cookieWarningReason =
        cookieIssueDetails.CookieWarningReason[reason];
      const cookieBlockedReason =
        cookieIssueDetails.CookieBlockedReason[reason];

      if (cookieBlockedReason) {
        reasons = reasons + cookieBlockedReason;
      }
      if (cookieWarningReason) {
        reasons =
          reasons +
          cookieWarningReason(
            selectedCookie?.headerType === 'response' ? 'SetCookie' : 'Cookie'
          );
      }
      if (cookieExclusionReason) {
        reasons =
          reasons +
          cookieExclusionReason(
            selectedCookie?.headerType === 'response' ? 'SetCookie' : 'Cookie'
          );
      }
      return reason;
    });
  }
  return (
    <div className="text-xs py-1 px-1.5">
      <p className="font-bold text-granite-gray dark:text-manatee mb-1 text-semibold flex items-center">
        <span>Cookie Value</span>
        <label className="text-granite-gray dark:text-manatee text-xs font-normal flex items-center">
          <input
            data-testid="show-url-decoded-checkbox"
            role="checkbox"
            type="checkbox"
            className={classNames(
              'ml-3 mr-1 cursor-pointer dark:accent-orange-400 accent-royal-blue',
              {
                'dark:min-h-0 dark:min-w-0 dark:h-[13px] dark:w-[13px] dark:appearance-none dark:bg-outer-space dark:border dark:border-manatee dark:rounded-[3px]':
                  !showUrlDecoded,
              }
            )}
            checked={showUrlDecoded}
            onChange={() => setShowUrlDecoded(!showUrlDecoded)}
          />
          <span>Show URL-decoded</span>
        </label>
      </p>
      <p className="mb-4 break-words text-outer-space-crayola dark:text-bright-gray">
        {showUrlDecoded
          ? decodeURIComponent(selectedCookie.parsedCookie.value)
          : selectedCookie.parsedCookie.value}
      </p>
      <p className="font-bold text-granite-gray dark:text-manatee mb-1">
        Description
      </p>
      <p className="mb-4 text-outer-space-crayola dark:text-bright-gray">
        {selectedCookie.analytics?.description || 'No description available.'}
      </p>
      {selectedCookie.isCookieBlocked && (
        <>
          <p className="font-bold text-granite-gray dark:text-manatee mb-1">
            Blocked reason
          </p>
          <p
            className="text-outer-space-crayola dark:text-bright-gray"
            dangerouslySetInnerHTML={{ __html: reasons ?? '' }}
          />
        </>
      )}
    </div>
  );
};

export default Details;
