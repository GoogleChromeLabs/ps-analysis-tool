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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getDomain } from 'tldts';

/**
 * Internal dependencies
 */
import checkURLInRWS, {
  type CheckURLInRWSOutputType,
} from './utils/checkURLInRWS';
import SitesList from './sitesList';

const Insights = () => {
  const [insightsData, setInsightsData] =
    useState<CheckURLInRWSOutputType | null>(null);
  const [loading, setLoading] = useState(true);

  const insightsListener = useCallback(async () => {
    setLoading(true);
    const result = await checkURLInRWS();

    setInsightsData(result);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    insightsListener();
  }, [insightsListener]);

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(
      (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        if (changeInfo.url) {
          if (
            tabId !== chrome.devtools.inspectedWindow.tabId ||
            (tabId === chrome.devtools.inspectedWindow.tabId &&
              getDomain(changeInfo.url) === insightsData?.domain)
          ) {
            return;
          }

          insightsListener();
        }
      }
    );

    return () => {
      chrome.tabs.onUpdated.removeListener(insightsListener);
    };
  }, [insightsData?.domain, insightsListener]);

  const cctlds = useMemo(
    () =>
      Object.values(insightsData?.relatedWebsiteSet?.ccTLDs || {}).reduce(
        (prev, current) => {
          return prev.concat(current);
        },
        []
      ),
    [insightsData?.relatedWebsiteSet?.ccTLDs]
  );

  return (
    <div className="text-raisin-black dark:text-bright-gray">
      {loading ? (
        <div className="flex gap-2 items-center justify-start">
          <p className="text-sm">Loading...</p>
          <div className="w-6 h-6 rounded-full animate-spin border-t-transparent border-solid border-blue-700 border-2" />
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">
            Related Website Sets Membership
          </h3>
          {insightsData?.isURLInRWS ? (
            <>
              <p className="text-lg font-medium">
                <span className="font-serif text-green-700">✓</span> This site
                belongs to a &quot;Related Website Set&quot;
              </p>
              <p className="text-sm">
                Primary Domain:{' '}
                <a
                  href={insightsData.relatedWebsiteSet?.primary}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="cursor-pointer hover:opacity-80 text-blue-500 underline dark:text-blue-400"
                  rel="noreferrer"
                >
                  {insightsData.relatedWebsiteSet?.primary}
                </a>
              </p>
              {!insightsData.primary ? (
                <>
                  {insightsData.isccTLD ? (
                    <p className="text-sm">
                      This site is a ccTLD of{' '}
                      <a
                        href={insightsData.relatedWebsiteSet?.ccTLDParent}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="cursor-pointer hover:opacity-80 text-blue-500 underline dark:text-blue-400"
                        rel="noreferrer"
                      >
                        {insightsData.relatedWebsiteSet?.ccTLDParent}
                      </a>
                      .
                    </p>
                  ) : (
                    <>
                      {Object.entries(
                        insightsData.relatedWebsiteSet?.rationaleBySite || {}
                      )
                        .filter(
                          ([domain]) =>
                            getDomain(domain) === insightsData.domain
                        )
                        .map(([domain, value]) => (
                          <p key={domain} className="text-sm">
                            Rationale:{' '}
                            <span className="underline">{value as string}</span>
                          </p>
                        ))}
                    </>
                  )}
                </>
              ) : (
                <p>
                  This site is the primary domain of the Related Website Set.
                </p>
              )}

              <div className="flex flex-row gap-4 overflow-auto">
                <SitesList
                  title="Associated Sites"
                  sites={insightsData.relatedWebsiteSet?.associatedSites || []}
                />
                <SitesList
                  title="Service Sites"
                  sites={insightsData.relatedWebsiteSet?.serviceSites || []}
                />
                <SitesList title="ccTLDs" sites={cctlds} />
              </div>
            </>
          ) : (
            <p className="text-lg font-medium flex items-center gap-2">
              <span className="text-red-500">✗</span>
              This site does not belong to a &quot;Related Website Set&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;
