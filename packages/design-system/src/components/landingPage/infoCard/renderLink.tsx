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

interface RenderLinkProps {
  label: string;
  link: string;
  linkLabel: string;
}

const RenderLink = ({ label, link, linkLabel }: RenderLinkProps) => (
  <>
    {link ? (
      <li className="py-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <p className="text-sm font-medium text-raisin-black dark:text-bright-gray truncate capitalize">
              {label}
            </p>
            <a
              title={link}
              href={link}
              className="text-xs text-bright-navy-blue dark:text-jordy-blue hover:opacity-80"
              target="_blank"
              rel="noreferrer"
            >
              {linkLabel}
            </a>
          </div>
        </div>
      </li>
    ) : (
      <></>
    )}
  </>
);

export default RenderLink;
