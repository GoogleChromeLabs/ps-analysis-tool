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
import React from 'react';

/**
 * Internal dependencies.
 */
import CookiesListing from './cookieListing';
import { CookiesLanding } from '@cookie-analysis-tool/design-system';
import { useContentStore } from '../../stateProviders/contentStore';

interface CookiesTabProps {
  selectedFrameUrl?: string | null;
}

const CookiesTab = ({ selectedFrameUrl }: CookiesTabProps) => {
  const { tabCookies } = useContentStore(({ state }) => ({
    tabCookies: state.cookies,
  }));

  const tabCookies1 = Object.fromEntries(
    tabCookies
      .filter((cookie) => {
        return cookie.frameUrl === selectedFrameUrl;
      })
      .map((cookie) => {
        return [
          cookie.name + cookie.domain + cookie.path,
          {
            parsedCookie: {
              name: cookie.name,
              value: cookie.value,
              domain: cookie.domain,
              path: cookie.path,
              expires: cookie.expires,
              httponly: cookie.httpOnly,
              secure: cookie.secure,
              samesite: cookie.sameSite,
            },
            analytics: {
              platform: cookie.platform,
              category:
                cookie.category === 'Unknown Category'
                  ? 'Uncategorized'
                  : cookie.category,
              description: cookie.description,
            },
            url: cookie.pageUrl,
            headerType: 'response',
            isFirstParty: cookie.isFirstParty === 'Yes' ? true : false,
            frameIdList: [],
            isCookieAccepted: !cookie.isBlocked,
          },
        ];
      })
  );

  const tabCookies2 = Object.fromEntries(
    tabCookies.map((cookie) => {
      return [
        cookie.name + cookie.domain + cookie.path,
        {
          parsedCookie: {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            expires: cookie.expires,
            httponly: cookie.httpOnly,
            secure: cookie.secure,
            samesite: cookie.sameSite,
          },
          analytics: {
            platform: cookie.platform,
            category:
              cookie.category === 'Unknown Category'
                ? 'Uncategorized'
                : cookie.category,
            description: cookie.description,
          },
          url: cookie.pageUrl,
          headerType: 'response',
          isFirstParty: cookie.isFirstParty === 'Yes' ? true : false,
          frameIdList: [],
          isCookieAccepted: !cookie.isBlocked,
        },
      ];
    })
  );

  const frameUrlSet = new Set<string>();

  tabCookies.forEach((cookie) => {
    frameUrlSet.add(cookie.frameUrl);
  });

  const tabFrames = {};

  Array.from(frameUrlSet).forEach((frameUrl) => {
    tabFrames[frameUrl] = [];
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      {selectedFrameUrl ? (
        <CookiesListing
          selectedFrameUrl={selectedFrameUrl}
          cookies={Object.values(tabCookies1)}
        />
      ) : (
        <CookiesLanding
          tabCookies={tabCookies2}
          tabFrames={tabFrames}
          tabUrl={tabCookies[0]?.pageUrl}
        />
      )}
    </div>
  );
};

export default CookiesTab;
