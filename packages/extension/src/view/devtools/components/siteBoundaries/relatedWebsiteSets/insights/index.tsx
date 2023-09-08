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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import checkURLInRWS, {
  type CheckURLInRWSOutputType,
} from './utils/checkURLInRWS';
import { getDomain } from 'tldts';

const Insights = () => {
  const [insightsData, setInsightsData] =
    useState<CheckURLInRWSOutputType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await checkURLInRWS();

      setInsightsData(result);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-base">Loading...</p>
      ) : (
        <div>
          {insightsData?.isURLInRWS ? (
            <div>
              <h4 className="text-lg font-semibold">
                This site belongs to a Related Website Set
              </h4>
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
              <div>
                {!insightsData.primary ? (
                  <>
                    {Object.entries(
                      insightsData.relatedWebsiteSet?.rationaleBySite || {}
                    )
                      .filter(
                        ([domain]) => getDomain(domain) === insightsData.domain
                      )
                      .map(([domain, value]) => (
                        <p key={domain} className="text-sm mt-4">
                          Rationale: <span className="underline">{value}</span>
                        </p>
                      ))}
                  </>
                ) : (
                  <p className="mt-4">
                    This site is the primary domain of the Related Website Set.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <h4 className="text-lg font-semibold">
              This site does not belong to a Related Website Set
            </h4>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;
