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
import { Warning } from '../../icons';

export interface DetailsProps {
  isUsingCDP: boolean;
  selectedCookie: CookieTableData;
}

// eslint-disable-next-line complexity
const Details = ({ selectedCookie, isUsingCDP }: DetailsProps) => {
  const [showUrlDecoded, setShowUrlDecoded] = useState(false);

  let blockedReasons = '';
  let warningReasons = '';
  const inboundBlock = selectedCookie.blockingStatus?.inboundBlock;
  const outboundBlock = selectedCookie.blockingStatus?.outboundBlock;
  const hasValidBlockedReason =
    selectedCookie.blockedReasons && selectedCookie.blockedReasons.length !== 0;

  selectedCookie?.blockedReasons?.forEach((reason) => {
    const cookieExclusionReason =
      cookieIssueDetails.CookieExclusionReason[reason];
    const cookieBlockedReason = cookieIssueDetails.CookieBlockedReason[reason];

    if (cookieBlockedReason) {
      blockedReasons = blockedReasons + cookieBlockedReason;
    }
    if (cookieExclusionReason) {
      blockedReasons =
        blockedReasons +
        cookieExclusionReason(
          selectedCookie?.headerType === 'response' ? 'SetCookie' : 'Cookie'
        );
    }
    return reason;
  });

  selectedCookie?.warningReasons?.forEach((reason) => {
    const cookieWarningReason = cookieIssueDetails.CookieWarningReason[reason];

    if (cookieWarningReason) {
      warningReasons =
        warningReasons +
        cookieWarningReason(
          selectedCookie?.headerType === 'response' ? 'SetCookie' : 'Cookie',
          ''
        );
    }
    return reason;
  });

  return (
    <div className="text-xs py-1 px-1.5">
      {selectedCookie.isDomainInAllowList && (
        <div className="mb-4">
          <p className="font-bold text-raising-black dark:text-bright-gray mb-1">
            Allow Listed
          </p>
          <p className="text-outer-space-crayola dark:text-bright-gray">
            The cookie domain was added to the allow-list for this session,
            however the browser may still block these cookies for various
            reasons, such as invalid attributes. You can check the allowed
            domains under chrome://settings/content/siteData.
          </p>
        </div>
      )}

      {(outboundBlock || inboundBlock) && hasValidBlockedReason && (
        <>
          <p className="font-bold text-raising-black dark:text-bright-gray">
            Blocked Reason
          </p>
          <p
            className="text-outer-space-crayola dark:text-bright-gray mb-3"
            dangerouslySetInnerHTML={{ __html: blockedReasons ?? '' }}
          />
        </>
      )}

      {inboundBlock === null && !hasValidBlockedReason && isUsingCDP && (
        <>
          <p className="font-bold text-raising-black dark:text-bright-gray">
            Blocked Reason
          </p>
          <p className="text-outer-space-crayola dark:text-bright-gray mb-3">
            This cookie was blocked due to unknown reasons
          </p>
        </>
      )}

      {inboundBlock === null && isUsingCDP && (
        <div className="flex gap-1 mb-3">
          <Warning className="h-4 text-warning-orange" />
          <p className="text-outer-space-crayola dark:text-bright-gray">
            This cookie was rejected by the browser in atleast one of the
            response headers.
          </p>
        </div>
      )}

      {inboundBlock !== null && inboundBlock && (
        <div className="flex gap-1 mb-3">
          <Warning className="h-4 text-warning-orange" />
          <p className="text-outer-space-crayola dark:text-bright-gray">
            This cookie was rejected by the browser in all of the response
            headers.
          </p>
        </div>
      )}

      {outboundBlock !== null && outboundBlock && (
        <div className="flex gap-1 mb-3">
          <Warning className="h-4 text-warning-orange" />
          <p className="text-outer-space-crayola dark:text-bright-gray">
            This cookie was rejected by the browser in one of the request
            headers.
          </p>
        </div>
      )}

      {selectedCookie?.warningReasons &&
        selectedCookie?.warningReasons?.length > 0 && (
          <>
            <p className="font-bold text-raising-black dark:text-bright-gray">
              Warnings
            </p>
            <p
              className="text-outer-space-crayola dark:text-bright-gray"
              dangerouslySetInnerHTML={{ __html: warningReasons ?? '' }}
            />
          </>
        )}

      <p className="font-bold text-raising-black dark:text-bright-gray mb-1 text-semibold flex items-center">
        <span>Cookie Value</span>
        <label className="text-raising-black dark:text-bright-gray text-xs font-normal flex items-center">
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
      <p className="font-bold text-raising-black dark:text-bright-gray mb-1">
        Description
      </p>
      <p className="mb-4 text-outer-space-crayola dark:text-bright-gray">
        {selectedCookie.analytics?.description || 'No description available.'}
      </p>
    </div>
  );
};

export default Details;
