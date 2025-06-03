/*
 * Copyright 2025 Google LLC
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
import { Link, ProgressBar } from '@google-psat/design-system';
import { useCallback, useEffect, useState } from 'react';

interface VersionComponentProps {
  prebidVersion: string;
}

const VersionComponent = ({ prebidVersion }: VersionComponentProps) => {
  const [latestVersion, setLatestVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReleaseInfo = useCallback(async () => {
    const response = await fetch(
      `https://api.github.com/repos/prebid/Prebid.js/releases?per_page=100&page=1&owner=prebid&repo=Prebid.js`
    );

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      setLoading(false);
      throw new Error(message);
    }

    const releaseData = await response.json();

    setLatestVersion(releaseData[0].tag_name);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReleaseInfo();
  }, [fetchReleaseInfo]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
        </div>
      )}
      {!loading && (
        <>
          <h2 className="font-bold">Version Information</h2>
          <p className="text-raisin-black dark:text-bright-gray">
            Installed Version:{' '}
            <span className="font-bold">{prebidVersion}</span>
          </p>
          <p className="text-raisin-black dark:text-bright-gray">
            Latest Version: <span className="font-bold">v{latestVersion}</span>
          </p>
          <Link
            rel="noreferrer"
            target="_blank"
            href="https://github.com/prebid/Prebid.js/releases"
            className="text-bright-navy-blue dark:text-jordy-blue"
          >
            View full release changelog
          </Link>
        </>
      )}
    </div>
  );
};

export default VersionComponent;
