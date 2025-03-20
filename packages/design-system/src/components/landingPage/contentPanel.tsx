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
import { addUTMParams } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { DescriptionIcon, WebStoriesIcon } from '../../icons';
import Link from '../link';
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '../sidebar';

export interface ContentPanelProps {
  title: string;
  content: {
    title: () => string;
    description: () => string;
    url: string;
    storyUrl?: string;
    onClick: () => void;
    sidebarItemKey?: SIDEBAR_ITEMS_KEYS;
  }[];
  counterStyles?: string;
}

const ContentPanel = ({
  title,
  content,
  counterStyles = '',
}: ContentPanelProps) => {
  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  return (
    <div className="px-2">
      <h3 className="text-base text-raisin-black dark:text-bright-gray mb-7">
        {title}
      </h3>
      <div className="flex gap-5 flex-wrap">
        {content.map((item, index) => (
          <div
            className="w-72 min-h-80  bg-[#FDFDFD] dark:bg-charleston-green hover:bg-[#FAFAFA] rounded-xl border-2 border-privacy-blue p-5 relative"
            key={index}
          >
            <div className="flex justify-between">
              <div
                className="w-16 h-16 flex justify-center items-center rounded-full bg-bright-gray mb-5 cursor-pointer"
                onClick={() =>
                  item.sidebarItemKey
                    ? updateSelectedItemKey(item.sidebarItemKey)
                    : null
                }
              >
                <div
                  className={`w-9 h-9 flex justify-center items-center rounded-md ${counterStyles}`}
                >
                  <span className="text-xxl text-white dark:black font-extrabold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4" title="View Documentation">
                  <Link href={addUTMParams(item.url)} rel="noreferer">
                    <DescriptionIcon
                      height="20"
                      width="20"
                      className="dark:fill-bright-gray fill-granite-gray group-hover:text-blue-500"
                    />
                  </Link>
                </div>
                {item.onClick && item?.storyUrl && (
                  <div
                    className="w-4 h-4 cursor-pointer"
                    title="View Story"
                    onClick={item.onClick}
                  >
                    <WebStoriesIcon
                      className="dark:fill-bright-gray fill-granite-gray group-hover:text-blue-500"
                      height="20"
                      width="20"
                    />
                  </div>
                )}
              </div>
            </div>
            <h3
              className={`text-lg font-medium inline-block mb-5 cursor-pointer text-raisin-black dark:text-bright-gray`}
              onClick={() =>
                item.sidebarItemKey
                  ? updateSelectedItemKey(item.sidebarItemKey)
                  : null
              }
            >
              {item.title()}
            </h3>
            <p className="text-base text-raisin-black dark:text-bright-gray mb-2">
              {item.description()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPanel;
