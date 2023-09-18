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
import React from 'react';

interface SitesListProps {
  title: string;
  sites: string[];
}

const SitesList = ({ title, sites }: SitesListProps) => {
  if (!sites.length) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="overflow-auto bg-anti-flash-white dark:bg-davys-grey rounded-md">
        <div className="max-h-40">
          <div className="p-3">
            <h4 className="text-base font-medium text-davys-grey dark:text-anti-flash-white mb-1">
              {title}
            </h4>
            <ul className="list-disc ml-4">
              {sites.map((site) => (
                <li key={site}>{site}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesList;
