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
import React, { useState, useEffect, useRef } from 'react';
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
  const [isDomainInAllowList, setIsDomainInAllowList] =
    useState<boolean>(false);

  const pageUrl = useRef<string>('');
  const isIncognito = useRef<boolean>(false);

  const domain = selectedCookie.parsedCookie.domain;

  let blockedReasons = '';
  let warningReasons = '';
  //Adding a comment here for future reference, this was done because we are using 2 different APIs to gather cookie data and often the isBlocked gets toggled between true and false.
  //Adding this as a fallback prevents from showing wrong information regarding blocked cookies.
  const isCookieBlocked =
    selectedCookie?.isBlocked ||
    (selectedCookie?.blockedReasons &&
      selectedCookie?.blockedReasons?.length > 0);
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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab?.url) {
        try {
          const origin = new URL(currentTab.url).origin;
          if (pageUrl.current !== origin) {
            pageUrl.current = origin;
          }
        } catch (e) {
          // Ignore.
        }
      }

      if (currentTab?.incognito) {
        isIncognito.current = currentTab.incognito;
      }

      if (pageUrl.current && domain) {
        let primaryUrl = domain;

        primaryUrl = primaryUrl.startsWith('.')
          ? `https://${primaryUrl.substring(1)}/`
          : `https://${primaryUrl}/`;

        chrome.contentSettings.cookies.get(
          {
            primaryUrl: primaryUrl,
            secondaryUrl: pageUrl.current,
            incognito: isIncognito.current,
          },
          (details) => {
            if (details?.setting === 'session_only') {
              setIsDomainInAllowList(true);
            } else {
              setIsDomainInAllowList(false);
            }
          }
        );
      }
    });
  }, [domain, isDomainInAllowList, selectedCookie]);

  return (
    <div className="text-xs py-1 px-1.5">
      {!isDomainInAllowList && isCookieBlocked && blockedReasons && (
        <>
          <p className="font-bold text-raising-black dark:text-bright-gray mb-1">
            Blocked reason
          </p>
          <p
            className="text-outer-space-crayola dark:text-bright-gray mb-3"
            dangerouslySetInnerHTML={{ __html: blockedReasons ?? '' }}
          />
        </>
      )}
      {!isDomainInAllowList &&
        selectedCookie?.warningReasons &&
        selectedCookie?.warningReasons?.length > 0 && (
          <>
            <p className="font-bold text-raising-black dark:text-bright-gray mb-1">
              Warnings
            </p>
            <p
              className="text-outer-space-crayola dark:text-bright-gray"
              dangerouslySetInnerHTML={{ __html: warningReasons ?? '' }}
            />
          </>
        )}
      {isDomainInAllowList && (
        <div className="mb-4">
          <p className="font-bold text-raising-black dark:text-bright-gray mb-1">
            Allow Listed
          </p>
          <p className="text-outer-space-crayola dark:text-bright-gray">
            The cookie domain was added to “allow list” for this session of the
            browser. You can view all allowed items under
            chrome://settings/content/siteData.
          </p>
        </div>
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
