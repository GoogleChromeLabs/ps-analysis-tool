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

export interface ContentPanelProps {
  title: string;
  content: {
    title: () => string;
    description: () => string;
    url: string;
    storyUrl: string;
    onClick: () => void;
  }[];
  titleStyles?: string;
  counterStyles?: string;
}

const ContentPanel = ({
  title,
  content,
  titleStyles = '',
  counterStyles = '',
}: ContentPanelProps) => {
  return (
    <div className="px-2">
      <h3 className="text-base text-raisin-black dark:text-bright-gray mb-7">
        {title}
      </h3>
      <div className="flex gap-5 flex-wrap">
        {content.map((item, index) => (
          <div
            className="w-72 min-h-80 bg-[#FDFDFD] dark:bg-charleston-green hover:bg-[#FAFAFA] rounded-xl border border-bright-gray dark:border-quartz p-5 relative"
            key={index}
          >
            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-bright-gray mb-5">
              <div
                className={`w-9 h-9 flex justify-center items-center rounded-md ${counterStyles}`}
              >
                <span className="text-xxl text-white dark:black font-extrabold">
                  {index + 1}
                </span>
              </div>
            </div>
            <h3 className={`text-lg font-medium mb-5 ${titleStyles}`}>
              {item.title()}
            </h3>
            <p className="text-base text-raisin-black dark:text-bright-gray mb-2">
              {item.description()}
            </p>
            <div className="absolute top-10 right-2.5 flex gap-2">
              <div className="w-4 h-4">
                <a
                  href={addUTMParams(item.url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <DescriptionIcon
                    height="16"
                    width="16"
                    className="fill-current text-black dark:text-bright-gray group-hover:text-blue-500"
                  />
                </a>
              </div>
              {item.onClick && item.storyUrl && (
                <div className="w-4 h-4 cursor-pointer" onClick={item.onClick}>
                  <WebStoriesIcon
                    className="fill-current text-black dark:text-bright-gray group-hover:text-blue-500"
                    height="16"
                    width="16"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPanel;
